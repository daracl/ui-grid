export interface Position {
    x: number;
    y: number;
}
/**
 * event stopPropagation and preventDefault
 *
 * @param e event
 */
export declare function stopPreventCancel(e: Event): void;
/**
 * event position
 *
 * @param e event
 * @returns
 */
export declare function eventPosition(e: Event): Position;
/**
 * 클릭 이벤트가 유효한 '왼쪽 클릭(mouse)' 또는 '터치(touch)'인지 확인하는 유틸 함수
 *
 * @param e MouseEvent 또는 TouchEvent 객체
 * @returns true: 왼쪽 클릭 또는 터치 / false: 오른쪽 클릭, 휠 클릭 등 무시해야 할 경우
 */
export declare function isClickEvent(e: Event): boolean;
