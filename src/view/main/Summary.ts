import { CellInfo, Config, SummaryConfig } from '@t/GridConfig';
import { SummaryItem, SummaryOptions } from '@t/GridOptions';

import { DaraElement } from '@/element/DaraElement';
import { formatValue } from '@/util/formatUtils';
import { calcSummary } from '@/util/mathUtils';
import { camelToKebab, isFunction } from '@/util/utils';
import { FieldItem } from '@t/GridField';
import { GridMain } from '../GridMain';
import { html } from '@/util/htmlTemplate';

/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export class Summary {
  private readonly gridMain: GridMain;

  private readonly config: Config;

  private readonly summaryOpts: SummaryOptions;

  private readonly _isActive: boolean;

  private summaryElement: DaraElement;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private summaryItems: SummaryItem[][];

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.config = gridMain.config();

    const opts = gridMain.options();

    const summaryItems = opts.summary?.items ?? [];

    this._isActive = summaryItems?.length > 0;

    if (!this._isActive) {
      return;
    }

    for (const items of summaryItems) this.summaryItems = summaryItems;
    this.summaryOpts = opts.summary ?? ({} as SummaryOptions);
  }

  public init() {
    this.summaryElement = this.gridMain.element().findDaraElement('.dg-summary');

    if (!this.isEnabled()) {
      this.summaryElement.getElement().remove();
      return;
    }
    this.createTemplate();
    this.drawData();
  }

  public isEnabled() {
    return this._isActive;
  }

  public getElement() {
    return this.summaryElement;
  }

  public isActive() {
    return this._isActive;
  }

  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    if (!this._isActive) return;
    this.leftElement.css({ width: mainLeftWidth + 'px' });
    this.centerElement.css({ 'margin-left': mainLeftWidth + 'px', width: mainCenterWidth + 'px' });
    this.rightElement.css({ width: mainRightWidth + 'px' });
  }

  public setCenterElementStyle(styleCss: any) {
    if (!this._isActive) return;

    this.centerElement.css(styleCss);
  }

  public drawData() {
    if (!this._isActive) return;

    const cfg = this.config;
    const items = cfg.dataManager.getViewItems();

    const summaryItems = this.summaryItems;

    const allFieldMap = cfg.allFieldMap;

    let rowIdx = 0;
    for (const groupItem of summaryItems) {
      for (const item of groupItem) {
        const fieldName = item.name;

        if (allFieldMap.has(fieldName)) {
          const field = allFieldMap.get(fieldName);

          const displayFormat = item.displayFormat ?? field?.displayFormat;

          const col = field?.$colSeq;
          const cellElement = this.summaryElement.find(`[data-cell-position="${rowIdx},${col}"]`)
            .firstChild as HTMLElement;

          const expression = item.expression;

          let summaryValue: any = '';

          if (items.length > 0) {
            if (expression) {
              if (isFunction(expression)) {
                summaryValue = expression(items);
              } else {
                summaryValue = calcSummary(items, expression, item.name);
              }
              if (displayFormat) {
                summaryValue = formatValue(summaryValue, displayFormat);
              }
            } else if (item.label) {
              summaryValue = item.label;
            }
          }

          cellElement.textContent = summaryValue;
          //field?.$renderer.render({ rowIndex: rowIdx, r: rowIdx, c: col, item: item } as CellInfo, cellElement);
        }
      }
      rowIdx++;
    }

    //console.log('summary draw data ', this._isActive);
  }

  private createTemplate() {
    const cfg = this.config;

    const summaryElement = this.summaryElement;

    summaryElement.css({ height: `${cfg.dimensions.mainSummaryHeight}px` });

    if (this.summaryOpts.position === 'top') {
      summaryElement.addClass('dg-top');
      const container = this.gridMain.element().find('.dg-main-container');
      container?.insertBefore(summaryElement.getElement(), container.querySelector('.dg-body'));
    }

    this.leftElement = summaryElement.findDaraElement('.dg-left');
    this.centerElement = summaryElement.findDaraElement('.dg-center');
    this.rightElement = summaryElement.findDaraElement('.dg-right');

    this.leftElement.html(this.template('left'));
    this.centerElement.html(this.template('center'));
    this.rightElement.html(this.template('right'));

    const { fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, summary } = cfg;

    const leftFields = fieldHeaderGroup.leafLeft;
    const centerFields = fieldHeaderGroup.leafCenter;
    const rightFields = fieldHeaderGroup.leafRight;

    const fieldGroups = [
      { name: 'left', fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: 'center', fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: 'right', fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    const summaryItems = this.summaryOpts.items;

    fieldGroups.forEach(({ fields, element, startCol }) => {
      if (fields.length === 0) return;

      element
        .findDaraElement('.dg-body-table > tbody')
        .append(this.rowTemplate(summary, summaryItems, fields, startCol));
    });
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.gridMain.config();

    let leafFields;
    let startGroupIdx = 0;
    if (type == 'left') {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == 'right') {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const viewRow = cfg.scroll.viewRow;
    const leafLength = leafFields.length;

    if (viewRow < 1 || leafLength < 1) return '';

    const colGroupHtm = [];
    let colGroupIdx = startGroupIdx;
    for (const leafNode of leafFields) {
      const nodeWidth = leafNode.$width;

      colGroupHtm.push(
        `<th data-col-idx="${colGroupIdx++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${nodeWidth}px;"></th>`,
      );
    }

    return html`<table class="dg-body-table">
        <thead>
          <tr>
            ${colGroupHtm.join('')}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      ${type == 'center' ? '' : '<div class="dg-fixed-column-line"></div>'}`;
  }

  /**
   * row template
   *
   * @private
   * @param {number} rowIdx row index
   * @param {number} rowHeight row height
   * @param {FieldItem[]} fields fields 정보
   * @returns {string} template
   */
  private rowTemplate(
    summaryConfig: SummaryConfig,
    items: SummaryItem[][],
    fields: FieldItem[],
    startCol: number,
  ): any {
    const returnTemplate = [];

    const rowCount = items.length;
    const rowHeights = summaryConfig.heights;

    for (let i = 0; i < rowCount; i++) {
      const rowIdx = i;

      const summaryItems = items[i];

      const cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];

        const summaryItem = summaryItems.find((item) => item.name === field.name) ?? { colspan: 0, rowspan: 0 };
        const spanAttr = [];
        if (summaryItem.colspan) {
          spanAttr.push(` colspan="${summaryItem.colspan}" `);
        }

        if (summaryItem.rowspan) {
          spanAttr.push(` rowspan="${summaryItem.rowspan}" `);
        }

        if (field.$isAside) {
          cellTemplate.push(html`<td
            scope="col"
            class="dg-cell dg-aside"
            ${spanAttr.join('')}
            data-cell-position="${rowIdx},${startCol + j}"
          >
            <div role="presentation" class="dg-cell-renderer ${field.$alignStyle}"></div>
          </td>`);
        } else {
          cellTemplate.push(html`<td
            scope="col"
            class="dg-cell"
            ${spanAttr.join(' ')}
            data-cell-position="${rowIdx},${startCol + j}"
          >
            <div
              role="presentation"
              class="dg-cell-renderer dg-cell-ellipsis 
              dg-text ${field.$alignStyle}"
            ></div>
          </td>`);
        }
      }

      returnTemplate.push(html`<tr class="dg-row" data-row="${rowIdx}" style="height:${rowHeights[i]}px">
        ${cellTemplate.join('')}
      </tr>`);
    }

    return returnTemplate.join('');
  }
}
