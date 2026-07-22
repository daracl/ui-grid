import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * hidden renderer
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ToolBarRenderer}
 */
export class HiddenRenderer extends ToolBarRenderer {
  private value: any;
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    this.value = this.field.defaultValue;
    this.afterRender();
  }

  public getValue() {
    return this.value;
  }

  public supportsEdit() {
    return true;
  }

  public setValue(value: string | string[]) {
    this.value = value;
    this.changeValue(this.value);
  }
}
