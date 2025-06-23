import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { CellInfo, Config, GridElement, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";

import { addStyleTag, removeClass } from "../../util/styleUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, getCellInfo, getCenterContentLeft, getOverCellPosition, isFixedLeftPostion, isFixedRightPostion, isInputField, isMultipleSelection, createNewItems, isRowSelection } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, stopPreventCancel } from "src/util/eventUtils";
import SelectionInfo from "src/selection/selection";
import AsideRowCheckRenderer from "src/renderer/view/AsideRowCheckRenderer";
import { getOffset, hasClass } from "src/util/domUtils";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class BodyFieldEvent {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private selectionInfo: SelectionInfo;

  public bodyElement: DaraElement;

  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public allCellElements: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.gridMain = gridMain;

    this.initEvent();

    this.selectionInfo = gridMain.selectionInfo;
  }
  public initEvent() {
    this.initBodyEvent();
  }

  private initBodyEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = utils.isFunction(pasteBeforeFn);

    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = utils.isFunction(pasteAfterFn);
  }
}
