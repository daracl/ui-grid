import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../GridMain';
export declare class StructureBuilder {
    private readonly opts;
    private readonly gridMain;
    private dimensionCalculator;
    private fieldBuilder;
    private fieldWidthCalculator;
    private rendererFactory;
    constructor(opts: GridOptions, gridMain: GridMain);
    /**
     * 사이즈 계산 후
     */
    calcGridDimension(): void;
    /**
     * body layout 계산
     *
     * @param {number} width 너비
     * @param {number} height 높이
     * @returns {void}
     */
    calculateBodyLayout(width: number, height: number): void;
    /**
     * field 구조 생성
     *
     * @returns {void}
     */
    buildFields(): void;
    /**
     * 특정 컬럼의 너비를 조절;
     *
     * @public
     * @param {number} idx 컬럼 인덱스
     * @param {number} w 컬럼 너비
     */
    setColumnWidth(idx: number, w: number): void;
}
