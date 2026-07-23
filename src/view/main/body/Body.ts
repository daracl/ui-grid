import { CellInfo } from '@t/GridConfig';

import { BodyCellStyleMap, ROW_CHECK_NAME, ROW_FIELD } from '@/constants';
import { WHITE_SPACE } from '@/constantStyles';

import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { ViewItem } from '@/types/Common';
import { getCheckboxMode } from '@/util/gridUtils';
import { html } from '@/util/htmlTemplate';
import { removeClass, resolveClassName } from '@/util/styleUtils';
import * as utils from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';
import { BodyEvent } from './BodyEvent';

const CELL_HIGHLIGHT_CLASS = 'dg-search-highlight';
const CELL_MATCH_CLASS = 'dg-search-match';

const CELL_BASE_CLASS = `${BodyCellStyleMap.CELL} ${BodyCellStyleMap.SELECTION}`;
/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export class Body {
  private readonly gridMain: GridMain;

  private readonly selectionInfo: SelectionInfo;

  private readonly bodyEvent: BodyEvent;

  private bodyElement: DaraElement;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private allCellElements: any;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.createTemplate();
    this.selectionInfo = gridMain.selectionInfo;

    this.bodyEvent = new BodyEvent(gridMain, this, this.selectionInfo);
  }

  init() {
    this.bodyEvent.init();
  }

  public getBodyElement() {
    return this.bodyElement;
  }

  public getBodyCellElements() {
    return this.allCellElements;
  }

  /**
   * @method setChangeValue
   * @description CUD모드 변경. (c = create , u = update , d =delete)
   */
  public setChangeValue(mode: string, rowItem: any, colInfo?: FieldItem, newValue?: any) {
    if (mode == 'new') {
      rowItem[ROW_FIELD.CUD] = 'C';
      return rowItem;
    }
    if (mode == 'remove') {
      rowItem[ROW_FIELD.CUD] = 'D';
      return rowItem;
    }

    if (mode == 'modify' && colInfo) {
      if (rowItem[ROW_FIELD.CUD] == '_') {
        rowItem[ROW_FIELD.CUD] = 'U';
      }

      rowItem[colInfo.name] = newValue;

      const config = this.gridMain.config();

      const cell = config.edit.cell;

      const cellEle = this.gridMain.getBody().bodyElement.find('[data-cell-position="' + cell.r + ',' + cell.c + '"]');

      this.setCellClass(cellEle, cell.rowIndex, cell.c, cell.field, cell.item);
      cell.field.$renderer.render(cell, cellEle.querySelector('.dg-cell') as HTMLElement);

      return rowItem;
    }
  }

  /**
   * all row check;
   *
   * @public
   * @param {boolean} checked
   */
  public setAllCheckItem(checked: boolean) {
    if (checked) {
      this.gridMain.config().dataManager.setAllCheck();
    } else {
      this.gridMain.config().dataManager.clearAllCheck();
    }

    this.dataDraw('allCheck');
  }

  /**
   * set check item
   *
   * @public
   * @param {boolean} checked check flag
   * @param {*} item row item
   */
  public setItemChecked(item: any, checked: boolean) {
    const { isRowAllowMultiSelect, dataManager, dataInfo } = this.gridMain.config();

    dataManager.setItemChecked(item, checked);

    if (!isRowAllowMultiSelect) {
      return;
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(dataManager.getCheckedCount(), dataInfo.rowLength));
  }

  /**
   * 현재 체크된 항목들에서 지정한 필드(`name`)의 값을 배열로 반환합니다.
   *
   * @param name - 반환할 필드명 (예: 'id', 'code', 'name' 등)
   * @returns 체크된 항목들의 해당 필드값 배열
   *
   * 예시:
   * - name이 "id"인 경우 → 체크된 row들의 id만 추출하여 배열로 반환
   */
  public getCheckedItemByName(name: string) {
    const { dataManager } = this.gridMain.config();

    const result = [];

    const items = dataManager.getViewItems();

    for (const viewItem of items) {
      if (dataManager.isItemChecked(viewItem.id)) {
        result.push(dataManager.getRowItem(viewItem.id)[name]);
      }
    }

    return result;
  }

  /**
   * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   *
   */
  public setCheckedItemByValue(name: string, values: any) {
    const isRowAllowMultiSelect = this.gridMain.config().isRowAllowMultiSelect;
    const { dataManager, dataInfo } = this.gridMain.config();

    const checkValues = utils.isArray(values) ? values : [values];

    const viewItems = dataManager.getViewItems();

    dataManager.clearAllCheck();

    for (const viewItem of viewItems) {
      if (checkValues.includes(dataManager.getRowItem(viewItem.id)[name])) {
        dataManager.setItemChecked(viewItem.id, true);

        if (!isRowAllowMultiSelect) break;
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(dataManager.getCheckedCount(), dataInfo.rowLength));

    this.dataDraw('setCheckedItemByValue');
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public addCheckedItemByValue(name: string, values: any) {
    const { dataManager, dataInfo } = this.gridMain.config();

    const checkValue = utils.isArray(values) ? values : [values];
    const viewItems = dataManager.getViewItems();

    for (const viewItem of viewItems) {
      if (checkValue.includes(dataManager.getRowItem(viewItem.id)[name])) {
        dataManager.setItemChecked(viewItem.id, true);
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(dataManager.getCheckedCount(), dataInfo.rowLength));

    this.dataDraw('addCheckedItemByValue');
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public unCheckedItemByValue(name: string, values: any) {
    const { dataManager, dataInfo } = this.gridMain.config();

    const checkValue = utils.isArray(values) ? values : [values];
    const viewItems = dataManager.getViewItems();

    for (const viewItem of viewItems) {
      if (checkValue.includes(dataManager.getRowItem(viewItem.id)[name])) {
        dataManager.setItemChecked(viewItem.id, false);
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(dataManager.getCheckedCount(), dataInfo.rowLength));

    this.dataDraw('unCheckedItemByValue');
  }

  /**
   * get rowitem check value
   *
   * @public
   * @param {*} rowItem row item
   * @param {boolean} checkFlag check 여부
   * @returns {*}
   */
  public setRowCheck(rowItem: any, checkFlag: boolean) {
    const rowId = rowItem[ROW_FIELD.ID];
    this.gridMain.config().dataManager.setItemChecked(rowId, checkFlag);
  }

  public setCenterElementStyle(styleCss: any) {
    this.centerElement.css(styleCss);
  }

  /**
   * grid data copy
   *
   * @public
   */
  public copyData() {
    const selectData = this.selectionInfo.selectionData();

    try {
      utils.copyStringToClipboard(selectData);
    } catch (e) {
      console.log('Unable to copy', e);
    }
  }

  public getStartCellElement() {
    return this.bodyElement.find('.dg-cell.' + BodyCellStyleMap.START_CELL);
  }

  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    this.leftElement.css({ width: mainLeftWidth + 'px' });
    this.centerElement.css({ 'margin-left': mainLeftWidth + 'px', width: mainCenterWidth + 'px' });
    this.rightElement.css({ width: mainRightWidth + 'px' });
  }

  public createTemplate() {
    const bodyElement = this.gridMain.element().findDaraElement('.dg-body');
    this.bodyElement = bodyElement;
    this.leftElement = bodyElement.findDaraElement('.dg-region-left');
    this.centerElement = bodyElement.findDaraElement('.dg-region-center');
    this.rightElement = bodyElement.findDaraElement('.dg-region-right');

    this.leftElement.html(this.template('left'));
    this.centerElement.html(this.template('center'));
    this.rightElement.html(this.template('right'));
  }

  /**
   * body 데이터 그리기
   */
  public dataDraw(mode?: string) {
    const opts = this.gridMain.options();
    const cfg = this.gridMain.config();

    const dataManager = cfg.dataManager;

    const viewItems = dataManager.getViewItems();

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;
    const enableLeftField = leftFields.length > 0;
    const enableRightField = rightFields.length > 0;

    const fieldGroups = [
      { name: 'left', fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: 'center', fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: 'right', fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    const viewRow = cfg.scroll.viewRow;
    let startIdx = cfg.scroll.startIdx;

    const maxRow = cfg.dataInfo.rowLength - startIdx;

    let currentViewRow = Math.min(viewRow, maxRow);

    if (maxRow == 0 && cfg.dimensions.mainBodyHeight < cfg.rowHeight) {
      startIdx = cfg.dataInfo.rowLength - 1;
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: startIdx, dragFlag: false });
      currentViewRow = 1;
    }

    const beforeViewRow = cfg.scroll.before.viewRow;

    if (beforeViewRow > 1 && beforeViewRow > viewRow) {
      for (let i = viewRow; i < beforeViewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length > 0) {
            const rowEl = element.find(`.dg-row[data-row="${i}"]`);
            rowEl?.parentNode?.removeChild(rowEl);
          }
        }
      }

      cfg.scroll.before.viewRow = viewRow;
    } else if (beforeViewRow < viewRow) {
      const rowHeight = cfg.rowHeight;

      const addRowTemplateCount = viewRow - beforeViewRow;

      fieldGroups.forEach(({ fields, element, startCol }) => {
        if (fields.length === 0) return;
        element
          .findDaraElement('.dg-body-table > tbody')
          .append(this.rowTemplate(beforeViewRow, addRowTemplateCount, rowHeight, fields, startCol));
      });

      const allCellMap: Record<string, HTMLElement[][]> = {};

      for (const { name, fields, element } of fieldGroups) {
        if (!fields.length) continue;

        const cellElements: HTMLElement[][] = Array.from({ length: viewRow }, () => []);
        const cells = element.finds('.dg-cell');

        for (const el of cells) {
          const cell = el;
          const pos = cell.getAttribute('data-cell-position');
          if (!pos) continue;

          const [row, col] = pos.split(',').map(Number);
          cellElements[row][col] = cell;
        }

        allCellMap[name] = cellElements;
      }
      this.allCellElements = allCellMap;

      cfg.scroll.before.viewRow = viewRow;
    }

    this.bodyElement.setAttr({ 'data-view-mode': viewItems.length < 1 ? 'empty' : 'grid' });

    if (currentViewRow < 1) {
      return;
    }

    this.gridMain.hideLayer(mode);

    // 마지막 라인 처리
    if (currentViewRow < viewRow) {
      const hideRowIdx = viewRow - 1;
      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length > 0) {
            if (i == hideRowIdx) {
              element.find(`.dg-row[data-row="${hideRowIdx}"]`).style.display = 'none';
              continue;
            }

            const style = element.find(`.dg-row[data-row="${i}"]`).style;
            if (style.display == 'none') style.removeProperty('display');
          }
        }
      }

      cfg.scroll.before.hideLastRow = true;
    } else if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length > 0) {
            const style = element.find(`.dg-row[data-row="${i}"]`).style;
            if (style.display) style.removeProperty('display');
          }
        }
      }
    }

    const bodyClassList = this.bodyElement.getElement().classList;

    if (startIdx % 2 == 0) {
      bodyClassList.remove('dg-body-odd');
      bodyClassList.add('dg-body-even');
    } else {
      bodyClassList.remove('dg-body-even');
      bodyClassList.add('dg-body-odd');
    }

    const startCell = cfg.selection.startCell;
    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    //const start = performance.now();

    this.selectionInfo.removeStartAnchorCell();

    const pagingStartIdx = opts.footer.paging?.enabled ? (cfg.paging.currPage - 1) * cfg.paging.countPerPage : 0;

    const leafAllFields = cfg.currentFields;
    const leftElements = this.allCellElements['left'];
    const centerElements = this.allCellElements['center'];
    const rightElements = this.allCellElements['right'];

    const searchEnable = cfg.searchEnable;
    const searchMatchInfo = cfg.searchMatchInfo;

    const matchInfo: {
      searchEnable: boolean;
      cellIndex: number;
      matchViewItem: ViewItem | undefined;
      searchMatchedFields: string[] | undefined;
    } = {
      searchEnable: searchEnable,
      cellIndex: searchMatchInfo.cellIndex,
      matchViewItem: undefined,
      searchMatchedFields: undefined,
    };
    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      const viewItem = viewItems[viewRowIdx];
      const item = dataManager.getRowItem(viewItem.id);

      const rowIdx = pagingStartIdx + viewRowIdx;

      matchInfo.matchViewItem = undefined;
      matchInfo.searchMatchedFields = undefined;

      if (searchEnable) {
        const matchViewItem = dataManager.getSearchMapItem(viewItem.id);
        matchInfo.matchViewItem = matchViewItem;
        matchInfo.searchMatchedFields = matchViewItem?.matchedFields?.map((f) => f.fieldName);
      }

      const rowCellInfo = { rowIndex: rowIdx, r: viewRowIdx, item: item, viewItem: viewItem, c: -1 } as CellInfo;

      // left panel
      if (enableLeftField) {
        const rowCells = leftElements[i];
        for (let j = 0; j < leftFields.length; j++) {
          const field = leftFields[j];
          const cell = rowCells[j];
          rowCellInfo.c = j;
          this.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);
          field.$renderer.render(rowCellInfo, cell.firstElementChild);
        }
      }

      // center panel
      const rowCenterCells = centerElements[i];
      for (let j = startCol; j <= endCol; j++) {
        const field = leafAllFields[j];
        const cell = rowCenterCells[j];
        this.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);
        rowCellInfo.c = j;
        field.$renderer.render(rowCellInfo, cell.firstElementChild);
      }

      // right panel
      if (enableRightField) {
        const rowCells = rightElements[i];
        for (let j = 0; j < rightFields.length; j++) {
          const field = rightFields[j];
          const cellIdx = fixedRightIndex + j;
          const cell = rowCells[cellIdx];

          rowCellInfo.c = cellIdx;

          this.setCellStyle(startCell, viewRowIdx, cellIdx, cell, field, item, matchInfo);

          field.$renderer.render(rowCellInfo, cell.firstElementChild);
        }
      }
    }

    this.selectRowAnchorCell();
    //const end = performance.now();
    //console.log(`실행 시간: ${end - start} ms`);
  }

  /**
   * cell style
   * @param startCellInfo start cell
   * @param rowIdx  row idx
   * @param col   col
   * @param cellElement cell element
   * @param field field info
   * @param item  row item
   * @param viewItem  view item
   * @param searchEnable  검색 여부
   * @returns
   */
  private setCellStyle(
    startCellInfo: any,
    rowIdx: number,
    col: number,
    cellElement: HTMLElement,
    field: FieldItem,
    item: any,
    matchInfo: {
      searchEnable: boolean;
      cellIndex: number;
      matchViewItem: ViewItem | undefined;
      searchMatchedFields: string[] | undefined;
    },
  ) {
    const contentEleStyle = (cellElement.firstElementChild as HTMLElement).style;
    const heightPixel = `${item[ROW_FIELD.HEIGHT] - 5}px`;
    contentEleStyle.maxHeight = heightPixel;
    //contentEleStyle.height = heightPixel;

    // field add class
    this.setCellClass(cellElement, rowIdx, col, field, item);

    if (field.$isAside) return;

    if (matchInfo.searchEnable) {
      const classList = cellElement.classList;
      const matchedFields = matchInfo.searchMatchedFields ?? [];

      if (matchedFields && matchedFields.length > 0) {
        const fieldName = field.name;
        const isMatch = matchInfo.matchViewItem?.isCurrentMatch && matchedFields[matchInfo.cellIndex] === fieldName;

        if (isMatch) {
          classList.add(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
        } else {
          const highlightFlag = matchedFields.includes(fieldName);
          classList.remove(CELL_MATCH_CLASS);
          classList.toggle(CELL_HIGHLIGHT_CLASS, highlightFlag);
        }
      } else {
        classList.remove(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
      }
    }

    this.selectionInfo.updateCellSelectionClass(
      cellElement,
      rowIdx,
      col,
      startCellInfo.startIdx,
      startCellInfo.startCol,
    );
  }

  public clearSearchHighlight() {
    const bodyElement = this.bodyElement;
    removeClass(bodyElement.finds('.dg-cell.' + CELL_HIGHLIGHT_CLASS), CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
  }

  /**
   * cell class 추가
   *
   * @private
   * @param {HTMLElement} cellEle cell element
   * @param {number} rowIdx row index
   * @param {number} col column index
   * @param {FieldItem} field field info
   * @param {*} item item
   */
  private setCellClass(cellEle: HTMLElement, rowIdx: number, col: number, field: FieldItem, item: any) {
    if (!field.cellClass) return;

    // Determine new class to add
    const newClass = resolveClassName(field.cellClass, { rowIdx, col, field, item });

    cellEle.className = newClass ? `${CELL_BASE_CLASS} ${newClass}` : CELL_BASE_CLASS;
  }

  selectRowAnchorCell() {
    const cfg = this.gridMain.config();

    const leafLeft = cfg.fieldHeaderGroup.leafLeft;

    if (leafLeft && !leafLeft[0].$isAside) return;

    const { left: leftElements } = this.gridMain.getBody().getBodyCellElements();

    const startIdx = cfg.scroll.startIdx;
    const viewRow = cfg.scroll.viewRow;
    const selectionClass = BodyCellStyleMap.SELECTION;
    const isAll = this.selectionInfo.isAllSelect();

    if (isAll) {
      for (let i = 0; i < viewRow; i++) {
        leftElements[i][0].classList.add(selectionClass);
      }

      return;
    }

    const rowLine = this.selectionInfo.getRowLine();

    for (let i = 0; i < viewRow; i++) {
      leftElements[i][0].classList.toggle(selectionClass, rowLine.has(i + startIdx));
    }
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.gridMain.config();

    let leafFields;
    let startGroupIdx = 0;
    if (type == 'left') {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == 'right') {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const colGroupHtm = [];
    let colGroupIdx = startGroupIdx;
    for (const leafNode of leafFields) {
      const nodeWidth = leafNode.$width;
      colGroupHtm.push(
        `<th data-col-idx="${colGroupIdx++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${nodeWidth}px;"></th>`,
      );
    }

    return html`<table class="dg-body-table">
        <thead>
          <tr>
            ${colGroupHtm.join('')}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      ${type == 'center' ? '' : '<div class="dg-fixed-column-line"></div>'}`;
  }

  /**
   * row template
   *
   * @private
   * @param {number} rowIdx row index
   * @param {number} rowHeight row height
   * @param {FieldItem[]} fields fields 정보
   * @returns {string} template
   */
  private rowTemplate(
    viewRow: number,
    rowTemplateCount: number,
    rowHeight: number,
    fields: FieldItem[],
    startCol: number,
  ): any {
    const returnTemplate = [];

    for (let i = 0; i < rowTemplateCount; i++) {
      const rowIdx = viewRow + i;

      const cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        const rendererType = field.renderer.type;

        let whiteSpaceStyle = '';
        let whiteSpaceClass = '';
        if (field.whiteSpace) {
          const fieldWhiteStyle = WHITE_SPACE[field.whiteSpace];
          if (fieldWhiteStyle) {
            whiteSpaceStyle = 'white-space: ' + fieldWhiteStyle;
            whiteSpaceClass = 'dg-white-space';
          }
        }

        if (field.$isAside) {
          cellTemplate.push(html`<td
            scope="col"
            class="dg-cell dg-aside dg-${utils.camelToKebab(field.name).replace('$', '')}"
            data-cell-position="${rowIdx + ',' + (startCol + j)}"
          >
            <div
              role="presentation"
              class="dg-cell-renderer ${field.name == ROW_CHECK_NAME ? 'dg-checkbox' : ''} ${field.$alignStyle}"
            ></div>
          </td>`);
        } else {
          cellTemplate.push(html`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + ',' + (startCol + j)}">
            <div
              role="presentation"
              class="dg-cell-renderer dg-ellipsis 
            dg-${rendererType} ${field.$alignStyle} ${whiteSpaceClass}"
              style="${whiteSpaceStyle}"
            ></div>
          </td>`);
        }
      }

      returnTemplate.push(html`<tr class="dg-row" data-row="${rowIdx}" style="height:${rowHeight}px">
        ${cellTemplate.join('')}
      </tr>`);
    }

    return returnTemplate.join('');
  }
}
