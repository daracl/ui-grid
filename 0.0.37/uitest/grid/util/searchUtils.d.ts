import { DataManager } from '../service/DataManager.js';
import { SearchMode, SearchResult, ViewItem } from '../types/Common.js';
export declare function gridDataSearch(searchList: ViewItem[], dataManager: DataManager, searchText: string, options: SearchMode): SearchResult;
export declare function highlightSingleMatch(text: string, match: {
    start: number;
    end: number;
}, highlightTag?: string): string;
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
export declare function isPotentiallyCatastrophicRegex(pattern: string): boolean;
