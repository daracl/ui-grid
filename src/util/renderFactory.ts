import { RENDER_TEMPLATE } from "../constants";
import { FieldItem } from "@t/GridField";
import { RendererInfo } from "@t/RendererInfo";
import AbstractRenderer from "src/renderer/AbstractRenderer";
import { isPlainObject, isString, isUndefined, merge } from "./utils";

export const getRenderer = (field: FieldItem): AbstractRenderer => {
  let render;
  if (field.renderer.type) {
    render = RENDER_TEMPLATE[field.renderer.type];

    if (render) return render;
  }

  return RENDER_TEMPLATE["text"];
};

/**
 * 필드에 랜더링 정보 추가
 *
 * @param {FieldItem} field 필드 정보
 * @returns {FieldItem} 필드 item
 */
export const setRendererInfo = (field: FieldItem): FieldItem => {
  let renderInfo = { type: "text" };

  if (isPlainObject(field.renderer)) {
    renderInfo = merge({}, field.renderer);
  } else if (isString(field.renderer)) {
    renderInfo = { type: field.renderer };
  }

  let render = RENDER_TEMPLATE[renderInfo.type];
  if (isUndefined(render)) {
    renderInfo.type = "text";
  }

  field.renderer = renderInfo;
  field.$renderer = RENDER_TEMPLATE[renderInfo.type];

  return field;
};
