import { POSITION_TYPE } from '@/constants';
import { OptionCallback } from './Common';
import { EditRendererInfo } from './RendererInfo';
import { ToolBarRenderer } from '@/renderer/ToolBarRenderer';

/**
 * ToolBar item info
 *
 * @interface ToolBarItem
 * @typedef {ToolRowItem}
 */
export interface ToolbarLayout {
  position: POSITION_TYPE;
  children: ToolbarFieldItem[];
  height?: number;
  width?: number;
}

export interface ToolbarFieldItem {
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
  width: string | number;

  /**
   * add class
   */
  styleClass?: OptionCallback | string;

  /**
   * render type
   */
  renderer: EditRendererInfo;
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;

  click?: OptionCallback;

  search?: OptionCallback;

  /**
   * field unique id
   */
  $uid: string;

  $renderer: ToolBarRenderer;

  $width: number;
}
