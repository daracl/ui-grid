import { RowId } from '../../../types/Common.js';
import { GridMain } from '../../GridMain.js';
/**
 * Grid Body
 *
 * Body의 기능을 역할별 Manager에 위임
 */
export declare class Body {
    private gridMain;
    /** Body 상태 및 DOM 관리 */
    private readonly context;
    /** Body Template 관리 */
    private readonly templateManager;
    /** Cell 관리 */
    private readonly cellManager;
    /** Body 렌더링 관리 */
    private readonly renderer;
    /** Row 선택 및 체크 관리 */
    private readonly selectionManager;
    /** Body 이벤트 관리 */
    private readonly bodyEvent;
    /**
     * Body 생성
     *
     * @param gridMain GridMain
     */
    constructor(gridMain: GridMain);
    /** Body 초기화 */
    init(): void;
    /** Body Element 반환 */
    getBodyElement(): import("../../../element/DaraElement").DaraElement;
    /** Body Cell Element 반환 */
    getBodyCellElements(): Record<string, HTMLElement[][]>;
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
     * @param rowIds Row ID 목록
     * @param checked 체크 여부
     */
    setItemsChecked(rowIds: RowId[], checked: boolean): void;
    /**
     * Row 체크 상태 추가
     *
     * @param rowId Row ID
     * @param checked 체크 여부
     */
    addItemChecked(rowId: RowId, checked: boolean): void;
    /**
     * 필드값으로 Row 체크 상태 설정
     *
     * @param name 필드명
     * @param values 필드값
     */
    setCheckedItemByValue(name: string, values: any): void;
    /**
     * 필드값으로 Row 체크 추가
     *
     * @param name 필드명
     * @param values 필드값
     */
    addCheckedItemByValue(name: string, values: any): void;
    /**
     * 필드값으로 Row 체크 해제
     *
     * @param name 필드명
     * @param values 필드값
     */
    unCheckedItemByValue(name: string, values: any): void;
    /**
     * Field 다시 렌더링
     *
     * @param fieldName Field명
     */
    setFieldRefresh(fieldName: string): void;
    /**
     * Center Element Style 설정
     *
     * @param styleCss CSS Style
     */
    setCenterElementStyle(styleCss: any): void;
    /**
     * Row Anchor Cell 갱신
     */
    selectRowAnchorCell(): void;
    /**
     * 선택 데이터 복사
     */
    copyData(): void;
    /** 시작 Cell Element 반환 */
    getStartCellElement(): HTMLElement;
    /**
     * Grid 영역 너비 설정
     *
     * @param mainLeftWidth Left 영역 너비
     * @param mainCenterWidth Center 영역 너비
     * @param mainRightWidth Right 영역 너비
     */
    setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number): void;
    /**
     * Body 데이터 렌더링
     *
     * @param mode 렌더링 모드
     */
    dataDraw(mode?: string): void;
    /**
     * Search Highlight 제거
     *
     */
    clearSearchHighlight(): void;
    /**
     * Body 리소스 정리
     */
    destroy(): void;
}
