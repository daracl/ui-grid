import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";

/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export default class Summary {
  private grid: DaraGrid;

  private headerOptions: HeaderOptions;

  private config: Config;

  constructor(grid: DaraGrid, config: Config) {
    this.grid = grid;
    this.config = config;

    this.headerOptions = grid.getOptions().header;
  }
}
