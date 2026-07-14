import { EventManager } from '@/event/EventManager';
import { isString, removeItem, stringSplit } from './utils';
import { ALL_SELECT_VALUE } from '@/constants';
import { OptionCallback } from '@/types/Common';
import { addClass, removeClass } from './styleUtils';
import { SELECTED_STYLE_CLASS } from '@/constantStyles';

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
export function normalizeChoiceOptions(list: any[], labelKey: string, valueKey: string) {
  const valueLabelMap = new Map<string, any>();
  const isStringValue = isString(list[0]);
  const newList = [];
  for (const item of list) {
    let val: string;
    let label: string;

    if (isStringValue) {
      val = item;
      label = item;
      const newItem: any = {};
      newItem[valueKey] = item;
      newItem[labelKey] = item;

      newList.push(newItem);
    } else {
      val = item?.[valueKey] ?? '';
      label = item?.[labelKey] ?? '';
      newList.push(item);
    }
    valueLabelMap.set(val, label);
  }

  return { list: newList, map: valueLabelMap };
}

/**
 * 요소에 focusout 이벤트를 등록하여 포커스를 잃으면 자동으로 숨김 처리한다.
 *
 * 드롭다운, 팝업 메뉴 등 포커스 기반 UI 컴포넌트에서 사용하며,
 * 기존에 등록된 focusout 이벤트를 제거한 후 새 이벤트를 등록한다.
 *
 * @param element - 자동 숨김 처리를 적용할 HTML 요소
 * @param eventManager - 이벤트 등록/해제를 관리하는 EventManager 인스턴스
 */
export function bindHideOnBlur(element: HTMLElement, eventManager: EventManager, callback?: OptionCallback) {
  element.tabIndex = 0;
  element.focus();
  eventManager.off(element, 'focusout');
  eventManager.on({ el: element, type: 'focusout' }, (e: UIEvent) => {
    element.style.display = 'none';
    if (callback) {
      callback();
    }
  });
}

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
export function uniqueListItem(list: any[], valueKey: string) {
  const seen = new Set();

  const uniqueArr = list.filter((item) => {
    if (seen.has(item[valueKey])) return false;
    seen.add(item[valueKey]);
    return true;
  });
  return uniqueArr;
}

/**
 * 드롭다운 선택 상태를 갱신한다.
 *
 * @param selectedValues 현재 선택된 값 목록
 * @param clickedValue 사용자가 클릭한 값
 * @param isMultiple 다중 선택 여부
 * @param enabledValues 선택 가능한 값 목록(비활성 항목 제외)
 * @returns 갱신된 선택 값 목록
 */
export function updateSelectValues<T>(
  selectedValues: any[],
  clickedValue: string,
  isMultiple: boolean,
  enabledValues: any[],
  required: boolean,
): any[] {
  // Single Select
  if (!isMultiple) {
    if (required) {
      return [clickedValue];
    }

    return selectedValues.includes(clickedValue) ? [] : [clickedValue];
  }

  // 전체 선택 클릭
  if (clickedValue === ALL_SELECT_VALUE) {
    return selectedValues.includes(ALL_SELECT_VALUE) ? [] : [ALL_SELECT_VALUE];
  }

  const enabledSet = new Set(enabledValues);
  const hasAll = enabledSet.has(ALL_SELECT_VALUE);

  // 현재 유효한 선택값
  const nextValues = selectedValues.includes(ALL_SELECT_VALUE)
    ? enabledValues.filter((value) => value !== ALL_SELECT_VALUE)
    : selectedValues.filter((value) => enabledSet.has(value));

  const index = nextValues.indexOf(clickedValue);

  if (index >= 0) {
    nextValues.splice(index, 1);
  } else {
    nextValues.push(clickedValue);
  }

  // 전체 선택 여부 확인
  const selectableCount = hasAll ? enabledValues.length - 1 : enabledValues.length;

  if (nextValues.length === selectableCount) {
    return hasAll ? [ALL_SELECT_VALUE] : [...nextValues];
  }

  return nextValues;
}

/**
 * 드롭다운 아이템의 선택 상태를 갱신한다.
 *
 * @param dropdownElement 드롭다운 컨테이너
 * @param listItems 드롭다운 데이터 목록
 * @param values 현재 선택된 값 목록
 * @param valueKey 값 필드명
 * @param isAll 전체 선택 여부
 */
export function updateDropdownSelection(
  dropdownElement: HTMLElement,
  listItems: any[],
  values: any[],
  valueKey: string,
  isAll: boolean,
): void {
  // 전체 선택
  if (isAll) {
    addClass(dropdownElement.querySelectorAll('.dg-dropdown-item:not(.disabled)'), SELECTED_STYLE_CLASS);
    return;
  }

  // 기존 선택 상태 제거
  removeClass(dropdownElement.querySelectorAll(`.dg-dropdown-item.${SELECTED_STYLE_CLASS}`), SELECTED_STYLE_CLASS);

  const selectedSet = new Set(values);

  for (let i = 0; i < listItems.length; i++) {
    if (!selectedSet.has(listItems[i][valueKey])) {
      continue;
    }

    dropdownElement
      .querySelector<HTMLElement>(`.dg-dropdown-item[data-index="${i}"]`)
      ?.classList.add(SELECTED_STYLE_CLASS);
  }
}

export function getLabelsByValue(
  value: string | string[],
  valueDelimiter: string,
  valueLabelMap: Map<string, any>,
): string[] {
  const valueSet = new Set(isString(value) ? stringSplit(value || '', valueDelimiter) : value);

  // 전체 선택인 경우 모든 라벨 반환
  if (valueSet.has(ALL_SELECT_VALUE)) {
    return [...valueLabelMap.values()];
  }

  const labels: string[] = [];

  for (const val of valueSet) {
    const label = valueLabelMap.get(val);

    if (label !== undefined) {
      labels.push(label);
    }
  }

  return labels;
}
