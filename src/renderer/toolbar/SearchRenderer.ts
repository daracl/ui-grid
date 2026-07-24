import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { createHTMLElement, getIcon } from '@/util/domUtils';

/**
 * search renderer
 *
 * @class SearchRenderer
 * @typedef {SearchRenderer}
 * @extends {ToolBarRenderer}
 */
export class SearchRenderer extends ToolBarRenderer {
  private editElement: HTMLInputElement;
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const wrapperElement = createHTMLElement('div', 'dg-search');

    const editElement = createHTMLElement('input', this.getRendererClassName('dg-search-text'), {
      type: 'text',
      autocomplete: 'off',
      placeholder: this.field.placeholder ?? '',
    }) as HTMLInputElement;

    wrapperElement.appendChild(editElement);

    const btnElement = createHTMLElement('button', 'dg-button dg-search-btn');

    const iconElement = createHTMLElement('span', 'dg-icon');
    iconElement.innerHTML = getIcon('search');
    btnElement.appendChild(iconElement);

    wrapperElement.appendChild(btnElement);

    controlElement.appendChild(wrapperElement);

    this.editElement = editElement;
    this.setValue(this.field.defaultValue ?? '');
    this.initEvt(editElement, btnElement);
  }

  initEvt(contentElement: HTMLInputElement, btnElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'input' }, (e: UIEvent) => {
      this.changeValue(this.getValue());
    });

    cfg.eventManager.on({ el: contentElement, type: 'keydown' }, (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.search(e);
      }
    });

    cfg.eventManager.on({ el: btnElement, type: 'click' }, (e: KeyboardEvent) => {
      this.search(e);
    });
  }

  public getValue() {
    return this.editElement.value;
  }

  public setValue(value: string) {
    this.editElement.value = value;
  }
}
