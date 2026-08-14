import { Config } from '@t/GridConfig';

import { ToolbarOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

import { ToolbarRenderer } from './ToolbarRenderer';
import { ToolbarScroll } from './ToolbarScroll';

/**
 *
 * grid Toolbar 관리
 *
 * 실제 Toolbar 렌더링 및 레이아웃 처리는 ToolbarRenderer가 담당,
 * 스크롤 및 스크롤 화살표 처리는 ToolbarScroll 처리
 *
 * @class Toolbar
 */
export class Toolbar {
  /**
   * GridMain 인스턴스
   */
  private readonly gridMain: GridMain;

  /**
   * Grid 설정
   */
  private readonly config: Config;

  /**
   * Toolbar 옵션
   */
  private readonly toolbarOpts: ToolbarOptions;

  /**
   * Toolbar DOM Element
   */
  private toolbarElement!: HTMLElement;

  /**
   * Toolbar 렌더링 및 레이아웃을 담당하는 Renderer
   */
  private toolbarRenderer!: ToolbarRenderer;

  /**
   * Toolbar 스크롤 및 화살표 동작을 담당하는 Scroll Controller
   */
  private toolbarScroll!: ToolbarScroll;

  private toolbarEnabled = false;

  /**
   * Toolbar 생성
   *
   * @param gridMain GridMain 인스턴스
   */
  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.config = gridMain.config();
    this.toolbarOpts = gridMain.options().toolbar;
  }

  /**
   * Toolbar를 초기화
   *
   * Toolbar가 비활성화되어 있는 경우 DOM을 제거후 종료
   *
   * 초기화 순서
   *
   * 1. Toolbar DOM 설정
   * 2. ToolbarRenderer 초기화
   * 3. ToolbarScroll 초기화
   * 4. Condition Field 갱신
   */
  public init(): void {
    const toolbarDataElement = this.gridMain.element().findDaraElement('.dg-toolbar');

    // Toolbar가 비활성화된 경우 Toolbar DOM을 제거
    if (!this.toolbarOpts?.enabled) {
      toolbarDataElement.getElement().remove();
      return;
    }

    this.toolbarEnabled = true;

    toolbarDataElement.css({
      display: 'block',
      height: `${this.config.dimensions.toolbarHeight}px`,
    });

    this.toolbarElement = toolbarDataElement.getElement();

    this.toolbarRenderer = new ToolbarRenderer(this.gridMain, this.toolbarElement, this.toolbarOpts);

    this.toolbarScroll = new ToolbarScroll(this.gridMain, this.toolbarElement, this.toolbarOpts);

    this.toolbarRenderer.init();

    this.toolbarScroll.init();

    this.refreshConditionFields();
  }

  /**
   * Toolbar DOM Element를 반환
   *
   * @returns Toolbar DOM Element
   */
  public getToolbarElement(): HTMLElement {
    return this.toolbarElement;
  }

  /**
   * Toolbar Field의 값을 설정
   *
   * 실제 값 설정은 ToolbarRenderer에서 처리
   *
   * @param values Field 이름과 값의 객체
   */
  public setValues(values: Record<string, unknown>): void {
    this.toolbarRenderer.setValues(values);
  }

  /**
   * Toolbar Field의 현재 값을 반환
   *
   * @returns Field 이름과 값의 객체
   */
  public getValues(): Record<string, unknown> {
    return this.toolbarRenderer.getValues();
  }

  /**
   * Condition Field를 갱신
   *
   */
  public refreshConditionFields(): void {
    this.toolbarRenderer.refreshConditionFields();

    // DOM 상태가 반영된 이후 Layout을 다시 계산합니다.
    requestAnimationFrame(() => {
      this.refreshToolbarLayout();
    });
  }

  /**
   * Toolbar Layout을 계산
   */
  private refreshToolbarLayout(): void {
    this.toolbarRenderer.refreshLayout();
    this.resizeArrowVisibility();
  }

  public resizeArrowVisibility() {
    if (!this.toolbarEnabled) return;
    this.toolbarScroll.resizeArrowVisibility();
  }

  /**
   * Toolbar를 정리
   *
   * Scroll Controller에서 사용 중인 Animation Frame 및
   * 기타 리소스를 정리합니다.
   */
  public destroy(): void {
    this.toolbarScroll?.destroy();
  }
}
