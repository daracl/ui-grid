import { FieldItem } from '../../types/GridField.js';
import { GridMain } from '../GridMain';
export declare class RendererFactory {
    private readonly gridMain;
    constructor(gridMain: GridMain);
    /**
     * field renderer 생성
     *
     * @param {FieldItem} field field 정보
     * @returns {FieldItem} renderer 정보가 추가된 field
     */
    createRenderer(field: FieldItem): FieldItem;
    private getViewRenderer;
    private getEditRenderer;
}
