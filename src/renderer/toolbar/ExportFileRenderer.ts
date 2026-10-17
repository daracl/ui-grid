import { exportGridFile } from '@/export/exportGridFile';
import { createHTMLElement, getIcon } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import type { ToolbarFieldItem } from '@/types/Toolbar';
import { DropdownRenderer } from './DropdownRenderer';

/** 형식을 선택한 뒤 별도 버튼으로 다운로드하는 툴바 렌더러. */
export class ExportFileRenderer extends DropdownRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    // 파일 형식은 항상 하나만 선택하며 같은 항목을 다시 눌러도 선택을 유지한다.
    field.renderer = { ...field.renderer };
    if (field.renderer.listItem) {
      field.renderer.listItem = { ...field.renderer.listItem, multiple: false, includeAllOption: false };
    }
    super(field, gridMain);
  }
  public render(element: HTMLElement): void {
    super.render(element);
    const control = this.getControlElement(element);
    const select = control.querySelector<HTMLButtonElement>('.dg-dropdown-button')!;
    select.type = 'button';
    select.setAttribute('aria-label', this.field.label || this.language.getMessage('export.format'));
    const container = createHTMLElement('div', 'dg-export-file');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.getRendererClassName('dg-button dg-export-download');
    const label = this.field.renderer.downloadLabel ?? this.language.getMessage('export.download');
    const text = createHTMLElement('span', 'dg-button-label');
    text.textContent = label;
    if (this.field.renderer.icon || this.field.renderer.iconStyle) {
      const icon = createHTMLElement('span', 'dg-icon ' + (this.field.renderer.iconStyle ?? ''));
      if (this.field.renderer.icon) icon.innerHTML = getIcon(this.field.renderer.icon);
      button.appendChild(icon);
    }
    button.appendChild(text);
    const status = createHTMLElement('span', 'dg-export-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    container.append(select, button, status);
    control.appendChild(container);
    let busy = false;
    this.gridMain.config().eventManager.on({ el: button, type: 'click' }, async (event: MouseEvent) => {
      event.preventDefault();
      if (busy || element.closest('.dg-disabled')) return;
      const value = this.getValue();
      const format = String(Array.isArray(value) ? value[0] ?? '' : value).toLowerCase();
      const grid = GridMain.getInstance(this.gridMain.element().getElement());
      if (!grid) return;
      busy = true;
      button.disabled = select.disabled = true;
      button.setAttribute('aria-busy', 'true');
      status.textContent = this.language.getMessage('export.creating');
      text.textContent = label;
      button.removeAttribute('title');
      try {
        this.click(event, button);
        await exportGridFile(
          grid,
          format,
          this.field.renderer.exportOptions,
          this.language.getMessage('export.unsupportedFormat'),
        );
        status.textContent = this.language.getMessage('export.completed');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        status.textContent = `${this.language.getMessage('export.failed')}: ${message}`;
        text.textContent = this.language.getMessage('export.failed');
        button.title = message;
      } finally {
        busy = false;
        button.disabled = select.disabled = false;
        button.removeAttribute('aria-busy');
      }
    });
  }
}
