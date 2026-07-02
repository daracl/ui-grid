import { PointerStateMap } from '@/constants';
import { ClickManager } from '@/event/ClickManager';
import { PointerPosition, PointerSession } from '@/event/PointerSession';
import { EventElementType } from '@/types/Event';
import { CellInfo, HeaderCellInfo } from '@/types/GridConfig';

const EVENT_KEY_CODE = {
  Enter: 13,
  Shift: 16,
  Control: 17,
  ArrowDown: 40,
  ArrowUp: 38,
  ArrowLeft: 37,
  ArrowRight: 39,
};

/**
 * shift key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export function isShiftKey(evt: Event): boolean {
  return (evt as KeyboardEvent).shiftKey;
}

/**
 * ctrl key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export function isCtrlKey(evt: Event): boolean {
  return (evt as KeyboardEvent).ctrlKey;
}

/**
 * spacebar check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export function isSpacebar(evt: Event): boolean {
  const event = evt as KeyboardEvent;

  if (event.key === ' ' || event.code === 'Space') {
    return true;
  }
  return false;
}

/**
 * enter key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export function isEnter(evt: Event): boolean {
  const event = evt as KeyboardEvent;

  return event.key === 'Enter' || event.code === 'Enter';
}

/**
 * esc key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export function isEsc(evt: Event): boolean {
  const event = evt as KeyboardEvent;

  return (
    event.key === 'Escape' || // 표준
    event.key === 'Esc' || // 구형 브라우저
    event.code === 'Escape' // 물리 키 기준
  );
}

/**
 * event stop
 *
 * @param e event
 */
export const stopPreventCancel = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * event key code
 * @param e Event
 * @returns
 */
export const eventKeyCode = (e: any) => {
  return window.event ? e.keyCode : e.which;
};

/**
 * event position
 *
 * @param e event
 * @returns
 */
export const eventPosition = (e: Event): PointerPosition => {
  // 1. PointerEvent (가장 우선)
  if (typeof PointerEvent !== 'undefined' && e instanceof PointerEvent) {
    return {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }

  // 2. TouchEvent
  if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
    const touch = e.changedTouches?.[0] || e.touches?.[0] || e.targetTouches?.[0];

    if (touch) {
      return {
        x: touch.pageX,
        y: touch.pageY,
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
    }
  }

  // 3. MouseEvent
  if (e instanceof MouseEvent) {
    return {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }

  // 4. fallback
  return {
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  };
};

/**
 * 클릭 이벤트가 유효한 '왼쪽 클릭(mouse)' 또는 '터치(touch)'인지 확인하는 유틸 함수
 *
 * @param e MouseEvent 또는 TouchEvent 객체
 * @returns true: 왼쪽 클릭 또는 터치 / false: 오른쪽 클릭, 휠 클릭 등 무시해야 할 경우
 */
export function isClickEvent(e: Event): boolean {
  // 모바일 터치 이벤트인 경우 항상 클릭으로 간주 (버튼 없음)
  if (e.type.startsWith('touch')) {
    return true; // 또는 터치 이동 거리 체크
  }

  // 마우스 이벤트인 경우
  if (e instanceof MouseEvent) {
    // 왼쪽 버튼 클릭인지 확인 (button === 0)
    return e.button === 0;
  }

  // 그 외의 경우 (안전 장치)
  return false;
}

export function initPointerSession(
  e: Event,
  startCellInfo: CellInfo | HeaderCellInfo,
  clickManager: ClickManager,
  el?: HTMLElement,
): PointerSession {
  const targetElement = e.currentTarget as HTMLElement;
  const evtPosition = eventPosition(e);

  return {
    state: PointerStateMap.PRESSED,
    event: e,
    startPos: evtPosition,
    currentPos: evtPosition,
    cellInfo: startCellInfo,
    startTime: Date.now(),
    lastClickTime: 0,
    cellEl: el ?? targetElement,
    clickManager: clickManager,
  };
}

/**
 *  마우스 이벤트가 왼쪽 클릭인지 또는 터치 이벤트인지 확인하는 유틸 함수 - 오른쪽 클릭이나 휠 클릭 등은 무시하기 위함
 * @param e   Event 객체 (MouseEvent 또는 TouchEvent)
 * @returns
 */
export const isPrimaryPointer = (e: Event): boolean => {
  if (e instanceof PointerEvent) {
    return e.isPrimary && e.button === 0;
  }

  if (e instanceof MouseEvent) {
    return e.button === 0;
  }

  if (e instanceof TouchEvent) {
    return true;
  }

  return false;
};

type EventTargetElement = Element | Document;

export function getEventTargets(el: EventElementType): EventTargetElement[] {
  if (!el) return [];

  if (Array.isArray(el)) {
    return el;
  }

  if (el instanceof Document || el instanceof Element) {
    return [el];
  }

  if (el instanceof NodeList) {
    return Array.from(el);
  }

  // string selector
  return Array.from(document.querySelectorAll(el));
}
