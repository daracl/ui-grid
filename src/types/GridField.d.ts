import DaraForm from "src/DaraGrid";
import { EDIT_RENDER_TYPE ,REGEXP_TYPE, TEXT_ALIGN_TYPE, FIELD_POSITION, VIEW_RENDER_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import Render from "src/renderer/edit/Render";

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
  align: TEXT_ALIGN_TYPE
  /**
   * value type
   */
  type: string	
  /**
   * VIEW_RENDER_TYPE
   */
  viewRender :VIEW_RENDER_TYPE;
  /**
   * 포멧터
   */
  formatter : function (itemInfo){	// 보여질 값을 처리.
      
  }
  /**
   * 기본 값
   */
  defaultValue : ''	// add item default value
  click :function (item){ console.log(idx item)}		// cell click event
  styleClass : function (idx item){return 'pub-bg-private';}	// cell add class
  tooltip : {
    show : true	// 툴팁 보일지 여부.
    formatter : function (obj){	// 툴팁 내용
      return obj.val;
    }
  }
  editRenderer?: RENDER_TYPE | string;
  customOptions: any;
  label: string; // '아이디'
  style: {
    width: string | number;
    labelHide: boolean;
    labelWidth: string | number;
    customClass: string;
    valueWidth: string | number;
    position: string;
    tabAlign: string;
  };
  tooltip: string; // 툴팁 문구
  disabled?: boolean; // disabled
  description: string; // 설명
  placeholder: string; // input  textarea 문구
  orientation: ORIENTATION_TYPE; // children에 사용
  required?: boolean; //true // 필수 여부
  regexpType?: REGEXP_TYPE; // 정규식 타입
  rule: {
    // 규칙
    minLength: number; // 3
    maxLength: number; //100
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
  };
  different: {
    // field 값이 다른지 비교
    field: string;
    message: string;
  };
  identical: {
    // field 값이 같은지 비교
    field: string;
    message: string;
  };
  template: OptionCallback | string; // 필드 템플릿
  defaultValue: string; // 기본값
  listItem: ValuesInfo; // dropdown radio checkbox
  children: EditRenderer[]; // child field
  validator?: OptionCallback; // custom validator
  onChange: OptionCallback; //  입력값 변경시 체크 function
  onClick: OptionCallback; // button onclick function
  fileDownload: OptionCallback; // file download function
  renderer: Render; // custom renderer
  conditional: ConditionInfo; // 보이기 여부
  gridOptions?: {
    disableAddButton?: boolean; // renderer 그리드 타입 추가 버튼 유무
    disableRemoveButton?: boolean; // renderer 그리드 타입 추가 버튼 유무
    align?: TEXT_ALIGN_TYPE; // renderer 그리드 타입 추가 버튼 유무
    height: string; // grid 높이값
  };
  $renderType: Render; // render Type
  $instance: Render; // 실제 render
  $orgin: EditRenderer;
  $xssName: string; // xss 변경명
  $key: string; // 내부 key
  $value: string; // 내부 사용 value
  $parent: EditRenderer;
  $tabForm?: DaraForm; //tab 일경우 폼 정보
  $validName: string; //
}


export interface ViewRender{
    /**
     * renderer type
     * @example button image checkbox radio select link html 
     */
    type : text // 
    item : {
      key : string
    }
    click : function (){}
    template : function (){}
    validator : function (){}		
}