import { isBlank, isEmpty, isString, isUndefined } from "src/util/utils";

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
export default {
  eventOff(el: Element | string | NodeList | null | Document, type: string) {
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
  },

  eventOn(el: Element | string | NodeList | null | Document, type: string, selector?: any, listener?: any) {
    if (el == null) return el;

    const eventTypes = type.replaceAll(/\s+/g, " ").split(" ");

    const elements = $querySelector(el);

    if (!isString(selector)) {
      listener = selector;

      const fn = (e: Event) => {
        if (listener(e, el) === false) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };

      for (const eventType of eventTypes) {
        addEventInfo(el, eventType, fn);

        elements.forEach((el) => {
          el.addEventListener(eventType, fn);
        });
      }

      return this;
    }

    const fn = (e: Event) => {
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

    for (const eventType of eventTypes) {
      addEventInfo(el, eventType, fn);
      elements.forEach((el) => {
        el.addEventListener(eventType, fn);
      });
    }
  },

  getEventPosition(e: any) {
    const evtTouche = e.touches;
    const evt = evtTouche && evtTouche[0] ? evtTouche[0] : e;

    return { x: evt.pageX, y: evt.pageY };
  },

  getEventKey(e: any) {
    return (e.key || "").toLowerCase();
  },
};

function addEventInfo(el: any, eventType: string, listener: any) {
  if (!EVENT_HANDLER_MAP.has(el)) {
    EVENT_HANDLER_MAP.set(el, {});
  }
  EVENT_HANDLER_MAP.get(el)[eventType] = listener;
}

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
