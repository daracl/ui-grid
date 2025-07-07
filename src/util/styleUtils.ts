import DaraGrid from "src/DaraGrid";

/**
 * @method addStyleTag
 * @param options {Object} - 데이터 .
 * @description  add style tab
 */
export const addStyleTag = (grid: DaraGrid) => {
  const options = grid.getOptions();

  const cssStr = [];

  const rowOptHeight = options.body.row.height;

  const uidAttribute = grid.getUidAttrSelector();

  if (!isNaN(rowOptHeight)) {
    cssStr.push(`${uidAttribute} .dg-cell, ${uidAttribute} .pub-body-aside-td{max-height:${rowOptHeight}px;height:${rowOptHeight}px;line-height:${rowOptHeight - 4}px;}`);
    cssStr.push("${uidAttribute} .dg-cell>.pub-content, ${uidAttribute} .pub-body-aside-td > .aside-content{margin:1px 0px 1px 0px;max-height:${(rowOptHeight - 3)}px; }");
    //cssStr.push('#'+_this.prefix+'_pubGrid .dg-cell>.pub-content, #'+_this.prefix+'_pubGrid .pub-body-aside-td > .aside-content{margin:1px 0px 1px 0px;height:'+(rowOptHeight-3)+'px; line-height:'+(rowOptHeight-5)+'px;}');
  }

  const headerHeight = options.header.height;

  if (!isNaN(headerHeight)) {
    cssStr.push(`${uidAttribute} .pubGrid-header-container th{height:${headerHeight}px;}`);
  }

  if (options.aside.lineNumber.enableRowSelection === true) {
    cssStr.push(`${uidAttribute} .pubGrid-body-aside .pub-body-aside-td{cursor:pointer;}`);
  }
  const instanceId = grid.instanceId();
  let styleTag = document.querySelector(`[daracl-style="${instanceId}"]`) as HTMLStyleElement;

  if (styleTag) {
  } else {
    styleTag = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleTag);
    styleTag.setAttribute("daracl-style", instanceId);
    styleTag.setAttribute("type", "text/css");
  }

  if (styleTag.style) {
    styleTag.style.cssText = cssStr.join("");
  } else {
    styleTag.innerHTML = cssStr.join("");
  }
};

/**
 * style class split
 * @example
 * ```
 * 'a b c' => ['a','b','c']
 * ```
 * @param {string} styleClass
 * @returns {*}
 */
export const styleClassSplit = (styleClass: string) => {
  return styleClass.trim().split(/\s+/);
};

/**
 * add element css class
 *
 * @param {string} styleClasss css class
 */
export function addClass(element: HTMLElement | NodeListOf<HTMLElement> | null, styleClass: string): void {
  if (!element) return;

  const elements: HTMLElement[] = element instanceof HTMLElement ? [element] : Array.from(element);

  const addStyles = styleClassSplit(styleClass);

  elements.forEach((el) => {
    el.classList.add(...addStyles); // 중복 자동 처리
  });
}

/**
 * remove element css class
 *
 * @param {(HTMLElement | NodeListOf<Element>)} element html dom elements
 * @param {string} styleClass style css class
 */
export function removeClass(element: Element | NodeListOf<Element> | null, classNames: string): void {
  if (!element || typeof classNames !== "string") return;

  const elements = element instanceof Element ? [element] : Array.from(element);

  const styleClasses = styleClassSplit(classNames);

  for (const el of elements) {
    el.classList.remove(...styleClasses);
  }
}

/**
 * toggleClass
 *
 * 지정된 DOM 요소(또는 요소 리스트)에 하나 이상의 클래스를 토글(add/remove)합니다.
 *
 * @param element - 단일 Element 또는 NodeListOf<Element> 또는 null
 * @param classNames - 공백으로 구분된 하나 이상의 클래스 이름
 */
export function toggleClass(element: Element | NodeListOf<Element> | null, classNames: string): void {
  if (!element || typeof classNames !== "string") return;

  const elements = element instanceof Element ? [element] : Array.from(element);
  const styleClasses = styleClassSplit(classNames);

  for (const el of elements) {
    styleClasses.forEach((cls) => {
      el.classList.toggle(cls);
    });
  }
}
