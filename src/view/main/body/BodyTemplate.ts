import { FieldItem } from '@t/GridField';

import { html } from '@/util/htmlTemplate';
import { getRendererVariantClass, getWhiteSpaceInfo } from '@/util/styleUtils';
import { camelToKebab } from '@/util/utils';

import { HorizontalRegion } from '@/constants';
import { BodyContext } from './BodyContext';
import { BodyFieldTemplateInfo } from '@/types/Body';

/**
 * Body의 table / row DOM template 생성
 */
export class BodyTemplate {
  /**
   * Body Context
   *
   * @param context Body Context
   */
  constructor(private readonly context: BodyContext) {}

  /**
   * Body 영역별 table template 생성
   */
  public create(): void {
    this.context.leftElement.html(this.createTemplate('left'));
    this.context.centerElement.html(this.createTemplate('center'));
    this.context.rightElement.html(this.createTemplate('right'));
  }

  /**
   * HTML table template 생성
   *
   * @param type Horizontal 영역
   */
  public createTemplate(type: HorizontalRegion): string {
    const cfg = this.context.gridMain.config();

    let startGroupIdx = 0;
    let leafFields: FieldItem[];

    if (type === 'left') {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type === 'right') {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const colGroupHtml = new Array<string>(leafFields.length);

    for (let i = 0; i < leafFields.length; i++) {
      const field = leafFields[i];

      colGroupHtml[i] = `<th data-col-idx="${startGroupIdx + i}" 
        style="border:0;margin:0 !important; padding:0 !important;font-size:0 !important;
        line-height:0 !important;height:0;width:${field.$width}px;"></th>`;
    }

    return html`<table class="dg-body-table">
        <thead>
          <tr>
            ${colGroupHtml.join('')}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      ${type === 'center' ? '' : '<div class="dg-fixed-column-line"></div>'}`;
  }

  /**
   * 가상화된 Row DOM 생성
   *
   * @param viewRow 시작 View Row
   * @param rowTemplateCount Row Template 개수
   * @param rowHeight Row 높이
   * @param fields Field 목록
   * @param startCol 시작 Column Index
   */
  public rowTemplate(
    viewRow: number,
    rowTemplateCount: number,
    rowHeight: number,
    fields: FieldItem[],
    startCol: number,
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();

    if (rowTemplateCount <= 0 || fields.length === 0) {
      return fragment;
    }

    const templates = this.createFieldTemplates(fields, startCol);

    const rowHeightCss = `${rowHeight}px`;

    for (let i = 0; i < rowTemplateCount; i++) {
      const rowIdx = viewRow + i;

      const tr = document.createElement('tr');

      tr.className = 'dg-row';
      tr.dataset.row = String(rowIdx);
      tr.style.height = rowHeightCss;

      for (const template of templates) {
        const td = document.createElement('td');

        td.className = template.cellClassName;
        td.dataset.cellPosition = `${rowIdx},${template.col}`;

        const div = document.createElement('div');

        div.className = template.rendererClassName;

        if (template.rendererStyle) {
          div.style.cssText = template.rendererStyle;
        }

        td.appendChild(div);
        tr.appendChild(td);
      }

      fragment.appendChild(tr);
    }

    return fragment;
  }

  /**
   * Field별 정적 Template 정보 생성
   *
   * @param fields Field 목록
   * @param startCol 시작 Column Index
   */
  private createFieldTemplates(fields: FieldItem[], startCol: number): BodyFieldTemplateInfo[] {
    const templates = new Array<BodyFieldTemplateInfo>(fields.length);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const col = startCol + i;

      if (field.$isAside) {
        templates[i] = {
          col,
          cellClassName: `dg-cell dg-aside dg-${camelToKebab(field.name).replace('$', '')}`,
          rendererClassName: `dg-cell-renderer ${field.$alignStyle || ''}`.trim(),
          rendererStyle: '',
        };

        continue;
      }

      const { style: whiteSpaceStyle, className: whiteSpaceClass } = getWhiteSpaceInfo(field);

      const renderer = field.$renderer;

      const variantClass = renderer.supportsInteraction()
        ? getRendererVariantClass(field.editRenderer)
        : getRendererVariantClass(field.renderer);

      templates[i] = {
        col,
        cellClassName: 'dg-cell',
        rendererClassName: [
          'dg-cell-renderer',
          'dg-ellipsis',
          `dg-${field.renderer.type}`,
          field.$alignStyle,
          whiteSpaceClass,
          variantClass,
        ]
          .filter(Boolean)
          .join(' '),
        rendererStyle: whiteSpaceStyle || '',
      };
    }

    return templates;
  }
}
