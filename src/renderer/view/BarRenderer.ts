import { EditRenderer } from "@t/EditRenderer";
import Renderer from "./Renderer";
import DaraForm from "src/DaraGrid";

export default class ButtonRender extends Renderer {
  constructor(field: EditRenderer, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.mounted();
    this.setDefaultOption();
  }

  mounted() {
    this.rowElement.querySelector(`#${this.field.$key}`)?.addEventListener("click", (evt) => {
      if (this.field.onClick) {
        this.field.onClick.call(null, this.field);
      }
    });
  }

  static isDataRender(): boolean {
    return false;
  }

  createField() {
    const field = this.field;

    const fieldContainerElement = this.rowElement.querySelector(".df-field-container") as HTMLElement;

    fieldContainerElement.innerHTML = `
      <button type="button" class="dg-btn">${field.label}</button>
     `;
  }

  getValue() {
    return "";
  }

  setValue(value: any): void {}

  reset() {
    this.setDisabled(false);
  }

  getElement() {
    return null;
  }

  valid(): any {
    return true;
  }
}
