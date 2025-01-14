import { RENDER_TEMPLATE } from "../constants";
import { FieldItem } from "@t/GridField";
import AbstractRenderer from "src/renderer/AbstractRenderer";

export const getRenderer = (field: FieldItem): AbstractRenderer => {
  let render;
  if (field.renderer.type) {
    render = RENDER_TEMPLATE[field.renderer.type];

    if (render) return render;
  }

  return RENDER_TEMPLATE["text"];
};
