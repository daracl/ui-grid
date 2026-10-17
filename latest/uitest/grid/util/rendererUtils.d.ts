import { EventManager } from '../event/EventManager.js';
import { OptionCallback } from '../types/Common.js';
/**
 * 선택형 컴포넌트(Select, Checkbox, Radio 등)에서 사용할 옵션을 정규화한다.
 *
 * - 문자열 배열인 경우 `{ valueKey, labelKey }` 형태의 객체 배열로 변환한다.
 * - 객체 배열인 경우 그대로 사용한다.
 * - value를 key, label을 value로 하는 조회용 Map을 함께 생성한다.
 *
 * @param list 옵션 목록 (string[] 또는 object[])
 * @param labelKey 옵션 라벨에 사용할 속성명
 * @param valueKey 옵션 값에 사용할 속성명
 * @returns 정규화된 옵션 목록과 value-label 조회 Map
 *
 * @example
 * normalizeChoiceOptions(['A', 'B'], 'label', 'value')
 * // {
 * //   list: [
 * //     { value: 'A', label: 'A' },
 * //     { value: 'B', label: 'B' }
 * //   ],
 * //   map: Map { 'A' => 'A', 'B' => 'B' }
 * // }
 *
 * @example
 * normalizeChoiceOptions(
 *   [
 *     { id: '1', name: 'Apple' },
 *     { id: '2', name: 'Orange' }
 *   ],
 *   'name',
 *   'id'
 * )
 * // {
 * //   list: [
 * //     { id: '1', name: 'Apple' },
 * //     { id: '2', name: 'Orange' }
 * //   ],
 * //   map: Map { '1' => 'Apple', '2' => 'Orange' }
 * // }
 */
export declare function normalizeChoiceOptions(list: any[], labelKey: string, valueKey: string): {
    list: any[];
    map: Map<string, any>;
};
/**
 * 요소에 focusout 이벤트를 등록하여 포커스를 잃으면 자동으로 숨김 처리한다.
 *
 * 드롭다운, 팝업 메뉴 등 포커스 기반 UI 컴포넌트에서 사용하며,
 * 기존에 등록된 focusout 이벤트를 제거한 후 새 이벤트를 등록한다.
 *
 * @param element - 자동 숨김 처리를 적용할 HTML 요소
 * @param eventManager - 이벤트 등록/해제를 관리하는 EventManager 인스턴스
 */
export declare function bindHideOnBlur(element: HTMLElement, eventManager: EventManager, callback?: OptionCallback): void;
/**
 * 배열 내 객체의 특정 키 값을 기준으로 중복 항목을 제거한다.
 *
 * 동일한 valueKey 값을 가진 객체가 여러 개 존재하는 경우
 * 처음 등장한 객체만 유지하고 이후 중복 객체는 제외한다.
 *
 * @param list - 중복 제거 대상 객체 배열
 * @param valueKey - 중복 여부를 판단할 객체의 키 이름
 * @returns 중복이 제거된 새로운 배열
 */
export declare function uniqueListItem(list: any[], valueKey: string): any[];
/**
 * 드롭다운 선택 상태를 갱신한다.
 *
 * @param selectedValues 현재 선택된 값 목록
 * @param clickedValue 사용자가 클릭한 값
 * @param isMultiple 다중 선택 여부
 * @param enabledValues 선택 가능한 값 목록(비활성 항목 제외)
 * @returns 갱신된 선택 값 목록
 */
export declare function updateSelectValues<T>(selectedValues: any[], clickedValue: string, isMultiple: boolean, enabledValues: any[], required: boolean): any[];
/**
 * 드롭다운 아이템의 선택 상태를 갱신한다.
 *
 * @param dropdownElement 드롭다운 컨테이너
 * @param listItems 드롭다운 데이터 목록
 * @param values 현재 선택된 값 목록
 * @param valueKey 값 필드명
 * @param isAll 전체 선택 여부
 */
export declare function updateDropdownSelection(dropdownElement: HTMLElement, listItems: any[], values: any[], valueKey: string, isAll: boolean): void;
export declare function getLabelsByValue(value: string | string[], valueDelimiter: string, valueLabelMap: Map<string, any>): string[];
