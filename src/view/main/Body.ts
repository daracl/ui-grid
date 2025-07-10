import { CellInfo, HeaderCellInfo } from "@t/GridConfig";

import { removeClass } from "../../util/styleUtils";
import { getCheckboxMode } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ROW_CHECK_KEY, ROW_CHECK_NAME, ROW_HEIGHT_KEY, ROW_ID_KEY } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";
import BodyEvent from "./BodyEvent";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class Body {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private selectionInfo: SelectionInfo;

  private bodyElement: DaraElement;

  private bodyEvent: BodyEvent;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private allCellElements: any;

  private rowCheckSet = new Set<number>();

  private beforeRowCheckItem: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.createTemplate();
    this.selectionInfo = gridMain.selectionInfo;

    this.bodyEvent = new BodyEvent(grid, gridMain, this, this.selectionInfo);
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
    if (mode == "new" || mode == "remove") {
      rowItem["_dgCUD"] = mode == "new" ? "C" : "D";
      return rowItem;
    }

    if (mode == "modify" && colInfo) {
      rowItem["_dgCUD"] = rowItem["_dgCUD"] == "_C" ? "C" : rowItem["_dgCUD"] == "C" ? "CU" : "U";

      rowItem[colInfo.name] = newValue;

      const config = this.grid.config();

      const cell = config.edit.cell;

      const cellEle = this.gridMain.getBody().bodyElement.find('[data-cell-position="' + cell.r + "," + cell.c + '"]');

      this.setCellStyleClass(cellEle, cell.rowIndex, cell.c, cell.field, cell.item);
      cell.field.$renderer.render(cell, cellEle.querySelector(".dg-cell") as HTMLElement);

      return rowItem;
    }
  }

  /**
   * all row check;
   *
   * @public
   * @param {boolean} checked
   */
  public setAllCheckItem(cellInfo: HeaderCellInfo, checked: boolean) {
    this.rowCheckSet.clear();
    const items = this.grid.config().items;
    for (const item of items) {
      item[ROW_CHECK_KEY] = checked;
      if (checked) this.rowCheckSet.add(item[ROW_ID_KEY]);
    }
    this.dataDraw("allCheck");
  }

  /**
   * set check item
   *
   * @public
   * @param {boolean} checked check flag
   * @param {*} item row item
   */
  public setCheckItem(cellInfo: CellInfo, checked: boolean, item: any) {
    const isRowAllowMultiSelect = this.grid.config().isRowAllowMultiSelect;

    if (!isRowAllowMultiSelect) {
      if (this.beforeRowCheckItem) {
        this.beforeRowCheckItem[ROW_CHECK_KEY] = false;
      }
      item[ROW_CHECK_KEY] = true;
      this.rowCheckSet.clear();
      this.rowCheckSet.add(item[ROW_ID_KEY]);

      this.beforeRowCheckItem = item;

      return;
    }

    item[ROW_CHECK_KEY] = checked;

    if (checked) {
      if (!this.rowCheckSet.has(item[ROW_ID_KEY])) this.rowCheckSet.add(item[ROW_ID_KEY]);
    } else if (this.rowCheckSet.has(item[ROW_ID_KEY])) {
      this.rowCheckSet.delete(item[ROW_ID_KEY]);
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(this.rowCheckSet.size, this.grid.config().items.length), cellInfo.c);
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
    const cfg = this.grid.config();

    const result = [];

    for (let item of cfg.items) {
      if (item[ROW_CHECK_KEY]) {
        result.push(item[name]);
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
    const isRowAllowMultiSelect = this.grid.config().isRowAllowMultiSelect;
    const cfg = this.grid.config();
    this.rowCheckSet.clear();

    let checkValue = utils.isArray(values) ? values : [values];

    for (let item of cfg.items) {
      item[ROW_CHECK_KEY] = false;
      if (checkValue.includes(item[name])) {
        item[ROW_CHECK_KEY] = true;
        this.rowCheckSet.add(item[ROW_ID_KEY]);

        if (isRowAllowMultiSelect) break;
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(this.rowCheckSet.size, cfg.items.length));

    this.dataDraw("setCheckedItemByValue");
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public addCheckedItemByValue(name: string, values: any) {
    const cfg = this.grid.config();

    let checkValue = utils.isArray(values) ? values : [values];

    for (let item of cfg.items) {
      if (checkValue.includes(item[name])) {
        item[ROW_CHECK_KEY] = true;
        this.rowCheckSet.add(item[ROW_ID_KEY]);
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(this.rowCheckSet.size, cfg.items.length));

    this.dataDraw("addCheckedItemByValue");
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public unCheckedItemByValue(name: string, values: any) {
    const isRowAllowMultiSelect = this.grid.config().isRowAllowMultiSelect;
    const cfg = this.grid.config();

    let checkValue = utils.isArray(values) ? values : [values];

    for (let item of cfg.items) {
      if (checkValue.includes(item[name])) {
        item[ROW_CHECK_KEY] = false;

        if (isRowAllowMultiSelect) {
          this.rowCheckSet.clear();
          this.dataDraw("unCheckedItemByValue");
          break;
        } else {
          this.rowCheckSet.delete(item[ROW_ID_KEY]);
        }
      }
    }

    this.gridMain.getHeader().setCheckboxStyle(getCheckboxMode(this.rowCheckSet.size, cfg.items.length));

    this.dataDraw("unCheckedItemByValue");
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
    rowItem["_dgRowCheck"] = checkFlag;
    return rowItem;
  }

  public editAreaClose() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    if (cfg.isCellEdit === true) {
      /*
      const editRowInfo = cfg.editRowInfo;
      const renderer = editRowInfo.colInfo.renderer;

      const newValue = editRowInfo.rowItem[editRowInfo.colInfo.key];
      if (renderer && renderer.type == "dropdown") {
        const selectElements = $("#" + gridCtx.prefix + "_pubGridEditArea .pubGrid-select-item.selected");

        if (selectElements.length > 0) {
          newValue = selectElements.attr("data-val");
        }

        $("#" + gridCtx.prefix + "_pubGridEditArea").removeClass("open");
      } else {
        let beforeEditEle = gridCtx.element.body.find('.pub-body-td[data-cell-position="' + cfg.editRowInfo.r + "," + cfg.editRowInfo.c + '"] .pubGrid-edit-field');

        if (beforeEditEle.length > 0) {
          newValue = beforeEditEle.val();
          beforeEditEle.remove();
        }
      }

      if (newValue != editRowInfo.rowItem[editRowInfo.colInfo.key]) {
        _$util.setChangeValue(gridCtx, "modify", editRowInfo.rowItem, editRowInfo.colInfo, newValue);
      }
      */
    }
  }

  public setCenterElementStyle(styleCss: any) {
    this.centerElement.css(styleCss);
  }

  /**
   * remove start cell style class
   *
   */
  public removeStartCellClass() {
    const startCellElement = this.bodyElement.finds(".dg-cell.start-cell");

    if (startCellElement) {
      removeClass(startCellElement, "start-cell");
    }
  }

  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    this.leftElement.css({ width: mainLeftWidth + "px" });
    this.centerElement.css({ "margin-left": mainLeftWidth + "px", width: mainCenterWidth + "px" });
    this.rightElement.css({ width: mainRightWidth + "px" });
  }

  public createTemplate() {
    const bodyElement = this.grid.element().findDaraElement(".dg-body");
    this.bodyElement = bodyElement;
    this.leftElement = bodyElement.findDaraElement(".dg-left");
    this.centerElement = bodyElement.findDaraElement(".dg-center");
    this.rightElement = bodyElement.findDaraElement(".dg-right");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
  }

  /**
   * body 데이터 그리기
   */
  public dataDraw(mode?: string) {
    const opts = this.grid.getOptions();
    const cfg = this.grid.config();

    const items = cfg.items;

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;
    const enableLeftField = leftFields.length > 0;
    const enableRightField = rightFields.length > 0;

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: "center", fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: "right", fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    let viewRow = cfg.scroll.viewRow;
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
            const rowEl = element.find(`.dg-row[rowinfo="${i}"]`);
            rowEl?.parentNode?.removeChild(rowEl);
          }
        }
      }

      cfg.scroll.before.viewRow = viewRow;
    } else if (beforeViewRow < viewRow) {
      const rowHeight = cfg.rowHeight;

      const addRow = viewRow - beforeViewRow;

      fieldGroups.forEach(({ fields, element, startCol }) => {
        if (fields.length === 0) return;
        element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(beforeViewRow, addRow, rowHeight, fields, startCol));
      });

      const allCellMap: Record<string, HTMLElement[][]> = {};

      for (const { name, fields, element } of fieldGroups) {
        if (!fields.length) continue;

        const cellElements: HTMLElement[][] = Array.from({ length: viewRow }, () => []);
        const cells = element.finds(".dg-cell");

        for (const el of cells) {
          const cell = el as HTMLElement;
          const pos = cell.getAttribute("data-cell-position");
          if (!pos) continue;

          const [row, col] = pos.split(",").map(Number);
          cellElements[row][col] = cell;
        }

        allCellMap[name] = cellElements;
      }
      this.allCellElements = allCellMap;

      cfg.scroll.before.viewRow = viewRow;
    }

    this.bodyElement.attr({ "data-view-mode": items.length < 1 ? "empty" : "grid" });

    if (currentViewRow < 1) {
      return;
    }

    // 마지막 라인 처리
    if (currentViewRow < viewRow) {
      //console.log(currentViewRow, viewRow, cfg.scroll.startIdx, cfg.dataInfo.rowLength, cfg.dimensions.mainBodyHeight < cfg.rowHeight);

      for (let i = currentViewRow; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length > 0) {
            element.find(`.dg-row[rowinfo="${i}"]`).style.display = "none";
          }
        }
      }

      cfg.scroll.before.hideLastRow = true;
    } else if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length > 0) {
            const style = element.find(`.dg-row[rowinfo="${i}"]`).style;
            if (style.display) style.removeProperty("display");
          }
        }
      }
    }

    const bodyClassList = this.bodyElement.getElement().classList;

    if (startIdx % 2 == 0) {
      bodyClassList.remove("dg-body-odd");
      bodyClassList.add("dg-body-even");
    } else {
      bodyClassList.remove("dg-body-even");
      bodyClassList.add("dg-body-odd");
    }

    const startCell = cfg.selection.startCell;
    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    //const start = performance.now();

    this.removeStartCellClass();

    const pagingStartIdx = opts.footer.paging?.enabled ? (cfg.paging.currPage - 1) * cfg.paging.countPerPage : 0;

    const leafAllFields = cfg.currentFields;
    const leftElements = this.allCellElements["left"];
    const centerElements = this.allCellElements["center"];
    const rightElements = this.allCellElements["right"];

    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      let item = items[viewRowIdx];

      const rowIdx = pagingStartIdx + viewRowIdx;

      // left panel
      if (enableLeftField) {
        const rowCells = leftElements[i];
        for (let j = 0; j < leftFields.length; j++) {
          const field = leftFields[j];
          const cell = rowCells[j];
          this.setSelectCell(startCell, viewRowIdx, j, cell, field, item);
          field.$renderer.render({ rowIndex: rowIdx, r: viewRowIdx, c: j, item: item } as CellInfo, cell.firstElementChild);
        }
      }

      // 중앙
      const rowCenterCells = centerElements[i];
      for (let j = startCol; j <= endCol; j++) {
        const field = leafAllFields[j];
        const cell = rowCenterCells[j];
        this.setSelectCell(startCell, viewRowIdx, j, cell, field, item);
        field.$renderer.render({ rowIndex: rowIdx, r: viewRowIdx, c: j, item: item } as CellInfo, cell.firstElementChild);
      }

      // right panel
      if (enableRightField) {
        const rowCells = rightElements[i];
        for (let j = 0; j < rightFields.length; j++) {
          const field = rightFields[j];
          const cellIdx = fixedRightIndex + j;
          const cell = rowCells[cellIdx];
          this.setSelectCell(startCell, viewRowIdx, cellIdx, cell, field, item);

          field.$renderer.render({ rowIndex: rowIdx, r: viewRowIdx, c: cellIdx, item: item } as CellInfo, cell.firstElementChild);
        }
      }
    }

    this.selectionInfo.setRowLineSelection();
    //const end = performance.now();
    //console.log(`실행 시간: ${end - start} ms`);
  }

  /**
   * cell 선택
   *
   * @private
   * @param {*} startCellInfo
   * @param {number} rowIdx row index
   * @param {number} col cell index
   * @param {HTMLElement} addEle cell element
   * @returns {boolean}
   */
  private setSelectCell(startCellInfo: any, rowIdx: number, col: number, cellElement: HTMLElement, field: FieldItem, item: any) {
    // field add class
    this.setCellStyleClass(cellElement, rowIdx, col, field, item);
    if (field.$isAside) return;

    this.selectionInfo.setCellSelectionStyleClass(cellElement, rowIdx, col, startCellInfo.startIdx, startCellInfo.startCol);
  }

  /**
   * cell style 추가
   *
   * @private
   * @param {HTMLElement} cellEle cell element
   * @param {number} rowIdx row index
   * @param {number} col column index
   * @param {FieldItem} field field info
   * @param {*} item item
   */
  private setCellStyleClass(cellEle: HTMLElement, rowIdx: number, col: number, field: FieldItem, item: any) {
    const renderType = field.renderer.type;
    if (renderType == "image" || renderType == "html" || renderType == "bar" || renderType == "sparkline" || renderType == "sparklineBar") {
      const contentEleStyle = (cellEle.firstElementChild as HTMLElement).style;
      const heightPixel = `${item[ROW_HEIGHT_KEY] - 5}px`;
      contentEleStyle.maxHeight = heightPixel;
      contentEleStyle.height = heightPixel;
      //contentEleStyle.lineHeight = height + "px";
    }

    if (!field.styleClass) return;

    const { classList } = cellEle;

    // Determine new class to add
    const newClass = utils.isFunction(field.styleClass) ? field.styleClass({ rowIdx, col, field, item }) : utils.isString(field.styleClass) ? field.styleClass : "";

    // Define base classes that should not be removed
    const baseClasses = new Set(["dg-cell", "start-cell", "selection"]);

    if (newClass) {
      if (!classList.contains(newClass)) {
        classList.add(newClass);
      }

      baseClasses.add(newClass);
    }

    classList.forEach((cls) => {
      if (!baseClasses.has(cls)) {
        classList.remove(cls);
      }
    });
  }

  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.grid.config();

    let leafFields;
    let startGroupIdx = 0;
    if (type == "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const viewRow = cfg.scroll.viewRow;
    const leafLength = leafFields.length;

    if (viewRow < 1 || leafLength < 1) return "";

    let colGroupHtm = [];
    let colGroupIdx = startGroupIdx;
    let tableWidth = 0;
    for (let leafNode of leafFields) {
      const nodeWidth = leafNode.$width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<th data-col-idx="${colGroupIdx++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${nodeWidth}px;"></th>`);
    }

    return `<table class="dg-body-table">
      <thead><tr>${colGroupHtm.join("")}</tr></thead>
      <tbody></tbody>
    </table> 
    ${type != "center" ? '<div class="fixed-column-line"></div>' : ""}`;
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
  private rowTemplate(viewRow: number, rowCount: number, rowHeight: number, fields: FieldItem[], startCol: number): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = viewRow + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        const renderType = field.renderer.type;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell dg-aside ${utils.camelToKebab(field.name)}" data-cell-position="${rowIdx + "," + (startCol + j)}">
          <div role="presentation" class="dg-cell-renderer ${field.name == ROW_CHECK_NAME ? "dg-checkbox" : ""} ${field.$alignStyle}"></div>
        </td>`);
        } else {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + (startCol + j)}"><div role="presentation"
            class="dg-cell-renderer dg-cell-ellipsis 
            dg-${renderType} ${field.$alignStyle}"></div>
        </td>`);
        }
      }

      returnTemplate.push(`<tr class="dg-row" rowinfo="${rowIdx}" style="height:${rowHeight}px">
        ${cellTemplate.join("")}
      </tr>`);
    }

    return returnTemplate.join("");
  }
}
