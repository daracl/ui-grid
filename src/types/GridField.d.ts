import { FieldItem } from "@t/GridField";
import { TEXT_ALIGN_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import { EditRendererInfo, RendererInfo } from "./RendererInfo";
import ViewRenderer from "src/renderer/ViewRenderer";
import EditRenderer from "src/renderer/EditRenderer";

/**
 * Field info
 *
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
   * colspan
   */
  colspan: number;
  /**
   * rowspan
   */
  rowspan: number;
  /**
   * 화면 표현여부
   */
  hidden: boolean;
  /**
   * 수정 가능 여부
   */
  editable: boolean;
  /**
   * 정렬 여부
   */
  sort: boolean;
  /**
   * 글자 정렬
   */
  align: TEXT_ALIGN_TYPE;
  /**
   * renderer info
   */
  renderer: RendererInfo;
  /**
   * edit renderer info
   */
  editRenderer?: EditRendererInfo;
  /**
   * 포멧터
   */
  formatter?: OptionCallback;
  /**
   * add item default value
   */
  defaultValue: string;
  /**
   * cell add class
   */
  styleClass?: OptionCallback | string;
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
  $renderer: ViewRenderer;

  /**
   * edit renderer
   *
   */
  $editRenderer: EditRenderer;

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
   * view cell width
   */
  $width: number;

  /**
   * align style
   */
  $alignStyle: string;

  /**
   * panel position
   */
  $isAside: boolean;

  /**
   *panel
   */
  $panel: "left" | "center" | "right";

  /**
   * field unique id
   */
  $uid: string;

  /**
   * column seq
   */
  $colSeq: number;
}
