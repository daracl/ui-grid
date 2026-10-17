import { OptionCallback } from './Common';
import type { ExportFileOptions } from '@/export/exportGridFile';

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
  enabledHeader: boolean;
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
   * 항목 키. copy는 선택 영역 복사, exportFile의 하위 excel(xlsx)·csv·pdf·json은 파일 다운로드.
   *
   * @type {?string}
   */
  key?: string;
  /** exportFile 부모 또는 형식별 하위 항목의 다운로드 옵션. 하위 항목이 우선한다. */
  exportOptions?: ExportFileOptions;
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
  label?: string;
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
