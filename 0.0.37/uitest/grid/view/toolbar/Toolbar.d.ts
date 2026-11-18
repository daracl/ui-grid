import { GridMain } from '../GridMain.js';
/**
 *
 * grid Toolbar 관리
 *
 * 실제 Toolbar 렌더링 및 레이아웃 처리는 ToolbarRenderer가 담당,
 * 스크롤 및 스크롤 화살표 처리는 ToolbarScroll 처리
 *
 * @class Toolbar
 */
export declare class Toolbar {
    /**
     * GridMain 인스턴스
     */
    private readonly gridMain;
    /**
     * Grid 설정
     */
    private readonly config;
    /**
     * Toolbar 옵션
     */
    private readonly toolbarOpts;
    /**
     * Toolbar DOM Element
     */
    private toolbarElement;
    /**
     * Toolbar 렌더링 및 레이아웃을 담당하는 Renderer
     */
    private toolbarRenderer;
    /**
     * Toolbar 스크롤 및 화살표 동작을 담당하는 Scroll Controller
     */
    private toolbarScroll;
    private toolbarEnabled;
    /**
     * Toolbar 생성
     *
     * @param gridMain GridMain 인스턴스
     */
    constructor(gridMain: GridMain);
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
    init(): void;
    /**
     * Toolbar DOM Element를 반환
     *
     * @returns Toolbar DOM Element
     */
    getToolbarElement(): HTMLElement;
    /**
     * Toolbar Field의 값을 설정
     *
     * 실제 값 설정은 ToolbarRenderer에서 처리
     *
     * @param values Field 이름과 값의 객체
     */
    setValues(values: Record<string, unknown>): void;
    /**
     * Toolbar Field의 현재 값을 반환
     *
     * @returns Field 이름과 값의 객체
     */
    getValues(): Record<string, unknown>;
    /**
     * Condition Field를 갱신
     *
     */
    refreshConditionFields(): void;
    /**
     * Toolbar Layout을 계산
     */
    private refreshToolbarLayout;
    resizeArrowVisibility(): void;
    /**
     * Toolbar를 정리
     *
     * Scroll Controller에서 사용 중인 Animation Frame 및
     * 기타 리소스를 정리합니다.
     */
    destroy(): void;
}
