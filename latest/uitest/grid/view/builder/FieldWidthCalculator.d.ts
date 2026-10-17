import { FieldItem } from '../../types/GridField.js';
import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../GridMain';
export declare class FieldWidthCalculator {
    private readonly opts;
    private readonly gridMain;
    private readonly cellMinWidth;
    constructor(opts: GridOptions, gridMain: GridMain);
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
    setColumnWidth(idx: number, w: number): void;
    /**
     * disableHorizontalScroll 상태에서
     * 전체 일반 컬럼의 width를 dimensions.width에 맞게 설정
     *
     * @private
     */
    private normalizeDisabledHorizontalWidths;
    /**
     * 컬럼 minWidth 체크
     *
     * @private
     * @param fields 컬럼 목록
     */
    private ensureAllMinimumWidths;
    /**
     * 컬럼의 width를 축소
     *
     * @private
     * @param fields width를 줄일 컬럼 목록
     * @param amount 줄여야 하는 전체 width
     */
    private shrinkFields;
    /**
     * 컬럼의 width를 증가
     *
     * @private
     * @param fields width를 증가시킬 컬럼 목록
     * @param amount 증가시켜야 하는 전체 width
     */
    private expandFields;
    /**
     * 가로 스크롤 활성화 여부 체크
     *
     * @param fieldTotalWidth 모든 필드의 총 넓이
     */
    calculateHorizontalScroll(fieldTotalWidth: number): void;
    /**
     * 각 필드의 최종 width를 계산하고
     * 좌/중앙/우측 패널별 width 및 레이아웃 치수를 계산
     *
     * @param fields 현재 그리드 필드
     * @param fieldTotalWidth 모든 필드의 총 width
     * @param verticalScrollWidth 세로 스크롤바 width
     * @param isHeaderResize 헤더 resize 여부
     */
    distributeWidths(fields: FieldItem[], fieldTotalWidth: number, isHeaderResize: boolean): void;
    /**
     * 좌/중앙/우측 패널 width 및 layout 치수를 계산
     *
     * @private
     */
    private calculatePanelWidths;
    /**
     * 컬럼의 여분 넓이를 계산
     *
     * @param fieldTotalWidth 모든 필드의 총 width
     * @param verticalScrollWidth 세로 스크롤바 width
     */
    private calculateFieldSpace;
}
