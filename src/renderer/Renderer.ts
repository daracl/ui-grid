import { FieldItem } from "@t/GridField";

export default abstract class Renderer {
  protected field;

  constructor(field: FieldItem) {
    this.field = field;
  }
}
