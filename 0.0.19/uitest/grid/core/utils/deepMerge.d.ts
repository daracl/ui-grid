/**
 * 깊은 병합 (objectDeepMerge)
 *
 * - 여러 객체를 순서대로 병합하여 새 객체를 반환합니다.
 * - 일반 객체끼리 병합하고, 배열끼리는 원시 값 중복을 제거하여 합칩니다(NaN 제외).
 * - 배열과 객체 등 타입이 다르면 뒤의 값으로 교체합니다.
 * - Date·RegExp·Map·Set은 복사하고 함수·DOM·기타 클래스 인스턴스는 참조를 유지합니다.
 * - 소스 내부의 순환 참조와 공유 참조를 유지합니다.
 * - undefined 값은 무시됩니다.
 * - __proto__·constructor·prototype은 첫 소스를 포함한 모든 일반 객체에서 제외합니다.
 * - 마지막 인자로 {_excludeKeys: string[]} 형태의 옵션 객체를 전달하면
 *   해당 키들은 병합에서 제외됩니다 (첫 번째 소스에는 제외 적용되지 않음).
 * - 옵션 객체에 {_arrays: 'replace'} 를 전달하면 중첩된 배열을 합치지 않고 뒤의 배열로 교체합니다.
 *   (빈 배열도 교체되며 중복 제거를 하지 않습니다. 기본값은 'merge'이며 기존 동작과 같습니다.)
 *
 * 사용 예:
 * - 기본 병합
 *   const out = objectDeepMerge(
 *     { a: 1, c: 3 },
 *     { b: 2, a: 10 }
 *   );
 *   // out -> { a: 10, b: 2, c: 3 }
 *
 * - 키 제외 (_excludeKeys)
 *   const out2 = objectDeepMerge(
 *     { a: 1, c: 3 },
 *     { b: 2, a: 10 },
 *     { _excludeKeys: ['a'] }
 *   );
 *   // out2 -> { a: 1, b: 2, c: 3 } // 'a' 는 두번째 소스에서 덮어쓰지 않음
 *
 * - 배열 교체 (_arrays)
 *   objectDeepMerge({ list: [1, 2] }, { list: [3] }, { _arrays: 'replace' }) -> { list: [3] }
 *   objectDeepMerge({ list: [1, 2] }, { list: [] }, { _arrays: 'replace' }) -> { list: [] }
 *
 * - null / 함수 처리
 *   objectDeepMerge({ x: 1 }, { x: null }) -> { x: null }
 *   objectDeepMerge({ f: () => 1 }, { f: () => 2 }) -> second f replaces first
 *
 * 주의:
 * - exclude 키는 마지막 인자에 _excludeKeys 배열로 전달해야 하며,
 *   첫 번째 소스(초기값)에는 제외 규칙이 적용되지 않습니다(초기값을 보존하도록 설계).
 *
 * @param {...any[]} values - 병합할 값들. 마지막에 {_excludeKeys: string[], _arrays: 'merge' | 'replace'} 옵션을 넣을 수 있음.
 * @returns {object} 병합된 새 객체
 */
export declare function objectDeepMerge(...values: any[]): any;
/** 배열들을 깊게 복사하여 합칩니다. 원시 값은 중복 제거하고 NaN·객체 요소는 보존합니다. 일반 객체의 __proto__·constructor·prototype은 제외합니다. */
export declare function arrayDeepMerge(...values: any[]): any;
