import { HIDDEN_ELEMENT_SELECTOR } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { ContextMenuItem, ContextMenuOptions } from '@/types/ContenxtMenu';
import { getBrowserSize, getElementRect, hasClass, outerLayerPosition } from '@/util/domUtils';
import { eventPosition, stopPreventCancel } from '@/util/eventUtils';
import { getCellInfo } from '@/util/gridUtils';
import { html } from '@/util/htmlTemplate';
import { addClass, removeClass, resolveClassName } from '@/util/styleUtils';
import { isFunction, isUndefined } from '@/util/utils';
import { GridMain } from '../GridMain';

const CONTEXT_MENU_ON = 'dg-on';
/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export class ContextMenu {
  private readonly gridMain: GridMain;

  private readonly contextOpts: ContextMenuOptions;

  private contextElement: DaraElement;

  private _isActive = false;

  private readonly contextData: Map<string, ContextMenuItem> = new Map();

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;

    const contextOpts = this.gridMain.options().contextMenu;

    if (!contextOpts) {
      return;
    }

    this._isActive = true;

    this.contextOpts = contextOpts;
  }

  init() {
    if (!this._isActive) return;
    this.create();
    this.initEvent();
  }

  create() {
    const contextElement = document.createElement('ul');
    contextElement.setAttribute('data-grid-id', this.gridMain.uid());
    contextElement.className = 'dg-contextmenu dg-contextmenu-top dg-outer-layer';
    contextElement.setAttribute('draggable', 'false');
    contextElement.setAttribute('onselectstart', 'return false');

    const htmlTemplate = [];
    if (this.contextOpts.enableHeader) {
      htmlTemplate.push('<li><a class="dg-contextmenu-header" tabindex="-1">-</a></li>');
      htmlTemplate.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
    }

    htmlTemplate.push(this.template(this.contextOpts.items, 'top', 0));

    contextElement.innerHTML = htmlTemplate.join('');

    document.querySelector(HIDDEN_ELEMENT_SELECTOR)?.appendChild(contextElement);

    this.contextElement = new DaraElement(contextElement);

    this.gridMain.config().eventManager.on({ el: contextElement, type: 'contextmenu' }, (e: Event) => {
      stopPreventCancel(e);
    });
  }

  private initEvent() {
    const cfg = this.gridMain.config();
    const contextOpts = this.contextOpts;
    const gridElement = this.gridMain.getMainElement().getElement();

    const isDisableItemKeyFn = isFunction(contextOpts.disableItem);
    const isBeforeActivateFn = isFunction(contextOpts.beforeActivate);

    let selectElement: HTMLElement;

    const eventManager = this.gridMain.config().eventManager;

    eventManager.off(gridElement, 'contextmenu');
    eventManager.on({ el: gridElement, type: 'contextmenu' }, (e: Event) => {
      stopPreventCancel(e);

      this.gridMain.hideLayer();

      removeClass(this.contextElement.finds('.dg-submenu-item.' + CONTEXT_MENU_ON), CONTEXT_MENU_ON);

      if (isDisableItemKeyFn) {
        const disableItem = contextOpts.disableItem(contextOpts.items);
        const disableItemLen = disableItem.length;
        let item;
        if (disableItemLen > 0) {
          for (let i = 0; i < disableItemLen; i++) {
            item = disableItem[i];
            addClass(this.contextElement.find('[context-key="' + item.depth + '_' + item.key + '"]'), 'disabled');
          }
        }
      }

      const targetElement = e.target as HTMLElement;
      selectElement = targetElement.closest('.dg-contextmenu-item') as HTMLElement;
      addClass(selectElement, 'dg-select');

      if (isBeforeActivateFn) {
        const cellElement = targetElement.closest('.dg-cell') as HTMLElement;

        if (cellElement) {
          const cellInfo = getCellInfo(cfg, cellElement);

          contextOpts.beforeActivate(cellInfo, { evt: e, element: targetElement });
        } else {
          contextOpts.beforeActivate({ evt: e, element: targetElement });
        }
      }
      const evtPosition = eventPosition(e);

      const orginContextElement = this.contextElement.getElement();

      this.gridMain.openLayer(orginContextElement);

      const position = outerLayerPosition(orginContextElement, evtPosition);

      this.contextElement.css({ top: position.top + 'px', left: position.left + 'px' });
    });
    this.initItemClickEvent();
    this.initSubmenuEvent();
  }

  private initItemClickEvent() {
    const contextItemElements = this.contextElement.finds('.dg-contextmenu-item');

    const fnContextCallback = this.contextOpts.callback;

    const isContextCallback = isFunction(fnContextCallback);

    const eventManager = this.gridMain.config().eventManager;

    // contextmenu item click
    eventManager.off(contextItemElements, 'click');
    eventManager.on({ el: contextItemElements, type: 'click' }, (e: Event) => {
      const itemElement = e.currentTarget as HTMLElement;

      if (hasClass(itemElement, 'dg-submenu-item')) {
        return;
      }

      const parentElement = itemElement.closest('.dg-contextmenu') as HTMLElement;

      parentElement.querySelectorAll('input[type="checkbox"]');

      const itemKey = itemElement.getAttribute('data-item-key') || '';

      const clickItem = this.contextData.get(itemKey);

      this.gridMain.hideLayer();

      if (clickItem?.callback) {
        clickItem.callback(clickItem);
        return;
      }

      if (isContextCallback) {
        fnContextCallback(clickItem);
      }
    });
  }

  private initSubmenuEvent() {
    const contextItemElements = this.contextElement.finds('.dg-contextmenu-item > a');

    let submenuTimer: any;

    const eventManager = this.gridMain.config().eventManager;

    // sub mouseenter
    eventManager.off(contextItemElements, 'mouseenter');
    eventManager.on({ el: contextItemElements, type: 'mouseenter' }, (e: Event) => {
      const targetElement = e.currentTarget as HTMLElement;
      const itemElement = targetElement.closest('.dg-contextmenu-item') as HTMLElement;
      const parentElement = itemElement.closest('.dg-contextmenu') as HTMLElement;

      clearTimeout(submenuTimer);

      if (!hasClass(itemElement, 'dg-submenu-item')) {
        removeClass(parentElement.querySelectorAll(':scope >.dg-contextmenu-item.' + CONTEXT_MENU_ON), CONTEXT_MENU_ON);
        return;
      }

      if (!hasClass(itemElement, CONTEXT_MENU_ON)) {
        removeClass(parentElement.querySelectorAll(':scope >.dg-contextmenu-item.' + CONTEXT_MENU_ON), CONTEXT_MENU_ON);
      }

      submenuTimer = setTimeout(() => {
        addClass(itemElement, CONTEXT_MENU_ON);

        const browserSize = getBrowserSize();

        const itemRect = getElementRect(itemElement);

        const subMenuElement = itemElement.querySelector('.dg-contextmenu-submenu') as HTMLElement;

        const submenuElement = new DaraElement(subMenuElement);
        submenuElement.css({ left: '', top: '' });
        const submenuRect = getElementRect(subMenuElement);

        const submenuWidth = submenuRect.width;
        const submenuHeight = submenuRect.height;
        const willOverflowRight = submenuWidth + itemRect.left + itemRect.width > browserSize.width;

        if (willOverflowRight) {
          const shiftLeftPercent = (submenuWidth / (itemRect.width + 3)) * 100;
          submenuElement.css({ left: `-${shiftLeftPercent}%` });
        }

        const overflowBottom = itemRect.top + submenuHeight - browserSize.height;

        if (overflowBottom > 0) {
          submenuElement.css({ top: `-${overflowBottom}px` });
        }
      }, 450);
    });
  }

  /**
   * change header label
   *
   * @public
   * @param {string} label header label
   */
  public changeHeader(label: string) {
    this.contextElement.find('.dg-contextmenu-header').textContent = label;
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(data: ContextMenuItem[], id: string, depth: number): string {
    const htmlTemplate = [];

    const dateLen = data.length;

    let itemKey, classNames;
    for (let i = 0; i < dateLen; i++) {
      const item = data[i];

      if (isUndefined(item)) continue;

      classNames = resolveClassName(item.itemClass, { item }) + (item.disabled === true ? ' disabled' : '');

      itemKey = depth + '_' + (item.key || '');

      if (item.divider === true) {
        htmlTemplate.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
        continue;
      }

      if (item.checkbox === true) {
        htmlTemplate.push(html`<li class="dg-contextmenu-check ${classNames}">
          <a tabindex="-1">
            <label for="dgcontext_${item.key}"
              ><input type="checkbox" id="dgcontext_${item.key}" /> <span>${item.label}</span>
            </label></a
          >
        </li>`);
        continue;
      }

      this.contextData.set(itemKey, item);

      if (!isUndefined(item.children)) {
        htmlTemplate.push(html`<li class="dg-contextmenu-item dg-submenu-item ${classNames}" data-item-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>
          <ul class="dg-contextmenu dg-contextmenu-submenu">
            ${this.template(item.children, id, depth + 1)}
          </ul>
        </li>`);
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey) ? `<span class="dg-contextmenu-hotkey">${item.hotkey}</span>` : '';
        htmlTemplate.push(html`<li class="dg-contextmenu-item ${classNames}" data-item-key="${itemKey}">
          <a tabindex="-1"> <span class="dg-contextmenu-label">${item.label}</span>${hotkeyHtm} </a>
        </li>`);
      }
      htmlTemplate.push('</li>');
    }

    return htmlTemplate.join('');
  }
}
