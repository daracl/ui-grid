import * as EditRenderer from './renderer/edit';

import * as ViewRenderer from './renderer/view';

import * as ToolbarRenderer from './renderer/toolbar';

// renderer type
export const VIEW_RENDERER: any = {
  lineNumber: ViewRenderer.AsideLineNumberRenderer,
  modifyInfo: ViewRenderer.AsideModifyInfoRenderer,
  rowCheckbox: ViewRenderer.AsideRowCheckRenderer,
  rowDragHandle: ViewRenderer.AsideRowDragHandleRenderer,
  dropdown: ViewRenderer.DropdownRenderer,
  checkbox: EditRenderer.CheckboxRenderer,
  switch: EditRenderer.SwitchRenderer,
  bar: ViewRenderer.BarRenderer,
  button: ViewRenderer.ButtonRenderer,
  hidden: ViewRenderer.HiddenRenderer,
  html: ViewRenderer.HtmlRenderer,
  image: ViewRenderer.ImageRenderer,
  link: ViewRenderer.LinkRenderer,
  number: ViewRenderer.NumberRenderer,
  text: ViewRenderer.TextRenderer,
  password: ViewRenderer.PasswordRenderer,
  sparkline: ViewRenderer.SparklineRenderer,
  sparklineBar: ViewRenderer.SparklineRendererBar,
  tree: ViewRenderer.TreeRenderer, // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: ViewRenderer.ViewCustomRenderer,
};

export type RENDERER_TYPE = keyof typeof VIEW_RENDERER;

// edit renderer type
export const EDIT_RENDERER: any = {
  date: EditRenderer.DateRenderer,
  custom: EditRenderer.CustomEditRenderer,
  text: EditRenderer.TextEditRenderer,
  number: EditRenderer.NumberEditRenderer,
  dropdown: EditRenderer.DropdownEditRenderer,
  checkbox: EditRenderer.CheckboxRenderer,
  password: EditRenderer.PasswordEditRenderer,
  range: EditRenderer.RangeRenderer,
  textarea: EditRenderer.TextAreaRenderer,
};

/**
 * toolbar renderer type
 */
export const TOOLBAR_RENDERER: any = {
  button: ToolbarRenderer.ButtonRenderer,
  choice: ToolbarRenderer.ChoiceRenderer,
  custom: ToolbarRenderer.CustomRenderer,
  date: ToolbarRenderer.DateRenderer,
  dropdown: ToolbarRenderer.DropdownRenderer,
  number: ToolbarRenderer.NumberRenderer,
  switch: ToolbarRenderer.SwitchRenderer,
  text: ToolbarRenderer.TextRenderer,
  textarea: ToolbarRenderer.TextRenderer,
  html: ToolbarRenderer.HtmlRenderer,
  link: ToolbarRenderer.LinkRenderer,
  search: ToolbarRenderer.SearchRenderer,
  hidden: ToolbarRenderer.HiddenRenderer,
};

export type TOOLBAR_RENDERER_TYPE = keyof typeof TOOLBAR_RENDERER;
