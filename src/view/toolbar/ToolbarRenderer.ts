import { TOOLBAR_RENDERER } from '@/constantRenders';
import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_TOOLBAR_FIELD_INFO } from '@/defaultGridOption';

import { ToolbarOptions } from '@/types/GridOptions';
import { ToolbarFieldItem, ToolbarLayout } from '@/types/Toolbar';

import { normalizeCssLength } from '@/util/styleUtils';
import { isArray, isNumber, merge, replaceXss } from '@/util/utils';
import { createHTMLElement } from '@/util/domUtils';

import { GridMain } from '@/view/GridMain';

export class ToolbarRenderer {
  private readonly gridMain: GridMain;
  private readonly toolbarElement: HTMLElement;
  private readonly toolbarOpts: ToolbarOptions;

  private readonly toolbarFields: ToolbarFieldItem[] = [];
  private readonly conditionFields: ToolbarFieldItem[] = [];

  private readonly fieldElements = new Map<string, HTMLElement>();

  private toolbarLayouts: ToolbarLayout[][] = [];

  constructor(gridMain: GridMain, toolbarElement: HTMLElement, toolbarOpts: ToolbarOptions) {
    this.gridMain = gridMain;
    this.toolbarElement = toolbarElement;
    this.toolbarOpts = toolbarOpts;
  }

  public init(): void {
    this.initRenderer();
    this.createTemplate();
  }

  public getLayouts(): ToolbarLayout[][] {
    return this.toolbarLayouts;
  }

  public getFields(): ToolbarFieldItem[] {
    return this.toolbarFields;
  }

  public getConditionFields(): ToolbarFieldItem[] {
    return this.conditionFields;
  }

  public setValues(values: Record<string, unknown>): void {
    for (const field of this.toolbarFields) {
      if (!field.name || !field.$renderer.supportsEdit()) continue;

      const value = values[field.name];

      if (value !== undefined) {
        field.$renderer.setValue(value);
      }
    }
  }

  public getValues(): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    for (const field of this.toolbarFields) {
      if (!field.name || !field.$renderer.supportsEdit()) continue;

      values[field.name] = field.$renderer.getValue();
    }

    return values;
  }

  public refreshConditionFields(): void {
    this.conditionFields.forEach((field) => {
      field.$renderer.refreshCondition();
    });
  }

  public refreshLayout(): void {
    const rows = Array.from(this.toolbarElement.querySelectorAll<HTMLElement>('.dg-toolbar-row'));

    this.toolbarLayouts.forEach((rowLayout, rowIndex) => {
      const rowElement = rows[rowIndex];

      if (!rowElement) return;

      const sections = rowElement.querySelectorAll<HTMLElement>('.dg-toolbar-section');

      rowLayout.forEach((item, index) => {
        const section = sections[index];

        if (section) {
          this.buildSectionLayout(section, item);
        }
      });
    });
  }

  private initRenderer(): void {
    const items = this.toolbarOpts.items || [];
    const defaultValues = this.toolbarOpts.defaultValues ?? {};
    const mainUid = this.gridMain.uid();

    this.toolbarLayouts = items.map((row, rowIndex) =>
      row.map((item, itemIndex) => ({
        ...item,
        children: item.children.map((field, fieldIndex) =>
          this.createToolbarField(field, mainUid, rowIndex, itemIndex, fieldIndex, defaultValues),
        ),
      })),
    );
  }

  private createToolbarField(
    field: ToolbarFieldItem,
    mainUid: string,
    rowIndex: number,
    itemIndex: number,
    fieldIndex: number,
    defaultValues: Record<string, unknown>,
  ): ToolbarFieldItem {
    const toolbarField = merge({}, DEFAULT_TOOLBAR_FIELD_INFO, field) as ToolbarFieldItem;

    toolbarField.$uid = `${mainUid}_${rowIndex}_${itemIndex}_${fieldIndex}`;

    toolbarField.renderer =
      typeof toolbarField.renderer === 'string'
        ? {
            ...DEFAULT_EDIT_RENDERER_INFO,
            type: toolbarField.renderer,
          }
        : merge({}, DEFAULT_EDIT_RENDERER_INFO, toolbarField.renderer);

    if (defaultValues[toolbarField.name] !== undefined && !toolbarField.defaultValue) {
      toolbarField.defaultValue = defaultValues[toolbarField.name];
    }

    const Renderer = TOOLBAR_RENDERER[toolbarField.renderer.type] ?? TOOLBAR_RENDERER.text;

    toolbarField.$renderer = new Renderer(toolbarField, this.gridMain);

    this.toolbarFields.push(toolbarField);

    if (toolbarField.condition) {
      this.conditionFields.push(toolbarField);
    }

    return toolbarField;
  }

  private createTemplate(): void {
    const scrollContainer = this.toolbarElement.querySelector('.dg-toolbar-scroll');

    if (!scrollContainer) return;

    const fragment = document.createDocumentFragment();

    this.toolbarLayouts.forEach((row) => {
      fragment.appendChild(this.createRow(row));
    });

    scrollContainer.appendChild(fragment);
  }

  /**
   * 행 생성. 위치(left, center, right)별 zone을 flex로 배치하며 폭 계산은 CSS가 처리한다.
   */
  private createRow(items: ToolbarLayout[]): HTMLElement {
    const row = document.createElement('div');

    if (items.length === 0) return row;

    row.className = 'dg-toolbar-row';
    row.style.height = `${items[0].height}px`;

    const fragment = document.createDocumentFragment();

    const positions = ['left', 'center', 'right'] as const;

    positions.forEach((position) => {
      const list = items.filter((item) => item.position === position);

      if (list.length === 0) return;

      const zone = document.createElement('div');

      zone.className = `dg-toolbar-zone dg-zone-${position}`;

      // 영역 폭을 지정한 경우 고정 폭 zone으로 처리한다.
      if (list[0]?.width) {
        const width = normalizeCssLength(list[0].width);

        zone.classList.add('dg-zone-fixed');
        zone.style.width = width;
        zone.style.minWidth = width;
        zone.style.maxWidth = width;
      }

      list.forEach((item) => {
        zone.appendChild(this.createSection(item));
      });

      fragment.appendChild(zone);
    });

    row.appendChild(fragment);

    return row;
  }

  private createSection(item: ToolbarLayout): HTMLElement {
    const section = document.createElement('div');

    section.className = `dg-toolbar-section dg-grid-area-${item.position}`;

    this.setWidth(section, item.width ?? '');

    const fragment = document.createDocumentFragment();

    item.children.forEach((field) => {
      if (!field) return;

      if (field.renderer.type === 'hidden') {
        field.$renderer.render(createHTMLElement('div'));
        return;
      }

      fragment.appendChild(this.createField(field));
    });

    section.appendChild(fragment);

    this.buildSectionLayout(section, item);

    return section;
  }

  /**
   * 필드 사이 간격(gap)을 margin으로 반영한다. 숨김 필드는 간격 계산에서 제외한다.
   */
  private buildSectionLayout(sectionElement: HTMLElement, item: ToolbarLayout): void {
    item.children.forEach((field, index) => {
      if (!field || field.renderer.type === 'hidden') {
        return;
      }

      const fieldElement = this.fieldElements.get(field.$uid);

      if (!fieldElement || fieldElement.classList.contains('dg-hide')) {
        return;
      }

      let beforeGap = 0;
      let afterGap = 0;

      if (isArray(field.gap)) {
        if (field.gap.length === 1) {
          afterGap = field.gap[0] ?? 0;
        } else {
          beforeGap = field.gap[0] ?? 0;
          afterGap = field.gap[1] ?? 0;
        }
      } else if (isNumber(field.gap)) {
        afterGap = field.gap;
      } else {
        const hasNextVisibleField = item.children.slice(index + 1).some((nextField) => {
          if (nextField.renderer.type === 'hidden') {
            return false;
          }

          const element = this.fieldElements.get(nextField.$uid);

          return element && !element.classList.contains('dg-hide');
        });

        if (hasNextVisibleField) {
          afterGap = 4;
        }
      }

      fieldElement.style.marginLeft = beforeGap > 0 ? `${beforeGap}px` : '';
      fieldElement.style.marginRight = afterGap > 0 ? `${afterGap}px` : '';
    });
  }

  private createField(field: ToolbarFieldItem): HTMLElement {
    const element = document.createElement('div');

    const { type: rendererType, required: isRequired } = field.renderer;

    const hasLabel = isRequired === true || (rendererType !== 'label' && rendererType !== 'button' && !!field.label);

    element.className = `dg-toolbar-field dg-type-${rendererType} ${hasLabel ? 'dg-group' : ''}`;

    element.dataset.uid = field.$uid;

    element.innerHTML = hasLabel
      ? `
          <span class="dg-label ${isRequired ? 'dg-required' : ''}">${replaceXss(String(field.label))}</span>
          <div class="dg-control"></div>
        `
      : '<div class="dg-control"></div>';

    field.$renderer.render(element);
    this.setWidth(element, field.width ?? 'auto');

    this.fieldElements.set(field.$uid, element);

    field.$renderer.afterRender();

    return element;
  }

  private setWidth(element: HTMLElement, width: number | string): void {
    if (!width) return;

    const value = normalizeCssLength(width);

    element.style.width = value;

    if (width !== 'auto') {
      element.style.minWidth = value;
      element.style.maxWidth = value;
    } else {
      element.style.minWidth = 'initial';
      element.style.maxWidth = 'initial';
    }
  }
}
