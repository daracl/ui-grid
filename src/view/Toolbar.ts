import { Config } from '@t/GridConfig';
import { HeaderOptions } from '@t/GridOptions';

import { GridMain } from './GridMain';

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export class Toolbar {
  private gridMain: GridMain;

  private headerOptions: HeaderOptions;

  private config: Config;

  constructor(gridMain: GridMain, config: Config) {
    this.gridMain = gridMain;
    this.config = config;

    this.headerOptions = gridMain.options().header;
  }
}
