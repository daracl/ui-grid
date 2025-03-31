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

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.bodyOpts = this.grid.getOptions().body;

    this.grid = grid;

    this.calcBodyDemention();

    this.createTemplate();

    this.dataDraw();
  }

  public calcBodyDemention() {
    const cfg = this.grid.config();
  }

  public createTemplate() {
    const containerElement = this.grid.element();
    this.leftElement = containerElement.findDaraElement(".dg-body>.dg-left");
    this.centerElement = containerElement.findDaraElement(".dg-body>.dg-center");
    this.rightElement = containerElement.findDaraElement(".dg-body>.dg-right");

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

    const viewRow = cfg.scroll.viewRow;

    for (let i = 0; i < viewRow; i++) {
      let item = items[i];
      // left panel

      for (let j = 0; j < leftFields.length; j++) {
        const field = leftFields[j];
        field.$renderer.render(i, j, item, this.leftElement.find('[data-cell-position="' + i + "," + j + '"]>.dg-cell-content'));
      }

      // center panel
      for (let j = 0; j < centerFields.length; j++) {
        const field = centerFields[j];
        field.$renderer.render(i, j, item, this.centerElement.find('[data-cell-position="' + i + "," + j + '"]>.dg-cell-content'));
      }

      // center panel
      for (let j = 0; j < rightFields.length; j++) {
        const field = rightFields[j];
        field.$renderer.render(i, j, item, this.rightElement.find('[data-cell-position="' + i + "," + j + '"]>.dg-cell-content'));
      }
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

    let strHtm = [];

    const opts = this.grid.getOptions();
    const rowHeight = opts.body.row.height;

    for (let i = 0; i < viewRow; i++) {
      strHtm.push(`<tr class="dg-row ${(i + 1) % 2 == 0 ? "shadow" : ""}" rowinfo="${i}" style="height:${rowHeight}px">`);

      for (let j = 0; j < leafLength; j++) {
        let field = leafFields[j];
        let clickFlag = field.click;

        let tdHtm = `<td scope="col" class="dg-cell" data-cell-position="${i + "," + j}">
          <div role="presentation" class="dg-cell-content dg-cell-ellipsis ${field.$alignStyle}  ${clickFlag ? "dg-cell-click" : ""}"></div>
        </td>`;

        strHtm.push(tdHtm);
      }

      strHtm.push("</tr>");
    }

    let colGroupHtm = [];
    let colGroupIdx = 0;
    let tableWidth = 0;
    for (let leafNode of leafFields) {
      const nodeWidth = leafNode.width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<col data-col-idx="${colGroupIdx++}" style="width:${nodeWidth}px;">`);
    }

    return `<table class="dg-body-table" style="width:${tableWidth}px;">
      <colgroup>${colGroupHtm.join("")}</colgroup>
      <thead>${strHtm.join("")}</thead>
    </table>`;
  }
}
