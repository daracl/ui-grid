import { Config } from '@t/GridConfig';

import { EventHandler } from '@/event/EventHandler';
import { HeaderOptions } from '@/types/GridOptions';
import { getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { isClickEvent, stopPreventCancel } from '@/util/eventUtils';
import { intValue, isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Header } from './Header';

/**
 * help button event class
 *
 * @class HelpButtonEvent
 * @typedef {HelpButtonEvent }
 */
export class HelpButtonEvent implements EventHandler {
  private readonly gridMain: GridMain;

  private readonly header: Header;

  private readonly helpOpts: HeaderOptions;

  constructor(gridMain: GridMain, header: Header) {
    this.gridMain = gridMain;
    this.header = header;

    this.helpOpts = gridMain.options().header;
  }

  /**
   * keydown event
   *
   */
  public init() {
    const helpOpts = this.helpOpts.help;

    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    const helpElements = this.header.getHeaderElement().finds('.dg-header-help');

    if (isFunction(helpOpts.click)) {
      const helpClickFn = helpOpts.click ?? (() => void 0);
      eventManager.off(helpElements, 'mousedown touchstart');
      eventManager.on(
        { el: helpElements, type: 'mousedown touchstart' },
        (e: UIEvent) => {
          if (!isClickEvent(e)) {
            return;
          }
          stopPreventCancel(e);

          const currentElement = e.currentTarget as HTMLElement;
          const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

          helpClickFn(cellInfo);

          return false;
        },
        { passive: false },
      );
    }

    let helpLayerElement: HTMLElement;

    // help mouseenter
    const delay = helpOpts.showDelay;
    const renderContainer = this.gridMain.getRendererLayerElement();
    let delayTimer: any;
    eventManager.off(helpElements, 'mouseenter');
    eventManager.on({ el: helpElements, type: 'mouseenter' }, (e: UIEvent) => {
      const currentElement = e.currentTarget as HTMLElement;
      const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

      const field = cellInfo.field;

      const helpValue = field?.headerHelp ?? helpOpts.content;

      if (!helpValue) return false;

      if (!helpLayerElement) {
        helpLayerElement = getLayerElement('div', 'dg-header-help-tooltip', 'help-tooltip');

        renderContainer.appendChild(helpLayerElement);
      }

      delayTimer = setTimeout(() => {
        let viewContent: any;
        if (isFunction(helpValue)) {
          viewContent = helpValue(cellInfo);
        } else {
          viewContent = helpValue;
        }

        helpLayerElement.innerHTML = viewContent;

        const layerStyle = helpLayerElement.style;

        layerStyle.height = 'auto';
        layerStyle.display = 'block';
        layerStyle.width = 'auto';

        const openPosition = innerLayerPosition(renderContainer, currentElement, helpLayerElement);

        layerStyle.top = `${openPosition.top}px`;
        layerStyle.left = `${openPosition.left + 2}px`;
        layerStyle.height = `${openPosition.height}px`;
      }, delay);

      return false;
    });

    eventManager.on({ el: helpElements, type: 'mouseleave' }, (e: UIEvent) => {
      clearTimeout(delayTimer);

      if (helpLayerElement?.style) {
        helpLayerElement.style.display = 'none';
      }

      return false;
    });
  }

  getHeaderHelpCellInfo(cfg: Config, currentElement: HTMLElement) {
    let cell;
    let field;
    const groupCellElement = currentElement.closest('.dg-header-group-cell');
    if (groupCellElement) {
      const groupPosition = groupCellElement.getAttribute('data-header-group-position')?.split(',');

      if (groupPosition && groupPosition.length > 0) {
        const row = intValue(groupPosition[0]);
        const idx = intValue(groupPosition[1]);

        let fieldGroups;
        if (groupCellElement.closest('.dg-region[data-region="left"]')) {
          fieldGroups = cfg.fieldHeaderGroup.left;
        } else if (groupCellElement.closest('.dg-region[data-region="right"]')) {
          fieldGroups = cfg.fieldHeaderGroup.right;
        } else {
          fieldGroups = cfg.fieldHeaderGroup.center;
        }
        field = fieldGroups[row][idx];
        cell = idx;
      }
    } else {
      cell = intValue(currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0');
      field = cfg.currentFields[cell];
    }

    return { c: cell, field: field };
  }
}
