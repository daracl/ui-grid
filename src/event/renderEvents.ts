import * as utils from "src/util/utils";
import { FieldItem } from "@t/GridField";

export const inputEvent = (field: FieldItem, element: HTMLElement) => {
  element.addEventListener("input", (e: Event) => {
    field.$editRenderer.changeEventCall(e, element);
    field.$editRenderer.valid(element);
  });
};

export const numberInputEvent = (field: FieldItem, element: HTMLInputElement) => {
  element.addEventListener("keyup", (e: any) => {
    const val = e.target.value;

    if (!utils.isNumber(val)) {
      element.value = val.replace(/[^0-9.\-+]/g, "");
      e.preventDefault();
    }
    field.$editRenderer.changeEventCall(e, element);
    field.$editRenderer.valid(element);
  });

  /*
    element.addEventListener('input', (e: any) => {
        customChangeEventCall(field, e, renderInfo);
        renderInfo.valid();
    })
    */
};

export const dropdownChangeEvent = (field: FieldItem, element: HTMLElement) => {
  element.addEventListener("change", (e: any) => {
    field.$editRenderer.changeEventCall(e, element);
    field.$editRenderer.valid(element);
  });
};
