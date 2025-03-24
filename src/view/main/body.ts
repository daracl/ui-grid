import { GridOptions, HeaderOptions } from "@t/GridOptions";
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

  private headerOptions: HeaderOptions;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.grid = grid;

    this.createTemplate();

    this.dataDraw();
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
  public dataDraw() {
    const opts = this.grid.getOptions();
    const items = opts.items;
    const cfg = this.grid.config();
    const fields = cfg.currentFields;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];

        if (field.$panel == "left") {
          field.$renderer.render(i, j, item, this.leftElement.find('[data-cell-position="' + i + "," + j + '"]'));
        }
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

    const leafLength = leafFields.length;

    if (leafLength < 1) return "";

    let strHtm = [];

    const opts = this.grid.getOptions();
    const height = opts.body.row.height;

    for (let i = 0, len = leafLength; i < len; i++) {
      let trHeight = height;

      strHtm.push(`<tr class="dg-body-tr ${i % 2 == 0 ? "tr0" : "tr1"}" rowinfo="${i}" style="height:${trHeight}px">`);

      for (let j = 0; j < leafLength; j++) {
        let field = leafFields[j];
        let clickFlag = field.click;

        let tdHtm = `<td scope="col" class="pub-body-td" data-cell-position="${i + "," + j}">
          <div class="pub-content pub-content-ellipsis ${field.$alignStyle}  + ${clickFlag ? "pub-body-td-click" : ""}"></div>
        </td>`;

        strHtm.push(tdHtm);
      }
      strHtm.push("</tr>");

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
