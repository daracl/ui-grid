import { Config } from '@t/GridConfig';

import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_TOOLBAR_FIELD_INFO } from '@/defaultGridOption';
import { ToolbarOptions } from '@/types/GridOptions';
import { ToolbarFieldItem, ToolbarLayout } from '@/types/Toolbar';
import { isArray, merge } from '@/util/utils';
import { TOOLBAR_RENDERER } from '../../constants';
import { isNumber } from '../../util/utils';
import { GridMain } from '../GridMain';

/**
 * Toolbar class
 *
 * @class Toolbar
 * @typedef {Toolbar}
 */
export class Toolbar {
  private readonly gridMain: GridMain;

  private readonly config: Config;

  private readonly toolbarOpts: ToolbarOptions;

  private toolbarElement: HTMLElement;

  private hiddenCheckElement: HTMLElement;

  private toolbarLayouts: ToolbarLayout[][];

  private readonly toolbarFields: ToolbarFieldItem[] = [];

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.config = gridMain.config();

    this.toolbarOpts = gridMain.options().toolbar;
  }

  public init() {
    if (!this.toolbarOpts.enabled) {
      return;
    }

    // toolbar
    const toolbarElement = this.gridMain.element().findDaraElement('.dg-toolbar');

    if (this.toolbarOpts.enabled) {
      toolbarElement.css({ display: 'block', height: `${this.config.dimensions.toolbarHeight}px` });
    } else {
      toolbarElement.getElement().remove();
    }

    this.toolbarElement = toolbarElement.getElement();

    this.initRenderer();

    this.createTemplate();
  }

  initRenderer() {
    const items = this.toolbarOpts.items;

    const mainUid = this.gridMain.uid();
    this.toolbarLayouts = items.map((row, rowIndex) =>
      row.map((item, itemIndex) => ({
        ...item,
        children: item.children.map((field, fieldIndex) =>
          this.createToolbarField(field, mainUid, rowIndex, itemIndex, fieldIndex),
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
  ): ToolbarFieldItem {
    const toolbarField: ToolbarFieldItem = merge({}, DEFAULT_TOOLBAR_FIELD_INFO, field);

    toolbarField.$uid = `${mainUid}_${rowIndex}_${itemIndex}_${fieldIndex}`;

    const renderer =
      typeof toolbarField.renderer === 'string'
        ? {
            ...DEFAULT_EDIT_RENDERER_INFO,
            type: toolbarField.renderer,
          }
        : merge({}, DEFAULT_EDIT_RENDERER_INFO, toolbarField.renderer);

    toolbarField.renderer = renderer;

    const Renderer = TOOLBAR_RENDERER[renderer.type] ?? TOOLBAR_RENDERER.text;

    toolbarField.$renderer = new Renderer(toolbarField, this.gridMain);

    this.toolbarFields.push(toolbarField);

    return toolbarField;
  }

  createTemplate() {
    const appFragment = document.createDocumentFragment();
    const hiddenCheckElement = document.createElement('div');
    this.hiddenCheckElement = hiddenCheckElement;
    hiddenCheckElement.style.cssText =
      'width:100%;height:0px;position:fixed;top:-9999;left:0px;z-index:-1;display: flex;';
    this.toolbarElement.appendChild(hiddenCheckElement);
    this.toolbarLayouts.forEach((row) => appFragment.appendChild(this.createRow(row)));
    hiddenCheckElement.remove();
    this.toolbarElement.appendChild(appFragment);
  }

  public setValues(val: any) {
    for (const key in val) {
      //
      //
      // name 처리 할것.
      //
      //
    }
  }

  public getValues() {
    const item: any = {};
    for (const field of this.toolbarFields) {
      if (field.name && field.$renderer.canEdit()) {
        item[field.name] = field.$renderer.getValue();
      }
    }

    return item;
  }

  private createRow(items: ToolbarLayout[]) {
    const row = document.createElement('div');
    if (items.length === 0) {
      return document.createElement('div');
    }

    row.className = 'dg-toolbar-row';
    row.style.height = `${items[0].height}px`;

    const positions = ['left', 'center', 'right'];
    const layoutColumns = ['0px']; // 1번째 트랙 시작 (Index 1)
    const fragment = document.createDocumentFragment();

    const validGroup = positions
      .map((pos) => ({
        position: pos,
        list: items.filter((x) => x.position === pos),
      }))
      .filter((group) => group.list.length > 0);

    validGroup.forEach((group, index) => {
      const groupItem = group.list[0];

      if (groupItem && groupItem.width) {
        const widthVal = formatLength(groupItem.width);

        // 핵심 변경: 현재까지 쌓인 트랙 배열 길이를 기반으로 타겟 인덱스를 안전하게 계산
        // [현재 배열 길이] + 1(Grid의 1-base 인덱스) + 1(첫 번째 'auto' 패딩 건너뛰기)
        const targetColIndex = layoutColumns.length + 2;

        layoutColumns.push('auto', widthVal, 'auto');

        group.list.forEach((item) => {
          this.createSection(item, targetColIndex, fragment);
        });
      } else {
        // width 값이 없는 경우 기본적으로 자동 계산 영역 확장
        const targetColIndex = layoutColumns.length + 1;

        let sectionWidth = 0;
        group.list.forEach((item) => {
          sectionWidth = this.createSection(item, targetColIndex, fragment);
        });

        layoutColumns.push('minmax(' + sectionWidth + 'px, 1fr)');
      }

      // 그룹 간 구분선 트랙 삽입
      if (index < validGroup.length - 1) {
        layoutColumns.push('2px', '2px');
      }
    });

    layoutColumns.push('0px'); // 맨 뒤 트랙 마무리
    row.style.gridTemplateColumns = layoutColumns.join(' ');
    row.appendChild(fragment);

    return row;
  }

  private createSection(item: ToolbarLayout, layoutColIndex: number, parentFragment: DocumentFragment): any {
    const sectionElement = document.createElement('div');
    sectionElement.className = `dg-toolbar-section dg-grid-area-${item.position}`;
    sectionElement.style.gridArea = `1 / ${layoutColIndex} / span 1 / span 1`;
    this.setWidth(sectionElement, item.width ?? '');

    const columns = ['0px'];
    const fragment = document.createDocumentFragment();
    let currentColumnIndex = 2; // "0px" 트랙이 1번이므로 실제 배치는 2번부터

    let totalWidth = 0;

    item.children.forEach((field, index) => {
      let beforeGap = 0;
      let afterGap = 0;

      // 1. gap 처리 로직
      if (isArray(field.gap)) {
        if (field.gap.length === 1) {
          // 배열에 값이 하나만 있는 경우 (예: [20]) -> 뒤쪽 여백으로 처리
          beforeGap = 0;
          afterGap = field.gap[0] ?? 0;
        } else {
          // 배열에 값이 두 개 이상인 경우 (예: [20, 10]) -> [앞, 뒤]
          beforeGap = field.gap[0] ?? 0;
          afterGap = field.gap[1] ?? 0;
        }
      } else if (isNumber(field.gap)) {
        // 배열이 아닌 단일 값인 경우 (예: gap: 20) -> 뒤쪽 여백으로 처리
        afterGap = field.gap;
      } else {
        // gap 속성이 아예 없는 경우
        // 마지막 요소가 아닐 때만 기본값(4px) 적용, 마지막 요소면 적용 안 함(0)
        if (index < item.children.length - 1) {
          afterGap = 4;
        }
      }

      // 2. 앞 여백(Before Gap) 트랙 추가
      if (beforeGap > 0) {
        totalWidth += beforeGap;
        columns.push(`${beforeGap}px`);
        currentColumnIndex++; // 앞 여백이 차지한 트랙만큼 인덱스 증가
      }

      // 3. 필드(요소) 트랙 너비 계산 및 추가
      let trackWidth = '1fr';
      if (field.width) {
        trackWidth = formatLength(field.width);
      } else if (field.renderer.type === 'button') {
        trackWidth = 'max-content';
      }
      columns.push(trackWidth);

      // 요소 렌더링 및 위치 지정
      fragment.appendChild(this.createField(field, currentColumnIndex));
      currentColumnIndex++; // 요소가 차지한 트랙만큼 인덱스 증가

      totalWidth += field.$width;

      // 4. 뒤 여백(After Gap) 트랙 추가
      if (afterGap > 0) {
        totalWidth += afterGap;
        columns.push(`${afterGap}px`);
        currentColumnIndex++; // 뒤 여백이 차지한 트랙만큼 인덱스 증가
      }
    });

    columns.push('0px'); // 맨 뒤 트랙 마무리
    sectionElement.style.gridTemplateColumns = columns.join(' ');
    sectionElement.appendChild(fragment);
    parentFragment.appendChild(sectionElement);
    return totalWidth;
  }

  private createField(field: ToolbarFieldItem, colIndex: number) {
    const el = document.createElement('div');
    const rendererType = field.renderer.type;
    const isRequired = field.renderer.required === true;
    const hasLabel = isRequired || (rendererType !== 'button' && field.label);

    el.className = `dg-toolbar-field dg-type-${rendererType} ${hasLabel ? 'dg-group' : ''}`;
    el.style.gridArea = `1 / ${colIndex} / span 1 / span 1`;

    if (hasLabel) {
      el.innerHTML = `
          <span class="dg-label ${isRequired ? 'dg-required' : ''}">${field.label}</span>
          <div class="dg-control"></div>
        `;
    } else {
      el.innerHTML = '<div class="dg-control"></div>';
    }

    field.$renderer.render(el);

    this.setWidth(el, field.width ?? 'auto');

    // 넓이 체크용으로 추가.
    this.hiddenCheckElement.appendChild(el);

    field.$width = el.getBoundingClientRect().width;

    return el;
  }

  private setWidth(el: HTMLDivElement, width: number | string) {
    if (!width) return;

    const value = formatLength(width);

    el.style.width = value;
    if (width !== 'auto') {
      el.style.minWidth = value;
      el.style.maxWidth = value;
    } else {
      el.style.minWidth = 'initial';
      el.style.maxWidth = 'initial';
    }
  }
}

function formatLength(width: number | string) {
  if (!width) return '';
  return typeof width === 'number' || /^\d+$/.test(width) ? `${width}px` : width;
}
