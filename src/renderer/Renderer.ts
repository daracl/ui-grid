import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";

export default abstract class Renderer {
  protected field;
  protected fieldName;
  protected gridMain;
  protected language;

  constructor(field: FieldItem, gridMain: GridMain) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.getGrid().i18n();
  }
}
