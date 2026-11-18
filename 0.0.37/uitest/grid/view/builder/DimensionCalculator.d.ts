import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../GridMain';
import { FieldWidthCalculator } from './FieldWidthCalculator';
/**
 * 그리드 dimension 계산
 */
export declare class DimensionCalculator {
    private readonly opts;
    private readonly gridMain;
    private readonly fieldWidthCalculator;
    /**
     * DimensionCalculator 생성
     *
     * @param opts 그리드 옵션
     * @param gridMain 그리드 메인
     * @param fieldWidthCalculator 필드 width 계산기
     */
    constructor(opts: GridOptions, gridMain: GridMain, fieldWidthCalculator: FieldWidthCalculator);
    /**
     * 그리드 dimension 계산
     */
    calcGridDimension(): void;
    /**
     * Body layout 계산
     *
     * @param width 그리드 width
     * @param height 그리드 height
     */
    calculateBodyLayout(width: number, height: number): void;
    /**
     * Toolbar height 계산
     */
    private calculateToolbarDimension;
    /**
     * Footer height 계산
     */
    private calculateFooterDimension;
    /**
     * Summary height 계산
     */
    private calculateSummaryDimension;
    /**
     * Line Number width 계산
     */
    private adjustLineNumberWidth;
}
