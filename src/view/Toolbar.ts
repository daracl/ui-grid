import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { DaraGrid } from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export class Toolbar {
  private grid: DaraGrid;

  private headerOptions: HeaderOptions;

  private config: Config;

  constructor(grid: DaraGrid, config: Config) {
    this.grid = grid;
    this.config = config;

    this.headerOptions = grid.getOptions().header;
  }
}
