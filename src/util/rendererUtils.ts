import { isString } from './utils';

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
