import { HIDDEN_ELEMENT_SELECTOR } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { ContextMenuItem, ContextMenuOptions } from '@/types/ContenxtMenu';
import { getBrowserSize, getElementRect, hasClass, outerLayerPosition } from '@/util/domUtils';
import { eventPosition, stopPreventCancel } from '@/util/eventUtils';
import { getCellInfo } from '@/util/gridUtils';
import { html } from '@/util/htmlTemplate';
import { addClass, removeClass, resolveClassName } from '@/util/styleUtils';
import { isFunction, isUndefined, replaceXss } from '@/util/utils';
import { GridMain } from '../GridMain';
import { exportGridFile, ExportFileOptions } from '@/export/exportGridFile';

const CONTEXT_MENU_ON = 'dg-on';
/**
 * Body class
 *
 * @class ContextMenu
 * @typedef {ContextMenu}
 */
export class ContextMenu {
  private readonly gridMain: GridMain;

  private readonly contextOpts: ContextMenuOptions;

  private contextElement: DaraElement;

  private _isActive = false;

  private readonly contextData: Map<string, ContextMenuItem> = new Map();
  private exportBusy = false;

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

  /** 숨김 컨테이너에 붙여 둔 메뉴 요소를 제거한다. */
  destroy() {
    this.contextElement?.getElement().remove();
  }

  create() {
    const contextElement = document.createElement('ul');
    contextElement.dataset.gridLayerId = this.gridMain.uid();
    contextElement.className = 'dg-contextmenu dg-contextmenu-top dg-outer-layer';
    contextElement.setAttribute('draggable', 'false');
    contextElement.setAttribute('onselectstart', 'return false');

    const htmlTemplate = [];
    if (this.contextOpts.enabledHeader) {
      htmlTemplate.push(`<li><a class="dg-contextmenu-header" tabindex="-1">-</a></li>
        <li><a class="dg-divider" tabindex="-1"></a></li>
      `);
    }

    htmlTemplate.push(this.template(this.createItems(this.contextOpts.items), 'top', 0));

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
        if (disableItem) {
          const disableItemLen = disableItem.length;
          let item;
          if (disableItemLen > 0) {
            for (let i = 0; i < disableItemLen; i++) {
              item = disableItem[i];
              addClass(this.contextElement.find('[context-key="' + item.depth + '_' + item.key + '"]'), 'disabled');
            }
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
    eventManager.off(contextItemElements, 'pointerdown');
    eventManager.on({ el: contextItemElements, type: 'pointerdown' }, (e: Event) => {
      const itemElement = e.currentTarget as HTMLElement;
      if (itemElement.closest('.disabled')) return;

      if (hasClass(itemElement, 'dg-submenu-item')) {
        return;
      }

      const parentElement = itemElement.closest('.dg-contextmenu') as HTMLElement;

      const checkboxes = parentElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

      const result: Record<string, boolean> = {};

      checkboxes.forEach((checkbox) => {
        if (checkbox?.dataset?.itemKey) {
          result[checkbox?.dataset?.itemKey] = checkbox.checked;
        }
      });

      const itemKey = itemElement.dataset.itemKey || '';

      const clickItem = this.contextData.get(itemKey);

      this.gridMain.hideLayer();

      if (clickItem?.callback) {
        clickItem.callback(clickItem, result);
        return;
      }

      if (isContextCallback) {
        fnContextCallback(clickItem, result);
      }
    });
  }

  /** 키 전용 설정에 기본 라벨·콜백을 채워 기존 메뉴 실행 경로에 전달한다. */
  private createItems(items: ContextMenuItem[], exportOptions?: ExportFileOptions): ContextMenuItem[] {
    const language = this.gridMain.i18n();
    return items.filter((item) => !isUndefined(item)).map((source) => {
      const item = { ...source };
      const key = item.key ?? '';
      let options = exportOptions;
      if (key === 'exportFile' || exportOptions) {
        options = { ...exportOptions };
        for (const type of ['excel', 'csv', 'json', 'pdf'] as const) {
          if (item.exportOptions?.[type]) options[type] = { ...options[type], ...item.exportOptions[type] };
        }
      }
      const labels: Record<string, string> = {
        copy: language.getMessage('context.copy'),
        exportFile: language.getMessage('context.exportFile'),
        excel: 'Excel', xlsx: 'Excel', csv: 'CSV', pdf: 'PDF', json: 'JSON',
      };
      item.label = item.label ?? ((key === 'copy' || key === 'exportFile' || exportOptions) ? labels[key] : undefined) ?? key;
      if (!item.callback && key === 'copy') {
        item.callback = () => GridMain.getInstance(this.gridMain.element().getElement())?.copyData();
      } else if (!item.callback && exportOptions && ['excel', 'xlsx', 'csv', 'pdf', 'json'].includes(key.toLowerCase())) {
        item.callback = async () => {
          if (this.exportBusy) return;
          const grid = GridMain.getInstance(this.gridMain.element().getElement());
          if (!grid) return;
          this.exportBusy = true;
          try {
            await exportGridFile(grid, key, options, language.getMessage('export.unsupportedFormat'));
          } catch (error) {
            console.error(language.getMessage('export.failed'), error);
          } finally { this.exportBusy = false; }
        };
      }
      if (item.children) item.children = this.createItems(item.children, options);
      return item;
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
   @param {string} id menu id
   @param {number} depth menu depth
   * @returns {string} template string
   */
  public template(data: ContextMenuItem[], id: string, depth: number): string {
    const htmlTemplate = [];

    const dateLen = data.length;

    let itemKey, classNames;
    for (let i = 0; i < dateLen; i++) {
      const item = data[i];

      if (isUndefined(item)) continue;

      // class 속성에 들어가므로 사용자 지정 클래스 이름도 이스케이프한다.
      classNames =
        replaceXss(resolveClassName(item.itemClass, { item }).join(' ')) + (item.disabled === true ? ' disabled' : '');

      itemKey = (id === 'top' ? '' : id + '_') + depth + '_' + (item.key || '');

      if (item.divider === true) {
        htmlTemplate.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
        continue;
      }

      if (item.checkbox === true) {
        htmlTemplate.push(html`<li class="dg-contextmenu-check ${classNames}">
          <a tabindex="-1">
            <label
              ><input type="checkbox" data-item-key="${replaceXss(String(item.key ?? ''))}" />
              <span>${replaceXss(String(item.label ?? ''))}</span>
            </label></a
          >
        </li>`);
        continue;
      }

      this.contextData.set(itemKey, item);

      if (!isUndefined(item.children)) {
        htmlTemplate.push(html`<li
          class="dg-contextmenu-item dg-submenu-item ${classNames}"
          data-item-key="${replaceXss(itemKey)}"
        >
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${replaceXss(String(item.label ?? ''))}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>
          <ul class="dg-contextmenu dg-contextmenu-submenu">
            ${this.template(item.children, itemKey, depth + 1)}
          </ul>
        </li>`);
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey)
          ? `<span class="dg-contextmenu-hotkey">${replaceXss(String(item.hotkey))}</span>`
          : '';
        htmlTemplate.push(html`<li class="dg-contextmenu-item ${classNames}" data-item-key="${replaceXss(itemKey)}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${replaceXss(String(item.label ?? ''))}</span>${hotkeyHtm}
          </a>
        </li>`);
      }
      htmlTemplate.push('</li>');
    }

    return htmlTemplate.join('');
  }
}
