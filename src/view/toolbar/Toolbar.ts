import { Config } from '@t/GridConfig';

import { TOOLBAR_RENDERER } from '@/constantRenders';
import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_TOOLBAR_FIELD_INFO } from '@/defaultGridOption';
import { ToolbarOptions } from '@/types/GridOptions';
import { ToolbarFieldItem, ToolbarLayout } from '@/types/Toolbar';
import { isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { normalizeCssLength } from '@/util/styleUtils';
import { isArray, isEmpty, isUndefined, merge, isNumber } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { createHTMLElement } from '@/util/domUtils';

/**
 * Toolbar class
 *
 * @class Toolbar
 */
export class Toolbar {
  private readonly gridMain: GridMain;
  private readonly config: Config;
  private readonly toolbarOpts: ToolbarOptions;
  private readonly toolbarFields: ToolbarFieldItem[] = [];
  private readonly conditionFields: ToolbarFieldItem[] = [];

  private readonly fieldElements = new Map<string, HTMLElement>();

  private toolbarElement!: HTMLElement;
  private toolbarLayouts: ToolbarLayout[][] = [];

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.config = gridMain.config();
    this.toolbarOpts = gridMain.options().toolbar;
  }

  public init(): void {
    const toolbarDaraElement = this.gridMain.element().findDaraElement('.dg-toolbar');

    if (!this.toolbarOpts?.enabled) {
      toolbarDaraElement.getElement().remove();
      return;
    }

    toolbarDaraElement.css({
      display: 'block',
      height: `${this.config.dimensions.toolbarHeight}px`,
    });

    this.toolbarElement = toolbarDaraElement.getElement();

    this.initRenderer();
    this.createTemplate();
    this.initEvent();
    this.initArrowEvents(); // 스크롤 화살표 이벤트 초기화
    this.refreshConditionFields();
  }

  public getToolbarElement(): HTMLElement {
    return this.toolbarElement;
  }

  private initEvent(): void {
    const scrollbarElement = this.toolbarElement.querySelector('.dg-toolbar-scroll') as HTMLElement | null;
    if (!scrollbarElement) return;

    const { eventManager } = this.config;

    eventManager.off(scrollbarElement, 'wheel DOMMouseScroll');
    eventManager.on(
      { el: scrollbarElement, type: 'wheel DOMMouseScroll' },
      (evt: WheelEvent) => {
        if (scrollbarElement.scrollWidth <= scrollbarElement.clientWidth) return;

        const delta = evt.deltaY;
        if (isEmpty(delta) || isShiftKey(evt)) return;

        stopPreventCancel(evt);
        scrollbarElement.scrollLeft += delta;
      },
      { passive: false },
    );
  }

  // [추가] 화살표 버튼 이벤트 바인딩
  private initArrowEvents(): void {
    const { eventManager } = this.config;
    const arrowContainer = this.toolbarElement.querySelector('.dg-toolbar-arrow') as HTMLElement | null;

    if (!arrowContainer) return;

    const leftBtn = arrowContainer.querySelector('[data-direction="left"]') as HTMLButtonElement | null;
    const rightBtn = arrowContainer.querySelector('[data-direction="right"]') as HTMLButtonElement | null;

    if (leftBtn) {
      eventManager.on({ el: leftBtn, type: 'click' }, () => this.scrollByDirection('left'));
    }

    if (rightBtn) {
      eventManager.on({ el: rightBtn, type: 'click' }, () => this.scrollByDirection('right'));
    }
  }

  // [추가] 화살표 클릭 시 스크롤 이동 로직
  private scrollByDirection(direction: 'left' | 'right'): void {
    const scrollElement = this.toolbarElement.querySelector('.dg-toolbar-scroll') as HTMLElement | null;
    if (!scrollElement) return;

    // 한 번에 이동할 픽셀량 (필요에 따라 조절 가능)
    const moveOffset = 250;
    const scrollAmount = direction === 'left' ? -moveOffset : moveOffset;

    scrollElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // [추가] 스크롤 여부를 확인하여 화살표 표시/숨김 처리
  public resizeArrowVisibility(): void {
    const scrollElement = this.toolbarElement.querySelector('.dg-toolbar-scroll') as HTMLElement | null;
    const arrowContainer = this.toolbarElement.querySelector('.dg-toolbar-arrow') as HTMLElement | null;

    if (!scrollElement || !arrowContainer) return;

    // 스크롤이 필요한 상태인지 확인
    const hasScroll = scrollElement.scrollWidth > scrollElement.clientWidth;

    if (hasScroll) {
      this.toolbarElement.classList.add('dg-has-scroll');
    } else {
      this.toolbarElement.classList.remove('dg-has-scroll');
      scrollElement.scrollLeft = 0; // 스크롤이 없어지면 0으로 원복
    }
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
    const toolbarField: ToolbarFieldItem = merge({}, DEFAULT_TOOLBAR_FIELD_INFO, field);
    toolbarField.$uid = `${mainUid}_${rowIndex}_${itemIndex}_${fieldIndex}`;

    toolbarField.renderer =
      typeof toolbarField.renderer === 'string'
        ? { ...DEFAULT_EDIT_RENDERER_INFO, type: toolbarField.renderer }
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

    const appFragment = document.createDocumentFragment();
    this.toolbarLayouts.forEach((row) => appFragment.appendChild(this.createRow(row, measureContainer)));

    scrollContainer.appendChild(appFragment);
    measureContainer.remove();
  }

  public setValues(values: Record<string, unknown>): void {
    for (const field of this.toolbarFields) {
      const fieldName = field.name;

      if (fieldName && field.$renderer.supportsEdit()) {
        const fieldValue = values[fieldName];
        if (!isUndefined(fieldValue)) {
          field.$renderer.setValue(fieldValue);
        }
      }
    }
  }

  public getValues(): Record<string, unknown> {
    const item: Record<string, unknown> = {};
    for (const field of this.toolbarFields) {
      if (field.name && field.$renderer.supportsEdit()) {
        item[field.name] = field.$renderer.getValue();
      }
    }
    return item;
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
      .map((pos) => ({ position: pos, list: items.filter((x) => x.position === pos) }))
      .filter((group) => group.list.length > 0);

    validGroups.forEach((group, index) => {
      const groupItem = group.list[0];

      if (groupItem?.width) {
        const widthVal = normalizeCssLength(groupItem.width);
        const targetColIndex = layoutColumns.length + 2;

        layoutColumns.push('auto', widthVal, 'auto');
        group.list.forEach((item) => this.createSection(item, targetColIndex, fragment, measureContainer));
      } else {
        const targetColIndex = layoutColumns.length + 1;
        let sectionWidth = 0;

        group.list.forEach((item) => {
          sectionWidth = this.createSection(item, targetColIndex, fragment, measureContainer);
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
    const sectionElement = document.createElement('div');
    sectionElement.className = `dg-toolbar-section dg-grid-area-${item.position}`;
    sectionElement.style.gridArea = `1 / ${layoutColIndex} / span 1 / span 1`;

    this.setWidth(sectionElement, item.width ?? '');

    const fragment = document.createDocumentFragment();
    const fieldsToMeasure: { field: ToolbarFieldItem; el: HTMLElement }[] = [];

    item.children.forEach((field) => {
      if (!field) return;

      if (field.renderer.type === 'hidden') {
        field.$renderer.render(createHTMLElement('div'));
        return;
      }

      const el = this.createField(field, 0);
      fragment.appendChild(el);
      fieldsToMeasure.push({ field, el });
    });

    if (fieldsToMeasure.length > 0) {
      const measureFragment = document.createDocumentFragment();
      const clones: { field: ToolbarFieldItem; clone: HTMLElement }[] = [];

      fieldsToMeasure.forEach(({ field, el }) => {
        const clone = el.cloneNode(true) as HTMLElement;
        measureFragment.appendChild(clone);
        clones.push({ field, clone });
      });

      measureContainer.appendChild(measureFragment);

      clones.forEach(({ field, clone }) => {
        field.$width = clone.getBoundingClientRect().width;
      });

      measureContainer.innerHTML = '';
    }

    sectionElement.appendChild(fragment);
    const totalWidth = this.buildSectionLayout(sectionElement, item);
    parentFragment.appendChild(sectionElement);

    return totalWidth;
  }

  private buildSectionLayout(sectionElement: HTMLElement, item: ToolbarLayout): number {
    const columns = ['0px'];
    let currentColumnIndex = 2;
    let totalWidth = 0;

    item.children.forEach((field, index) => {
      if (!field || field.renderer.type === 'hidden') return;

      const fieldElement = this.fieldElements.get(field.$uid);
      if (!fieldElement || fieldElement.classList.contains('dg-hide')) return;

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
          if (nextField.renderer.type === 'hidden') return false;
          const nextElement = this.fieldElements.get(nextField.$uid);
          return nextElement && !nextElement.classList.contains('dg-hide');
        });

        if (hasNextVisibleField) afterGap = 4;
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
    const el = document.createElement('div');
    const { type: rendererType, required: isRequired } = field.renderer;
    const hasLabel = isRequired === true || (rendererType !== 'button' && !!field.label);

    el.className = `dg-toolbar-field dg-type-${rendererType} ${hasLabel ? 'dg-group' : ''}`;
    el.style.gridArea = `1 / ${colIndex} / span 1 / span 1`;
    el.dataset.uid = field.$uid;

    el.innerHTML = hasLabel
      ? `
          <span class="dg-label ${isRequired ? 'dg-required' : ''}">${field.label}</span>
          <div class="dg-control"></div>
        `
      : '<div class="dg-control"></div>';

    field.$renderer.render(el);
    this.setWidth(el, field.width ?? 'auto');

    this.fieldElements.set(field.$uid, el);
    field.$renderer.afterRender();

    return el;
  }

  private setWidth(el: HTMLElement, width: number | string): void {
    if (!width) return;
    const value = normalizeCssLength(width);

    el.style.width = value;
    if (width !== 'auto') {
      el.style.minWidth = value;
      el.style.maxWidth = value;
    } else {
      el.style.minWidth = 'initial';
      el.style.maxWidth = 'initial';
    }
  }

  public refreshConditionFields(): void {
    this.conditionFields.forEach((field) => {
      field.$renderer.refreshCondition();
    });

    requestAnimationFrame(() => {
      this.refreshToolbarLayout();
    });
  }

  private refreshToolbarLayout(): void {
    const rows = Array.from(this.toolbarElement.querySelectorAll<HTMLElement>('.dg-toolbar-row'));

    this.toolbarLayouts.forEach((rowLayout, rowIndex) => {
      const rowEl = rows[rowIndex];
      if (!rowEl) return;

      const sections = rowEl.querySelectorAll<HTMLElement>('.dg-toolbar-section');
      rowLayout.forEach((item, index) => {
        const section = sections[index];
        if (section) this.buildSectionLayout(section, item);
      });
    });

    const rowsScrollWidths = rows.map((rowEl) => {
      const sections = Array.from(rowEl.querySelectorAll<HTMLElement>('.dg-toolbar-section'));
      return sections.map((section) => section.scrollWidth);
    });

    rows.forEach((rowEl, rowIndex) => {
      const widths = rowsScrollWidths[rowIndex];
      const columns = ['0px'];

      widths.forEach((width, index) => {
        columns.push(`minmax(${width}px, 1fr)`);
        if (index < widths.length - 1) {
          columns.push('2px', '2px');
        }
      });

      columns.push('0px');
      rowEl.style.gridTemplateColumns = columns.join(' ');
    });

    // [추가] 레이아웃이 갱신된 후 스크롤 화살표 표시 여부 다시 체크
    this.resizeArrowVisibility();
  }
}
