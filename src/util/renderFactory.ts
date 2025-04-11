import { VIEW_RENDERER } from "../constants";
import { FieldItem } from "@t/GridField";
import { isPlainObject, isString, isUndefined, merge } from "./utils";
import ViewRenderer from "src/renderer/ViewRenderer";
import EditRenderer from "src/renderer/EditRenderer";

export const getViewRenderer = (field: FieldItem): ViewRenderer => {
  let render;
  if (field.renderer.type) {
    render = VIEW_RENDERER[field.renderer.type];

    if (render) return render;
  }

  return VIEW_RENDERER["text"];
};

export const getEditRenderer = (field: FieldItem): EditRenderer => {
  let render;
  if (field.renderer.type) {
    render = VIEW_RENDERER[field.renderer.type];

    if (render) return render;
  }

  return VIEW_RENDERER["text"];
};
