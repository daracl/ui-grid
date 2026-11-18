import { ViewCellRenderer } from '../renderer/ViewCellRenderer.js';
import { Config } from '../types/GridConfig.js';
/**
 * click event
 * @param cfg config
 * @param contentElement cell element
 * @param context renderer
 */
export declare const viewRendererClickEvent: (cfg: Config, contentElement: HTMLElement, context: ViewCellRenderer) => void;
