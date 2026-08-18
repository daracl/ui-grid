import { ASIDE_RENDERER, EDIT_RENDERER, VIEW_RENDERER } from '@/constantRenders';
import { DEFAULT_EDIT_RENDERER_INFO, DEFAULT_RENDERER_INFO } from '@/defaultGridOption';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { FieldItem } from '@/types/GridField';
import { EditRendererInfo } from '@/types/RendererInfo';
import { isFieldEditable } from '@/util/gridUtils';
import { isPlainObject, isString, isUndefined, merge } from '@/util/utils';
import { GridMain } from '../GridMain';

export class RendererFactory {
  constructor(private readonly gridMain: GridMain) {}

  /**
   * field renderer 생성
   *
   * @param {FieldItem} field field 정보
   * @returns {FieldItem} renderer 정보가 추가된 field
   */
  public createRenderer(field: FieldItem): FieldItem {
    if (field.$isAside) {
      field.$renderer = new ASIDE_RENDERER[field.renderer.type](field, this.gridMain);
      return field;
    }

    const cfg = this.gridMain.config();
    const editable = isFieldEditable(cfg, field);
    let editRenderer;

    if (!isUndefined(field.editRenderer)) {
      editRenderer = this.getEditRenderer(field, field.editRenderer, '');
      field.$editRenderer = editRenderer;

      if (editRenderer.supportsInteraction()) {
        field.$renderer = editRenderer;
        field.renderer = merge({}, DEFAULT_RENDERER_INFO, {
          type: field.editRenderer.type,
        });
      }
    }

    if (!field.$renderer) {
      field = this.getViewRenderer(field);
    }

    if (editable && !field.$editRenderer) {
      field.$editRenderer = this.getEditRenderer(field, field.editRenderer, field.renderer.type);
    }

    return field;
  }

  private getViewRenderer(field: FieldItem): FieldItem {
    let renderInfo = { type: 'text' };

    if (isPlainObject(field.renderer)) {
      renderInfo = merge({}, field.renderer);
    } else if (isString(field.renderer)) {
      renderInfo = { type: field.renderer };
    }

    const render = VIEW_RENDERER[renderInfo.type];
    if (isUndefined(render)) {
      renderInfo.type = 'text';
    }

    field.renderer = merge({}, DEFAULT_RENDERER_INFO, renderInfo);
    field.$renderer = new VIEW_RENDERER[field.renderer.type](field, this.gridMain);

    return field;
  }

  private getEditRenderer(
    field: FieldItem,
    editRendererInfo: EditRendererInfo,
    rendererType: string,
  ): EditCellRenderer {
    if (isString(editRendererInfo)) {
      editRendererInfo = { type: editRendererInfo };
    }

    if (isUndefined(editRendererInfo) || isUndefined(editRendererInfo.type)) {
      editRendererInfo = { type: rendererType };
    }

    field.editRenderer = merge({}, DEFAULT_EDIT_RENDERER_INFO, editRendererInfo);

    let type = 'text';
    const editType = editRendererInfo?.type;

    if (editType && EDIT_RENDERER[editType]) {
      type = editType;
    } else if (EDIT_RENDERER[rendererType]) {
      type = rendererType;
    }

    return new EDIT_RENDERER[type](field, this.gridMain);
  }
}
