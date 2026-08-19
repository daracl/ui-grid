import { FieldItem } from '@/types/GridField';
import { GridOptions } from '@/types/GridOptions';
import { gridAvailableWidth } from '@/util/gridUtils';

import { GridMain } from '../GridMain';

export class FieldWidthCalculator {
  private readonly cellMinWidth: number;

  constructor(private readonly opts: GridOptions, private readonly gridMain: GridMain) {
    this.cellMinWidth = opts.header.resize.minWidth;
  }

  /**
   * 컬럼 width 변경
   *
   * disableHorizontalScroll이 true인 경우
   * isHeaderResize 여부와 관계없이 항상
   * dimensions.width에 맞게 전체 컬럼을 재분배
   *
   * @public
   * @param idx column index
   * @param w column width
   */
  public setColumnWidth(idx: number, w: number): void {
    const cfg = this.gridMain.config();
    const field = cfg.currentFields[idx];

    if (!field) return;

    cfg.isHeaderResize = true;

    const { maxWidth } = this.gridMain.options().header.resize;
    let targetWidth = w;

    if (this.cellMinWidth !== -1) {
      targetWidth = Math.max(targetWidth, this.cellMinWidth);
    }
    if (maxWidth !== -1) {
      targetWidth = Math.min(targetWidth, maxWidth);
    }

    const oldWidth = field.$width ?? field.width;
    if (targetWidth === oldWidth) return;

    field.$width = targetWidth;

    if (cfg.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths();
    }

    this.gridMain.resizeDraw();
  }

  /**
   * disableHorizontalScroll 상태에서
   * 전체 일반 컬럼의 width를 dimensions.width에 맞게 설정
   *
   * @private
   */
  private normalizeDisabledHorizontalWidths(): void {
    const cfg = this.gridMain.config();
    const { dimensions, currentFields: fields } = cfg;

    if (dimensions.width <= 0 || fields.length === 0) return;

    // 필드가 실제로 사용할 수 있는 영역
    const targetWidth = gridAvailableWidth(cfg);
    if (targetWidth <= 0) return;

    // 필드의 최소 width 일괄 보정
    this.ensureAllMinimumWidths(fields);

    let asideWidth = 0;
    let currentNormalWidth = 0;
    const normalFields: FieldItem[] = [];

    for (const field of fields) {
      const w = field.$width ?? field.width;

      if (field.$isAside) {
        field.$width = w;
        asideWidth += w;
      } else {
        normalFields.push(field);
        currentNormalWidth += w;
      }
    }

    if (normalFields.length === 0) return;

    const availableWidth = targetWidth - asideWidth;
    if (availableWidth <= 0) return;

    const diff = availableWidth - currentNormalWidth;

    if (diff > 0) {
      this.expandFields(normalFields, diff);
    } else if (diff < 0) {
      this.shrinkFields(normalFields, -diff); // 절대값(Math.abs) 대신 부호 반전 사용
    }
  }

  /**
   * 컬럼 minWidth 체크
   *
   * @private
   * @param fields 컬럼 목록
   */
  private ensureAllMinimumWidths(fields: FieldItem[]): void {
    const minWidth = this.cellMinWidth;
    if (minWidth === -1) return; // 제한이 없으면 루프를 돌 필요 없음 (최적화)

    for (const field of fields) {
      field.$width = Math.max(field.$width ?? field.width, minWidth);
    }
  }

  /**
   * 컬럼의 width를 축소
   *
   * @private
   * @param fields width를 줄일 컬럼 목록
   * @param amount 줄여야 하는 전체 width
   */
  private shrinkFields(fields: FieldItem[], amount: number): void {
    if (amount <= 0 || fields.length === 0) return;

    this.ensureAllMinimumWidths(fields);

    // width가 큰 컬럼부터 처리하기 위해 정렬
    const sortedFields = [...fields].sort((a, b) => (b.$width ?? b.width) - (a.$width ?? a.width));

    const minWidth = this.cellMinWidth;
    const totalShrinkableWidth = sortedFields.reduce(
      (acc, field) => acc + Math.max(0, (field.$width ?? field.width) - minWidth),
      0,
    );

    let remainWidth = Math.min(amount, totalShrinkableWidth);
    if (remainWidth <= 0) return;

    // 분배
    while (remainWidth > 0) {
      const shrinkableFields = sortedFields.filter((f) => (f.$width ?? f.width) > minWidth);
      if (shrinkableFields.length === 0) break;

      const shrinkPerField = Math.max(1, Math.floor(remainWidth / shrinkableFields.length));

      for (const field of shrinkableFields) {
        if (remainWidth <= 0) break;

        const currentWidth = field.$width ?? field.width;
        const actualShrink = Math.min(currentWidth - minWidth, shrinkPerField, remainWidth);

        if (actualShrink > 0) {
          field.$width = currentWidth - actualShrink;
          remainWidth -= actualShrink;
        }
      }
    }
  }

  /**
   * 컬럼의 width를 증가
   *
   * @private
   * @param fields width를 증가시킬 컬럼 목록
   * @param amount 증가시켜야 하는 전체 width
   */
  private expandFields(fields: FieldItem[], amount: number): void {
    if (amount <= 0 || fields.length === 0) return;

    this.ensureAllMinimumWidths(fields);

    const count = fields.length;
    const baseWidth = Math.floor(amount / count);
    const remainder = amount % count; // 남은 폭 (소수점 버림 오차)

    // 이중 루프(baseWidth 증가 + 남은 1px씩 증가)를 단일 루프로 통합
    for (let i = 0; i < count; i++) {
      const field = fields[i];
      field.$width = (field.$width ?? field.width) + baseWidth + (i < remainder ? 1 : 0);
    }
  }

  /**
   * 가로 스크롤 활성화 여부 체크
   *
   * @param fieldTotalWidth 모든 필드의 총 넓이
   */
  public calculateHorizontalScroll(fieldTotalWidth: number): void {
    const cfg = this.gridMain.config();

    if (cfg.disableHorizontalScroll) {
      cfg.scroll.enableHorizontal = false;
      return;
    }

    const availableWidth = gridAvailableWidth(cfg);
    cfg.scroll.enableHorizontal = fieldTotalWidth > availableWidth;
  }

  /**
   * 각 필드의 최종 width를 계산하고
   * 좌/중앙/우측 패널별 width 및 레이아웃 치수를 계산
   *
   * @param fields 현재 그리드 필드
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   * @param isHeaderResize 헤더 resize 여부
   */
  public distributeWidths(fields: FieldItem[], fieldTotalWidth: number, isHeaderResize: boolean): void {
    const cfg = this.gridMain.config();

    const availableWidth = gridAvailableWidth(cfg);

    if (cfg.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths();
      this.calculatePanelWidths(fields, availableWidth);
      return;
    }

    const { remainderWidth, lastSpaceW, isAddSpaceWidth } = this.calculateFieldSpace(fieldTotalWidth, availableWidth);

    let remainSpaceWidth = lastSpaceW;

    for (const field of fields) {
      if (field.$isAside) {
        field.$width = isHeaderResize ? field.$width : field.width;
        continue;
      }

      let fieldWidth = isHeaderResize ? field.$width : field.width;

      if (!isHeaderResize && !this.opts.enableWidthFixed) {
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

    this.calculatePanelWidths(fields, availableWidth);
  }

  /**
   * 좌/중앙/우측 패널 width 및 layout 치수를 계산
   *
   * @private
   */
  private calculatePanelWidths(fields: FieldItem[], availableWidth: number): void {
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
    dimensions.mainInsideWidth = availableWidth;
    dimensions.mainCenterOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth;
    dimensions.mainCenterViewWidth = dimensions.mainInsideWidth - (leftWidth + rightWidth);
  }

  /**
   * 컬럼의 여분 넓이를 계산
   *
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   */
  private calculateFieldSpace(
    fieldTotalWidth: number,
    availableWidth: number,
  ): { remainderWidth: number; lastSpaceW: number; isAddSpaceWidth: boolean } {
    const cfg = this.gridMain.config();
    const { dataInfo, currentFields: fields, scroll } = cfg;

    if (cfg.disableHorizontalScroll || scroll.enableHorizontal) {
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: true };
    }

    const resizeFieldCount = fields.length - dataInfo.asideLength;
    if (resizeFieldCount <= 0) {
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: true };
    }

    const overWidth = availableWidth - fieldTotalWidth;

    const absOverWidth = Math.abs(overWidth);

    // 몫과 나머지를 활용하여 분배 연산 최적화
    return {
      remainderWidth: (overWidth < 0 ? -1 : 1) * Math.floor(absOverWidth / resizeFieldCount),
      lastSpaceW: absOverWidth % resizeFieldCount, // 곱셈/뺄셈 대신 나머지 연산(%) 활용
      isAddSpaceWidth: overWidth >= 0,
    };
  }
}
