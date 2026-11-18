import { RowId } from '../../../types/Common.js';
import { BodyContext } from './BodyContext';
import { BodyRenderer } from './BodyRenderer';
/**
 * Body Row Check / Selection 관리
 */
export declare class BodySelection {
    private readonly context;
    private readonly renderer;
    /**
     * Body Selection 생성
     *
     * @param context Body Context
     * @param renderer Body Renderer
     */
    constructor(context: BodyContext, renderer: BodyRenderer);
    init(): void;
    /**
     * 체크된 항목의 필드값 반환
     *
     * @param name 필드명
     */
    getCheckedItemByName(name: string): any[];
    /**
     * 전체 Row 체크 상태 설정
     *
     * @param checked 체크 여부
     */
    setAllCheckItem(checked: boolean): void;
    /**
     * Row 체크 상태 설정
     *
     * @param rowId Row ID
     * @param checked 체크 여부
     */
    setItemChecked(rowId: RowId, checked: boolean): void;
    /**
     * 여러 Row 체크 상태 설정
     *
     * 기존 체크 상태를 초기화한 후 지정한 Row를 체크
     *
     * @param rowIds Row ID 목록
     * @param checked 체크 여부
     */
    setItemsChecked(rowIds: RowId[], checked: boolean): void;
    /**
     * Row 체크 상태 추가
     *
     * 기존 체크 상태를 유지
     *
     * @param rowId Row ID
     * @param checked 체크 여부
     */
    addItemChecked(rowId: RowId, checked: boolean): void;
    /**
     * 여러 Row의 체크 상태 설정
     *
     * @param rowIds Row ID 목록
     * @param checked 체크 여부
     */
    private addItemsChecked;
    /**
     * 지정한 Field 다시 렌더링
     *
     * @param fieldName Field명
     */
    setFieldRefresh(fieldName: string): void;
    /**
     * 필드값으로 Row 체크 상태 설정
     *
     * @param name 비교할 필드명
     * @param values 필드값 또는 필드값 목록
     */
    setCheckedItemByValue(name: string, values: any): void;
    /**
     * 필드값으로 Row 체크 추가
     *
     * @param name 비교할 필드명
     * @param values 필드값 또는 필드값 목록
     */
    addCheckedItemByValue(name: string, values: any): void;
    /**
     * 필드값으로 Row 체크 해제
     *
     * @param name 비교할 필드명
     * @param values 필드값 또는 필드값 목록
     */
    unCheckedItemByValue(name: string, values: any): void;
    /** 선택 데이터 클립보드 복사 */
    copyData(): void;
    /** Row Anchor Cell 선택 상태 갱신 */
    selectRowAnchorCell(): void;
    /** Selection 상태 정리 */
    destroy(): void;
}
