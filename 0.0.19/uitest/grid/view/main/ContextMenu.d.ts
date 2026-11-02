import { ContextMenuItem } from '../../types/ContenxtMenu.js';
import { GridMain } from '../GridMain';
/**
 * Body class
 *
 * @class ContextMenu
 * @typedef {ContextMenu}
 */
export declare class ContextMenu {
    private readonly gridMain;
    private readonly contextOpts;
    private contextElement;
    private _isActive;
    private readonly contextData;
    private exportBusy;
    constructor(gridMain: GridMain);
    init(): void;
    /** 숨김 컨테이너에 붙여 둔 메뉴 요소를 제거한다. */
    destroy(): void;
    create(): void;
    private initEvent;
    private initItemClickEvent;
    /** 키 전용 설정에 기본 라벨·콜백을 채워 기존 메뉴 실행 경로에 전달한다. */
    private createItems;
    private initSubmenuEvent;
    /**
     * change header label
     *
     * @public
     * @param {string} label header label
     */
    changeHeader(label: string): void;
    /**
     * html template
     *
     * @public
     @param {string} id menu id
     @param {number} depth menu depth
     * @returns {string} template string
     */
    template(data: ContextMenuItem[], id: string, depth: number): string;
}
