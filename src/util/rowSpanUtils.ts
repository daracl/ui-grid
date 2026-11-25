import { RowId, ViewItem } from '@/types/Common';
import { Config } from '@t/GridConfig';

type GetRowItem = (rowId: RowId) => any;

export interface RowSpanRange {
  /** 병합 블록 시작 행 index */
  start: number;
  /** 병합 블록 끝 행 index(포함) */
  end: number;
}

/**
 * field가 병합 기준으로 사용하는 rowSpanFields 키 목록.
 * 상위 병합 필드 값까지 모두 같아야 병합되므로 자기 자신까지의 prefix를 반환한다.
 *
 * @param rowSpanFields rowSpanFields 옵션
 * @param fieldName 대상 field name
 * @returns 병합 비교 키 목록(병합 대상이 아니면 빈 배열)
 */
export function getRowSpanKeys(rowSpanFields: string[] | undefined, fieldName?: string): string[] {
  const level = fieldName && rowSpanFields ? rowSpanFields.indexOf(fieldName) : -1;

  return level < 0 ? [] : (rowSpanFields as string[]).slice(0, level + 1);
}

/**
 * 병합 비교기. 키의 그룹 단계 정보를 한 번만 계산해 두고 행별 키 값을 구한다.
 *
 * 행의 키 값(병합에 참여할 수 없는 행이면 undefined):
 * - 데이터 행: 원본 행의 키 값
 * - 그룹 소계 행: 모든 키가 groupingFields에 있고 소계 단계(groupDepth)가 키의 그룹 단계보다 안쪽이면
 *   groupValues에서 키 값을 가져온다. 상위 병합 셀이 하위 그룹 소계 행까지 이어지게 하기 위함이다.
 * - 그 외 그룹 행(자기 단계·바깥 단계 소계, 총계): 병합을 끊는다.
 */
function createRowSpanMatcher(viewItems: ViewItem[], getRowItem: GetRowItem, keys: string[], groupingFields: string[]) {
  const groupIndexes = keys.map((key) => groupingFields.indexOf(key));
  // 키 중 하나라도 그룹 필드가 아니면 소계 행은 병합에 참여하지 않는다.
  const maxGroupIndex = groupIndexes.some((index) => index < 0) ? Infinity : Math.max(-1, ...groupIndexes);

  const valuesAt = (rowIdx: number): any[] | undefined => {
    const viewItem = viewItems[rowIdx];

    if (!viewItem) {
      return undefined;
    }

    if (!viewItem.groupRowType) {
      const item = getRowItem(viewItem.id);
      return keys.map((key) => item?.[key]);
    }

    if (
      viewItem.groupRowType !== 'groupSummary' ||
      !viewItem.groupValues ||
      (viewItem.groupDepth ?? -1) <= maxGroupIndex
    ) {
      return undefined;
    }

    return groupIndexes.map((index) => viewItem.groupValues?.[index]);
  };

  const isSame = (baseValues: any[] | undefined, rowIdx: number): boolean => {
    if (!baseValues) {
      return false;
    }

    const values = valuesAt(rowIdx);

    return !!values && baseValues.every((value, index) => Object.is(value, values[index]));
  };

  return { valuesAt, isSame };
}

/**
 * start 행부터 같은 병합 블록이 끝나는 위치(exclusive)를 구한다.
 * 병합 블록은 데이터 행에서만 시작한다(그룹 행에서 시작하면 단독 셀).
 *
 * @param limit 탐색 상한(exclusive). 기본값은 viewItems 길이
 * @returns 병합 블록 다음 행 index(병합이 없으면 start + 1)
 */
export function getRowSpanEnd(
  viewItems: ViewItem[],
  getRowItem: GetRowItem,
  keys: string[],
  start: number,
  limit: number = viewItems.length,
  groupingFields: string[] = [],
): number {
  let end = start + 1;

  if (keys.length === 0 || end >= limit || viewItems[start]?.groupRowType) {
    return end;
  }

  const matcher = createRowSpanMatcher(viewItems, getRowItem, keys, groupingFields);
  const baseValues = matcher.valuesAt(start);

  while (end < limit && matcher.isSame(baseValues, end)) {
    end++;
  }

  return end;
}

/**
 * rowIdx가 속한 병합 블록의 시작/끝 행 index를 데이터 기준으로 구한다.
 * rowIdx가 블록 안의 하위 그룹 소계 행이어도 그 블록 범위를 반환한다.
 */
export function getRowSpanRange(
  viewItems: ViewItem[],
  getRowItem: GetRowItem,
  keys: string[],
  rowIdx: number,
  groupingFields: string[] = [],
): RowSpanRange {
  let start = rowIdx;
  let end = rowIdx;

  if (keys.length === 0) {
    return { start, end };
  }

  const matcher = createRowSpanMatcher(viewItems, getRowItem, keys, groupingFields);
  const baseValues = matcher.valuesAt(rowIdx);

  if (!baseValues) {
    return { start, end };
  }

  while (start > 0 && matcher.isSame(baseValues, start - 1)) {
    start--;
  }

  while (end < viewItems.length - 1 && matcher.isSame(baseValues, end + 1)) {
    end++;
  }

  return { start, end };
}

/**
 * 그리드 셀(rowIdx, colIdx)이 속한 병합 블록 범위.
 * 병합 컬럼이 아니면 { start: rowIdx, end: rowIdx }를 반환한다.
 */
export function getCellRowSpanRange(
  cfg: Config,
  rowSpanFields: string[] | undefined,
  rowIdx: number,
  colIdx: number,
  groupingFields: string[] = [],
): RowSpanRange {
  const keys = getRowSpanKeys(rowSpanFields, cfg.currentFields[colIdx]?.name);

  if (keys.length === 0) {
    return { start: rowIdx, end: rowIdx };
  }

  const dataManager = cfg.dataManager;

  return getRowSpanRange(
    dataManager.getViewItems(),
    (rowId) => dataManager.getRowItem(rowId),
    keys,
    rowIdx,
    groupingFields,
  );
}

export interface RowSpanMerge {
  /** 병합 필드명 */
  field: string;
  /** 병합 시작 행 index */
  start: number;
  /** 병합 끝 행 index(포함) */
  end: number;
}

/**
 * 전체 view 행 기준 병합 구간 목록(2행 이상만). 파일 내보내기(Excel·PDF)에서 사용한다.
 * 결과는 rowSpanFields 순서, 같은 필드 안에서는 행 순서로 정렬된다.
 */
export function getRowSpanMerges(
  viewItems: ViewItem[],
  getRowItem: GetRowItem,
  rowSpanFields: string[],
  groupingFields: string[] = [],
): RowSpanMerge[] {
  const merges: RowSpanMerge[] = [];

  for (const field of rowSpanFields) {
    const keys = getRowSpanKeys(rowSpanFields, field);

    for (let start = 0; start < viewItems.length; ) {
      const end = getRowSpanEnd(viewItems, getRowItem, keys, start, viewItems.length, groupingFields);

      if (end - start > 1) {
        merges.push({ field, start, end: end - 1 });
      }

      start = end;
    }
  }

  return merges;
}
