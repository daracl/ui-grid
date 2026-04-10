import { isEmpty, isObject, isString, isUndefined } from './utils';
import { $querySelector } from './domUtils';
import { PointerPosition, PointerSession } from '@/event/PointerSession';
import { POINTER_STATE } from '@/constants';
import { CellInfo, HeaderCellInfo } from '@/types/GridConfig';
import { ClickManager } from '@/event/ClickManager';
import { EventOptions } from '../types/Event';

const EVENT_KEY_CODE = {
  Enter: 13,
  Shift: 16,
  Control: 17,
  ArrowDown: 40,
  ArrowUp: 38,
  ArrowLeft: 37,
  ArrowRight: 39,
};

const EVENT_HANDLER_MAP = new Map();

function addEventInfo(el: any, eventType: string, listener: any) {
  if (!EVENT_HANDLER_MAP.has(el)) {
    EVENT_HANDLER_MAP.set(el, {});
  }
  const evtObj = EVENT_HANDLER_MAP.get(el);
  if (!evtObj[eventType]) {
    EVENT_HANDLER_MAP.get(el)[eventType] = listener;
  }
}

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
 * 모든 이벤트 취소
 */
export function allEventOff() {
  for (const [element, events] of EVENT_HANDLER_MAP) {
    for (const event in events) {
      eventOff(element, event);
    }
  }
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
 * html element event 등록
 *
 * @param {(Element | string | NodeList | null | Document)} el html element
 * @param {string} type event type "click mousedown" space split
 * @returns {*}
 */
export const eventOff = (el: Element | string | NodeList | null | Document | Element[], type: string) => {
  if (el == null) return el;

  const eventTypes = type.replaceAll(/\s+/g, ' ').split(' ');

  const elements = $querySelector(el);

  const evtInfo = EVENT_HANDLER_MAP.get(el);

  if (isEmpty(evtInfo)) {
    return;
  }

  // 각 요소별로 WeakMap에서 이벤트 정보를 읽어와 제거
  for (const eventType of eventTypes) {
    const event = eventType.split('.')[0];
    elements.forEach((target) => {
      const elementEvents = EVENT_HANDLER_MAP.get(target);

      if (isEmpty(elementEvents) || isEmpty(elementEvents[eventType])) {
        return;
      }

      target.removeEventListener(event, elementEvents[eventType]);
      delete elementEvents[eventType];

      if (Object.keys(elementEvents).length < 1) {
        EVENT_HANDLER_MAP.delete(target);
      }
    });
  }
};

/**
 * html element event 등록
 *
 * @param {(Element | string | NodeList | null | Document)} el html element
 * @param {string} type event type "click mousedown" space split
 * @param {?*} [listener] 이벤트 리스너
 * @param {?*} [selector] 상위 셀럭터
 * @param {?*} [fnOpts] listener option
 * @returns {*}
 */
export const eventOn = (opts: EventOptions, listener?: any, fnOpts?: any) => {
  const el = opts.el;

  if (el == null) return;

  const type = opts.type;
  const selector = opts.selector;

  const eventTypes = type.replaceAll(/\s+/g, ' ').split(' ');

  const elements = $querySelector(el);

  let fn: any;
  if (!isEmpty(selector) && isString(selector)) {
    fn = (e: Event) => {
      const evtTarget = e.target as Element;
      const selectorEle = evtTarget.closest(selector);

      if (!selectorEle) return;

      let containsFlag = false;
      for (const el of elements) {
        if (el.contains(selectorEle)) {
          containsFlag = true;
        }
      }

      if (!containsFlag) return;

      if (listener(e, selectorEle) === false) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
  } else {
    fn = (e: Event) => {
      if (listener(e, el) === false) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
  }

  for (const eventType of eventTypes) {
    addEventInfo(el, eventType, fn);
    const event = eventType.split('.')[0];

    elements.forEach((el: Node) => {
      el.addEventListener(event, fn, fnOpts ?? {});
    });
  }
};

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
  let evt;
  if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent && e.touches.length > 0) {
    evt = e.touches[0];
  } else if (e instanceof MouseEvent) {
    evt = e;
  } else {
    evt = { pageX: 0, pageY: 0 };
  }
  return {
    x: evt.pageX,
    y: evt.pageY,
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
): PointerSession {
  const targetElement = e.currentTarget as HTMLElement;
  const evtPosition = eventPosition(e);
  return {
    state: POINTER_STATE.PRESSED,
    event: e,
    startPos: evtPosition,
    currentPos: evtPosition,
    cellInfo: startCellInfo,
    startTime: Date.now(),
    lastClickTime: 0,
    cellEl: targetElement,
    clickManager: clickManager,
  };
}
