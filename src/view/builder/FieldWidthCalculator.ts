import { FieldItem } from '@/types/GridField';
import { GridOptions } from '@/types/GridOptions';
import { isUndefined } from '@/util/utils';

import { GridMain } from '../GridMain';
import { gridAvailableWidth } from '@/util/gridUtils';

export class FieldWidthCalculator {
  private readonly cellMinWidth: number;

  constructor(private readonly opts: GridOptions, private readonly gridMain: GridMain) {
    this.cellMinWidth = opts.header.resize.minWidth;
  }

  /**
   * 컬럼 width를 변경합니다.
   *
   * disableHorizontalScroll이 true인 경우
   * isHeaderResize 여부와 관계없이 항상
   * dimensions.width에 맞게 전체 컬럼을 재분배합니다.
   *
   * @public
   * @param idx column index
   * @param w column width
   */
  public setColumnWidth(idx: number, w: number): void {
    const cfg = this.gridMain.config();
    const fields = cfg.currentFields;

    const field = fields[idx];

    if (!field) {
      return;
    }

    cfg.isHeaderResize = true;

    const headerOpts = this.gridMain.options().header;

    const minWidth = headerOpts.resize.minWidth;

    const maxWidth = headerOpts.resize.maxWidth;

    if (minWidth !== -1) {
      w = Math.max(w, minWidth);
    }

    if (maxWidth !== -1) {
      w = Math.min(w, maxWidth);
    }

    const oldWidth = field.$width ?? field.width;

    if (w == oldWidth) return;

    field.$width = w;

    if (cfg.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths();

      this.gridMain.resizeDraw();

      return;
    }

    if (field.$isAside) {
      this.gridMain.resizeDraw();

      return;
    }

    // 컬럼 resize old 버전으로 처리할 것
    //
    //
    const delta = w - oldWidth;

    if (delta !== 0) {
      this.redistributeAfterResize(idx, delta);
    }

    this.gridMain.resizeDraw();
  }

  /**
   * resize된 컬럼의 width 변화량을
   * 다른 일반 컬럼에 재분배합니다.
   *
   * @private
   * @param resizedIndex resize된 컬럼 index
   * @param delta width 변화량
   */
  private redistributeAfterResize(resizedIndex: number, delta: number): void {
    if (delta === 0) {
      return;
    }

    const cfg = this.gridMain.config();
    const fields = cfg.currentFields;

    const resizeFields: FieldItem[] = [];

    for (let i = 0; i < fields.length; i++) {
      if (i === resizedIndex) {
        continue;
      }

      const field = fields[i];

      // Aside 컬럼은 고정
      if (field.$isAside) {
        continue;
      }

      // width fixed 모드에서는
      // 다른 컬럼을 변경하지 않음
      if (this.opts.enableWidthFixed === true) {
        continue;
      }

      // 모든 컬럼의 최소 width 보장
      this.ensureMinimumWidth(field);

      resizeFields.push(field);
    }

    if (resizeFields.length === 0) {
      return;
    }

    // resize 대상이 커짐
    if (delta > 0) {
      this.shrinkFields(resizeFields, delta);

      return;
    }

    // resize 대상이 작아짐
    this.expandFields(resizeFields, -delta);
  }

  /**
   * disableHorizontalScroll 상태에서
   * 전체 일반 컬럼의 width를 dimensions.width에 맞춥니다.
   *
   * isHeaderResize 여부와 관계없이 실행됩니다.
   *
   * @private
   */
  private normalizeDisabledHorizontalWidths(): void {
    const cfg = this.gridMain.config();
    const { dimensions } = cfg;
    const fields = cfg.currentFields;

    if (dimensions.width <= 0 || fields.length === 0) {
      return;
    }

    // 필드가 실제로 사용할 수 있는 영역
    const targetWidth = gridAvailableWidth(cfg);

    if (targetWidth <= 0) {
      return;
    }

    //  필드의 최소 width 설정
    this.ensureAllMinimumWidths(fields);

    let asideWidth = 0;

    const normalFields: FieldItem[] = [];

    for (const field of fields) {
      const width = field.$width ?? field.width;

      if (field.$isAside) {
        field.$width = width;
        asideWidth += width;

        continue;
      }

      normalFields.push(field);
    }

    if (normalFields.length === 0) {
      return;
    }

    //  컬럼이 사용할 수 있는 width
    const availableWidth = targetWidth - asideWidth;

    if (availableWidth <= 0) {
      return;
    }

    //컬럼 width 계산

    let currentWidth = 0;
    for (const field of normalFields) {
      currentWidth += field.$width ?? field.width;
    }

    const diff = availableWidth - currentWidth;

    // 변경 없을때
    if (diff === 0) {
      return;
    }

    // 남는 경우
    if (diff > 0) {
      this.expandFields(normalFields, diff);

      return;
    }

    //부족한 경우
    this.shrinkFields(normalFields, Math.abs(diff));
  }

  /**
   * 모든 컬럼이 minWidth 이상인지 확인하고
   * 필요한 경우 minWidth로 보정합니다.
   *
   * minWidth === -1이면 최소 width 제한을 사용하지 않습니다.
   *
   * @private
   * @param fields 컬럼 목록
   */
  private ensureAllMinimumWidths(fields: FieldItem[]): void {
    if (this.cellMinWidth === -1) {
      return;
    }

    const minWidth = this.cellMinWidth;

    for (const field of fields) {
      const width = field.$width ?? field.width;

      if (width < minWidth) {
        field.$width = minWidth;
      } else {
        field.$width = width;
      }
    }
  }

  /**
   * 특정 컬럼의 minWidth를 보장합니다.
   *
   * @private
   * @param field 컬럼
   * @returns 보정된 width
   */
  private ensureMinimumWidth(field: FieldItem): number {
    const width = field.$width ?? field.width;

    if (this.cellMinWidth === -1) {
      field.$width = width;

      return width;
    }

    if (width < this.cellMinWidth) {
      field.$width = this.cellMinWidth;

      return this.cellMinWidth;
    }

    field.$width = width;

    return width;
  }

  /**
   * 다른 컬럼의 width를 줄입니다.
   *
   * 모든 컬럼이 minWidth 이하로 내려가지 않도록 합니다.
   *
   * @private
   * @param fields width를 줄일 컬럼 목록
   * @param amount 줄여야 하는 전체 width
   */
  private shrinkFields(fields: FieldItem[], amount: number): void {
    if (amount <= 0 || fields.length === 0) {
      return;
    }

    const minWidth = this.cellMinWidth === -1 ? 0 : this.cellMinWidth;

    // minWidth 보장
    this.ensureAllMinimumWidths(fields);

    //width가 큰 컬럼부터 처리
    const sortedFields = [...fields].sort((a, b) => {
      const aWidth = a.$width ?? a.width;

      const bWidth = b.$width ?? b.width;

      return bWidth - aWidth;
    });

    let totalShrinkableWidth = 0;

    for (const field of sortedFields) {
      const width = field.$width ?? field.width;

      totalShrinkableWidth += Math.max(0, width - minWidth);
    }

    let remainWidth = Math.min(amount, totalShrinkableWidth);

    if (remainWidth <= 0) {
      return;
    }

    //분배
    while (remainWidth > 0) {
      const shrinkableFields: FieldItem[] = [];

      for (const field of sortedFields) {
        const width = field.$width ?? field.width;

        if (width > minWidth) {
          shrinkableFields.push(field);
        }
      }

      if (shrinkableFields.length === 0) {
        break;
      }

      const shrinkPerField = Math.max(1, Math.floor(remainWidth / shrinkableFields.length));

      for (const field of shrinkableFields) {
        if (remainWidth <= 0) {
          break;
        }

        const currentWidth = field.$width ?? field.width;

        const maxShrink = currentWidth - minWidth;

        if (maxShrink <= 0) {
          continue;
        }

        const actualShrink = Math.min(maxShrink, shrinkPerField, remainWidth);

        field.$width = currentWidth - actualShrink;

        remainWidth -= actualShrink;
      }
    }
  }

  /**
   * 다른 컬럼의 width를 증가시킵니다.
   *
   * @private
   * @param fields width를 증가시킬 컬럼 목록
   * @param amount 증가시켜야 하는 전체 width
   */
  private expandFields(fields: FieldItem[], amount: number): void {
    if (amount <= 0 || fields.length === 0) {
      return;
    }

    // field min 값 설정
    this.ensureAllMinimumWidths(fields);

    const count = fields.length;

    const baseWidth = Math.floor(amount / count);

    let remainWidth = amount - baseWidth * count;

    if (baseWidth > 0) {
      for (const field of fields) {
        const currentWidth = field.$width ?? field.width;
        field.$width = currentWidth + baseWidth;
      }
    }

    for (let i = 0; i < fields.length && remainWidth > 0; i++) {
      const field = fields[i];

      const currentWidth = field.$width ?? field.width;

      field.$width = currentWidth + 1;

      remainWidth--;
    }
  }

  /**
   * 그리드의 전체 필드 width를 반환합니다.
   *
   * @public
   * @returns 전체 필드 width
   */
  public getTotalFieldWidth(): number {
    const cfg = this.gridMain.config();
    const fields = cfg.currentFields;

    let totalWidth = 0;

    for (const field of fields) {
      totalWidth += field.$width ?? field.width;
    }

    return totalWidth;
  }

  /**
   * 그리드의 전체 필드 넓이와 사용 가능한 영역을 비교하여
   * 가로 스크롤 활성화 여부를 결정합니다.
   *
   * @param fieldTotalWidth 모든 필드의 총 넓이
   */
  public calculateHorizontalScroll(fieldTotalWidth: number): void {
    const cfg = this.gridMain.config();
    const { scroll } = cfg;

    if (cfg.disableHorizontalScroll === true) {
      scroll.enableHorizontal = false;

      return;
    }

    const availableWidth = gridAvailableWidth(cfg);

    scroll.enableHorizontal = fieldTotalWidth > availableWidth;
  }

  /**
   * 각 필드의 최종 width를 계산하고
   * 좌/중앙/우측 패널별 width 및 레이아웃 치수를 계산합니다.
   *
   * @param fields 현재 그리드 필드
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   * @param isHeaderResize 헤더 resize 여부
   */
  public distributeWidths(
    fields: FieldItem[],
    fieldTotalWidth: number,
    verticalScrollWidth: number,
    isHeaderResize: boolean,
  ): void {
    const cfg = this.gridMain.config();
    const dimensions = cfg.dimensions;

    if (cfg.disableHorizontalScroll === true) {
      this.normalizeDisabledHorizontalWidths();

      this.calculatePanelWidths(fields, verticalScrollWidth);

      return;
    }

    //  width 계산
    const adjustedFieldWidths = this.calculateDisabledHorizontalFieldWidths(
      fields,
      fieldTotalWidth,
      dimensions.width - verticalScrollWidth,
      isHeaderResize,
    );

    const { remainderWidth, lastSpaceW, isAddSpaceWidth } = this.calculateFieldSpace(
      fieldTotalWidth,
      verticalScrollWidth,
    );

    let remainSpaceWidth = lastSpaceW;

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];

      if (field.$isAside) {
        field.$width = isHeaderResize ? field.$width : field.width;

        continue;
      }

      let fieldWidth = isHeaderResize ? field.$width : field.width;

      //가로 스크롤 비활성화
      if (cfg.disableHorizontalScroll && adjustedFieldWidths) {
        const adjustedWidth = adjustedFieldWidths.get(field);

        if (!isUndefined(adjustedWidth)) {
          fieldWidth = adjustedWidth;
        }
      } else if (!isHeaderResize && this.opts.enableWidthFixed !== true) {
        fieldWidth += remainderWidth;

        if (remainSpaceWidth > 0) {
          const addSpaceW = Math.min(remainSpaceWidth, 1);

          fieldWidth += (isAddSpaceWidth ? 1 : -1) * addSpaceW;

          remainSpaceWidth -= addSpaceW;
        }

        if (this.cellMinWidth !== -1) {
          fieldWidth = Math.max(fieldWidth, this.cellMinWidth);
        }
      }

      field.$width = fieldWidth;
    }

    this.calculatePanelWidths(fields, verticalScrollWidth);
  }

  /**
   * 좌/중앙/우측 패널 width 및 layout 치수를 계산합니다.
   *
   * @private
   */
  private calculatePanelWidths(fields: FieldItem[], verticalScrollWidth: number): void {
    const cfg = this.gridMain.config();
    const dimensions = cfg.dimensions;

    let leftWidth = 0;
    let centerWidth = 0;
    let rightWidth = 0;

    for (const field of fields) {
      const width = field.$width ?? field.width;

      if (field.$panel === 'left') {
        leftWidth += width;
      } else if (field.$panel === 'right') {
        rightWidth += width;
      } else {
        centerWidth += width;
      }
    }

    dimensions.mainLeftWidth = leftWidth;
    dimensions.mainCenterWidth = centerWidth;
    dimensions.mainRightWidth = rightWidth;
    dimensions.mainTotalWidth = leftWidth + centerWidth + rightWidth;

    // 내부 그리드 크기
    dimensions.mainInsideWidth = dimensions.width - verticalScrollWidth;
    dimensions.mainCenterOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth;
    dimensions.mainCenterViewWidth = dimensions.mainInsideWidth - (leftWidth + rightWidth);
  }

  /**
   * 가로 스크롤이 비활성화된 상태에서
   * 필드 width를 조절합니다.
   *
   * @param fields 전체 필드 목록
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param availableWidth 사용 가능한 총 width
   * @param isHeaderResize 헤더 resize 여부
   * @returns 조절된 필드별 width map
   */
  private calculateDisabledHorizontalFieldWidths(
    fields: FieldItem[],
    fieldTotalWidth: number,
    availableWidth: number,
    isHeaderResize: boolean,
  ): Map<FieldItem, number> | undefined {
    const cfg = this.gridMain.config();

    if (cfg.disableHorizontalScroll !== true || isHeaderResize) {
      return undefined;
    }

    const result = new Map<FieldItem, number>();

    const resizeFields: FieldItem[] = [];

    for (const field of fields) {
      if (field.$isAside || this.opts.enableWidthFixed === true) {
        continue;
      }

      resizeFields.push(field);

      result.set(field, field.width);
    }

    if (resizeFields.length === 0) {
      return result;
    }

    const diff = availableWidth - fieldTotalWidth;

    if (diff === 0) {
      return result;
    }

    //공간이 남으면 확장
    if (diff > 0) {
      let remainWidth = diff;

      const fieldCount = resizeFields.length;

      const baseWidth = Math.floor(remainWidth / fieldCount);

      if (baseWidth > 0) {
        for (const field of resizeFields) {
          result.set(field, (result.get(field) ?? field.width) + baseWidth);
        }

        remainWidth -= baseWidth * fieldCount;
      }

      for (let i = 0; i < resizeFields.length && remainWidth > 0; i++) {
        const field = resizeFields[i];

        result.set(field, (result.get(field) ?? field.width) + 1);

        remainWidth--;
      }

      return result;
    }

    //공간이 부족하면 최소 width 유지하며 축소
    let remainWidth = Math.abs(diff);

    while (remainWidth > 0) {
      const shrinkableFields = resizeFields.filter(
        (field) => (result.get(field) ?? field.width) > this.getMinimumWidth(),
      );

      if (shrinkableFields.length === 0) {
        break;
      }

      const shrinkPerField = Math.max(1, Math.floor(remainWidth / shrinkableFields.length));

      for (const field of shrinkableFields) {
        if (remainWidth <= 0) {
          break;
        }

        const currentWidth = result.get(field) ?? field.width;

        const maxShrink = currentWidth - this.getMinimumWidth();

        const actualShrink = Math.min(maxShrink, shrinkPerField, remainWidth);

        if (actualShrink <= 0) {
          continue;
        }

        result.set(field, currentWidth - actualShrink);

        remainWidth -= actualShrink;
      }
    }

    return result;
  }

  /**
   * 현재 설정된 최소 width를 반환합니다.
   *
   * minWidth === -1이면 최소 제한을 사용하지 않으므로
   * 0을 반환합니다.
   *
   * @private
   */
  private getMinimumWidth(): number {
    return this.cellMinWidth === -1 ? 0 : this.cellMinWidth;
  }

  /**
   * 그리드 영역 대비 필드들이 차지하고
   * 남거나 부족한 공간을 계산합니다.
   *
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   */
  private calculateFieldSpace(
    fieldTotalWidth: number,
    verticalScrollWidth: number,
  ): {
    remainderWidth: number;
    lastSpaceW: number;
    isAddSpaceWidth: boolean;
  } {
    const cfg = this.gridMain.config();

    const { dimensions, dataInfo, currentFields: fields, scroll } = cfg;

    let remainderWidth = 0;
    let lastSpaceW = 0;
    let isAddSpaceWidth = true;

    if (cfg.disableHorizontalScroll === true || scroll.enableHorizontal) {
      return {
        remainderWidth,
        lastSpaceW,
        isAddSpaceWidth,
      };
    }

    const viewGridWidth = fieldTotalWidth + verticalScrollWidth;

    const overWidth = dimensions.width - viewGridWidth;

    const resizeFieldCount = fields.length - dataInfo.asideLength;

    if (resizeFieldCount <= 0) {
      return {
        remainderWidth,
        lastSpaceW,
        isAddSpaceWidth,
      };
    }

    const absOverWidth = Math.abs(overWidth);

    remainderWidth = Math.floor(absOverWidth / resizeFieldCount);

    lastSpaceW = absOverWidth - remainderWidth * resizeFieldCount;

    if (overWidth < 0) {
      isAddSpaceWidth = false;
      remainderWidth = -remainderWidth;
    }

    return {
      remainderWidth,
      lastSpaceW,
      isAddSpaceWidth,
    };
  }
}
