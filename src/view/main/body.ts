import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedLeftPostion } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";

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

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.bodyOpts = this.grid.getOptions().body;

    this.grid = grid;

    this.calcBodyDemention();

    this.createTemplate();
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
          element.find(`.dg-row[rowinfo="${i}"]`).remove();
        }
      });

      cfg.scroll.before.viewRow = viewRow;
    } else if (beforeViewRow < viewRow && beforeViewRow > 0) {
      const rowHeight = opts.body.row.height;

      const addViewRow = viewRow - beforeViewRow;

      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(beforeViewRow, addViewRow, rowHeight, fields));
      });

      cfg.scroll.before.viewRow = viewRow;
    }

    if (viewRow < 1) {
      return;
    }

    console.log("dataDraw", currentViewRow, viewRow);

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
    } else if (cfg.scroll.before.hideLastRow || currentViewRow > viewRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = viewRow - 1; i < viewRow; i++) {
        fieldGroups.forEach(({ fields, element }) => {
          if (fields.length > 0) {
            element.find(`.dg-row[rowinfo="${i}"]`).style.removeProperty("display");
          }
        });
      }
    }

    this.bodyElement.attr({ "data-striped-type": startRow % 2 == 0 ? "odd" : "even" });

    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    for (let i = 0; i < currentViewRow; i++) {
      const startRowIdx = startRow + i;
      let item = items[startRowIdx];

      // left panel
      leftFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.leftElement.find(`[data-cell-position="${i},${j}"]>.dg-cell-content`));
      });

      // center panel
      for (let j = startCol; j <= endCol; j++) {
        const field = centerFields[j];
        field.$renderer.render(startRowIdx, j, item, this.centerElement.find('[data-cell-position="' + i + "," + j + '"]>.dg-cell-content'));
      }

      // right panel
      rightFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.rightElement.find(`[data-cell-position="${i},${j}"]>.dg-cell-content`));
      });
    }
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
      colGroupHtm.push(`<col data-col-idx="${colGroupIdx++}" style="width:${nodeWidth}px;">`);
    }

    return `<table class="dg-body-table">
      <colgroup>${colGroupHtm.join("")}</colgroup>
      <tbody>
        ${this.rowTemplate(0, viewRow, this.grid.getOptions().body.row.height, leafFields)}
      </tbody>
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
