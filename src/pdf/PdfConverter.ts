import PDFDocument from 'pdfkit';
import * as pdfkitModule from 'pdfkit';
import Courier from 'pdfkit/standard-fonts/Courier';
import CourierBold from 'pdfkit/standard-fonts/CourierBold';
import CourierBoldOblique from 'pdfkit/standard-fonts/CourierBoldOblique';
import CourierOblique from 'pdfkit/standard-fonts/CourierOblique';
import Helvetica from 'pdfkit/standard-fonts/Helvetica';
import HelveticaBold from 'pdfkit/standard-fonts/HelveticaBold';
import HelveticaBoldOblique from 'pdfkit/standard-fonts/HelveticaBoldOblique';
import HelveticaOblique from 'pdfkit/standard-fonts/HelveticaOblique';
import Symbol from 'pdfkit/standard-fonts/Symbol';
import TimesBold from 'pdfkit/standard-fonts/TimesBold';
import TimesBoldItalic from 'pdfkit/standard-fonts/TimesBoldItalic';
import TimesItalic from 'pdfkit/standard-fonts/TimesItalic';
import TimesRoman from 'pdfkit/standard-fonts/TimesRoman';
import ZapfDingbats from 'pdfkit/standard-fonts/ZapfDingbats';
import { getKoreanFontUrl } from '@/pdf/PdfFontUrl';

export interface PdfColumn {
  name: string;
  label: string;
  width?: number;
}

export interface PdfBorderSide {
  color: string;
  width: number;
}

export interface PdfCellBorders {
  top?: PdfBorderSide;
  right?: PdfBorderSide;
  bottom?: PdfBorderSide;
  left?: PdfBorderSide;
}

export type PdfCellChart =
  | { type: 'bar'; value: number; minimum: number; maximum: number; label: string; color: string }
  | { type: 'sparkline' | 'sparklineBar'; values: number[] };

export interface PdfTableData {
  columns: PdfColumn[];
  rows: string[][];
  cellBackgrounds?: (string | undefined)[][];
  cellBorders?: (PdfCellBorders | undefined)[][];
  headerCellBorders?: (PdfCellBorders | undefined)[];
  cellCharts?: (PdfCellChart | undefined)[][];
}

export interface PdfExportOptions {
  fileName?: string;
  title?: string;
  author?: string;
  pageSize?: string | [number, number];
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  fontName?: string;
  fontSize?: number;
  customFont?: {
    name: string;
    data: Uint8Array | ArrayBuffer;
  };
}

const DEFAULT_FILE_NAME = 'grid-export.pdf';
const DEFAULT_FONT_NAME = 'NotoSansKR';
const DEFAULT_FONT_SIZE = 9;
const CELL_PADDING = 5;
const MIN_ROW_HEIGHT = 22;
const standardFonts = [
  Courier,
  CourierBold,
  CourierBoldOblique,
  CourierOblique,
  Helvetica,
  HelveticaBold,
  HelveticaBoldOblique,
  HelveticaOblique,
  Symbol,
  TimesBold,
  TimesBoldItalic,
  TimesItalic,
  TimesRoman,
  ZapfDingbats,
];

const registerStdFonts = Reflect.get(pdfkitModule, 'registerStdFonts');
if (typeof registerStdFonts === 'function') {
  registerStdFonts(...standardFonts);
}

let koreanFontData: Promise<ArrayBuffer> | undefined;

function loadKoreanFont(): Promise<ArrayBuffer> {
  koreanFontData ??= fetch(getKoreanFontUrl()).then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load the bundled Korean PDF font: ${response.status} ${response.statusText}`);
    }
    return response.arrayBuffer();
  });
  return koreanFontData;
}

export class PdfConverter {
  public async convert(data: PdfTableData, options: PdfExportOptions = {}): Promise<Blob> {
    if (data.columns.length === 0) {
      throw new Error('PDF export requires at least one visible column');
    }

    const fontName = options.customFont?.name ?? options.fontName ?? DEFAULT_FONT_NAME;
    const fontData =
      options.customFont?.data ??
      (!options.fontName || options.fontName === DEFAULT_FONT_NAME ? await loadKoreanFont() : undefined);
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    const margin = options.margin ?? 36;
    if (!Number.isFinite(fontSize) || fontSize <= 0) {
      throw new RangeError('PDF fontSize must be a positive number');
    }
    if (!Number.isFinite(margin) || margin < 0) {
      throw new RangeError('PDF margin must be a non-negative number');
    }

    const doc = new PDFDocument({
      size: options.pageSize ?? 'A4',
      layout: options.orientation ?? 'landscape',
      margin,
      info: {
        Title: options.title ?? 'Grid export',
        Author: options.author ?? '',
      },
    });
    if (fontData) {
      doc.registerFont(fontName, fontData);
    }
    doc.font(fontName).fontSize(fontSize);

    return new Promise<Blob>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      doc.on('end', () => resolve(new Blob(chunks, { type: 'application/pdf' })));
      doc.on('error', reject);

      const pageWidth = doc.page.width - margin * 2;
      if (pageWidth <= 0 || doc.page.height - margin * 2 <= 0) {
        reject(new RangeError('PDF margins exceed the page dimensions'));
        return;
      }
      const columnWidths = this.getColumnWidths(doc, data, pageWidth, fontSize);
      let y = margin;

      if (options.title) {
        doc.fontSize(fontSize + 4).text(options.title, margin, y, { width: pageWidth });
        y = doc.y + 10;
        doc.fontSize(fontSize);
      }

      const drawHeader = () => {
        y = this.drawRow(
          doc,
          data.columns.map((column) => column.label),
          columnWidths,
          margin,
          y,
          fontSize,
          true,
          MIN_ROW_HEIGHT,
          undefined,
          data.headerCellBorders,
        );
      };

      drawHeader();

      for (const [rowIndex, row] of data.rows.entries()) {
        const rowHeight = this.getRowHeight(doc, row, columnWidths, fontSize);
        if (y + rowHeight > doc.page.height - margin) {
          doc.addPage();
          y = margin;
          drawHeader();
        }
        y = this.drawRow(
          doc,
          row,
          columnWidths,
          margin,
          y,
          fontSize,
          false,
          rowHeight,
          data.cellBackgrounds?.[rowIndex],
          data.cellBorders?.[rowIndex],
          data.cellCharts?.[rowIndex],
        );
      }

      doc.end();
    });
  }

  public download(blob: Blob, fileName = DEFAULT_FILE_NAME): void {
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const requestedName = fileName.trim() || DEFAULT_FILE_NAME;
    anchor.href = url;
    anchor.download = requestedName.toLowerCase().endsWith('.pdf') ? requestedName : `${requestedName}.pdf`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private getColumnWidths(
    doc: PDFKit.PDFDocument,
    data: PdfTableData,
    availableWidth: number,
    fontSize: number,
  ): number[] {
    doc.fontSize(fontSize);
    const measuredWidths = data.columns.map((column, index) => {
      const longestText = data.rows.reduce((longest, row) => {
        const text = row[index] ?? '';
        return doc.widthOfString(text) > doc.widthOfString(longest) ? text : longest;
      }, column.label);
      return Math.max(column.width ?? 40, doc.widthOfString(longestText) + CELL_PADDING * 2);
    });
    const totalWidth = measuredWidths.reduce((sum, width) => sum + width, 0);
    const scale = availableWidth / totalWidth;

    return measuredWidths.map((width) => width * scale);
  }

  private getRowHeight(doc: PDFKit.PDFDocument, values: string[], widths: number[], fontSize: number): number {
    doc.fontSize(fontSize);
    const textHeight = values.reduce((height, value, index) => {
      const cellHeight = doc.heightOfString(value, {
        width: Math.max(widths[index] - CELL_PADDING * 2, 1),
      });
      return Math.max(height, cellHeight);
    }, 0);

    return Math.max(MIN_ROW_HEIGHT, textHeight + CELL_PADDING * 2);
  }

  private drawRow(
    doc: PDFKit.PDFDocument,
    values: string[],
    widths: number[],
    x: number,
    y: number,
    fontSize: number,
    header: boolean,
    rowHeight = MIN_ROW_HEIGHT,
    cellBackgrounds?: (string | undefined)[],
    cellBorders?: (PdfCellBorders | undefined)[],
    cellCharts?: (PdfCellChart | undefined)[],
  ): number {
    let cellX = x;
    doc.fontSize(fontSize);

    for (let index = 0; index < widths.length; index++) {
      const width = widths[index];
      if (header) {
        doc.save().fillColor('#e9edf2').rect(cellX, y, width, rowHeight).fill().restore();
      } else {
        const cellBackground = cellBackgrounds?.[index];
        if (cellBackground) {
          doc
            .save()
            .fillColor(normalizePdfColor(cellBackground))
            .rect(cellX, y, width, rowHeight)
            .fill()
            .restore();
        }
      }
      this.drawCellBorders(doc, cellX, y, width, rowHeight, cellBorders?.[index]);
      const chart = cellCharts?.[index];
      if (chart) {
        this.drawCellChart(doc, chart, cellX, y, width, rowHeight, fontSize);
      } else {
        doc
          .fillColor('#222222')
          .text(values[index] ?? '', cellX + CELL_PADDING, y + CELL_PADDING, {
            width: Math.max(width - CELL_PADDING * 2, 1),
            height: rowHeight - CELL_PADDING * 2,
            lineBreak: true,
          });
      }
      cellX += width;
    }

    return y + rowHeight;
  }

  private drawCellChart(
    doc: PDFKit.PDFDocument,
    chart: PdfCellChart,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: number,
  ): void {
    const padding = 4;
    const chartX = x + padding;
    const chartY = y + padding;
    const chartWidth = Math.max(1, width - padding * 2);
    const chartHeight = Math.max(1, height - padding * 2);

    if (chart.type === 'bar') {
      const min = Math.min(chart.minimum, chart.maximum);
      const max = Math.max(chart.minimum, chart.maximum);
      const range = max - min || 1;
      const value = Math.max(min, Math.min(max, chart.value));
      const zero = min < 0 && max > 0 ? (-min / range) * chartWidth : min >= 0 ? 0 : chartWidth;
      const extent =
        min < 0 && max > 0
          ? (Math.abs(value) / range) * chartWidth
          : min >= 0
            ? ((value - min) / range) * chartWidth
            : (Math.abs(value - max) / range) * chartWidth;
      const barX =
        (min < 0 && max > 0 && value < 0) || max <= 0 ? chartX + zero - extent : chartX + zero;

      doc.save().fillColor(normalizePdfColor(chart.color)).rect(barX, chartY, extent, chartHeight).fill().restore();
      doc
        .save()
        .fillColor('#222222')
        .fontSize(Math.min(fontSize, 12))
        .text(chart.label, chartX, chartY + Math.max(0, (chartHeight - fontSize) / 2), {
          width: chartWidth,
          height: chartHeight,
          align: 'center',
          lineBreak: false,
        })
        .restore();
      return;
    }

    const values = chart.values;
    if (values.length === 0) {
      return;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    if (chart.type === 'sparklineBar') {
      const barWidth = chartWidth / values.length;
      values.forEach((value, index) => {
        const barHeight = ((value - min) / range) * chartHeight;
        const color =
          value === max
            ? '#28a745'
            : value === min
              ? '#dc3545'
              : index === 0 || index === values.length - 1
                ? '#0000ff'
                : '#ff9900';
        doc
          .save()
          .fillColor(color)
          .rect(
            chartX + index * barWidth + Math.min(1, barWidth / 4),
            chartY + chartHeight - barHeight,
            Math.max(0.5, barWidth - 2),
            barHeight,
          )
          .fill()
          .restore();
      });
      return;
    }

    const points = values.map((value, index) => ({
      x: chartX + (values.length > 1 ? (index / (values.length - 1)) * chartWidth : chartWidth / 2),
      y: chartY + (1 - (value - min) / range) * chartHeight,
    }));
    doc.save().strokeColor('#007acc').lineWidth(0.75).moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => doc.lineTo(point.x, point.y));
    doc.stroke().restore();
    points.forEach((point, index) => {
      const value = values[index];
      const color =
        value === max
          ? '#28a745'
          : value === min
            ? '#dc3545'
            : index === 0 || index === values.length - 1
              ? '#0000ff'
              : '#ff9900';
      doc.save().fillColor(color).circle(point.x, point.y, 1.875).fill().restore();
    });
  }

  private drawCellBorders(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    borders?: PdfCellBorders,
  ): void {
    const sides = borders ?? { right: { color: '#cdcdcd', width: 1 }, bottom: { color: '#cdcdcd', width: 1 } };

    for (const [side, border] of Object.entries(sides) as [keyof PdfCellBorders, PdfBorderSide | undefined][]) {
      if (!border || border.width <= 0) {
        continue;
      }

      const start =
        side === 'top' || side === 'bottom' ? [x, side === 'top' ? y : y + height] : [side === 'left' ? x : x + width, y];
      const end =
        side === 'top' || side === 'bottom'
          ? [x + width, side === 'top' ? y : y + height]
          : [side === 'left' ? x : x + width, y + height];
      doc
        .save()
        .strokeColor(normalizePdfColor(border.color))
        .lineWidth((border.width * 72) / 96)
        .moveTo(start[0], start[1])
        .lineTo(end[0], end[1])
        .stroke()
        .restore();
    }
  }
}

export function normalizePdfCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

export function normalizePdfColor(value: string): string {
  const match = value.match(/^rgba?\((.*)\)$/i);
  if (!match) {
    return value;
  }

  const components = match[1].split(/[,\s/]+/).filter(Boolean);
  if (components.length < 3 || components.length > 4) {
    return value;
  }

  const channels = components.slice(0, 3).map((component) => {
    const numericValue = Number.parseFloat(component);
    const channel = component.endsWith('%') ? (numericValue * 255) / 100 : numericValue;
    return Math.max(0, Math.min(255, channel));
  });
  const alphaValue = components[3];
  const alpha = alphaValue === undefined
    ? 1
    : Math.max(0, Math.min(1, alphaValue.endsWith('%') ? Number.parseFloat(alphaValue) / 100 : Number.parseFloat(alphaValue)));
  const rgb = channels.map((channel) => Math.round(channel * alpha + 255 * (1 - alpha)));

  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
