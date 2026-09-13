import * as EditCellRenderer from './renderer/edit';

import * as ViewCellRenderer from './renderer/view';

import * as ToolbarRenderer from './renderer/toolbar';

export const ASIDE_RENDERER: any = {
  lineNumber: ViewCellRenderer.AsideLineNumberRenderer,
  modifyInfo: ViewCellRenderer.AsideModifyInfoRenderer,
  rowCheckbox: ViewCellRenderer.AsideRowCheckRenderer,
  rowDragHandle: ViewCellRenderer.AsideRowDragHandleRenderer,
};

// renderer type
export const VIEW_RENDERER: any = {
  dropdown: ViewCellRenderer.DropdownRenderer,
  bar: ViewCellRenderer.BarRenderer,
  button: ViewCellRenderer.ButtonRenderer,
  hidden: ViewCellRenderer.HiddenRenderer,
  html: ViewCellRenderer.HtmlRenderer,
  image: ViewCellRenderer.ImageRenderer,
  link: ViewCellRenderer.LinkRenderer,
  number: ViewCellRenderer.NumberRenderer,
  text: ViewCellRenderer.TextRenderer,
  password: ViewCellRenderer.PasswordRenderer,
  sparkline: ViewCellRenderer.SparklineRenderer,
  sparklineBar: ViewCellRenderer.SparklineRendererBar,
  tree: ViewCellRenderer.TreeRenderer, // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: ViewCellRenderer.ViewCustomRenderer,
};

export type RENDERER_TYPE = keyof typeof VIEW_RENDERER;

// edit renderer type
export const EDIT_RENDERER: any = {
  date: EditCellRenderer.DateRenderer,
  custom: EditCellRenderer.CustomEditRenderer,
  text: EditCellRenderer.TextEditRenderer,
  number: EditCellRenderer.NumberEditRenderer,
  dropdown: EditCellRenderer.DropdownEditRenderer,
  switch: EditCellRenderer.SwitchRenderer,
  checkbox: EditCellRenderer.CheckboxRenderer,
  password: EditCellRenderer.PasswordEditRenderer,
  range: EditCellRenderer.RangeRenderer,
  textarea: EditCellRenderer.TextAreaRenderer,
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
  label: ToolbarRenderer.LabelRenderer,
};

export type TOOLBAR_RENDERER_TYPE = keyof typeof TOOLBAR_RENDERER;
