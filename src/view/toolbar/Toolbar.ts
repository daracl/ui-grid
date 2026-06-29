import { Config } from '@t/GridConfig';

import { GridMain } from '../GridMain';
import { ToolbarOptions } from '@/types/GridOptions';

/**
 * Toolbar class
 *
 * @class Toolbar
 * @typedef {Toolbar}
 */
export class Toolbar {
  private readonly gridMain: GridMain;

  private readonly config: Config;

  private readonly toolbarOpts: ToolbarOptions;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.config = gridMain.config();

    this.toolbarOpts = gridMain.options().toolbar;
  }

  public init() {
    if (!this.toolbarOpts.enabled) {
      return;
    }

    // renderer 로 처리 할것.

    // toolbar
    const toolbarElement = this.gridMain.element().findDaraElement('.dg-toolbar');

    if (this.toolbarOpts.enabled) {
      toolbarElement.css({ height: `${this.config.dimensions.toolbarHeight}px` });
    } else {
      toolbarElement.getElement().remove();
    }
  }
}
