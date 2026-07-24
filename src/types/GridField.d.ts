import { TextAlignType, WhiteSpaceType } from '@/constantStyles';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { CellRenderer } from '@/renderer/CellRenderer';
import { FieldItem } from '@t/GridField';
import { DisplayFormatOptions, OptionCallback } from './Common';
import { EditRendererInfo, ViewRendererInfo } from './RendererInfo';

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
   * value callback;
   */
  getValue?: OptionCallback;
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
  align: TextAlignType;

  /**
   * word warp
   */
  whiteSpace?: WhiteSpaceType;
  /**
   * renderer info
   */
  renderer: ViewRendererInfo;
  /**
   * edit renderer info
   */
  editRenderer: EditRendererInfo;
  /**
   * 포멧터
   */
  displayFormat?: DisplayFormatOptions;
  /**
   * add item default value
   */
  defaultValue: string;
  /**
   * cell add class
   */
  cellClass?: OptionCallback | string;

  /**
   * tooltip 설정
   */
  tooltip?: {
    /**
     * 툴팁 보일지 여부.
     */
    enabled: boolean;
    /**
     * 툴팁 내용
     */
    content?: OptionCallback;
  };
  /**
   * header help 설정
   */
  headerHelp: string | OptionCallback | undefined;
  /**
   * 자식 컬럼 정보
   */
  children?: FieldItem[];

  /**
   * 실제 랜더러
   */
  $renderer: CellRenderer;

  /**
   * edit renderer
   *
   */
  $editRenderer: EditCellRenderer;

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
  $panel: 'left' | 'center' | 'right';

  /**
   * field unique id
   */
  $uid: string;

  /**
   * column seq
   */
  $colSeq: number;

  /**
   * enable help button
   */
  $enableHelp: boolean;
}
