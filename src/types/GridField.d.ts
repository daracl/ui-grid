import { FieldItem } from "@t/GridField";
import { RENDERER_TYPE, REGEXP_TYPE, TEXT_ALIGN_TYPE, FIELD_POSITION, VIEW_RENDER_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import { RendererInfo } from "./RendererInfo";
import AbstractRenderer from "src/renderer/AbstractRenderer";

/**
 * Field info
 *
 * @export
 * @interface FieldItem
 * @typedef {FieldItem}
 */
export interface FieldItem {
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
  width: number;
  /**
   * 화면 표현여부
   */
  hidden: boolean;
  /**
   * 정렬 여부
   */
  sort: boolean;
  /**
   * 글자 정렬
   */
  align: TEXT_ALIGN_TYPE;
  /**
   * value type
   */
  dataType: string;
  /**
   * RENDER_TYPE
   */
  renderer: RendererInfo;
  /**
   * 포멧터
   */
  formatter?: OptionCallback;
  /**
   * add item default value
   */
  defaultValue: string;
  /**
   * cell click event
   */
  click?: OptionCallback;
  /**
   * cell add class
   */
  styleClass?: OptionCallback;
  /**
   * tooltip 설정
   */
  tooltip?: {
    /**
     * 툴팁 보일지 여부.
     */
    show: boolean;
    /**
     * 툴팁 내용
     */
    formatter?: OptionCallback;
  };
  /**
   * 자식 컬럼 정보
   */
  children?: FieldItem[];

  /**
   * 실제 랜더러
   */
  $renderer: AbstractRenderer;

  /**
   * colspan number
   */
  $colspan: number;

  /**
   * row span count
   */
  $rowspan: number;

  /**
   * depth
   */
  $depth: number;

  /**
   * leaf node 여부
   */
  $isLeaf: boolean;

  /**
   * child length
   */
  $childLength: number;

  /**
   * resize idx
   */
  $resizeIdx: number;

  /**
   * grid max width
   */
  $maxWidth: number;

  /**
   * align style
   */
  $alignStyle: string;
}
