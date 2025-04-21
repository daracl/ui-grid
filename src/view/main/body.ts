import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedLeftPostion, isInputField } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, stopPreventCancel } from "src/util/eventUtils";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class Body {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private bodyOpts: BodyOptions;

  private bodyElement: DaraElement;

  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public allCellMap: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.bodyOpts = this.grid.getOptions().body;

    this.grid = grid;

    this.calcBodyDemention();

    this.createTemplate();

    this.initEvent();
  }
  public initEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    const copyMode = opts.copyMode;
    const selectionMode = opts.selectionMode;
    // window keydown 처리.  tabindex 처리 확인 해볼것.

    eventOff(document, "keydown");
    eventOn(document, "keydown", (e: KeyboardEvent) => {
      if (!cfg.focus) return;

      const targetElement = e.target as HTMLElement;

      if (isInputField(targetElement.tagName)) {
        return true;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest(".pubGrid-setting-area")) return true;

      const evtKey = eventKeyCode(e);

      if (e.metaKey || e.ctrlKey) {
        // copy

        if (evtKey == 67) {
          // ctrl+ c
          if (copyMode == "none") {
            return;
          }

          const copyData = "";

          if (selectionMode == "row" && copyMode == "single" && cfg.selection.allSelect !== true) {
            // const startCellInfo = cfg.selection.startCell;
            // const selItem = cfg.currentClickInfo[startCellInfo.startIdx];
            // if (utils.isUndefined(selItem)) {
            //   return;
            // }
            // copyData = opts.tbodyItem[startCellInfo.startIdx][cfg.currentHeaderItems[startCellInfo.startCol].key];
          } else {
            // copyData = _this.selectionData();
          }

          try {
            //utils.copyStringToClipboard(_this.prefix, copyData);
          } catch (e) {
            console.log("Unable to copy", e);
          }
          return;
        } else if (evtKey == 65) {
          // ctrl + a 처리 할것.
          // if (targetElement.closest("#" + _this.prefix + "_pubGrid .pubGrid-setting-wrapper").length > 0) {
          //   return true;
          // }

          //_this.allItemSelect();
          return false;
        } else if (evtKey == 86) {
          // ctrl + v
          //_this.element.pasteArea.focus();
          return true;
        } else if (evtKey == 70) {
          // ctrl+f
          stopPreventCancel(e);

          //_$setting.settingBtnToggle(_this);
          return true;
        }
      }

      if (opts.editable === true) {
        if ((65 <= evtKey && evtKey <= 90) || (48 <= evtKey && evtKey <= 57)) {
          // const clickInfo = _this.getCurrentClickInfo();
          // const cellInfo = _$util.getCellInfo(_this, _$util.getCellElement(_this, clickInfo.r, clickInfo.c));
          // _$renderer.editCell(_this, cellInfo, e);
          // return false;
        }
      }

      if ((32 < evtKey && evtKey < 41) || evtKey == 13 || evtKey == 9) {
        stopPreventCancel(e);

        // _this.gridKeyCtrl(e, evtKey);
      }
    });
  }

  public calcBodyDemention() {
    const cfg = this.grid.config();
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
    const items = opts.items;
    const cfg = this.grid.config();
    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement },
      { name: "center", fields: centerFields, element: this.centerElement },
      { name: "right", fields: rightFields, element: this.rightElement },
    ];

    let viewRow = cfg.scroll.viewRow;
    const startRow = cfg.scroll.startRow;

    const currentViewRow = viewRow < cfg.dataInfo.rowLength - startRow ? viewRow : cfg.dataInfo.rowLength - startRow;
    const beforeViewRow = cfg.scroll.before.viewRow;

    if (beforeViewRow > 1 && beforeViewRow > viewRow) {
      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        for (let i = viewRow; i < beforeViewRow; i++) {
          let trEle = element.find(`.dg-row[rowinfo="${i}"]`);
          trEle.parentNode?.removeChild(trEle);
          //element.find(`.dg-row[rowinfo="${i}"]`).remove();
        }
      });

      cfg.scroll.before.viewRow = viewRow;
    } else if (beforeViewRow < viewRow) {
      const rowHeight = opts.body.row.height;

      const addViewRow = viewRow - beforeViewRow;

      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(beforeViewRow, addViewRow, rowHeight, fields));
      });

      // 속도 향상 위해 cell을 cache
      const allCellMap = {} as any;
      fieldGroups.forEach(({ name, fields, element }) => {
        if (fields.length > 0) {
          allCellMap[name] = {} as any;
          element.finds(".dg-cell").forEach((cellElement, idx) => {
            let element = cellElement as HTMLElement;
            const cellPosition = element.getAttribute("data-cell-position");
            // this.leftElement.find(`[data-cell-position="${i},${j}"]>.dg-cell-content`));
            if (cellPosition) allCellMap[name][cellPosition] = element.children[0];
          });
        }
      });

      this.allCellMap = allCellMap;

      cfg.scroll.before.viewRow = viewRow;
    }

    if (viewRow < 1) {
      return;
    }

    // 마지막 라인 처리
    if (currentViewRow < viewRow) {
      for (let i = currentViewRow; i < viewRow; i++) {
        fieldGroups.forEach(({ fields, element }) => {
          if (fields.length > 0) {
            element.find(`.dg-row[rowinfo="${i}"]`).style.display = "none";
          }
        });
      }

      cfg.scroll.before.hideLastRow = true;
    } else if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = 0; i < viewRow; i++) {
        fieldGroups.forEach(({ fields, element }) => {
          if (fields.length > 0) {
            const style = element.find(`.dg-row[rowinfo="${i}"]`).style;
            if (style.display) style.removeProperty("display");
          }
        });
      }
    }

    this.bodyElement.attr({ "data-striped-type": startRow % 2 == 0 ? "odd" : "even" });

    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    //console.log(mode, "dataDraw", currentViewRow, viewRow, startCol, endCol);

    //const start = performance.now();
    if (opts.scroll.vertical.enable === false && !utils.isEmpty(mode)) {
      return;
    }

    for (let i = 0; i < currentViewRow; i++) {
      const startRowIdx = startRow + i;
      let item = items[startRowIdx];

      // left panel
      leftFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["left"][`${i},${j}`]);
      });

      // center panel
      for (let j = startCol; j <= endCol; j++) {
        const field = centerFields[j];
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["center"][`${i},${j}`]);
      }

      // right panel
      rightFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["right"][`${i},${j}`]);
      });
    }

    //const end = performance.now();
    //console.log(`실행 시간: ${end - start} ms`);
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
    if (type == "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const viewRow = cfg.scroll.viewRow;
    const leafLength = leafFields.length;

    if (viewRow < 1 || leafLength < 1) return "";

    let colGroupHtm = [];
    let colGroupIdx = 0;
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
  private rowTemplate(startRowIdx: number, rowCount: number, rowHeight: number, fields: FieldItem[]): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = startRowIdx + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let clickFlag = field.click;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + j}">
          <div role="presentation" class="dg-cell-content ${field.$alignStyle}"></div>
        </td>`);
        } else {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + j}">
          <div role="presentation" class="dg-cell-content dg-cell-ellipsis ${field.$alignStyle}  ${clickFlag ? "dg-cell-click" : ""}"></div>
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
