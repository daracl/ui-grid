import type { FieldItem } from '@/types/GridField';
import { DropdownRenderer } from '@/renderer/view/DropdownRenderer';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import type { RefOptionValue } from '@/types/RefValue';
import { normalizeExportValue } from './exportValue';

/** 그리드 렌더러의 표시 포맷·라벨·마스킹을 내보내기에 공통 적용한다. */
export function getExportCellValues(fields: FieldItem[], item: Record<string, unknown>): string[] {
  return fields.map((field) => {
    const renderer = field.$renderer;
    if (field.renderer?.type === 'password') return '********';
    if (field.renderer?.type === 'hidden') return '';
    const value = renderer.getValue(item);
    if (renderer instanceof ViewCellRenderer && ['dropdown', 'link', 'button'].includes(field.renderer?.type)) {
      const ref = renderer.getRefValue(value, item) as RefOptionValue | string | undefined;
      if (typeof ref === 'string') return ref;
      if (ref?.hide) return '';
      if (ref?.label !== undefined) return normalizeExportValue(ref.label);
      if (renderer instanceof DropdownRenderer) {
        let labels = renderer.getLabel(value);
        if (labels.length === 0 && field.defaultValue) labels = renderer.getLabel(field.defaultValue);
        if (labels.length > 0) return labels.join(field.editRenderer?.listItem?.delimiter ?? ',');
      }
    }
    return normalizeExportValue(value);
  });
}
