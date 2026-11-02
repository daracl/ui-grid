export type PopupAlignment = "top" | "center" | "left" | "right" | "bottom";
export interface PopupPosition {
    align?: PopupAlignment;
    topMargin?: number;
    leftMargin?: number;
    /** 중앙 위치 계산에 사용할 세로 분모입니다. 기본값은 2입니다. */
    top?: number;
    /** 중앙 위치 계산에 사용할 가로 분모입니다. 기본값은 2입니다. */
    left?: number;
    /** IE에서 현재 브라우저 창을 기준으로 중앙에 배치합니다. */
    ieDualCenter?: boolean;
}
export interface PopupOptions {
    param?: Record<string, unknown>;
    method?: "GET" | "POST" | "get" | "post";
    name?: string;
    /** window.open 기능 문자열입니다. 명시한 top/left는 자동 위치보다 우선합니다. */
    viewOption?: string;
    position?: PopupAlignment | PopupPosition;
    /**
     * true 면 열린 창의 opener 를 끊어 `window.opener` 로 되접근하지 못하게 합니다.
     * 지정하지 않으면 현재 출처와 다른 URL 을 열 때만 끊고, 같은 출처는 기존처럼 opener 를 유지합니다. false 면 항상 유지합니다.
     */
    noopener?: boolean;
}
/** 사용 가능한 화면 영역을 기준으로 팝업 좌표를 계산합니다. IE의 다중 화면 중앙 배치를 지원합니다. */
export declare function popupPosition(width: number, height: number, tr?: number, lr?: number, ieDualCenter?: boolean): {
    top: number;
    left: number;
};
/**
 * GET 또는 POST로 팝업을 열고 창 참조를 반환합니다. 팝업이 차단되면 null을 반환합니다.
 * 사용자 클릭 처리 안에서 호출해야 하며, 객체 매개변수는 JSON으로 전송합니다.
 * POST 전송 실패는 호출자에게 전달하고 임시 폼은 항상 제거합니다.
 */
export declare function popup(url: string, options?: PopupOptions): Window | null;
