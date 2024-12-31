import { EditRenderer } from "@t/EditRenderer";
import Render from "./Render";
import DaraForm from "src/DaraGrid";

export default class GroupRender extends Render {
  constructor(field: EditRenderer, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
  }

  public mounted() {}

  static isDataRender(): boolean {
    return false;
  }

  createField() {
    return "";
  }

  getValue() {
    return null;
  }

  setValue(value: any): void {}

  reset() {}

  getElement(): HTMLElement {
    return this.rowElement;
  }

  valid(): any {
    return true;
  }

  public addChildField(element: Element) {
    let addContainer = this.rowElement.querySelector(".df-field-container");

    if (addContainer) {
      addContainer.append(element);
    } else {
      this.rowElement.append(element);
    }
  }

  focus(): void {}
}
