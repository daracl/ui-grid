import { RowId } from '@/types/Common';
import { BodyCellStyleMap, ROW_CHECK_NAME } from '@/constants';
import { getCheckboxMode } from '@/util/gridUtils';
import { copyStringToClipboard, isArray } from '@/util/utils';

import { BodyContext } from './BodyContext';
import { BodyRenderer } from './BodyRenderer';
import { CellInfo } from '@/types/GridConfig';

/**
 * Body Row Check / Selection 관리
 */
export class BodySelection {
  /**
   * Body Selection 생성
   *
   * @param context Body Context
   * @param renderer Body Renderer
   */
  constructor(private readonly context: BodyContext, private readonly renderer: BodyRenderer) {}

  public init(): void {
    //
  }

  /**
   * 체크된 항목의 필드값 반환
   *
   * @param name 필드명
   */
  public getCheckedItemByName(name: string) {
    const { dataManager } = this.context.gridMain.config();

    const result: any[] = [];
    const items = dataManager.getViewItems();

    for (const viewItem of items) {
      if (dataManager.isItemChecked(viewItem.id)) {
        result.push(dataManager.getRowItem(viewItem.id)[name]);
      }
    }

    return result;
  }

  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  public setAllCheckItem(checked: boolean): void {
    const dataManager = this.context.gridMain.config().dataManager;

    if (checked) {
      dataManager.setAllCheck();
    } else {
      dataManager.clearAllCheck();
    }

    this.renderer.dataDraw('allCheck');
  }

  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  public setItemChecked(rowId: RowId, checked: boolean): void {
    this.setItemsChecked([rowId], checked);
  }

  /**
   * 여러 Row 체크 상태 설정
   *
   * 기존 체크 상태를 초기화한 후 지정한 Row를 체크
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  public setItemsChecked(rowIds: RowId[], checked: boolean): void {
    this.context.gridMain.config().dataManager.clearAllCheck();

    this.addItemsChecked(rowIds, checked);
  }

  /**
   * Row 체크 상태 추가
   *
   * 기존 체크 상태를 유지
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  public addItemChecked(rowId: RowId, checked: boolean): void {
    this.addItemsChecked([rowId], checked);
  }

  /**
   * 여러 Row의 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  private addItemsChecked(rowIds: RowId[], checked: boolean): void {
    if (rowIds.length === 0) {
      return;
    }

    const { isRowAllowMultiSelect, dataManager, dataInfo } = this.context.gridMain.config();

    if (!isRowAllowMultiSelect) {
      dataManager.clearAllCheck();

      const rowId = rowIds[0];

      if (rowId !== undefined) {
        dataManager.setItemChecked(rowId, checked);
        this.setFieldRefresh(ROW_CHECK_NAME);
      }

      return;
    }

    rowIds.forEach((rowId) => {
      dataManager.setItemChecked(rowId, checked);
    });

    this.setFieldRefresh(ROW_CHECK_NAME);

    this.context.gridMain
      .getHeader()
      .setCheckboxStyle(getCheckboxMode(dataManager.getCheckedCount(), dataInfo.rowLength));
  }

  /**
   * 지정한 Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  public setFieldRefresh(fieldName: string): void {
    const cfg = this.context.gridMain.config();
    const { scroll, paging, dataManager, currentFields } = cfg;

    const refreshField = currentFields.find((field) => field.name === fieldName);

    if (!refreshField) {
      return;
    }

    const opts = this.context.gridMain.options();
    const viewItems = dataManager.getViewItems();

    const currentViewRow = scroll.viewRow;
    const startIdx = scroll.startIdx;

    const pagingStartIdx = opts.footer.paging?.enabled ? (paging.currPage - 1) * paging.countPerPage : 0;

    const colSeq = refreshField.$colSeq;

    let fieldMapElement = this.context.allCellElements.center;

    if (colSeq < cfg.fixedLeftIndex) {
      fieldMapElement = this.context.allCellElements.left;
    } else if (colSeq >= cfg.fixedRightIndex) {
      fieldMapElement = this.context.allCellElements.right;
    }

    const rowCellInfo: CellInfo = { rowIndex: -1, r: -1, item: null, viewItem: undefined, c: -1, field: refreshField };

    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      const viewItem = viewItems[viewRowIdx];

      if (!viewItem) {
        break;
      }

      const item = dataManager.getRowItem(viewItem.id);

      const rowIdx = pagingStartIdx + viewRowIdx;

      rowCellInfo.rowIndex = rowIdx;
      rowCellInfo.r = viewRowIdx;
      rowCellInfo.item = item;
      rowCellInfo.viewItem = viewItem;
      rowCellInfo.c = colSeq;

      const cell = fieldMapElement[i]?.[colSeq];

      if (!cell) {
        continue;
      }

      refreshField.$renderer.render(rowCellInfo, cell.firstElementChild as HTMLElement);
    }
  }

  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  public setCheckedItemByValue(name: string, values: any): void {
    const { dataManager, isRowAllowMultiSelect } = this.context.gridMain.config();

    const checkValueSet = new Set(isArray(values) ? values : [values]);

    const viewItems = dataManager.getViewItems();

    const rowIdsToCheck: RowId[] = [];

    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);

        if (!isRowAllowMultiSelect) {
          break;
        }
      }
    }

    this.setItemsChecked(rowIdsToCheck, true);
  }

  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  public addCheckedItemByValue(name: string, values: any): void {
    const { dataManager } = this.context.gridMain.config();

    const checkValueSet = new Set(isArray(values) ? values : [values]);

    const viewItems = dataManager.getViewItems();

    const rowIdsToCheck: RowId[] = [];

    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);
      }
    }

    this.addItemsChecked(rowIdsToCheck, true);
  }

  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  public unCheckedItemByValue(name: string, values: any): void {
    const { dataManager } = this.context.gridMain.config();

    const checkValueSet = new Set(isArray(values) ? values : [values]);

    const viewItems = dataManager.getViewItems();

    const rowIdsToCheck: RowId[] = [];

    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);
      }
    }

    this.addItemsChecked(rowIdsToCheck, false);
  }

  /** 선택 데이터 클립보드 복사 */
  public copyData(): void {
    const selectData = this.context.selectionInfo.selectionData();

    try {
      copyStringToClipboard(selectData);
    } catch (e) {
      console.log('Unable to copy', e);
    }
  }

  /** Row Anchor Cell 선택 상태 갱신 */
  public selectRowAnchorCell(): void {
    const cfg = this.context.gridMain.config();
    const leafLeft = cfg.fieldHeaderGroup.leafLeft;

    if (leafLeft && !leafLeft[0].$isAside) {
      return;
    }

    const leftElements = this.context.allCellElements.left;

    const startIdx = cfg.scroll.startIdx;
    const viewRow = cfg.scroll.viewRow;
    const selectionClass = BodyCellStyleMap.SELECTION;

    const isAll = this.context.selectionInfo.isAllSelect();

    if (!leftElements) {
      return;
    }

    if (isAll) {
      for (let i = 0; i < viewRow; i++) {
        leftElements[i][0]?.classList.add(selectionClass);
      }

      return;
    }

    const rowLine = this.context.selectionInfo.getRowLine();

    for (let i = 0; i < viewRow; i++) {
      leftElements[i][0]?.classList.toggle(selectionClass, rowLine.has(i + startIdx));
    }
  }

  /** Selection 상태 정리 */
  public destroy(): void {
    //
  }
}
