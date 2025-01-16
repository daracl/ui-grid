import { Config } from "@t/GridConfig";
import { FieldItem } from "@t/GridField";
import { intValue } from "./utils";

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
