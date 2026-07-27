import { HeaderOptions } from '@t/GridOptions';

import { DaraElement } from '@/element/DaraElement';
import { GridMain } from '@/view/GridMain';

import { BodyCellStyleMap, LINE_NUMBER_NAME, ROW_CHECK_NAME } from '@/constants';
import { addClass, removeClass } from '@/util/styleUtils';
import { intValue } from '@/util/utils';
import { HeaderEvent } from './HeaderEvent';
import { html } from '@/util/htmlTemplate';
import { ALL_ICONS } from '@/constantIcons';
import { SELECTED_STYLE_CLASS } from '@/constantStyles';
import { hasClass } from '@/util/domUtils';

const CHECK_INDETERMINATE = 'dg-indeterminate';
/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export class Header {
  private readonly gridMain: GridMain;

  private readonly headerOpts: HeaderOptions;

  private readonly headerEvent: HeaderEvent;

  private headerElement: DaraElement;
  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private headerCellElements: HTMLElement[];

  private enabled = true;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;

    this.headerOpts = gridMain.options().header;

    this.headerElement = gridMain.element().findDaraElement('.dg-header');

    if (this.headerOpts.view === false) {
      this.enabled = false;
      this.headerElement.getElement().remove();

      return;
    }

    this.initHeader();

    this.headerEvent = new HeaderEvent(gridMain, this);
    this.headerEvent.init();
  }

  initHeader() {
    this.createTemplate();

    this.setHeight(this.gridMain.config().dimensions.mainHeaderHeight);
  }

  public isEnabled() {
    return this.enabled;
  }

  public getHeaderCellElements() {
    return this.headerCellElements;
  }

  public getHeaderElement() {
    return this.headerElement;
  }

  /**
   * all item check
   *
   * @public
   * @param {boolean} checked
   * @param {?HTMLInputElement} [allCheckedElement]
   */
  public setAllCheckItem(checked: boolean, allCheckedElement?: HTMLElement) {
    if (!allCheckedElement) {
      allCheckedElement = this.headerElement.getElement().querySelector('.dg-checkbox.dg-all') as HTMLElement;
    }

    if (checked) {
      addClass(allCheckedElement, SELECTED_STYLE_CLASS);
    } else {
      removeClass(allCheckedElement, SELECTED_STYLE_CLASS);
    }

    removeClass(allCheckedElement as HTMLElement, CHECK_INDETERMINATE);

    this.gridMain.getBody().setAllCheckItem(checked);
  }

  /**
   * set check box style
   *
   * @public
   * @param {number} idx
   * @param {("all" | "none" | "partial")} mode
   */
  public setCheckboxStyle(mode: 'all' | 'none' | 'partial') {
    if (!this.gridMain.config().isRowAllowMultiSelect) return;

    const checkEle = this.headerElement.getElement().querySelector('.dg-checkbox.dg-all') as HTMLElement;

    const classList = checkEle?.classList;
    if (mode == 'partial') {
      classList.remove(SELECTED_STYLE_CLASS);
      if (!classList.contains(CHECK_INDETERMINATE)) classList.add(CHECK_INDETERMINATE);
    } else {
      if (mode == 'all') {
        classList.add(SELECTED_STYLE_CLASS);
      }

      if (classList.contains(CHECK_INDETERMINATE)) classList.remove(CHECK_INDETERMINATE);
    }
  }

  /**
   * set column width
   *
   * @public
   * @param {number} idx column index
   * @param {number} w  column width
   */
  public setColumnWidth(idx: number, w: number) {
    const cfg = this.gridMain.config();
    cfg.isHeaderResize = true;

    const minWidth = this.headerOpts.resize.minWidth,
      maxWidth = this.headerOpts.resize.maxWidth;
    if (minWidth !== -1 && w < minWidth) {
      w = minWidth;
    } else if (maxWidth !== -1 && w > maxWidth) {
      w = maxWidth;
    }
    if (cfg.isHeaderResize) {
      cfg.currentFields[idx].$width = w;
    } else {
      cfg.currentFields[idx].width = w;
    }

    this.gridMain.resizeDraw();
  }

  /**
   * set header height
   *
   * @param {number} header height
   */
  public setHeight(height: number) {
    this.headerElement.setHeight(height);
  }

  /**
   * set header panel width
   *
   * @public
   * @param {number} mainLeftWidth
   * @param {number} mainCenterWidth
   * @param {number} mainRightWidth
   */
  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    if (!this.enabled) return;
    this.leftElement.css({ width: mainLeftWidth + 'px' });
    this.centerElement.css({ 'margin-left': mainLeftWidth + 'px', width: mainCenterWidth + 'px' });
    this.rightElement.css({ width: mainRightWidth + 'px' });
  }

  public setCenterElementStyle(styleCss: any) {
    if (!this.enabled) return;
    this.centerElement.css(styleCss);
  }

  public setSearchIcon(searchDataFlag: boolean) {
    const searchIconElement = this.headerElement.find('.dg-search-icon');

    if (searchDataFlag) {
      addClass(searchIconElement, 'dg-on');
    } else {
      removeClass(searchIconElement, 'dg-on');
    }
  }

  public createTemplate() {
    this.headerElement.css({ height: `${this.gridMain.config().dimensions.mainHeaderHeight}px` });

    this.leftElement = this.headerElement.findDaraElement('.dg-header>.dg-region-left');
    this.centerElement = this.headerElement.findDaraElement('.dg-header>.dg-region-center');
    this.rightElement = this.headerElement.findDaraElement('.dg-header>.dg-region-right');

    this.leftElement.html(this.template('left'));
    this.centerElement.html(this.template('center'));
    this.rightElement.html(this.template('right'));

    this.headerCellElements = [];
    this.headerElement.finds('.dg-header-cell').forEach((node) => {
      const ele = node as HTMLElement;
      const cellIdx = intValue(ele.getAttribute('data-header-cell-position') || '0');
      this.headerCellElements[cellIdx] = node;
    });
  }

  /**
   *  set column line selection style
   * @param columnLine  selected column line set
   * @param isAll all select flag
   * @returns
   */
  public selectColumnAnchorCell() {
    if (!this.enabled) return;

    const dataInfo = this.gridMain.config().dataInfo;
    const headerObj = this.gridMain.getHeader();
    const headerCellElements = headerObj.getHeaderCellElements();

    const isAll = this.gridMain.selectionInfo.isAllSelect();
    const columnLine = this.gridMain.selectionInfo.getColumnLine();

    for (let col = dataInfo.startCol; col < dataInfo.colLength; col++) {
      const headerEle = headerCellElements[col];
      const classList = headerEle.classList;

      if (isAll || columnLine.has(col)) {
        if (!classList.contains(BodyCellStyleMap.SELECTION)) {
          classList.add(BodyCellStyleMap.SELECTION);
        }
      } else if (classList.contains(BodyCellStyleMap.SELECTION)) {
        classList.remove(BodyCellStyleMap.SELECTION);
      }
    }
  }

  clearAnchorCell() {
    removeClass(this.getHeaderCellElements(), BodyCellStyleMap.SELECTION);
  }

  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    let headerGroups, leafGroup;
    const currentFields = cfg.currentFields;

    if (type == 'left') {
      headerGroups = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == 'right') {
      headerGroups = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      headerGroups = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }

    if (!headerGroups?.length || !headerGroups[0]?.length) return '';

    const rowsHtml: string[] = [];
    const searchEnabled = opts.search.enabled;
    const helpEnabled = opts.header.help.enabled;
    const headerGroupLength = headerGroups.length;

    const resizeEnabled = this.headerOpts.resize.enabled;

    const sortEnabled = opts.header.sort.enabled;

    const searchIcon = searchEnabled ? html`<div class="dg-search-icon">${ALL_ICONS.search}</div>` : '';

    headerGroups.forEach((headerGroup, rowIndex) => {
      const trHeight = cfg.fieldHeaderGroup.heights[rowIndex];
      const rowHtml: string[] = [`<tr class="dg-header-row" style="height:${trHeight}px">`];

      headerGroup.forEach((headerItem, colIndex: number) => {
        if (headerItem.$isLeaf && headerItem.$depth < headerGroupLength) {
          headerItem.$rowspan = headerGroupLength - headerItem.$depth;
        }
        let classes = '';
        let cellIdx = '';
        if (headerItem.$isLeaf) {
          classes = 'dg-header-cell';
          cellIdx = ` data-header-cell-position="${headerItem.$resizeIdx}"`;
        } else {
          classes = 'dg-header-group-cell';
          cellIdx = ` data-header-group-position="${rowIndex},${colIndex}"`;
        }

        const colspan = headerItem.$colspan > 1 ? ` colspan="${headerItem.$colspan}" scope="colgroup"` : '';
        const rowspan = headerItem.$rowspan > 1 ? ` rowspan="${headerItem.$rowspan}"` : '';

        const sortIcons =
          headerItem.$isLeaf && !headerItem.$isAside && (sortEnabled || headerItem.sort === true)
            ? html`<div class="dg-sort-icon"><span class="dg-sort-num"></span>${ALL_ICONS.headerSort}</div>`
            : '';

        const isheaderHelp = headerItem.$enableHelp;
        const helpIcon =
          !headerItem.$isAside && (helpEnabled || isheaderHelp !== false)
            ? html`<div class="dg-header-help-button">${ALL_ICONS.help}</div>`
            : '';

        const label =
          headerItem.$isAside && headerItem.name == ROW_CHECK_NAME && cfg.isRowAllowMultiSelect
            ? html`<div class="dg-choice">
                <div class="dg-choice-item dg-checkbox dg-all">
                  ${headerItem.label ? '' : '<div class="dg-indicator"></div>'}
                  <span class="dg-label dg-ellipsis">${headerItem.label}</span>
                </div>
              </div>`
            : `<div class="centered">${headerItem.label ?? ''}</div>`;

        const searchHtml = headerItem.$isAside && headerItem.name == LINE_NUMBER_NAME ? searchIcon : '';

        const labelHtml = html` ${helpIcon}
          <div class="dg-label-wrapper">
            <div class="dg-header-label ${headerItem.sort ? 'sort-header' : ''}">
              <div class="dg-inner">${label}</div>
              ${sortIcons}
            </div>
          </div>`;

        const resizerHtml =
          !resizeEnabled || headerItem.$isAside
            ? ''
            : `<div class="dg-header-resizer" data-resize-idx="${headerItem.$resizeIdx}"></div>`;

        rowHtml.push(html` <th class="${classes}" ${colspan}${rowspan}${cellIdx}>
          ${searchHtml} ${labelHtml} ${resizerHtml}
        </th>`);
      });

      rowHtml.push('</tr>');
      rowsHtml.push(rowHtml.join(''));
    });

    const colGroupHtml = [];

    for (const leaf of leafGroup) {
      const colSeq = leaf.$colSeq;
      colGroupHtml.push(
        `<th data-col-idx="${colSeq}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${currentFields[colSeq].$width}px;"></th>`,
      );
    }

    return html` <table class="dg-header-table">
        <thead>
          <tr>
            ${colGroupHtml.join('')}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>
      ${type === 'center' ? '' : '<div class="dg-fixed-column-line"></div>'}`;
  }
}
