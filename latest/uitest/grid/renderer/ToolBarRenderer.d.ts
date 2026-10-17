import { OptionCallback } from '../types/Common.js';
import { ToolbarFieldItem } from '../types/Toolbar.js';
import { GridMain } from '../view/GridMain.js';
import { Config } from '../types/GridConfig.js';
/**
 *
 */
export declare abstract class ToolBarRenderer {
    protected isClick: boolean;
    protected readonly cfg: Config;
    protected field: ToolbarFieldItem;
    protected fieldName: string;
    protected gridMain: GridMain;
    protected language: import("../util/Language").Language;
    protected fieldElement: HTMLElement;
    private enabledView;
    protected readonly rendererContainer: HTMLElement;
    private validatorElement;
    private isInit;
    private beforeValue;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    /**
     * event class
     *
     * @public
     * @param {string} addClass
     * @returns {string}
     */
    getRendererClassName(addClass: string): string;
    /**
     * view render
     *
     * @public
     * @abstract
     * @param {HTMLElement} element cell element
     */
    abstract render(element: HTMLElement): void;
    afterRender(): void;
    protected textRender(element: HTMLElement, type: string): HTMLInputElement;
    initTextEvt(contentElement: HTMLInputElement): void;
    /**
     * cell click event
     * @param e click event object
     * @param eventElement  event element
     */
    click(e: Event, eventElement: HTMLElement): void;
    changeValue(newValue: any): void;
    search(e: Event): void;
    getToolbarValues(): Record<string, unknown>;
    getControlElement(fieldElement: HTMLElement): HTMLElement;
    abstract setValue(values: any): void;
    abstract getValue(): any;
    supportsEdit(): boolean;
    isEnabledView(): boolean;
    private getFieldElement;
    show(): void;
    hide(): void;
    setDisabled(disabled: boolean): void;
    refreshCondition(): void;
    protected evaluateCondition(condition: boolean | OptionCallback | undefined, defaultValue: boolean): boolean;
    private isVisible;
    private isDisabled;
}
