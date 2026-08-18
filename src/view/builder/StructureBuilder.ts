import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '../GridMain';
import { DimensionCalculator } from './DimensionCalculator';
import { FieldBuilder } from './FieldBuilder';
import { FieldWidthCalculator } from './FieldWidthCalculator';
import { RendererFactory } from './RendererFactory';

export class StructureBuilder {
  private dimensionCalculator: DimensionCalculator;
  private fieldBuilder: FieldBuilder;
  private fieldWidthCalculator: FieldWidthCalculator;
  private rendererFactory: RendererFactory;

  constructor(private readonly opts: GridOptions, private readonly gridMain: GridMain) {
    this.rendererFactory = new RendererFactory(gridMain);
    this.fieldWidthCalculator = new FieldWidthCalculator(opts, gridMain);
    this.dimensionCalculator = new DimensionCalculator(opts, gridMain, this.fieldWidthCalculator);
    this.fieldBuilder = new FieldBuilder(opts, gridMain, this.rendererFactory);
  }

  /**
   * 사이즈 계산 후
   */
  public calcGridDimension() {
    this.dimensionCalculator.calcGridDimension();
  }

  /**
   * body layout 계산
   *
   * @param {number} width 너비
   * @param {number} height 높이
   * @returns {void}
   */
  public calculateBodyLayout(width: number, height: number) {
    this.dimensionCalculator.calculateBodyLayout(width, height);
  }

  /**
   * field 구조 생성
   *
   * @returns {void}
   */
  public buildFields() {
    this.fieldBuilder.buildFields();
  }

  /**
   * 특정 컬럼의 너비를 조절;
   *
   * @public
   * @param {number} idx 컬럼 인덱스
   * @param {number} w 컬럼 너비
   */
  public setColumnWidth(idx: number, w: number) {
    this.fieldWidthCalculator.setColumnWidth(idx, w);
  }
}
