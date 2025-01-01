import { EditRenderer } from "@t/EditRenderer";

import Render from "../renderer/edit/Renderer";
import { RENDER_TEMPLATE } from "../constants";
import * as utils from "./utils";

export const getRenderer = (field: EditRenderer): Render => {
  let render;
  if (field.renderType) {
    render = RENDER_TEMPLATE[field.renderType];
  }

  if (render && (render.isDataRender() === false || !utils.isUndefined(field.name))) {
    return render;
  }

  if (utils.isUndefined(field.name)) {
    if (field.children) {
      return RENDER_TEMPLATE["group"];
    } else {
      return RENDER_TEMPLATE["hidden"];
    }
  }

  return RENDER_TEMPLATE["text"];
};
