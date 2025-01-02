import DaraForm from "src/DaraGrid";
import { EDIT_RENDER_TYPE, REGEXP_TYPE, TEXT_ALIGN_TYPE, FIELD_POSITION, VIEW_RENDER_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import Render from "src/renderer/edit/Renderer";

/**
 * column info
 *
 * @export
 * @interface ColumnItem
 * @typedef {ColumnItem}
 */
export interface ColumnItem {
  /**
   * 컬럼명
   */
  name: string;
  /**
   * 컬럼 label
   */
  label: string;
  /**
   * 컬럼 넓이
   */
  width?: number;
  /**
   * 정렬 여부
   */
  sort?: boolean;
  /**
   * 글자 정렬
   */
  align: TEXT_ALIGN_TYPE;
  /**
   * value type
   */
  dataType: string;
  /**
   * VIEW_RENDER_TYPE
   */
  renderer: VIEW_RENDER_TYPE;
  /**
   * 포멧터
   */
  formatter: OptionCallback;
  /**
   * add item default value
   */
  defaultValue: string;
  /**
   * cell click event
   */
  click: OptionCallback;
  /**
   * cell add class
   */
  styleClass: OptionCallback;
  /**
   * tooltip 설정
   */
  tooltip: {
    /**
     * 툴팁 보일지 여부.
     */
    show: boolean;
    /**
     * 툴팁 내용
     */
    formatter: OptionCallback;
  };
  /**
   * 수정 렌더러
   */
  editRenderer?: RENDER_TYPE | string;
}

export interface ViewRender {
  /**
   * renderer type
   * @example button image checkbox radio select link html
   */
  type: text;
  item: {
    key: string;
  };
  click: OptionCallback;
  template: OptionCallback;
  validator: OptionCallback;
}
