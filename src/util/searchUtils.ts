import { LAYER_ATTR_NAME } from "src/constants";
import { styleClassSplit } from "./styleUtils";
import { isArray } from "./utils";
import { MatchedField, SearchMode, SearchResult } from "@t/Common";

export function gridDataSearch(
  searchList: any[],
  searchText: string,
  options: SearchMode = {
    matchCase: false,
    matchWholeWord: false,
    useRegex: false,
    searchFields: "$all$",
  }
): SearchResult[] {
  // 빈 검색어 처리
  if (!searchText.trim()) {
    return searchList.map((item) => ({
      item,
      matchedFields: [],
      totalMatches: 0,
    }));
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

  const results: SearchResult[] = [];

  // 배치 처리를 위한 청크 크기
  const CHUNK_SIZE = 1000;

  for (let i = 0; i < searchList.length; i += CHUNK_SIZE) {
    const chunk = searchList.slice(i, i + CHUNK_SIZE);

    for (const item of chunk) {
      const matchedFields = findFirstMatchInItemOptimized(item, searchText, normalizedSearchText, matchCase, matchWholeWord, compiledRegex, wordBoundaryRegex, fieldsToSearch);

      if (matchedFields.length > 0) {
        results.push({
          item,
          matchedFields,
          totalMatches: matchedFields.length, // 필드 개수 = 총 매칭 수
        });
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
      // 전체 단어 매칭 - 첫 번째 매칭만
      const match = wordBoundaryRegex.exec(text);
      if (match) {
        return {
          start: match.index,
          end: match.index + match[0].length,
        };
      }
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
