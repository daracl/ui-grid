import { POSITION_TYPE } from '@/constants';
import { OptionCallback } from './Common';
import { EditRendererInfo } from './RendererInfo';

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
  width?: string;

  /**
   * render type
   */
  editRenderer: EditRendererInfo;
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;

  click?: OptionCallback;

  /**
   * field unique id
   */
  $uid: string;
}
