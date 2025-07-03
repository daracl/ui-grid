import { Config } from "@t/GridConfig";
import { FieldItem } from "@t/GridField";
import { intValue, isEmpty, isString, isUndefined } from "./utils";

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
  EVENT_HANDLER_MAP.get(el)[eventType] = listener;
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

  if (event.key === " " || event.code === "Space" || event.keyCode === 32) {
    return true;
  }
  return false;
}
/**
 * html element event 등록
 *
 * @param {(Element | string | NodeList | null | Document)} el html element
 * @param {string} type event type "click mousedown" space split
 * @returns {*}
 */
export const eventOff = (el: Element | string | NodeList | null | Document, type: string) => {
  if (el == null) return el;

  const eventTypes = type.replaceAll(/\s+/g, " ").split(" ");

  const elements = $querySelector(el);

  const evtInfo = EVENT_HANDLER_MAP.get(el);

  if (isEmpty(evtInfo)) {
    return;
  }

  for (const eventType of eventTypes) {
    if (isUndefined(evtInfo[eventType])) continue;

    elements.forEach((el) => {
      el.removeEventListener(eventType, evtInfo[eventType]);
    });

    delete evtInfo[eventType];
  }

  if (Object.keys(evtInfo).length < 1) {
    EVENT_HANDLER_MAP.delete(el);
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
export const eventOn = (el: Element | string | NodeList | null | Document, type: string, listener?: any, selector?: any, fnOpts?: any) => {
  if (el == null) return;

  const eventTypes = type.replaceAll(/\s+/g, " ").split(" ");

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
    elements.forEach((el) => {
      el.addEventListener(eventType, fn, fnOpts ?? {});
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
export const eventPosition = (e: any) => {
  const oe = e.originalEvent;
  let evt;
  if (oe) {
    if (oe.changedTouches) {
      evt = oe.changedTouches[0];
    } else if (oe.touches) {
      evt = oe[0];
    }
  }

  evt = evt || e;

  return { x: evt.pageX, y: evt.pageY };
};

function $querySelector(el: Element | string | NodeList | Document): any[] {
  if (el instanceof Document) {
    return [document];
  }

  if (el instanceof Element) {
    return [el];
  }
  let nodeList;
  if (el instanceof NodeList) {
    nodeList = el;
  } else {
    nodeList = document.querySelectorAll(el);
  }

  const reval: Element[] = [];

  for (let node of nodeList) {
    reval.push(node as Element);
  }

  return reval;
}
