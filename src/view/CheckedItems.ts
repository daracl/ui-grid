import { DataManager } from '@/service/DataManager';
import { isArray, isUndefined } from '@/util/utils';

/**
 * 체크된 행을 화면 표시 순서대로 모은다.
 *
 * @param dataManager 데이터 관리자
 * @param names 가져올 필드명. 생략하면 행 전체를 반환하고, 지정하면 해당 필드만 담은 객체를 반환한다.
 * @returns 체크된 행 배열
 */
export function collectCheckedItems(
  dataManager: DataManager,
  names?: string | string[],
): Record<string, unknown>[] {
  const exportNames: string[] | undefined = isUndefined(names) ? undefined : isArray(names) ? names : [names];
  const checkItems: Record<string, unknown>[] = [];

  for (const viewItem of dataManager.getViewItems()) {
    const rowId = viewItem.id;
    if (!dataManager.isItemChecked(rowId)) continue;

    const rowItem = dataManager.getRowItem(rowId) as Record<string, unknown>;

    if (!exportNames) {
      checkItems.push(rowItem);
      continue;
    }

    const checkItem: Record<string, unknown> = {};
    for (const name of exportNames) {
      checkItem[name] = rowItem[name];
    }
    checkItems.push(checkItem);
  }

  return checkItems;
}
