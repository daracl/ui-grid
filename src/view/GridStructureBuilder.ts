import {
  ALIGN_STYLE,
  EDIT_RENDERER,
  LINE_NUMBER_NAME,
  ROW_CHECK_NAME,
  ROW_DRAG_HANDLE_NAME,
  VIEW_RENDERER,
} from '@/constants';
import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_OPTIONS, DEFAULT_RENDERER_INFO } from '@/defaultGridOption';
import { EditRenderer } from '@/renderer/EditRenderer';
import { FieldItem } from '@/types/GridField';
import { getTextWidth, heightOptionValue } from '@/util/gridUtils';
import { deepCopy, isNumber, isObject, isPlainObject, isString, isUndefined, merge } from '@/util/utils';
import { GridMain } from './GridMain';
import { GridOptions } from '@/types/GridOptions';
import { Config, FieldHeaderGroupInfo } from '@/types/GridConfig';
import { defaultFieldGroupInfo } from '@/defaultGridConfig';
import { isArray } from '../util/utils';

// main-body  margin = border top + border bottom+ 공백1
const MAIN_MARGIN_BOTTOM = 3;

export class GridStructureBuilder {
  private readonly cfg: Config;
  private readonly cellMinWidth: number;
  private readonly enableViewAllLabel: boolean;

  constructor(private readonly opts: GridOptions, private readonly gridMain: GridMain) {
    this.cfg = gridMain.config();
    const headerOpts = opts.header;
    this.cellMinWidth = headerOpts.resize.minWidth;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;
  }

  /**
   * body layout 계산
   *
   * @param {boolean} [isInit] 초기화 여부
   * @returns {void}
   */
  public calculateBodyLayout() {
    const cfg = this.cfg;
    const { dimensions, rowHeight, dataInfo, currentFields: fields, scroll } = cfg;
    const opts = this.opts;

    const fieldLength = fields.length;

    const rowLength = dataInfo.rowLength;

    const isHeaderResize = cfg.isHeaderResize;

    const lineNumberCol = cfg.allFieldMap.get(LINE_NUMBER_NAME)?.$colSeq;
    if (!isUndefined(lineNumberCol)) {
      const numberField = fields[lineNumberCol];
      if (rowLength >= 100000) {
        const textWidth = getTextWidth(cfg, rowLength + '');
        numberField.width = textWidth ?? numberField.width;
        numberField.$width = textWidth ?? numberField.$width;
      } else {
        const defaultLineNumberWidth = opts.aside.lineNumber.width ?? DEFAULT_OPTIONS.aside.lineNumber.width ?? 40;
        numberField.width = defaultLineNumberWidth;
        numberField.$width = defaultLineNumberWidth;
      }
    }

    let fieldTotalWidth = 0;
    for (const field of fields) {
      if (!isHeaderResize && this.enableViewAllLabel) {
        const labelWidth = getTextWidth(cfg, field.label, 20);
        field.width = Math.max(field.width, labelWidth);
      }

      fieldTotalWidth += isHeaderResize ? field.$width : field.width;
    }

    scroll.enableHorizontal = fieldTotalWidth > dimensions.width;

    //세로 스크롭 계산 start
    const verticalEnable = opts.scroll.vertical.enable;

    if (verticalEnable === false) {
      dimensions.mainHeight =
        rowHeight * rowLength +
        (dimensions.mainHeaderHeight +
          dimensions.mainSummaryHeight +
          (scroll.enableHorizontal ? opts.scroll.width : 0));
      dimensions.mainHeight = dimensions.mainHeight + MAIN_MARGIN_BOTTOM;
    }

    const mainBodyHeight =
      dimensions.mainHeight -
      (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (scroll.enableHorizontal ? opts.scroll.width : 0)) -
      2; // 2 border height;

    scroll.enableVertical = verticalEnable === false ? false : rowHeight * rowLength > mainBodyHeight;
    scroll.enableHorizontal = fieldTotalWidth > dimensions.width - (scroll.enableVertical ? opts.scroll.width : 0);

    dimensions.mainBodyHeight = mainBodyHeight;

    const orginViewRow = mainBodyHeight / rowHeight;
    const viewRow = Math.min(Math.max(1, Math.ceil(orginViewRow)), rowLength);

    scroll.insideViewRow = viewRow - (viewRow > 1 && viewRow > Math.floor(orginViewRow) ? 1 : 0);
    scroll.viewRow = viewRow;

    const verticalScrollWidth = scroll.enableVertical ? opts.scroll.width + (cfg.fixedRightIndex > 0 ? 1 : 3) : 0; // +3 마지막 여백처리;

    let remainderWidth = 0,
      lastSpaceW = 0;

    let isAddSpaceWidth;

    if (!scroll.enableHorizontal) {
      const viewGridWidth = fieldTotalWidth + verticalScrollWidth;
      const overWidth = dimensions.width - viewGridWidth;
      isAddSpaceWidth = true;
      const absOverWidth = overWidth < 0 ? Math.abs(overWidth) : overWidth;

      remainderWidth = Math.floor(absOverWidth / (fieldLength - dataInfo.asideLength));
      lastSpaceW = absOverWidth - remainderWidth * (fieldLength - dataInfo.asideLength);

      if (overWidth < 0) {
        isAddSpaceWidth = false;
        remainderWidth = -remainderWidth;
      }
    }

    let leftWidth = 0,
      centerWidth = 0,
      rightWidth = 0;

    for (let j = 0; j < fieldLength; j++) {
      const field = fields[j];
      let fieldWidth = isHeaderResize ? field.$width : field.width;

      // 그리드 남는 영역을 계산 해서 컬럼에 추가.
      if (!isHeaderResize && !field.$isAside && opts.enableWidthFixed !== true) {
        fieldWidth = fieldWidth + remainderWidth;

        if (lastSpaceW > 0) {
          const addSpaceW = Math.min(lastSpaceW, 1);
          fieldWidth = fieldWidth + (isAddSpaceWidth ? 1 : -1) * addSpaceW;
          lastSpaceW = lastSpaceW - 1;
        }

        fieldWidth = Math.max(fieldWidth, this.cellMinWidth);
      }

      if (field.$panel == 'left') {
        leftWidth += fieldWidth;
      } else if (field.$panel == 'right') {
        rightWidth += fieldWidth;
      } else {
        centerWidth += fieldWidth;
      }

      field.$width = fieldWidth;
    }

    //console.log('222222 ', dimensions.width - verticalScrollWidth);

    dimensions.mainLeftWidth = leftWidth;
    dimensions.mainCenterWidth = centerWidth;
    dimensions.mainRightWidth = rightWidth;
    dimensions.mainTotalWidth = leftWidth + centerWidth + rightWidth;
    dimensions.mainInsideWidth = dimensions.width - verticalScrollWidth; // 마지막 여백처리;
    dimensions.mainCenterOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth; // 마지막 여백처리;
    dimensions.mainCenterViewWidth = dimensions.mainInsideWidth - (leftWidth + rightWidth);

    console.log(
      'calcBody ',
      fieldLength,
      dimensions.width,
      dimensions.mainHeight,
      mainBodyHeight,
      rowLength,
      rowHeight,
      scroll.insideViewRow,
      scroll.viewRow,
      JSON.stringify(dimensions),
    );
  }

  /**
   * field 구조 생성
   *
   * @returns {void}
   */
  public buildFields() {
    const cfg = this.cfg;
    const opts = this.opts;
    const fields = deepCopy(opts.fields);

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    const asideOrder: any[] = [];
    // linenumber
    if (opts.aside.lineNumber.enabled === true) {
      opts.aside.lineNumber.order = opts.aside.lineNumber.order ?? 0;
      const fieldItem = merge({}, opts.aside.lineNumber, {
        name: LINE_NUMBER_NAME,
        renderer: { type: 'lineNumber' },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    // rowCheckbox
    if (opts.aside.rowCheckbox.enabled === true) {
      opts.aside.rowCheckbox.order = opts.aside.rowCheckbox.order ?? 1;
      const fieldItem = merge({ width: 27 }, opts.aside.rowCheckbox, {
        name: ROW_CHECK_NAME,
        renderer: { type: 'rowCheckbox', customOptions: { allowMultiSelect: opts.aside.rowCheckbox.allowMultiSelect } },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    // rowDragHandle
    if (opts.body.rowMove?.enabled === true && opts.body.rowMove?.enableDragHandle !== false) {
      const fieldItem = merge(
        {},
        {
          name: ROW_DRAG_HANDLE_NAME,
          width: 32,
          order: 2,
          renderer: { type: 'rowDragHandle' },
          $isAside: true,
        },
      );
      asideOrder.push(fieldItem);
    }

    // modifyInfo 추가.
    if (opts.aside.modifyInfo.enabled === true) {
      opts.aside.modifyInfo.order = opts.aside.modifyInfo.order ?? 2;
      const fieldItem = merge({}, opts.aside.modifyInfo, {
        name: '$modifyInfo',
        renderer: { type: 'modifyInfo' },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    asideOrder.sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;

      const aIsUndefined = orderA === undefined;
      const bIsUndefined = orderB === undefined;

      if (aIsUndefined && bIsUndefined) return 0;
      if (aIsUndefined) return 1; // a가 뒤로
      if (bIsUndefined) return -1; // b가 뒤로

      return orderA - orderB;
    });

    const asideLength = asideOrder.length;

    cfg.dataInfo.asideLength = asideLength;
    cfg.dataInfo.startCol = asideLength;

    const fixedLeftIndex = asideLength + cfg.fixedLeftIndex - 1;
    let fixedRightIndex = cfg.fixedRightIndex < 1 ? 0 : asideLength + cfg.fixedRightIndex;

    fixedRightIndex = fixedRightIndex > fixedLeftIndex + 1 ? fixedRightIndex : 0;

    fields.unshift(...asideOrder);

    let fieldIndex = 0;

    for (const field of fields) {
      this.buildFieldGroup(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, '' + fieldIndex++);
    }

    cfg.fieldHeaderGroup.depth = cfg.fieldHeaderGroup.center.length;
    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
    cfg.fixedLeftIndex = fixedLeftIndex + 1;
    cfg.fixedRightIndex = fixedRightIndex > cfg.currentFields.length ? 0 : fixedRightIndex;
    cfg.dataInfo.colLength = cfg.currentFields.length;

    if (opts.header.view === false) {
      return;
    }

    const heightOption = heightOptionValue(opts.header.height, 28);
    const { height, heights } = heightOption;

    const groupDepth = cfg.fieldHeaderGroup.depth;

    cfg.fieldHeaderGroup.heights = new Array(groupDepth);

    let mainHeaderHeight = 0;
    let headerHeight = height;
    for (let i = 0; i < groupDepth; i++) {
      if (heights.length > i) {
        headerHeight = heights[i];
        headerHeight = headerHeight > 0 ? headerHeight : height;
      }
      mainHeaderHeight += headerHeight;
      cfg.fieldHeaderGroup.heights[i] = headerHeight;
    }

    cfg.dimensions.mainHeaderHeight = mainHeaderHeight;
  }

  /**
   * field group 정보
   *
   * @param {FieldItem} field field 정보
   * @param {number} depth 현재 depth
   * @param {FieldHeaderGroupInfo} fieldGroupInfo field group 정보
   * @param {number} fixedLeftIndex left 고정 컬럼 index
   * @param {number} fixedRightIndex right 고정 컬럼 index
   * @param {string} fieldIndex field index path
   *
   * @returns {FieldItem} field 정보
   */
  private buildFieldGroup(
    field: FieldItem,
    depth: number,
    fieldGroupInfo: FieldHeaderGroupInfo,
    fixedLeftIndex: number,
    fixedRightIndex: number,
    fieldIndex: string,
  ) {
    if (field.hidden) {
      field.$colspan = -1;
      return field;
    }

    this.initFieldMeta(field, depth, fieldIndex);

    // help button
    if (field.$enableHelp && !this.cfg.enableHeaderHelpButton) {
      this.cfg.enableHeaderHelpButton = true;
    }

    // sort button
    if (field.sort && !this.cfg.enableSortButton) {
      this.cfg.enableSortButton = true;
    }

    const children = field.children;
    if (!field.$isLeaf && children) {
      let colspan = 0;
      let childFieldIndex = 0;
      for (const childNode of children) {
        this.buildFieldGroup(
          childNode,
          depth + 1,
          fieldGroupInfo,
          fixedLeftIndex,
          fixedRightIndex,
          fieldIndex + '_' + childFieldIndex++,
        );
        colspan += childNode.$colspan;
      }

      field.$colspan = colspan;
      field.$resizeIdx = fieldGroupInfo.leaf.length - 1;
    } else {
      field.$resizeIdx = fieldGroupInfo.leaf.length;
    }

    if (isUndefined(fieldGroupInfo.left[depth])) {
      fieldGroupInfo.left[depth] = [];
    }
    if (isUndefined(fieldGroupInfo.center[depth])) {
      fieldGroupInfo.center[depth] = [];
    }

    if (isUndefined(fieldGroupInfo.right[depth])) {
      fieldGroupInfo.right[depth] = [];
    }

    // left 고정 컬럼
    if (
      (field.$childLength > 0 && fixedLeftIndex > field.$resizeIdx - field.$colspan) ||
      (field.$childLength < 1 && fixedLeftIndex >= field.$resizeIdx)
    ) {
      if (field.$colspan <= 1) {
        fieldGroupInfo.left[depth].push(field);
      } else {
        const leftNode = cloneFieldMeta(field);

        if (leftNode.$resizeIdx > fixedLeftIndex) {
          leftNode.$colspan = fixedLeftIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedLeftIndex;
        }

        fieldGroupInfo.left[depth].push(leftNode);
        if (fixedLeftIndex < field.$resizeIdx) {
          const bodyNode = cloneFieldMeta(field);
          bodyNode.$colspan = field.$resizeIdx - fixedLeftIndex;
          fieldGroupInfo.center[depth].push(bodyNode);
        }
      }
      field.$panel = 'left';
      if (field.$isLeaf) fieldGroupInfo.leafLeft.push(field);
    }

    // right 고정 컬럼
    if (fixedRightIndex > 0 && fixedRightIndex <= field.$resizeIdx) {
      if (field.$colspan == 1) {
        fieldGroupInfo.right[depth].push(field);
      } else {
        let rightColspan = field.$colspan;

        const bodyFieldColspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;

        if (fixedRightIndex <= field.$resizeIdx && bodyFieldColspan > 0) {
          const bodyNode = cloneFieldMeta(field) as FieldItem;
          bodyNode.$colspan = bodyFieldColspan;
          bodyNode.$resizeIdx = fixedRightIndex - 1;
          rightColspan = rightColspan - bodyNode.$colspan;

          const idx = fieldGroupInfo.center[depth].findIndex((value) => value.$uid === bodyNode.$uid);

          if (idx > -1) {
            fieldGroupInfo.center[depth][idx] = bodyNode;
          } else {
            fieldGroupInfo.center[depth].push(bodyNode);
          }
        }

        const rightNode = cloneFieldMeta(field);

        rightNode.$colspan = rightColspan;
        rightNode.$resizeIdx = field.$resizeIdx;

        fieldGroupInfo.right[depth].push(rightNode);
      }

      field.$panel = 'right';
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    }

    if (isUndefined(field.$panel)) {
      fieldGroupInfo.center[depth].push(field);
      field.$panel = 'center';
      if (field.$isLeaf) fieldGroupInfo.leafCenter.push(field);
    }

    if (field.$isLeaf) {
      let width = isNumber(field.width) ? field.width : this.cellMinWidth;

      if (this.enableViewAllLabel) {
        width = Math.max(width, getTextWidth(this.cfg, field.label, 20));
      }

      if (!field.$isAside) {
        width = Math.max(width, this.cellMinWidth);
      }
      field = this.createRenderer(field);
      field.$colSeq = fieldGroupInfo.leaf.length;
      field.width = width;
      field.$width = width;
      field.$alignStyle = ALIGN_STYLE[field.align] ?? (field.$renderer.alignStyle() || ALIGN_STYLE.left);

      fieldGroupInfo.leaf.push(field);

      this.cfg.allFieldMap.set(field.name, field);
    }

    return field;
  }

  /**
   * field 메타 정보 초기화
   *
   * @param {FieldItem} field field 정보
   * @param {number} depth 현재 depth
   * @param {string} fieldIndex field index path
   *
   * @returns {void}
   */
  private initFieldMeta(field: FieldItem, depth: number, fieldIndex: string) {
    field.$depth = depth + 1;
    field.$uid = this.gridMain.uid() + '_' + field.$depth + '_' + fieldIndex;

    field.$colspan = field.colspan ?? 1;
    field.$rowspan = field.rowspan ?? 1;

    field.$enableHelp = !isUndefined(field.headerHelp);

    const children = field.children;
    const childrenLen = isArray(children) ? children.length : 0;
    field.$childLength = childrenLen;
    field.$isLeaf = childrenLen < 1;
  }

  /**
   * field renderer 생성
   *
   * @param {FieldItem} field field 정보
   *
   * @returns {FieldItem} renderer 정보가 추가된 field
   */
  private createRenderer(field: FieldItem): FieldItem {
    const opts = this.opts;

    if (!field.$isAside) {
      let renderInfo = { type: 'text' };

      if (isPlainObject(field.renderer)) {
        renderInfo = merge({}, field.renderer);
      } else if (isString(field.renderer)) {
        renderInfo = { type: field.renderer };
      }

      const render = VIEW_RENDERER[renderInfo.type];

      if (isUndefined(render)) {
        renderInfo.type = 'text';
      }

      field.renderer = merge({}, DEFAULT_RENDERER_INFO, renderInfo);

      if (opts.editable || field.editable) {
        field.editRenderer = merge({}, DEFAULT_EDIT_RENDERER_INFO, field.editRenderer);
      }
    }

    const rendererType = field.renderer.type;

    field.$renderer = new VIEW_RENDERER[rendererType](field, this.gridMain);

    if ((opts.editable && field.editable !== false) || field.$renderer instanceof EditRenderer) {
      let editRendererInfo = field.editRenderer;

      if (isString(editRendererInfo)) {
        editRendererInfo = { type: editRendererInfo };
      }

      let type = 'text';
      const editType = editRendererInfo?.type;

      if (editType && EDIT_RENDERER[editType]) {
        type = editType;
      } else if (EDIT_RENDERER[rendererType]) {
        type = rendererType;
      }

      field.$editRenderer = new EDIT_RENDERER[type](field, this.gridMain);
    }

    return field;
  }
}

/**
 * field 메타 정보 복사
 *
 * @param {any} field field 정보
 *
 * @returns {any} 복사된 field meta 정보
 */
function cloneFieldMeta(field: any): any {
  const result: any = {};

  const cloneKeys = [
    'name',
    'label',
    'colspan',
    'rowspan',
    'hidden',
    'sort',
    'headerHelp',
    '$colspan',
    '$rowspan',
    '$depth',
    '$isLeaf',
    '$childLength',
    '$resizeIdx',
    '$width',
    '$alignStyle',
    '$isAside',
    '$panel',
    '$uid',
    '$colSeq',
    '$enableHelp',
  ];

  for (const key of cloneKeys) {
    result[key] = field[key];
  }

  return result;
}
