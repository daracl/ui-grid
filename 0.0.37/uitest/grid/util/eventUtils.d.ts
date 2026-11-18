import { ClickManager } from '../event/ClickManager.js';
import { PointerPosition, PointerSession } from '../event/PointerSession.js';
import { EventElementType } from '../types/Event.js';
import { CellInfo, HeaderCellInfo } from '../types/GridConfig.js';
/**
 * shift key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isShiftKey(evt: Event): boolean;
/**
 * ctrl key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isCtrlKey(evt: Event): boolean;
/**
 * spacebar check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isSpacebar(evt: Event): boolean;
/**
 * enter key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isEnter(evt: Event): boolean;
/**
 * esc key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isEsc(evt: Event): boolean;
/**
 * event stop
 *
 * @param e event
 */
export declare const stopPreventCancel: (e: Event) => void;
/**
 * event key code
 * @param e Event
 * @returns
 */
export declare const eventCodeValue: (e: any) => any;
/**
 * event position
 *
 * @param e event
 * @returns
 */
export declare const eventPosition: (e: Event) => PointerPosition;
/**
 * 클릭 이벤트가 유효한 '왼쪽 클릭(mouse)' 또는 '터치(touch)'인지 확인하는 유틸 함수
 *
 * @param e MouseEvent 또는 TouchEvent 객체
 * @returns true: 왼쪽 클릭 또는 터치 / false: 오른쪽 클릭, 휠 클릭 등 무시해야 할 경우
 */
export declare function isClickEvent(e: Event): boolean;
export declare function initPointerSession(e: Event, startCellInfo: CellInfo | HeaderCellInfo, clickManager: ClickManager, el?: HTMLElement): PointerSession;
/**
 *  마우스 이벤트가 왼쪽 클릭인지 또는 터치 이벤트인지 확인하는 유틸 함수 - 오른쪽 클릭이나 휠 클릭 등은 무시하기 위함
 * @param e   Event 객체 (MouseEvent 또는 TouchEvent)
 * @returns
 */
export declare const isPrimaryPointer: (e: Event) => boolean;
type EventTargetElement = Element | Document;
export declare function getEventTargets(el: EventElementType): EventTargetElement[];
export {};
