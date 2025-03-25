import { FieldItem } from "@t/GridField";

export default abstract class Renderer {
  protected field;
  protected fieldName;

  constructor(field: FieldItem) {
    this.field = field;
    this.fieldName = field.name;
  }
}
