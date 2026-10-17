import { downloadExport } from '../downloadExport';
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
import { getKoreanFontUrl } from '@/export/pdf/PdfFontUrl';
export { normalizePdfCellValue } from './PdfValue';

export interface PdfColumn {
  name: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

export interface PdfCellGradient {
  startColor: string;
  endColor: string;
}

export interface PdfBorderSide {
  color: string;
  width: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
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
  cellTextColors?: (string | undefined)[][];
  headerBackgrounds?: (string | undefined)[];
  headerTextColors?: (string | undefined)[];
  headerGradients?: (PdfCellGradient | undefined)[];
  tableBorders?: PdfCellBorders;
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
  koreanFontData ??= fetch(getKoreanFontUrl())
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load the bundled Korean PDF font: ${response.status} ${response.statusText}`);
      }
      return response.arrayBuffer();
    })
    .catch((error) => {
      // 실패한 요청은 캐시하지 않아 다음 내보내기에서 재시도할 수 있게 한다.
      koreanFontData = undefined;
      throw error;
    });
  return koreanFontData;
}

export class PdfConverter {
  public async convert(data: PdfTableData, options: PdfExportOptions = {}): Promise<Blob> {
    if (data.columns.length === 0) {
      throw new Error('PDF export requires at least one visible column');
    }

    const fontName = options.customFont?.name ?? options.fontName ?? DEFAULT_FONT_NAME;
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    const margin = options.margin ?? 36;
    if (!Number.isFinite(fontSize) || fontSize <= 0) {
      throw new RangeError('PDF fontSize must be a positive number');
    }
    if (!Number.isFinite(margin) || margin < 0) {
      throw new RangeError('PDF margin must be a non-negative number');
    }
    const fontData =
      options.customFont?.data ??
      (!options.fontName || options.fontName === DEFAULT_FONT_NAME ? await loadKoreanFont() : undefined);

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
      const headerValues = data.columns.map((column) => column.label);
      const headerHeight = this.getRowHeight(doc, headerValues, columnWidths, fontSize);
      if (headerHeight > doc.page.height - margin * 2) {
        reject(new RangeError('PDF header exceeds the available page height'));
        doc.end();
        return;
      }
      let y = margin;
      let tableTop = y;
      const borderRows: { y: number; height: number; borders?: (PdfCellBorders | undefined)[] }[] = [];
      // 인접 셀·행의 배경이 선을 덮지 않도록 페이지 내용 뒤에 테두리를 그린다.
      const drawPageBorders = () => {
        for (const row of borderRows) {
          let cellX = margin;
          columnWidths.forEach((width, index) => {
            this.drawCellBorders(doc, cellX, row.y, width, row.height, row.borders?.[index]);
            cellX += width;
          });
        }
        if (data.tableBorders) {
          this.drawCellBorders(doc, margin, tableTop, pageWidth, y - tableTop, data.tableBorders);
        }
        borderRows.length = 0;
      };

      if (options.title) {
        doc.fontSize(fontSize + 4).text(options.title, margin, y, { width: pageWidth });
        y = doc.y + 10;
        doc.fontSize(fontSize);
      }

      if (y + headerHeight > doc.page.height - margin) {
        doc.addPage();
        y = margin;
      }

      const drawHeader = () => {
        tableTop = y;
        borderRows.push({ y, height: headerHeight, borders: data.headerCellBorders });
        y = this.drawRow(
          doc,
          headerValues,
          columnWidths,
          margin,
          y,
          fontSize,
          true,
          headerHeight,
          data.headerBackgrounds,
          undefined,
          undefined,
          data.headerTextColors,
          data.headerGradients,
        );
      };

      drawHeader();

      for (const [rowIndex, row] of data.rows.entries()) {
        const rowHeight = this.getRowHeight(doc, row, columnWidths, fontSize);
        if (y + rowHeight > doc.page.height - margin) {
          drawPageBorders();
          doc.addPage();
          y = margin;
          drawHeader();
        }
        borderRows.push({ y, height: rowHeight, borders: data.cellBorders?.[rowIndex] });
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
          data.cellCharts?.[rowIndex],
          data.columns.map((column) => column.align),
          data.cellTextColors?.[rowIndex],
        );
      }

      drawPageBorders();
      doc.end();
    });
  }

  public download(blob: Blob, fileName = DEFAULT_FILE_NAME): void {
    downloadExport(blob, fileName, DEFAULT_FILE_NAME, 'pdf');
  }

  private getColumnWidths(
    doc: PDFKit.PDFDocument,
    data: PdfTableData,
    availableWidth: number,
    fontSize: number,
  ): number[] {
    doc.fontSize(fontSize);
    const measuredWidths = data.columns.map((column, index) => {
      const textWidth = (text: string) =>
        text.split(/\r\n|\r|\n/).reduce((longest, line) => Math.max(longest, doc.widthOfString(line)), 0);
      const longestWidth = data.rows.reduce(
        (longest, row) => Math.max(longest, textWidth(row[index] ?? '')),
        textWidth(column.label),
      );
      const configuredWidth = column.width;
      const baseWidth =
        configuredWidth !== undefined && Number.isFinite(configuredWidth) && configuredWidth > 0 ? configuredWidth : 40;
      return configuredWidth !== undefined && Number.isFinite(configuredWidth) && configuredWidth > 0
        ? configuredWidth
        : Math.max(baseWidth, longestWidth + CELL_PADDING * 2);
    });
    const totalWidth = measuredWidths.reduce((sum, width) => sum + width, 0);
    const scale = availableWidth / totalWidth;

    return measuredWidths.map((width) => width * scale);
  }

  private getRowHeight(doc: PDFKit.PDFDocument, values: string[], widths: number[], fontSize: number): number {
    doc.fontSize(fontSize);
    const textHeight = widths.reduce((height, width, index) => {
      const cellHeight = doc.heightOfString(values[index] ?? '', {
        width: Math.max(width - CELL_PADDING * 2, 1),
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
    cellCharts?: (PdfCellChart | undefined)[],
    aligns?: PdfColumn['align'][],
    textColors?: (string | undefined)[],
    gradients?: (PdfCellGradient | undefined)[],
  ): number {
    let cellX = x;
    doc.fontSize(fontSize);

    for (let index = 0; index < widths.length; index++) {
      const width = widths[index];
      if (header) {
        const gradient = gradients?.[index];
        const background = gradient
          ? doc.linearGradient(cellX, y, cellX, y + rowHeight)
              .stop(0, normalizePdfColor(gradient.startColor))
              .stop(1, normalizePdfColor(gradient.endColor))
          : normalizePdfColor(cellBackgrounds?.[index] || '#e9edf2');
        doc
          .save()
          .rect(cellX, y, width, rowHeight)
          .fill(background)
          .restore();
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
      const chart = cellCharts?.[index];
      if (chart) {
        this.drawCellChart(doc, chart, cellX, y, width, rowHeight, fontSize);
      } else {
        doc
          .fillColor(normalizePdfColor(textColors?.[index] || '#222222'))
          .text(values[index] ?? '', cellX + CELL_PADDING, y + CELL_PADDING, {
            width: Math.max(width - CELL_PADDING * 2, 1),
            height: rowHeight - CELL_PADDING * 2,
            lineBreak: true,
            align: header ? 'center' : aligns?.[index] ?? 'left',
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
      if (!border || !Number.isFinite(border.width) || border.width <= 0) {
        continue;
      }

      const start =
        side === 'top' || side === 'bottom' ? [x, side === 'top' ? y : y + height] : [side === 'left' ? x : x + width, y];
      const end =
        side === 'top' || side === 'bottom'
          ? [x + width, side === 'top' ? y : y + height]
          : [side === 'left' ? x : x + width, y + height];
      const lineWidth = (border.width * 72) / 96;
      doc.save().strokeColor(normalizePdfColor(border.color)).lineWidth(lineWidth);
      if (border.style === 'dashed') {
        doc.dash(lineWidth * 3, { space: lineWidth * 3 });
      } else if (border.style === 'dotted') {
        doc.lineCap('round').dash(0.01, { space: lineWidth * 2 });
      } else {
        doc.undash();
      }
      if (border.style === 'double') {
        const horizontal = side === 'top' || side === 'bottom';
        doc.lineWidth(lineWidth / 3);
        for (const offset of [-lineWidth / 3, lineWidth / 3]) {
          doc
            .moveTo(start[0] + (horizontal ? 0 : offset), start[1] + (horizontal ? offset : 0))
            .lineTo(end[0] + (horizontal ? 0 : offset), end[1] + (horizontal ? offset : 0))
            .stroke();
        }
      } else {
        doc.moveTo(start[0], start[1]).lineTo(end[0], end[1]).stroke();
      }
      doc.restore();
    }
  }
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
