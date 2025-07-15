import { CellInfo, Config, HeaderCellInfo } from "@t/GridConfig";

import { removeClass } from "../../util/styleUtils";
import { getCheckboxMode } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALL_SELECT_VALUE, ROW_CHECK_KEY, ROW_CHECK_NAME, ROW_HEIGHT_KEY, ROW_ID_KEY } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";
import BodyEvent from "./BodyEvent";
import { SearchOptions } from "@t/GridOptions";
import { getLayerElement, getOpenLayerPosition } from "src/util/domUtils";

/**
 * DataSearch class
 *
 * @class DataSearch
 * @typedef {DataSearch}
 */
export default class DataSearch {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private cfg: Config;

  private searchOpts: SearchOptions;

  private searchElement: HTMLElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.cfg = grid.config();
    this.searchOpts = this.grid.getOptions().search;
    this.gridMain = gridMain;
    this.createTemplate();
  }

  openSearch() {
    this.gridMain.openLayer(this.searchElement);
  }

  createTemplate() {
    const searchOpts = this.searchOpts;

    if (searchOpts.mode == "full") {
    } else {
      this.simpleTemplate();
    }
    console.log("createTemplate");
  }

  simpleTemplate() {
    const searchOpts = this.searchOpts;

    const rendererContainer = this.gridMain.getRendererContainer();

    const fields = this.cfg.currentFields;

    let searchElement = this.searchElement;
    if (!searchElement) {
      const template = [];

      searchElement = getLayerElement("div", "dg-search-simple", "help-tooltip");

      template.push('<select class="search-field">');
      template.push(`<option value="${ALL_SELECT_VALUE}">${this.gridMain.getGrid().i18n().getMessage("all")}</option>`);
      for (let field of fields) {
        if (field.$isAside) continue;
        template.push(`<option value="${field.name}">${field.label}</option>`);
      }
      template.push("</select>");

      template.push('<input type="text" class="search-text">');
      template.push(`<span class="search-btn">
          <span class="search-nav-up" title="${this.gridMain.getGrid().i18n().getMessage("prev")}"></span>
          <span class="search-nav-down" title="${this.gridMain.getGrid().i18n().getMessage("next")}"></span>
        </span>`);

      searchElement.innerHTML = template.join("");

      rendererContainer.appendChild(searchElement);

      this.searchElement = searchElement;
    }

    const searchStyle = searchElement.style;

    const headerElement = this.gridMain.getHeader().getHeaderElement();

    const openPosition = getOpenLayerPosition(rendererContainer, headerElement.getElement(), searchElement);

    searchStyle.top = `${openPosition.top}px`;
    searchStyle.left = `${openPosition.left}px`;
  }
}
