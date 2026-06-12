import { EventElementType, EventOptions } from '@/types/Event';
import { getEventTargets } from '@/util/eventUtils';
type EventStore = Record<string, EventListener | undefined>;

export class EventManager {
  private readonly EVENT_HANDLER_MAP = new WeakMap<any, EventStore>();
  private readonly ELEMENTS = new Set<any>();

  private addEventInfo(el: any, eventType: string, listener: EventListener) {
    if (!this.EVENT_HANDLER_MAP.has(el)) {
      this.EVENT_HANDLER_MAP.set(el, {});
    }

    const store = this.EVENT_HANDLER_MAP.get(el);

    if (store && !store?.[eventType]) {
      store[eventType] = listener;
    }

    this.ELEMENTS.add(el);
  }

  on(opts: EventOptions, listener?: any, fnOpts?: AddEventListenerOptions) {
    const el = opts.el;
    if (!el) return;

    const type = opts.type;
    const selector = opts.selector;

    const eventTypes = type.replaceAll(/\s+/g, ' ').split(' ');
    const elements = getEventTargets(el);

    let fn: EventListener;

    if (selector && typeof selector === 'string') {
      fn = (e: Event) => {
        const target = e.target as Element;
        const matched = target.closest(selector);

        if (!matched) return;

        const valid = elements.some((parent) => parent.contains(matched));
        if (!valid) return;

        if (listener(e, matched) === false) {
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
      const event = eventType.split('.')[0];

      elements.forEach((target) => {
        this.addEventInfo(target, eventType, fn);
        target.addEventListener(event, fn, fnOpts ?? {});
      });
    }
  }

  off(el: EventElementType, type: string) {
    if (!el) return;
    const eventTypes = type.replaceAll(/\s+/g, ' ').split(' ');
    const elements = getEventTargets(el);

    for (const target of elements) {
      const store = this.EVENT_HANDLER_MAP.get(target);
      if (!store) continue;

      let hasHandler = false;

      for (const eventType of eventTypes) {
        const handler = store[eventType];
        if (!handler) continue;

        const event = eventType.split('.')[0];
        target.removeEventListener(event, handler);

        store[eventType] = undefined;

        hasHandler = true;
      }

      if (hasHandler) {
        let isEmpty = true;
        for (const key in store) {
          if (store[key] !== undefined) {
            isEmpty = false;
            break;
          }
        }

        if (isEmpty) {
          this.EVENT_HANDLER_MAP.delete(target);
          this.ELEMENTS.delete(target);
        }
      }
    }
  }

  /**
   * 제거
   */
  destroy() {
    this.ELEMENTS.forEach((el) => {
      const store = this.EVENT_HANDLER_MAP.get(el);
      if (!store) return;

      for (const type in store) {
        const event = type.split('.')[0];
        el.removeEventListener(event, store[type]);
      }

      this.EVENT_HANDLER_MAP.delete(el);
    });

    this.ELEMENTS.clear();
  }
}
