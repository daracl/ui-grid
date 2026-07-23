import { OptionCallback } from './Common';

/**
 * context menu
 *
 * @export
 * @interface ContextMenuOptions
 * @typedef {ContextMenuOptions}
 */
export interface ContextMenuOptions {
  /**
   * click before
   *
   */
  beforeActivate: OptionCallback;
  /**
   * 컨텍스트 메뉴 오픈시 disable item
   */
  disableItem: OptionCallback;
  /**
   * click callback
   */
  callback: OptionCallback;
  /**
   * context mene items
   */
  items: ContextMenuItem[];

  /**
   * enable header
   */
  enableHeader: boolean;
}

/**
 * context menu item
 *
 * @export
 * @interface ContextMenuItem
 * @typedef {ContextMenuItem}
 */
export interface ContextMenuItem {
  /**
   * context menu header
   *
   * @type {?string}
   */
  header?: string;

  /**
   * key
   *
   * @type {?string}
   */
  key?: string;
  /**
   * click disabled
   */
  disabled?: boolean;
  /**
   * hotkey
   */
  hotkey?: string;
  /**
   * context menu label
   */
  label: string;
  /**
   * checkbox
   */
  checkbox?: boolean;

  /**
   * click callback
   *
   * @type {?OptionCallback}
   */
  callback?: OptionCallback;

  /**
   * item style class
   *
   * @type {?string}
   */
  itemClass?: string | OptionCallback;

  /**
   * 구분선
   *
   * @type {?boolean}
   */
  divider?: boolean;
  /**
   * children
   *
   * @type {ContextMenuItem[]}
   */
  children?: ContextMenuItem[];
}
