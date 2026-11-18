import { FieldItem } from '../../../types/GridField.js';
import { HorizontalRegion } from '../../../constants.js';
import { BodyContext } from './BodyContext';
/**
 * Body의 table / row DOM template 생성
 */
export declare class BodyTemplate {
    private readonly context;
    /**
     * Body Context
     *
     * @param context Body Context
     */
    constructor(context: BodyContext);
    /**
     * Body 영역별 table template 생성
     */
    create(): void;
    /**
     * HTML table template 생성
     *
     * @param type Horizontal 영역
     */
    createTemplate(type: HorizontalRegion): string;
    /**
     * 가상화된 Row DOM 생성
     *
     * @param viewRow 시작 View Row
     * @param rowTemplateCount Row Template 개수
     * @param rowHeight Row 높이
     * @param fields Field 목록
     * @param startCol 시작 Column Index
     */
    rowTemplate(viewRow: number, rowTemplateCount: number, rowHeight: number, fields: FieldItem[], startCol: number): DocumentFragment;
    /**
     * Field별 정적 Template 정보 생성
     *
     * @param fields Field 목록
     * @param startCol 시작 Column Index
     */
    private createFieldTemplates;
}
