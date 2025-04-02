import { isBlank, isEmpty, isString, isUndefined } from "src/util/utils";

export default {
  hasClass(element: HTMLElement, styleClass: string) {
    if (element.classList.contains(styleClass)) {
      return true;
    }

    return false;
  },
};
