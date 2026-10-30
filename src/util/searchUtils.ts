import { ALL_SELECT_VALUE, MATCH_WHOLE_REGEX } from '@/constants';
import { DataManager } from '@/service/DataManager';
import { MatchedField, SearchFields, SearchMode, SearchResult, ViewItem } from '@t/Common';
import { arrayCopy, hasOwnProp } from './utils';

const MAX_REGEX_PATTERN_LENGTH = 200;

export function gridDataSearch(
  searchList: ViewItem[],
  dataManager: DataManager,
  searchText: string,
  options: SearchMode,
): SearchResult {
  const results: ViewItem[] = [];
  const postProcess = options.postProcess;
  const searchListLength = searchList.length;
  // 빈 검색어 처리
  if (!searchText.trim()) {
    for (let i = 0; i < searchListLength; i++) {
      const item = searchList[i];
      item.matchCount = undefined;
      item.matchedFields = undefined;
      item.isCurrentMatch = false;

      results.push(item);
      if (postProcess) {
        postProcess(false, item);
      }
    }

    return { isOriginal: true, matchCount: 0, items: results };
  }

  const { matchCase, matchWholeWord, useRegex, searchFields, hideNonMatched } = options;
  let matchWholeRegex = options.matchWholeRegex;

  // 검색 필드 최적화
  const fieldsToSearch = getSearchFields(searchList, dataManager, searchFields);

  // 검색 텍스트 전처리
  const normalizedSearchText = matchCase ? searchText : searchText.toLowerCase();

  if (matchWholeWord && !matchWholeRegex) {
    matchWholeRegex = MATCH_WHOLE_REGEX;
  }

  // 정규식 미리 컴파일
  let compiledRegex: RegExp | null = null;
  let wordBoundaryRegex: RegExp | null = null;

  if (useRegex) {
    if (searchText.length > MAX_REGEX_PATTERN_LENGTH) {
      console.warn('Search pattern too long, falling back to text search.');
    } else if (isPotentiallyCatastrophicRegex(searchText)) {
      console.warn('Search pattern looks unsafe (possible catastrophic backtracking), falling back to text search.');
    } else {
      try {
        const flags = matchCase ? '' : 'i'; // 'g' 플래그 제거 (첫 번째 매칭만 찾기)
        compiledRegex = new RegExp(searchText, flags);
      } catch (error) {
        console.warn('Invalid regex, falling back to text search:', error);
      }
    }
  } else if (matchWholeWord) {
    const flags = matchCase ? '' : 'i'; // 'g' 플래그 제거
    wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(normalizedSearchText)}\\b`, flags);
  }

  let matchCount = 0;
  for (let i = 0; i < searchListLength; i++) {
    const viewItem = searchList[i];
    const item = dataManager.getRowItem(viewItem.id);
    const matchedFields = findFirstMatchInItemOptimized(
      item,
      searchText,
      normalizedSearchText,
      matchCase,
      matchWholeWord,
      compiledRegex,
      wordBoundaryRegex,
      fieldsToSearch,
      matchWholeRegex,
    );
    const matchLength = matchedFields.length;
    const matched = matchLength > 0;
    viewItem.isCurrentMatch = false;

    if (matched) {
      matchCount += matchLength;
      viewItem.matchedFields = matchedFields;
      viewItem.matchCount = matchLength;
      results.push(viewItem);
    } else {
      viewItem.matchCount = undefined;
      viewItem.matchedFields = undefined;

      if (!hideNonMatched) {
        results.push(viewItem);
      }
    }

    if (postProcess) {
      postProcess(matched, item, viewItem);
    }
  }

  return { isOriginal: false, matchCount: matchCount, items: results };
}

function getSearchFields(searchList: ViewItem[], dataManager: DataManager, searchFields: SearchFields): string[] {
  if (searchFields === ALL_SELECT_VALUE) {
    return searchList.length > 0 ? Object.keys(dataManager.getRowItem(searchList[0].id)) : [];
  }

  return Array.isArray(searchFields) ? arrayCopy(searchFields) : [searchFields];
}

function findFirstMatchInItemOptimized(
  item: any,
  searchText: string,
  normalizedSearchText: string,
  matchCase: boolean,
  matchWholeWord: boolean,
  compiledRegex: RegExp | null,
  wordBoundaryRegex: RegExp | null,
  fieldsToSearch: string[],
  matchWholeRegex: RegExp,
): MatchedField[] {
  const matchedFields: MatchedField[] = [];

  for (const field of fieldsToSearch) {
    if (!hasOwnProp(item, field)) continue;

    const fieldValue = String(item[field]);
    if (!fieldValue) continue; // 빈 값 스킵

    const firstMatch = findFirstMatchInTextOptimized(
      fieldValue,
      searchText,
      normalizedSearchText,
      matchCase,
      matchWholeWord,
      compiledRegex,
      wordBoundaryRegex,
      matchWholeRegex,
    );

    if (firstMatch) {
      matchedFields.push({
        fieldName: field,
        originalValue: fieldValue,
        matchCount: 1,
        matchPositions: [firstMatch],
      });
    }
  }

  return matchedFields;
}

function findFirstMatchInTextOptimized(
  text: string,
  searchText: string,
  normalizedSearchText: string,
  matchCase: boolean,
  matchWholeWord: boolean,
  compiledRegex: RegExp | null,
  wordBoundaryRegex: RegExp | null,
  matchWholeRegex: RegExp,
): { start: number; end: number } | null {
  try {
    if (compiledRegex) {
      // 정규식 검색 - 첫 번째 매칭만
      const match = compiledRegex.exec(text);
      if (match) {
        return {
          start: match.index,
          end: match.index + match[0].length,
        };
      }
    } else if (matchWholeWord && wordBoundaryRegex) {
      return findWholePhraseMatchES6(text, searchText, matchCase, matchWholeRegex);
    } else {
      // 일반 텍스트 검색 - 가장 빠른 방법
      const targetText = matchCase ? text : text.toLowerCase();
      const index = targetText.indexOf(normalizedSearchText);

      if (index !== -1) {
        return {
          start: index,
          end: index + normalizedSearchText.length,
        };
      }
    }
  } catch (error) {
    console.warn('Search error:', error);
    // 심플한 fallback
    const targetText = matchCase ? text : text.toLowerCase();
    const index = targetText.indexOf(normalizedSearchText);

    if (index !== -1) {
      return {
        start: index,
        end: index + normalizedSearchText.length,
      };
    }
  }

  return null;
}

export function highlightSingleMatch(
  text: string,
  match: { start: number; end: number },
  highlightTag = 'mark',
): string {
  const before = text.substring(0, match.start);
  const matchedText = text.substring(match.start, match.end);
  const after = text.substring(match.end);

  return `${before}<${highlightTag}>${matchedText}</${highlightTag}>${after}`;
}

/**
 * 치명적 역추적(ReDoS)을 일으킬 수 있는 정규식인지 보수적으로 판단한다.
 *
 * 끝없이 반복되는 그룹(`+`, `*`, `{n,}`) 안에 다시 끝없는 반복이나 교대(`|`)가 있으면 위험으로 본다.
 * 예: (a+)+ , (a*)* , (a|a)+ , (a+(b)?)+ , ((a+))+ , (?:a+)+ , (a+){2,}
 *
 * 그룹을 괄호 깊이대로 해석하므로 괄호가 중첩된 형태도 잡는다. 이스케이프(\\)와 문자 클래스([...]) 안의 기호는 무시한다.
 * 완전한 정적 분석기는 아니며, 위험할 수 있는 패턴은 호출하는 쪽에서 일반 텍스트 검색으로 대체한다.
 * 횟수가 정해진 반복({n}, {n,m})은 지수적으로 늘지 않으므로 반복으로 보지 않는다.
 */
export function isPotentiallyCatastrophicRegex(pattern: string): boolean {
  type GroupState = { hasUnbounded: boolean; hasAlternation: boolean };
  const stack: GroupState[] = [];
  let current: GroupState = { hasUnbounded: false, hasAlternation: false };

  /** index 위치의 반복 기호가 끝없는 반복(+, *, {n,})이면 그 길이를, 아니면 0을 돌려준다. */
  const unboundedQuantifierLength = (index: number): number => {
    const ch = pattern[index];
    if (ch === '+' || ch === '*') return 1;
    if (ch === '{') {
      const match = /^\{\d+,\}/.exec(pattern.slice(index));
      return match ? match[0].length : 0;
    }
    return 0;
  };

  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];

    if (ch === '\\') {
      i++; // 이스케이프된 문자는 건너뛴다.
      continue;
    }

    if (ch === '[') {
      // 문자 클래스는 닫는 ]까지 건너뛴다.
      for (i++; i < pattern.length && pattern[i] !== ']'; i++) {
        if (pattern[i] === '\\') i++;
      }
      continue;
    }

    if (ch === '(') {
      stack.push(current);
      current = { hasUnbounded: false, hasAlternation: false };
      // (?: (?= (?! (?<= (?<! (?<name> 같은 그룹 접두는 반복 기호가 아니므로 건너뛴다.
      if (pattern[i + 1] === '?') {
        i += 2;
        if (pattern[i] === '<' && pattern[i + 1] !== '=' && pattern[i + 1] !== '!') {
          while (i < pattern.length && pattern[i] !== '>') i++;
        } else if (pattern[i] === '<') {
          i++;
        }
      }
      continue;
    }

    if (ch === ')') {
      const group = current;
      current = stack.pop() ?? { hasUnbounded: false, hasAlternation: false };

      const length = unboundedQuantifierLength(i + 1);
      if (length > 0) {
        // 끝없이 반복되는 그룹 안에 끝없는 반복이나 교대가 있으면 위험하다.
        if (group.hasUnbounded || group.hasAlternation) return true;
        // 이 그룹 자체가 끝없는 반복이므로 바깥 그룹에는 끝없는 반복이 있는 것으로 본다.
        current.hasUnbounded = true;
        i += length;
      } else {
        // 반복되지 않는 그룹이라도 안쪽의 끝없는 반복·교대는 바깥 그룹에 이어서 판단한다. 예: ((a|aa))+ , (a+(b)?)+
        if (group.hasUnbounded) current.hasUnbounded = true;
        if (group.hasAlternation) current.hasAlternation = true;
      }
      continue;
    }

    if (ch === '|') {
      current.hasAlternation = true;
      continue;
    }

    const length = unboundedQuantifierLength(i);
    if (length > 0) {
      current.hasUnbounded = true;
      i += length - 1;
    }
  }

  return false;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function splitTokensES6(text: string, matchWholeRegex: RegExp): string[] {
  // 한글/영문/숫자/언더스코어 단위만 추출
  //即, 특수문자, 공백 등은 경계로 처리
  return text.match(matchWholeRegex) || [];
}

function findWholePhraseMatchES6(
  text: string,
  phrase: string,
  matchCase: boolean,
  matchWholeRegex: RegExp,
): { start: number; end: number } | null {
  // 케이스 통일
  if (!matchCase) {
    text = text.toLowerCase();
    phrase = phrase.toLowerCase();
  }

  const textTokens = splitTokensES6(text, matchWholeRegex);
  const phraseTokens = splitTokensES6(phrase, matchWholeRegex);

  if (phraseTokens.length === 0) return null;
  if (phraseTokens.length > textTokens.length) return null;

  // 토큰 슬라이딩 윈도우로 조합하여 비교
  for (let i = 0; i <= textTokens.length - phraseTokens.length; i++) {
    let hit = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      if (textTokens[i + j] !== phraseTokens[j]) {
        hit = false;
        break;
      }
    }
    if (hit) {
      // 토큰 조합의 실제 위치 계산
      // 각 토큰의 시작 인덱스 얻기
      let cnt = 0;
      let offset = 0;
      while (cnt < i && offset < text.length) {
        const token = splitTokensES6(text.slice(offset), matchWholeRegex)[0];
        if (!token) break;
        offset = text.indexOf(token, offset) + token.length;
        cnt++;
      }
      // 시작 위치
      const firstToken = splitTokensES6(text.slice(offset), matchWholeRegex)[0];
      const start = text.indexOf(firstToken, offset);

      // 끝 토큰의 end 위치
      let endOffset = start;
      for (let k = 0; k < phraseTokens.length; k++) {
        const token = splitTokensES6(text.slice(endOffset), matchWholeRegex)[0];
        endOffset = text.indexOf(token, endOffset) + token.length;
      }

      // phrase와 원본문자열이 정확히 일치하는지(중간에 특수문자·공백 포함 가능) 체크
      const matchedText = text.substring(start, endOffset);
      // phrase와 완전 일치하는 어절군인지(공백, 특수문자 포함!)
      // 토큰 묶음만 비교하면 실제 phrase는 띄어쓰기, 특수문자 등 포함 가능
      // 실제 phrase를 splitTokens로 자른 것과, matchedText를 splitTokens로 자른 것이 같아야 함
      if (splitTokensES6(matchedText, matchWholeRegex).join(' ') === phraseTokens.join(' ')) {
        return { start, end: endOffset };
      }
    }
  }

  return null;
}
