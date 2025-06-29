import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isUndefined } from "src/util/utils";

/**
 * SparkLine renderer
 *
 * @class SparklineRenderer
 * @typedef {SparklineRenderer}
 * @extends {ViewRenderer}
 */
export default class SparklineRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value, item);

    const data = refValue.value;
    const fields = refValue.fields;

    const canvas = document.createElement("canvas");
    const width = 100;
    const height = 30;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const yPadding = 5;
    const xPadding = 5;
    const graphHeight = height - yPadding * 2;
    const graphWidth = width - xPadding * 2;
    const step = graphWidth / (data.length - 1);

    const points: any = [];

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#007acc";
    ctx.lineWidth = 1;

    ctx.beginPath();
    data.forEach((val: number, i: number) => {
      const x = xPadding + i * step;
      const y = yPadding + (1 - (val - min) / range) * graphHeight;
      points.push({ x, y, value: val });
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw circles
    points.forEach((pt: any, i: number) => {
      if (pt.value === max) {
        ctx.fillStyle = "#28a745"; // green
      } else if (pt.value === min) {
        ctx.fillStyle = "#dc3545"; // red
      } else if (i === 0 || i === data.length - 1) {
        ctx.fillStyle = "#0000ff"; // blue
      } else {
        ctx.fillStyle = "#ff9900"; // orange
      }
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, 2 * Math.PI);
      ctx.fill();
    });

    element.appendChild(canvas);
  }
}
