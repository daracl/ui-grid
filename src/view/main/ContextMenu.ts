import DaraGrid from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class ContextMenu {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private selectionInfo: SelectionInfo;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.template();
    this.selectionInfo = gridMain.selectionInfo;
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template() {
    const cfg = this.grid.config();

    return `<table class="dg-body-table">
      <thead><tr></tr></thead>
      <tbody></tbody>
    </table>`;
  }
}
