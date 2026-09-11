import { DEFAULT_LINE_NUMBER_WIDTH, FOOTER_HEIGHT, LINE_NUMBER_NAME, TOOLBAR_HEIGHT } from '@/constants';
import { GridOptions } from '@/types/GridOptions';
import { getTextWidth, heightOptionValue } from '@/util/gridUtils';
import { isNumber, isUndefined } from '@/util/utils';
import { GridMain } from '../GridMain';
import { FieldWidthCalculator } from './FieldWidthCalculator';

const DEFAULT_SUMMARY_HEIGHT = 28;
const SUMMARY_BORDER_MAX = 2;
const LARGE_DATA_THRESHOLD = 100000;

/**
 * 그리드 dimension 계산
 */
export class DimensionCalculator {
  /**
   * DimensionCalculator 생성
   *
   * @param opts 그리드 옵션
   * @param gridMain 그리드 메인
   * @param fieldWidthCalculator 필드 width 계산기
   */
  constructor(
    private readonly opts: GridOptions,
    private readonly gridMain: GridMain,
    private readonly fieldWidthCalculator: FieldWidthCalculator,
  ) {}

  /**
   * 그리드 dimension 계산
   */
  public calcGridDimension() {
    this.calculateToolbarDimension();
    this.calculateFooterDimension();
    this.calculateSummaryDimension();
  }

  /**
   * Body layout 계산
   *
   * @param width 그리드 width
   * @param height 그리드 height
   */
  public calculateBodyLayout(width: number, height: number) {
    const cfg = this.gridMain.config();
    const { dimensions, rowHeight, dataInfo, currentFields: fields, scroll } = cfg;

    const gridElement = this.gridMain.element();

    // 전체 컨테이너 사이즈 초기 설정
    const minHeightSize = dimensions.toolbarHeight + dimensions.footerHeight + dimensions.mainHeaderHeight + rowHeight;
    let changeHeight = height < 0 ? gridElement.height() : height;
    changeHeight = Math.max(minHeightSize, changeHeight);
    dimensions.height = changeHeight;
    dimensions.width = width < 0 ? gridElement.clientWidth() : width;

    // Line Number 너비 동적 계산
    this.adjustLineNumberWidth();

    let fieldTotalWidth = 0;
    for (const field of fields) {
      fieldTotalWidth += cfg.isHeaderResize ? field.$width : field.width;
    }

    dimensions.fieldTotalWidth = fieldTotalWidth;

    // 가로/세로 스크롤 및 레이아웃 높이 계산
    // [주의] 세로 스크롤바 생성 여부가 가로 공간에 영향을 주므로 의도된 2-Pass 계산입니다.
    this.fieldWidthCalculator.calculateHorizontalScroll(fieldTotalWidth);

    const nonMainAreaHeight =
      dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (scroll.enabledHorizontal ? cfg.scrollbarSize : 0);

    if (cfg.disableVerticalScroll) {
      scroll.enabledVertical = false;
      dimensions.mainHeight = rowHeight * dataInfo.rowLength + nonMainAreaHeight + 1;
      dimensions.mainBodyHeight = rowHeight * dataInfo.rowLength;
      dimensions.height = dimensions.mainHeight + dimensions.toolbarHeight + dimensions.footerHeight;
    } else {
      const bodyMainHeight = changeHeight - (dimensions.toolbarHeight + dimensions.footerHeight);
      dimensions.mainHeight = bodyMainHeight;
      dimensions.mainBodyHeight = bodyMainHeight - nonMainAreaHeight - 1;
      scroll.enabledVertical = rowHeight * dataInfo.rowLength > dimensions.mainBodyHeight;
    }

    // 세로 스크롤 상태가 확정된 후 가로 스크롤 재계산
    this.fieldWidthCalculator.calculateHorizontalScroll(fieldTotalWidth);

    // Row 개수 계산
    const originViewRow = dimensions.mainBodyHeight / rowHeight;
    const viewRow = Math.min(Math.max(1, Math.ceil(originViewRow)), dataInfo.rowLength);

    scroll.insideViewRow = viewRow - (viewRow > 1 && viewRow > Math.floor(originViewRow) ? 1 : 0);
    scroll.viewRow = viewRow;

    this.fieldWidthCalculator.distributeWidths(fields, fieldTotalWidth, cfg.isHeaderResize);
  }

  /**
   * Toolbar height 계산
   */
  private calculateToolbarDimension() {
    const { toolbar } = this.opts;

    if (!toolbar?.enabled || !toolbar.items?.length) return;

    const toolbarHeight = isNumber(toolbar.height) ? toolbar.height : TOOLBAR_HEIGHT;
    let totHeight = 0;

    toolbar.items.forEach((row) => {
      if (row.length > 0) {
        const rowHeight = isNumber(row[0].height) ? row[0].height : toolbarHeight;

        row[0].height = rowHeight; // [Warning] 원본 옵션 데이터를 수정하는 부수 효과 발생 중
        totHeight += rowHeight;
      }
    });

    this.gridMain.config().dimensions.toolbarHeight = totHeight;
  }

  /**
   * Footer height 계산
   */
  private calculateFooterDimension() {
    const { footer } = this.opts;

    if (footer?.enabled) {
      this.gridMain.config().dimensions.footerHeight = isNumber(footer.height) ? footer.height : FOOTER_HEIGHT;
    }
  }

  /**
   * Summary height 계산
   */
  private calculateSummaryDimension() {
    const { summary } = this.opts;

    if (!summary || !summary.items || summary.items.length === 0) return;

    const cfg = this.gridMain.config();
    const len = summary.items.length;

    const { height, heights } = heightOptionValue(summary.height, DEFAULT_SUMMARY_HEIGHT);

    cfg.summary.heights = new Array(len);

    let totalHeight = 0;

    for (let i = 0; i < len; i++) {
      let summaryHeight = heights.length > i ? heights[i] : height;

      summaryHeight = summaryHeight > 0 ? summaryHeight : height;

      totalHeight += summaryHeight;
      cfg.summary.heights[i] = summaryHeight;
    }

    // 테두리(Border) 등으로 인한 보정값 적용
    cfg.dimensions.mainSummaryHeight = totalHeight + Math.min(totalHeight, SUMMARY_BORDER_MAX);
  }

  /**
   * Line Number width 계산
   */
  private adjustLineNumberWidth(): void {
    const cfg = this.gridMain.config();
    const { dataInfo, currentFields: fields, allFieldMap } = cfg;

    const lineNumberCol = allFieldMap.get(LINE_NUMBER_NAME)?.$colSeq;
    if (isUndefined(lineNumberCol)) return;

    const numberField = fields[lineNumberCol];
    if (!numberField) return; // 방어적 코드: 필드가 실제로 존재하지 않을 경우 예외 방지

    let targetWidth: number;

    // 데이터가 많을 때 글자 폭에 맞춰 자동 리사이즈
    if (dataInfo.rowLength >= LARGE_DATA_THRESHOLD) {
      const textWidth = getTextWidth(cfg, String(dataInfo.rowLength));
      targetWidth = textWidth || (this.opts.aside.lineNumber.width ?? DEFAULT_LINE_NUMBER_WIDTH);
    } else {
      targetWidth = this.opts.aside.lineNumber.width ?? DEFAULT_LINE_NUMBER_WIDTH;
    }

    numberField.width = targetWidth;
    numberField.$width = targetWidth;
  }
}
