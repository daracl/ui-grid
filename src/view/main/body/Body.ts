import { RowId } from '@/types/Common';
import { FieldItem } from '@t/GridField';

import { GridMain } from '@/view/GridMain';
import { BodyEvent } from './event/BodyEvent';

import { BodyCell } from './BodyCell';
import { BodyContext } from './BodyContext';
import { BodyRenderer } from './BodyRenderer';
import { BodySelection } from './BodySelection';
import { BodyTemplate } from './BodyTemplate';

/**
 * Grid Body
 *
 * Body의 기능을 역할별 Manager에 위임
 */
export class Body {
  /** Body 상태 및 DOM 관리 */
  private readonly context: BodyContext;

  /** Body Template 관리 */
  private readonly templateManager: BodyTemplate;

  /** Cell 관리 */
  private readonly cellManager: BodyCell;

  /** Body 렌더링 관리 */
  private readonly renderer: BodyRenderer;

  /** Row 선택 및 체크 관리 */
  private readonly selectionManager: BodySelection;

  /** Body 이벤트 관리 */
  private readonly bodyEvent: BodyEvent;

  /**
   * Body 생성
   *
   * @param gridMain GridMain
   */
  constructor(private gridMain: GridMain) {
    this.context = new BodyContext(gridMain);

    this.templateManager = new BodyTemplate(this.context);

    this.cellManager = new BodyCell(this.context);

    this.renderer = new BodyRenderer(this.context, this.cellManager, this.templateManager);

    this.selectionManager = new BodySelection(this.context, this.renderer);

    this.templateManager.create();

    this.bodyEvent = new BodyEvent(gridMain, this, this.context.selectionInfo);
  }

  /** Body 초기화 */
  public init(): void {
    this.bodyEvent.init();
  }

  /** Body Element 반환 */
  public getBodyElement() {
    return this.context.bodyElement;
  }

  /** Body Cell Element 반환 */
  public getBodyCellElements() {
    return this.context.allCellElements;
  }

  /**
   * 체크된 항목의 필드값 반환
   *
   * @param name 필드명
   */
  public getCheckedItemByName(name: string) {
    return this.selectionManager.getCheckedItemByName(name);
  }

  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  public setAllCheckItem(checked: boolean): void {
    this.selectionManager.setAllCheckItem(checked);
  }

  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  public setItemChecked(rowId: RowId, checked: boolean): void {
    this.selectionManager.setItemChecked(rowId, checked);
  }

  /**
   * 여러 Row 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  public setItemsChecked(rowIds: RowId[], checked: boolean): void {
    this.selectionManager.setItemsChecked(rowIds, checked);
  }

  /**
   * Row 체크 상태 추가
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  public addItemChecked(rowId: RowId, checked: boolean): void {
    this.selectionManager.addItemChecked(rowId, checked);
  }

  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 필드명
   * @param values 필드값
   */
  public setCheckedItemByValue(name: string, values: any): void {
    this.selectionManager.setCheckedItemByValue(name, values);
  }

  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 필드명
   * @param values 필드값
   */
  public addCheckedItemByValue(name: string, values: any): void {
    this.selectionManager.addCheckedItemByValue(name, values);
  }

  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 필드명
   * @param values 필드값
   */
  public unCheckedItemByValue(name: string, values: any): void {
    this.selectionManager.unCheckedItemByValue(name, values);
  }

  /**
   * Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  public setFieldRefresh(fieldName: string): void {
    this.selectionManager.setFieldRefresh(fieldName);
  }

  /**
   * Center Element Style 설정
   *
   * @param styleCss CSS Style
   */
  public setCenterElementStyle(styleCss: any): void {
    this.cellManager.setCenterElementStyle(styleCss);
  }

  /**
   * Row Anchor Cell 갱신
   */
  public selectRowAnchorCell() {
    this.selectionManager.selectRowAnchorCell();
  }

  /**
   * 선택 데이터 복사
   */
  public copyData(): void {
    this.selectionManager.copyData();
  }

  /** 시작 Cell Element 반환 */
  public getStartCellElement() {
    return this.cellManager.getStartCellElement();
  }

  /**
   * Grid 영역 너비 설정
   *
   * @param mainLeftWidth Left 영역 너비
   * @param mainCenterWidth Center 영역 너비
   * @param mainRightWidth Right 영역 너비
   */
  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number): void {
    this.cellManager.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
  }

  /**
   * Body 데이터 렌더링
   *
   * @param mode 렌더링 모드
   */
  public dataDraw(mode?: string): void {
    this.renderer.dataDraw(mode);
  }

  /**
   * Search Highlight 제거
   *
   */
  public clearSearchHighlight(): void {
    this.cellManager.clearSearchHighlight();
  }

  /**
   * Body 리소스 정리
   */
  public destroy(): void {
    this.bodyEvent.destroy();
    this.renderer.destroy();
    this.selectionManager.destroy();
    this.cellManager.destroy();
    this.context.resetCellState();
  }
}
