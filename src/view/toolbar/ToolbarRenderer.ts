import { TOOLBAR_RENDERER } from '@/constantRenders';
import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_TOOLBAR_FIELD_INFO } from '@/defaultGridOption';

import { ToolbarOptions } from '@/types/GridOptions';
import { ToolbarFieldItem, ToolbarLayout } from '@/types/Toolbar';

import { normalizeCssLength } from '@/util/styleUtils';
import { isArray, isNumber, merge } from '@/util/utils';
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

    this.refreshRowWidths(rows);
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

    const measureContainer = document.createElement('div');

    measureContainer.style.cssText = 'position: absolute; visibility: hidden; display: flex;';

    this.toolbarElement.appendChild(measureContainer);

    const fragment = document.createDocumentFragment();

    this.toolbarLayouts.forEach((row) => {
      fragment.appendChild(this.createRow(row, measureContainer));
    });

    scrollContainer.appendChild(fragment);
    measureContainer.remove();
  }

  private createRow(items: ToolbarLayout[], measureContainer: HTMLElement): HTMLElement {
    const row = document.createElement('div');

    if (items.length === 0) return row;

    row.className = 'dg-toolbar-row';
    row.style.height = `${items[0].height}px`;

    const fragment = document.createDocumentFragment();
    const layoutColumns = ['0px'];

    const positions = ['left', 'center', 'right'] as const;

    const validGroups = positions
      .map((position) => ({
        position,
        list: items.filter((item) => item.position === position),
      }))
      .filter((group) => group.list.length > 0);

    validGroups.forEach((group, index) => {
      const groupItem = group.list[0];

      if (groupItem?.width) {
        const width = normalizeCssLength(groupItem.width);
        const targetColumnIndex = layoutColumns.length + 2;

        layoutColumns.push('auto', width, 'auto');

        group.list.forEach((item) => {
          this.createSection(item, targetColumnIndex, fragment, measureContainer);
        });
      } else {
        const targetColumnIndex = layoutColumns.length + 1;
        let sectionWidth = 0;

        group.list.forEach((item) => {
          sectionWidth = this.createSection(item, targetColumnIndex, fragment, measureContainer);
        });

        layoutColumns.push(`minmax(${sectionWidth}px, 1fr)`);
      }

      if (index < validGroups.length - 1) {
        layoutColumns.push('2px', '2px');
      }
    });

    layoutColumns.push('0px');

    row.style.gridTemplateColumns = layoutColumns.join(' ');

    row.appendChild(fragment);

    return row;
  }

  private createSection(
    item: ToolbarLayout,
    layoutColIndex: number,
    parentFragment: DocumentFragment,
    measureContainer: HTMLElement,
  ): number {
    const section = document.createElement('div');

    section.className = `dg-toolbar-section dg-grid-area-${item.position}`;

    section.style.gridArea = `1 / ${layoutColIndex} / span 1 / span 1`;

    this.setWidth(section, item.width ?? '');

    const fragment = document.createDocumentFragment();

    const fieldsToMeasure: {
      field: ToolbarFieldItem;
      el: HTMLElement;
    }[] = [];

    item.children.forEach((field) => {
      if (!field) return;

      if (field.renderer.type === 'hidden') {
        field.$renderer.render(createHTMLElement('div'));
        return;
      }

      const element = this.createField(field, 0);

      fragment.appendChild(element);

      fieldsToMeasure.push({
        field,
        el: element,
      });
    });

    if (fieldsToMeasure.length > 0) {
      const measureFragment = document.createDocumentFragment();

      const clones: {
        field: ToolbarFieldItem;
        clone: HTMLElement;
      }[] = [];

      fieldsToMeasure.forEach(({ field, el }) => {
        const clone = el.cloneNode(true) as HTMLElement;

        measureFragment.appendChild(clone);

        clones.push({
          field,
          clone,
        });
      });

      measureContainer.appendChild(measureFragment);

      clones.forEach(({ field, clone }) => {
        field.$width = clone.getBoundingClientRect().width;
      });

      measureContainer.innerHTML = '';
    }

    section.appendChild(fragment);

    const totalWidth = this.buildSectionLayout(section, item);

    parentFragment.appendChild(section);

    return totalWidth;
  }

  private buildSectionLayout(sectionElement: HTMLElement, item: ToolbarLayout): number {
    const columns = ['0px'];
    let currentColumnIndex = 2;
    let totalWidth = 0;

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

      if (beforeGap > 0) {
        columns.push(`${beforeGap}px`);
        currentColumnIndex++;
        totalWidth += beforeGap;
      }

      const trackWidth = field.width
        ? normalizeCssLength(field.width)
        : field.renderer.type === 'button'
        ? 'max-content'
        : '1fr';

      columns.push(trackWidth);

      fieldElement.style.gridArea = `1 / ${currentColumnIndex} / span 1 / span 1`;

      currentColumnIndex++;
      totalWidth += field.$width ?? 0;

      if (afterGap > 0) {
        columns.push(`${afterGap}px`);
        currentColumnIndex++;
        totalWidth += afterGap;
      }
    });

    columns.push('0px');

    sectionElement.style.gridTemplateColumns = columns.join(' ');

    return totalWidth;
  }

  private createField(field: ToolbarFieldItem, colIndex: number): HTMLElement {
    const element = document.createElement('div');

    const { type: rendererType, required: isRequired } = field.renderer;

    const hasLabel = isRequired === true || (rendererType !== 'label' && rendererType !== 'button' && !!field.label);

    element.className = `dg-toolbar-field dg-type-${rendererType} ${hasLabel ? 'dg-group' : ''}`;

    element.style.gridArea = `1 / ${colIndex} / span 1 / span 1`;

    element.dataset.uid = field.$uid;

    element.innerHTML = hasLabel
      ? `
          <span class="dg-label ${isRequired ? 'dg-required' : ''}">${field.label}</span>
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

  private refreshRowWidths(rows: HTMLElement[]): void {
    const rowsScrollWidths = rows.map((row) => {
      const sections = Array.from(row.querySelectorAll<HTMLElement>('.dg-toolbar-section'));

      return sections.map((section) => section.scrollWidth);
    });

    rows.forEach((row, rowIndex) => {
      const widths = rowsScrollWidths[rowIndex];

      const columns = ['0px'];

      widths.forEach((width, index) => {
        columns.push(`minmax(${width}px, 1fr)`);

        if (index < widths.length - 1) {
          columns.push('2px', '2px');
        }
      });

      columns.push('0px');

      row.style.gridTemplateColumns = columns.join(' ');
    });
  }
}
