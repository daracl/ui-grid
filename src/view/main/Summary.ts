import { Config, SummaryConfig } from '@t/GridConfig';
import { SummaryOptions } from '@t/GridOptions';

import { ALIGN_STYLE } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { SummaryTextRenderer } from '@/renderer/summary/SummaryTextRenderer';
import { SummaryRenderer } from '@/renderer/SummaryRenderer';
import { html } from '@/util/htmlTemplate';
import { merge } from '@/util/utils';
import { FieldItem } from '@t/GridField';
import { GridMain } from '../GridMain';

/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export class Summary {
  private readonly gridMain: GridMain;

  private readonly cfg: Config;

  private readonly summaryOpts: SummaryOptions;

  private readonly _isActive: boolean;

  private summaryElement: DaraElement;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private allSummaryRenders: SummaryRenderer[][];

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.cfg = gridMain.config();

    const opts = gridMain.options();

    const summaryItems = opts.summary?.items ?? [];

    this._isActive = summaryItems?.length > 0;

    if (!this._isActive) {
      return;
    }

    this.summaryOpts = opts.summary ?? ({} as SummaryOptions);
  }

  public init() {
    this.summaryElement = this.gridMain.element().findDaraElement('.dg-summary');

    if (!this._isActive) {
      this.summaryElement.getElement().remove();
      return;
    }

    this.initRenderer();

    this.createTemplate();

    this.drawData();
  }

  private initRenderer() {
    const allSummaryRenders: SummaryRenderer[][] = [];

    const allFieldMap = this.cfg.allFieldMap;

    for (const items of this.summaryOpts.items) {
      const summaryRenders: SummaryRenderer[] = [];
      for (const item of items) {
        const fieldName = item.name;
        const fileInfo = allFieldMap.get(fieldName) ?? (merge({}, item) as FieldItem);

        item.$alignStyle = ALIGN_STYLE[item.align] ?? (fileInfo.$alignStyle || ALIGN_STYLE.left);

        summaryRenders.push(new SummaryTextRenderer(fileInfo, this.gridMain, item));
      }
      allSummaryRenders.push(summaryRenders);
    }

    this.allSummaryRenders = allSummaryRenders;
  }

  public isEnabled() {
    return this._isActive;
  }

  public getElement() {
    return this.summaryElement;
  }

  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    if (!this.isEnabled()) return;

    this.leftElement.css({ width: mainLeftWidth + 'px' });
    this.centerElement.css({ 'margin-left': mainLeftWidth + 'px', width: mainCenterWidth + 'px' });
    this.rightElement.css({ width: mainRightWidth + 'px' });
  }

  public setCenterElementStyle(styleCss: any) {
    if (!this.isEnabled()) return;

    this.centerElement.css(styleCss);
  }

  public drawData() {
    if (!this.isEnabled()) return;

    const summaryItems = this.allSummaryRenders;
    const summaryElement = this.summaryElement;

    let rowIdx = 0;
    for (const groupItem of summaryItems) {
      for (const renderer of groupItem) {
        const col = renderer.getCol();

        const cellElement = summaryElement.find(`[data-cell-position="${rowIdx},${col}"]`)
          ?.firstElementChild as HTMLElement;

        if (cellElement) {
          renderer.render(cellElement);
        }
      }
      rowIdx++;
    }
  }

  private createTemplate() {
    const cfg = this.cfg;

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

    fieldGroups.forEach(({ fields, element, startCol }) => {
      if (fields.length === 0) return;

      element.findDaraElement('.dg-body-table > tbody').append(this.rowTemplate(summary, fields, startCol));
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
  private rowTemplate(summaryConfig: SummaryConfig, fields: FieldItem[], startCol: number): string {
    const returnTemplate = [];

    const rowHeights = summaryConfig.heights;

    const allSummaryRenders = this.allSummaryRenders;
    const rowCount = allSummaryRenders.length;

    const rowspan: Record<number, number> = {};
    for (let i = 0; i < rowCount; i++) {
      const rowIdx = i;

      const rendererItems = allSummaryRenders[i];

      const cellTemplate = [];
      let colspan = 0;
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];

        const rendererItem = rendererItems.find((renderer) => renderer.getFieldInfo().name === field.name);

        if (rendererItem) {
          field = rendererItem.getSummaryItem();
        }

        if (colspan > 0) {
          --colspan;
          continue;
        }

        if (rowspan[j] > 0) {
          rowspan[j] = rowspan[j] - 1;
          continue;
        }

        const spanAttr = [];
        if (field.colspan) {
          colspan = field.colspan - 1;
          spanAttr.push(` colspan="${field.colspan}" scope="colgroup" `);
        }

        if (field.rowspan) {
          rowspan[j] = field.rowspan - 1;
          spanAttr.push(` rowspan="${field.rowspan}" `);
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
