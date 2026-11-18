import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../GridMain';
import { RendererFactory } from './RendererFactory';
export declare class FieldBuilder {
    private readonly opts;
    private readonly gridMain;
    private readonly rendererFactory;
    private readonly cellMinWidth;
    private readonly enabledViewAllLabel;
    constructor(opts: GridOptions, gridMain: GridMain, rendererFactory: RendererFactory);
    buildFields(): void;
    /**
     * aside 옵션
     *
     * @param opts 옵션
     * @returns
     */
    private buildAsideFields;
    private buildFieldGroup;
    private initFieldMeta;
}
