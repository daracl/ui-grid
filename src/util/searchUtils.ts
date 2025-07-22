import { MatchedField, SearchMode } from "@t/Common";
import DaraGrid from "src/DaraGrid";

export function gridDataSearch(
  searchList: any[],
  searchText: string,
  options: SearchMode = {
    matchCase: false,
    matchWholeWord: false,
    useRegex: false,
    searchFields: "$all$",
  }
): any[] {
  const results: any[] = [];

  // 배치 처리를 위한 청크 크기
  const CHUNK_SIZE = 1000;

  // 빈 검색어 처리
  if (!searchText.trim()) {
    for (let i = 0; i < searchList.length; i += CHUNK_SIZE) {
      const chunk = searchList.slice(i, i + CHUNK_SIZE);

      for (const item of chunk) {
        if (item.$$matchedFields) {
          delete item.$$matchedFields;
          delete item.$$totalMatches;
        }
      }
    }
  }

  const { matchCase, matchWholeWord, useRegex, searchFields } = options;

  // 검색 필드 최적화
  const fieldsToSearch = getSearchFields(searchList, searchFields);

  // 검색 텍스트 전처리
  const normalizedSearchText = matchCase ? searchText : searchText.toLowerCase();

  // 정규식 미리 컴파일
  let compiledRegex: RegExp | null = null;
  let wordBoundaryRegex: RegExp | null = null;

  if (useRegex) {
    try {
      const flags = matchCase ? "" : "i"; // 'g' 플래그 제거 (첫 번째 매칭만 찾기)
      compiledRegex = new RegExp(searchText, flags);
    } catch (error) {
      console.warn("Invalid regex, falling back to text search:", error);
    }
  } else if (matchWholeWord) {
    const flags = matchCase ? "" : "i"; // 'g' 플래그 제거
    wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(normalizedSearchText)}\\b`, flags);
  }

  for (let i = 0; i < searchList.length; i += CHUNK_SIZE) {
    const chunk = searchList.slice(i, i + CHUNK_SIZE);

    for (const item of chunk) {
      const matchedFields = findFirstMatchInItemOptimized(item, searchText, normalizedSearchText, matchCase, matchWholeWord, compiledRegex, wordBoundaryRegex, fieldsToSearch);

      if (matchedFields.length > 0) {
        item.$$matchedFields = matchedFields;
        item.$$totalMatches = matchedFields.length;
        results.push(item);
      } else if (item.$$matchedFields) {
        delete item.$$matchedFields;
        delete item.$$totalMatches;
      }
    }
  }

  return results;
}

function getSearchFields(searchList: any[], searchFields: string | string[] | "$all$"): string[] {
  if (searchFields === "$all$") {
    // 첫 번째 아이템에서 필드 추출 (모든 아이템이 같은 구조라고 가정)
    return searchList.length > 0 ? Object.keys(searchList[0]) : [];
  }

  return Array.isArray(searchFields) ? searchFields : [searchFields];
}

function findFirstMatchInItemOptimized(item: any, searchText: string, normalizedSearchText: string, matchCase: boolean, matchWholeWord: boolean, compiledRegex: RegExp | null, wordBoundaryRegex: RegExp | null, fieldsToSearch: string[]): MatchedField[] {
  const matchedFields: MatchedField[] = [];

  for (const field of fieldsToSearch) {
    if (!item.hasOwnProperty(field)) continue;

    const fieldValue = String(item[field]);
    if (!fieldValue) continue; // 빈 값 스킵

    const firstMatch = findFirstMatchInTextOptimized(fieldValue, searchText, normalizedSearchText, matchCase, matchWholeWord, compiledRegex, wordBoundaryRegex);

    if (firstMatch) {
      const highlightedValue = highlightSingleMatch(fieldValue, firstMatch);
      matchedFields.push({
        fieldName: field,
        originalValue: fieldValue,
        highlightedValue,
        matchCount: 1,
        matchPositions: [firstMatch],
      });
    }
  }

  return matchedFields;
}

function findFirstMatchInTextOptimized(text: string, searchText: string, normalizedSearchText: string, matchCase: boolean, matchWholeWord: boolean, compiledRegex: RegExp | null, wordBoundaryRegex: RegExp | null): { start: number; end: number } | null {
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
      return findWholePhraseMatchES6(text, searchText, matchCase);
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
    console.warn("Search error:", error);
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

function highlightSingleMatch(text: string, match: { start: number; end: number }, highlightTag: string = "mark"): string {
  const before = text.substring(0, match.start);
  const matchedText = text.substring(match.start, match.end);
  const after = text.substring(match.end);

  return `${before}<${highlightTag}>${matchedText}</${highlightTag}>${after}`;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitTokensES6(text: string): string[] {
  // 한글/영문/숫자/언더스코어 단위만 추출
  // 즉, 특수문자, 공백 등은 경계로 처리
  return text.match(DaraGrid.MATCH_WHOLE_REGEX) || [];
}

function findWholePhraseMatchES6(text: string, phrase: string, matchCase: boolean): { start: number; end: number } | null {
  // 케이스 통일
  if (!matchCase) {
    text = text.toLowerCase();
    phrase = phrase.toLowerCase();
  }

  const textTokens = splitTokensES6(text);
  const phraseTokens = splitTokensES6(phrase);

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
      let idx = -1,
        cnt = 0;
      let offset = 0;
      while (cnt < i && offset < text.length) {
        const token = splitTokensES6(text.slice(offset))[0];
        if (!token) break;
        offset = text.indexOf(token, offset) + token.length;
        cnt++;
      }
      // 시작 위치
      const firstToken = splitTokensES6(text.slice(offset))[0];
      const start = text.indexOf(firstToken, offset);

      // 끝 토큰의 end 위치
      let endOffset = start;
      for (let k = 0; k < phraseTokens.length; k++) {
        const token = splitTokensES6(text.slice(endOffset))[0];
        endOffset = text.indexOf(token, endOffset) + token.length;
      }

      // phrase와 원본문자열이 정확히 일치하는지(중간에 특수문자·공백 포함 가능) 체크
      const matchedText = text.substring(start, endOffset);
      // phrase와 완전 일치하는 어절군인지(공백, 특수문자 포함!)
      // 토큰 묶음만 비교하면 실제 phrase는 띄어쓰기, 특수문자 등 포함 가능
      // 실제 phrase를 splitTokens로 자른 것과, matchedText를 splitTokens로 자른 것이 같아야 함
      if (splitTokensES6(matchedText).join(" ") === phraseTokens.join(" ")) {
        return { start, end: endOffset };
      }
    }
  }

  return null;
}
