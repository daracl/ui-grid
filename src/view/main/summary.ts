import { GridOptions, HeaderOptions, SummaryOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { camelToKebab, isFunction } from "src/util/utils";
import { ROW_CHECK_NAME } from "src/constants";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";

/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export default class Summary {
  private grid: DaraGrid;

  private config: Config;

  private summaryOpts: SummaryOptions;

  private _isActive: boolean;

  private summaryElement: DaraElement;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.config = grid.config();

    const opts = grid.getOptions();

    this._isActive = opts.summary && opts.summary?.items?.length > 0 ? true : false;

    if (!this._isActive) return;

    this.summaryOpts = opts.summary ?? ({} as SummaryOptions);

    this.createTemplate();

    this.drawData();

    //처리할것.
  }

  public getElement() {
    return this.summaryElement;
  }

  public isActive() {
    return this._isActive;
  }

  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    if (!this._isActive) return;
    this.leftElement.css({ width: mainLeftWidth + "px" });
    this.centerElement.css({ "margin-left": mainLeftWidth + "px", width: mainCenterWidth + "px" });
    this.rightElement.css({ width: mainRightWidth + "px" });
  }

  public setCenterElementStyle(styleCss: any) {
    if (!this._isActive) return;

    this.centerElement.css(styleCss);
  }

  public drawData() {
    if (!this._isActive) return;

    const cfg = this.config;
    const items = cfg.items;

    const summaryItems = this.summaryOpts.items;

    const allFieldMap = cfg.allFieldMap;

    //TODO 포멧 추가.
    //
    //
    //

    let rowIdx = 0;
    for (const groupItem of summaryItems) {
      for (const item of groupItem) {
        const fieldName = item.name;

        if (allFieldMap.has(fieldName)) {
          const col = allFieldMap.get(fieldName)?.$colSeq;
          const cellElement = this.summaryElement.find(`[data-cell-position="${rowIdx},${col}"]`).firstChild as HTMLElement;

          const expression = item.expression;

          let summaryValue: any = "";
          if (expression) {
            if (isFunction(expression)) {
              summaryValue = expression(items);
            } else {
              summaryValue = calcSummary(items, expression, item.name);
            }
          } else if (item.label) {
            summaryValue = item.label;
          }

          cellElement.innerText = summaryValue;
        }
      }
      rowIdx++;
    }

    //const col = .get(LINE_NUMBER_NAME)?.$colSeq;

    console.log("summary draw data ", this._isActive);
  }

  private createTemplate() {
    const cfg = this.config;
    const summaryElement = this.grid.element().findDaraElement(".dg-summary");
    this.summaryElement = summaryElement;
    this.leftElement = summaryElement.findDaraElement(".dg-left");
    this.centerElement = summaryElement.findDaraElement(".dg-center");
    this.rightElement = summaryElement.findDaraElement(".dg-right");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: "center", fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: "right", fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    const heights = cfg.summary.heights;

    const heightsLength = heights.length;

    fieldGroups.forEach(({ fields, element, startCol }) => {
      if (fields.length === 0) return;

      element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(0, heightsLength, heights, fields, startCol));
    });
  }

  /**
   * html template
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
  private rowTemplate(viewRow: number, rowCount: number, rowHeight: number[], fields: FieldItem[], startCol: number): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = viewRow + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        const renderType = field.renderer.type;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell dg-aside ${camelToKebab(field.name).replace("$", "")}" data-cell-position="${rowIdx + "," + (startCol + j)}">
            <div role="presentation" class="dg-cell-renderer ${field.name == ROW_CHECK_NAME ? "dg-checkbox" : ""} ${field.$alignStyle}"></div>
          </td>`);
        } else {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + (startCol + j)}"><div role="presentation"
              class="dg-cell-renderer dg-cell-ellipsis 
              dg-${renderType} ${field.$alignStyle}"></div>
          </td>`);
        }
      }

      returnTemplate.push(`<tr class="dg-row" rowinfo="${rowIdx}" style="height:${rowHeight[i]}px">
          ${cellTemplate.join("")}
        </tr>`);
    }

    return returnTemplate.join("");
  }
}

function calcSummary(items: any[], mode: string, itemKey: string): number | string {
  const values = items.map((user) => user[itemKey]).filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return "not valid";
  }

  switch (mode) {
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "sum":
      return values.reduce((acc, val) => acc + val, 0);
    case "average":
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    default:
      return `${mode} not valid`;
  }
}
