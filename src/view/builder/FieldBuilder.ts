import { DEFAULT_ROW_CHECK_WIDTH, LINE_NUMBER_NAME, ROW_CHECK_NAME, ROW_DRAG_HANDLE_NAME } from '@/constants';
import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { FieldHeaderGroupInfo } from '@/types/GridConfig';
import { FieldItem } from '@/types/GridField';
import { GridOptions } from '@/types/GridOptions';
import { getTextWidth, heightOptionValue } from '@/util/gridUtils';
import { deepCopy, isArray, isNumber, isUndefined, merge } from '@/util/utils';
import { GridMain } from '../GridMain';
import { RendererFactory } from './RendererFactory';
import { defaultFieldGroupInfo } from '@/defaultGridConfig';

export class FieldBuilder {
  private readonly cellMinWidth: number;
  private readonly enabledViewAllLabel: boolean;

  constructor(
    private readonly opts: GridOptions,
    private readonly gridMain: GridMain,
    private readonly rendererFactory: RendererFactory,
  ) {
    const headerOpts = opts.header;
    this.cellMinWidth = headerOpts.resize.minWidth;
    this.enabledViewAllLabel = headerOpts.enabledViewAllLabel === true;
  }

  public buildFields() {
    const cfg = this.gridMain.config();
    const opts = this.opts;
    const fields = deepCopy(opts.fields) as FieldItem[];

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    //  Aside 필드
    const asideOrder = this.buildAsideFields(opts);
    const asideLength = asideOrder.length;

    cfg.dataInfo.asideLength = asideLength;
    cfg.dataInfo.startCol = asideLength;

    const fixedLeftIndex = asideLength + cfg.fixedLeftIndex - 1;
    let fixedRightIndex = cfg.fixedRightIndex < 1 ? 0 : asideLength + cfg.fixedRightIndex;
    fixedRightIndex = fixedRightIndex > fixedLeftIndex + 1 ? fixedRightIndex : 0;

    fields.unshift(...asideOrder);

    let fieldIndex = 0;
    for (const field of fields) {
      this.buildFieldGroup(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, `${fieldIndex++}`);
    }

    cfg.fieldHeaderGroup.depth = cfg.fieldHeaderGroup.center.length;
    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
    cfg.fixedLeftIndex = fixedLeftIndex + 1;
    cfg.fixedRightIndex = fixedRightIndex > cfg.currentFields.length ? 0 : fixedRightIndex;
    cfg.dataInfo.colLength = cfg.currentFields.length;

    if (opts.header.view === false) return;

    //  헤더 높이 계산
    const { height: defaultHeight, heights } = heightOptionValue(opts.header.height, 28);
    const groupDepth = cfg.fieldHeaderGroup.depth;

    cfg.fieldHeaderGroup.heights = new Array(groupDepth);
    let mainHeaderHeight = 0;

    for (let i = 0; i < groupDepth; i++) {
      const customHeight = heights.length > i ? heights[i] : 0;
      const currentHeaderHeight = customHeight > 0 ? customHeight : defaultHeight; // 매번 기본값으로 평가

      mainHeaderHeight += currentHeaderHeight;
      cfg.fieldHeaderGroup.heights[i] = currentHeaderHeight;
    }
    cfg.dimensions.mainHeaderHeight = mainHeaderHeight;
  }

  /**
   * aside 옵션
   *
   * @param opts 옵션
   * @returns
   */
  private buildAsideFields(opts: GridOptions): FieldItem[] {
    const asideItems: { field: FieldItem; order: number }[] = [];

    // Line Number
    if (opts.aside.lineNumber.enabled === true) {
      asideItems.push({
        field: merge({}, opts.aside.lineNumber, {
          name: LINE_NUMBER_NAME,
          renderer: { type: 'lineNumber' },
          $isAside: true,
        }) as FieldItem,
        order: opts.aside.lineNumber.order ?? 0,
      });
    }

    //  Row Checkbox
    if (opts.aside.rowCheckbox.enabled === true) {
      asideItems.push({
        field: merge({ width: DEFAULT_ROW_CHECK_WIDTH }, opts.aside.rowCheckbox, {
          name: ROW_CHECK_NAME,
          renderer: { type: 'rowCheckbox' },
          $isAside: true,
        }) as FieldItem,
        order: opts.aside.rowCheckbox.order ?? 1,
      });
    }

    // Row Drag Handle
    if (opts.body.rowMove?.enabled === true && opts.body.rowMove?.enabledDragHandle !== false) {
      asideItems.push({
        field: merge(
          {},
          {
            name: ROW_DRAG_HANDLE_NAME,
            width: 32,
            renderer: { type: 'rowDragHandle' },
            $isAside: true,
          },
        ) as FieldItem,
        order: 2, // Drag Handle의 기본 order
      });
    }

    // Modify Info
    if (opts.aside.modifyInfo.enabled === true) {
      asideItems.push({
        field: merge({}, opts.aside.modifyInfo, {
          name: '$modifyInfo',
          renderer: { type: 'modifyInfo' },
          $isAside: true,
        }) as FieldItem,
        order: opts.aside.modifyInfo.order ?? 2,
      });
    }

    return asideItems.sort((a, b) => a.order - b.order).map((item) => item.field);
  }

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

    const children = field.children;
    if (children && children.length > 0) {
      let colspan = 0;
      let childFieldIndex = 0;

      for (const childNode of children) {
        this.buildFieldGroup(
          childNode,
          depth + 1,
          fieldGroupInfo,
          fixedLeftIndex,
          fixedRightIndex,
          `${fieldIndex}_${childFieldIndex++}`, //  템플릿 리터럴 적용
        );
        colspan += childNode.$colspan;
      }
      field.$colspan = colspan;
    }

    field = this.initFieldMeta(field, depth, fieldIndex, fieldGroupInfo);

    if (isUndefined(fieldGroupInfo.left[depth])) fieldGroupInfo.left[depth] = [];
    if (isUndefined(fieldGroupInfo.center[depth])) fieldGroupInfo.center[depth] = [];
    if (isUndefined(fieldGroupInfo.right[depth])) fieldGroupInfo.right[depth] = [];

    // Left Fixed
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

    // Right Fixed
    if (fixedRightIndex > 0 && fixedRightIndex <= field.$resizeIdx) {
      if (field.$colspan == 1) {
        fieldGroupInfo.right[depth].push(field);
      } else {
        let rightColspan = field.$colspan;
        const bodyFieldColspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;

        if (fixedRightIndex <= field.$resizeIdx && bodyFieldColspan > 0) {
          const bodyNode = cloneFieldMeta(field);
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

    return field;
  }

  private initFieldMeta(field: FieldItem, depth: number, fieldIndex: string, fieldGroupInfo: FieldHeaderGroupInfo) {
    const cfg = this.gridMain.config();
    const enableHelp = !isUndefined(field.headerHelp);

    if (!cfg.enabledHeaderHelpButton && enableHelp) cfg.enabledHeaderHelpButton = true;
    if (!cfg.enabledSortButton && field.sort) cfg.enabledSortButton = true;

    const children = field.children;
    const childrenLen = isArray(children) ? children.length : 0;
    let isLeaf = false;

    if (childrenLen < 1) {
      isLeaf = true;
      field.$colspan = field.colspan ?? 1;
    } else {
      field.$colspan = field.$colspan ?? 1;
    }

    field.$isLeaf = isLeaf;
    field.$resizeIdx = fieldGroupInfo.leaf.length - (isLeaf ? 0 : 1);
    field.$childLength = childrenLen;
    field.$rowspan = field.rowspan ?? 1;
    field.$depth = depth;
    field.$uid = `${this.gridMain.uid()}_${field.$depth}_${fieldIndex}`; //  템플릿 리터럴 적용
    field.$enabledHelp = enableHelp;

    if (isLeaf) {
      let width = isNumber(field.width) ? field.width : this.cellMinWidth;

      if (this.enabledViewAllLabel) {
        width = Math.max(width, getTextWidth(cfg, field.label, 20));
      }
      if (!field.$isAside) {
        width = Math.max(width, this.cellMinWidth);
      }

      field = this.rendererFactory.createRenderer(field);

      field.$colSeq = fieldGroupInfo.leaf.length;
      field.width = width;
      field.$width = width;
      field.$alignStyle = TEXT_ALIGN_STYLE[field.align] ?? (field.$renderer?.alignStyle() || TEXT_ALIGN_STYLE.left); //  방어적 코드 추가 (?.)

      fieldGroupInfo.leaf.push(field);
      cfg.allFieldMap.set(field.name, field);
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
function cloneFieldMeta(field: any): FieldItem {
  const result: any = {};

  const cloneKeys = [
    'name',
    'label',
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
    '$enabledHelp',
  ];

  for (const key of cloneKeys) {
    result[key] = field[key];
  }

  return result;
}
