import { POSITION_TYPE, TOOLBAR_RENDERER_TYPE } from '@/constants';
import { OptionCallback } from './Common';
import { RendererInfo } from './RendererInfo';

/**
 * ToolBar item info
 *
 * @interface ToolBarItem
 * @typedef {ToolRowItem}
 */
export interface ToolbarLayout {
  position: POSITION_TYPE;
  children: ToolbarCellItem[];
  height?: number;
  width?: number;
}

export interface ToolbarCellItem {
  placeholder?: string;
  defaultValue?: string;
  gap?: number | number[];

  /**
   * 구분선 추가 여부
   */
  divider?: true;
  /**
   * item name
   */
  name: string;
  /**
   * label
   */
  label?: string;
  /**
   * 값 width
   */
  width?: string;

  /**
   * render type
   */
  renderer?: TOOLBAR_RENDERER_TYPE;
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;
}
