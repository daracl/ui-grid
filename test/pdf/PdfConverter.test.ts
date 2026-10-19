/** @jest-environment node */

import { readFileSync } from 'fs';
import path from 'path';
import { inflateSync } from 'zlib';
import { normalizePdfColor, PdfConverter } from '@/export/pdf/PdfConverter';
import PDFDocument from 'pdfkit';

describe('PdfConverter', () => {
  it('loads and caches font files separately by URL and retries failed requests', async () => {
    const fontData = readFileSync(path.join(__dirname, '../../public/assets/NotoSansKR-Regular.ttf'));
    const fetchFont = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => ({
      ok: true,
      arrayBuffer: async () => fontData,
    } as unknown as Response));
    const data = { columns: [{ name: 'name', label: '이름' }], rows: [['김민수']] };
    const converter = new PdfConverter();
    try {
      const blob = await converter.convert(data, { fontUrl: '/fonts/first.ttf' });
      expect(Buffer.from(await blob.arrayBuffer()).toString('latin1')).toContain('/FontFile2');
      await converter.convert(data, { fontUrl: '/fonts/first.ttf' });
      await converter.convert(data, { fontUrl: '/fonts/second.ttf' });
      expect(fetchFont.mock.calls.map(([url]) => url)).toEqual(['/fonts/first.ttf', '/fonts/second.ttf']);

      fetchFont.mockRejectedValueOnce(new Error('network error'));
      await expect(converter.convert(data, { fontUrl: '/fonts/retry.ttf' })).rejects.toThrow('network error');
      await converter.convert(data, { fontUrl: '/fonts/retry.ttf' });
      expect(fetchFont).toHaveBeenCalledTimes(4);

      await converter.convert(data, {
        fontUrl: '/fonts/unused.ttf',
        customFont: { name: 'Custom', data: fontData },
      });
      expect(fetchFont).toHaveBeenCalledTimes(4);
    } finally {
      fetchFont.mockRestore();
    }
  });

  it('draws the full merged header once and repeats only leaf headers on subsequent pages', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text');
    try {
      const blob = await new PdfConverter().convert({
        columns: [{ name: 'a', label: 'Leaf A' }, { name: 'b', label: 'Leaf B' }],
        rows: Array.from({ length: 30 }, (_, index) => [`Row ${index}`, 'Data']),
        firstPageHeader: [
          [{ label: 'Parent', column: 0, colSpan: 2, rowSpan: 1 }],
          [{ label: 'Middle', column: 0, colSpan: 2, rowSpan: 1 }],
          [{ label: 'Leaf A', column: 0, colSpan: 1, rowSpan: 1 }, { label: 'Leaf B', column: 1, colSpan: 1, rowSpan: 1 }],
        ],
      }, { pageSize: [240, 240], margin: 20, orientation: 'portrait', fontName: 'Helvetica' });
      const pdf = Buffer.from(await blob.arrayBuffer()).toString('latin1');
      const pages = (pdf.match(/\/Type \/Page\b/g) ?? []).length;
      expect(pages).toBeGreaterThan(1);
      expect(text.mock.calls.filter(([value]) => value === 'Parent')).toHaveLength(1);
      expect(text.mock.calls.filter(([value]) => value === 'Middle')).toHaveLength(1);
      expect(text.mock.calls.filter(([value]) => value === 'Leaf A')).toHaveLength(pages);
      expect(text.mock.calls.filter(([value]) => value === 'Leaf B')).toHaveLength(pages);
      expect(text.mock.calls.filter(([value]) => /^Row \d+$/.test(String(value)))).toHaveLength(30);
    } finally { text.mockRestore(); }
  });

  it('repeats dark header gradients with readable text on every page', async () => {
    const gradient = jest.spyOn(PDFDocument.prototype, 'linearGradient');
    const color = jest.spyOn(PDFDocument.prototype, 'fillColor');
    try {
      const blob = await new PdfConverter().convert({
        columns: [{ name: 'name', label: 'Dark header' }],
        rows: Array.from({ length: 30 }, (_, index) => [`Row ${index}`]),
        headerGradients: [{ startColor: 'rgb(82, 82, 82)', endColor: 'rgb(0, 0, 0)' }],
        headerTextColors: ['rgb(224, 224, 224)'],
      }, { pageSize: [200, 200], orientation: 'portrait', margin: 20, fontName: 'Helvetica' });
      const pdf = Buffer.from(await blob.arrayBuffer()).toString('latin1');
      const pages = pdf.match(/\/Type \/Page\b/g) ?? [];
      expect(pages.length).toBeGreaterThan(1);
      expect(gradient).toHaveBeenCalledTimes(pages.length);
      expect(color).toHaveBeenCalledWith('#e0e0e0');
      expect(pdf).toContain('/ShadingType 2');
    } finally {
      gradient.mockRestore();
      color.mockRestore();
    }
  });

  it('paints borders after all cell backgrounds on each page and repeats the outer frame', async () => {
    const fill = jest.spyOn(PDFDocument.prototype, 'fill');
    const stroke = jest.spyOn(PDFDocument.prototype, 'stroke');
    const addPage = jest.spyOn(PDFDocument.prototype, 'addPage');
    const moveTo = jest.spyOn(PDFDocument.prototype, 'moveTo');
    try {
      await new PdfConverter().convert(
        {
          columns: [{ name: 'a', label: 'A' }, { name: 'b', label: 'B' }],
          rows: Array.from({ length: 12 }, () => ['one', 'two']),
          cellBackgrounds: Array.from({ length: 12 }, () => ['#ffffff', '#eeeeee']),
          tableBorders: { top: { color: '#123456', width: 2 }, left: { color: '#123456', width: 2 } },
        },
        { pageSize: [200, 200], orientation: 'portrait', margin: 20, fontName: 'Helvetica' },
      );
      const pageStarts = addPage.mock.invocationCallOrder;
      expect(pageStarts.length).toBeGreaterThan(1);
      for (let index = 0; index < pageStarts.length; index++) {
        const start = pageStarts[index];
        const end = pageStarts[index + 1] ?? Infinity;
        const fills = fill.mock.invocationCallOrder.filter((order) => order > start && order < end);
        const strokes = stroke.mock.invocationCallOrder.filter((order) => order > start && order < end);
        expect(Math.min(...strokes)).toBeGreaterThan(Math.max(...fills));
      }
      expect(moveTo.mock.calls.filter(([x, y]) => x === 20 && y === 20)).toHaveLength(pageStarts.length * 2);
    } finally {
      fill.mockRestore();
      stroke.mockRestore();
      addPage.mockRestore();
      moveTo.mockRestore();
    }
  });

  it('preserves borderless cells and dashed or dotted borders', async () => {
    const stroke = jest.spyOn(PDFDocument.prototype, 'stroke');
    const dash = jest.spyOn(PDFDocument.prototype, 'dash');
    try {
      const converter = new PdfConverter();
      const options = { fontName: 'Helvetica' };
      await converter.convert({
        columns: [{ name: 'a', label: 'A' }], rows: [['one']],
        headerCellBorders: [{}], cellBorders: [[{}]], tableBorders: {},
      }, options);
      expect(stroke).not.toHaveBeenCalled();
      await converter.convert({
        columns: [{ name: 'a', label: 'A' }], rows: [['one']],
        headerCellBorders: [{}],
        cellBorders: [[{ right: { color: '#000000', width: 2, style: 'dashed' },
          bottom: { color: '#000000', width: 1, style: 'dotted' } }]],
      }, options);
      expect(stroke).toHaveBeenCalledTimes(2);
      expect(dash).toHaveBeenCalledWith(4.5, { space: 4.5 });
      expect(dash).toHaveBeenCalledWith(0.01, { space: 1.5 });
    } finally {
      stroke.mockRestore();
      dash.mockRestore();
    }
  });

  it('keeps configured column proportions and applies text alignment and color', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text');
    const rect = jest.spyOn(PDFDocument.prototype, 'rect');
    const fillColor = jest.spyOn(PDFDocument.prototype, 'fillColor');
    try {
      await new PdfConverter().convert(
        {
          columns: [
            { name: 'name', label: 'Name', width: 40, align: 'left' },
            { name: 'amount', label: 'Amount', width: 120, align: 'right' },
          ],
          rows: [['A very long label that wraps within its narrow column', '123']],
          cellTextColors: [[undefined, 'rgb(255, 0, 0)']],
        },
        { pageSize: [200, 400], orientation: 'portrait', margin: 20, fontName: 'Helvetica' },
      );
      expect(rect).toHaveBeenCalledWith(20, 20, 40, expect.any(Number));
      expect(rect).toHaveBeenCalledWith(60, 20, 120, expect.any(Number));
      expect(text).toHaveBeenCalledWith('123', expect.any(Number), expect.any(Number), expect.objectContaining({ align: 'right' }));
      expect(fillColor).toHaveBeenCalledWith('#ff0000');
    } finally {
      text.mockRestore();
      rect.mockRestore();
      fillColor.mockRestore();
    }
  });

  it('rejects invalid options before requesting a font and retries a failed font request', async () => {
    const originalFetch = globalThis.fetch;
    const fontData = readFileSync(path.join(__dirname, '../../public/assets/NotoSansKR-Regular.ttf'));
    const fetchFont = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Unavailable' })
      .mockResolvedValueOnce({ ok: true, arrayBuffer: async () => fontData });
    globalThis.fetch = fetchFont;
    const converter = new PdfConverter();
    const data = { columns: [{ name: 'name', label: '이름' }], rows: [['김민수']] };

    try {
      await expect(converter.convert(data, { fontSize: 0 })).rejects.toThrow(RangeError);
      expect(fetchFont).not.toHaveBeenCalled();
      await expect(converter.convert(data)).rejects.toThrow('503 Unavailable');
      const blobs = await Promise.all([converter.convert(data), converter.convert(data)]);
      expect(blobs.every((blob) => blob.type === 'application/pdf' && blob.size > 0)).toBe(true);
      expect(fetchFont).toHaveBeenCalledTimes(2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('preserves multiline headers on repeated pages', async () => {
    const blob = await new PdfConverter().convert(
      {
        columns: [{ name: 'name', label: 'FIRST\nSECOND\nTHIRD' }],
        rows: Array.from({ length: 30 }, (_, index) => [`Row ${index}`]),
      },
      { pageSize: [200, 200], orientation: 'portrait', margin: 20, fontName: 'Helvetica' },
    );
    const pdfText = Buffer.from(await blob.arrayBuffer()).toString('latin1');
    const streams: string[] = [];
    for (const match of pdfText.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
      try {
        streams.push(inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1'));
      } catch {
        continue;
      }
    }
    const pages = pdfText.match(/\/Type \/Page\b/g) ?? [];
    expect(pages.length).toBeGreaterThan(1);
    // 마지막 헤더 줄이 모든 페이지에 출력되는지 확인한다.
    expect(streams.filter((stream) => stream.includes(Buffer.from('THIRD').toString('hex')))).toHaveLength(
      pages.length,
    );
  });

  it('creates a paginated PDF blob from table data', async () => {
    const converter = new PdfConverter();
    const rows = Array.from({ length: 80 }, (_, index) => [`Order ${index + 1}`, String(index + 1)]);

    const blob = await converter.convert(
      {
        columns: [
          { name: 'name', label: 'Order' },
          { name: 'amount', label: 'Amount' },
        ],
        rows,
      },
      {
        title: 'Orders',
        orientation: 'portrait',
        fontName: 'Helvetica',
        fontSize: 10,
      },
    );

    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(0);
    await expect(blob.slice(0, 5).text()).resolves.toBe('%PDF-');
  });

  it('embeds a Korean-capable font so Hangul text is preserved', async () => {
    const fontData = readFileSync(path.join(__dirname, '../../public/assets/NotoSansKR-Regular.ttf'));
    const converter = new PdfConverter();
    const blob = await converter.convert(
      {
        columns: [{ name: 'name', label: '이름' }],
        rows: [['김민수']],
      },
      { customFont: { name: 'NotoSansKR', data: fontData } },
    );
    const pdfBytes = Buffer.from(await blob.arrayBuffer());

    expect(blob.type).toBe('application/pdf');
    expect(pdfBytes.toString('latin1')).toContain('/FontFile2');
    expect(pdfBytes.toString('latin1')).toContain('/ToUnicode');
  });

  it('converts CSS rgb cell backgrounds to PDF colors without obscuring text', async () => {
    expect(normalizePdfColor('rgb(249, 249, 249)')).toBe('#f9f9f9');
    expect(normalizePdfColor('rgba(0, 0, 0, 0.5)')).toBe('#808080');

    const converter = new PdfConverter();
    const blob = await converter.convert({
      columns: [{ name: 'category', label: 'Category' }],
      rows: [['Korea 합계']],
      cellBackgrounds: [['rgb(249, 249, 249)']],
      cellBorders: [
        [
          {
            right: { color: '#cdcdcd', width: 1 },
            bottom: { color: '#cdcdcd', width: 1 },
          },
        ],
      ],
    }, {
      customFont: {
        name: 'NotoSansKR',
        data: readFileSync(path.join(__dirname, '../../public/assets/NotoSansKR-Regular.ttf')),
      },
    });
    const pdfBytes = Buffer.from(await blob.arrayBuffer());
    const pdfText = pdfBytes.toString('latin1');
    const contentStreams: string[] = [];
    const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch: RegExpExecArray | null;

    while ((streamMatch = streamPattern.exec(pdfText)) !== null) {
      try {
        contentStreams.push(inflateSync(Buffer.from(streamMatch[1], 'latin1')).toString('latin1'));
      } catch {
        continue;
      }
    }

    expect(contentStreams.some((stream) => stream.includes('0.9764705882352941 0.9764705882352941 0.9764705882352941 scn'))).toBe(
      true,
    );
    expect(contentStreams.some((stream) => stream.includes('0.75 w'))).toBe(true);
    expect(contentStreams.some((stream) => /RG/.test(stream))).toBe(true);
    expect(contentStreams.some((stream) => stream.includes('BT') && stream.includes('Tf'))).toBe(true);
  });

  it('draws bar, sparkline, and sparkline-bar cells as vector charts', async () => {
    const converter = new PdfConverter();
    const blob = await converter.convert(
      {
        columns: [
          { name: 'bar', label: 'Bar' },
          { name: 'line', label: 'Line' },
          { name: 'sparkBars', label: 'Spark bars' },
        ],
        rows: [['', '', '']],
        cellCharts: [
          [
            { type: 'bar', value: 60, minimum: 0, maximum: 100, label: '60%', color: '#77c0fc' },
            { type: 'sparkline', values: [1, 5, 3, 8] },
            { type: 'sparklineBar', values: [1, 5, 3, 8] },
          ],
        ],
      },
      {
        customFont: {
          name: 'NotoSansKR',
          data: readFileSync(path.join(__dirname, '../../public/assets/NotoSansKR-Regular.ttf')),
        },
      },
    );
    const pdfText = Buffer.from(await blob.arrayBuffer()).toString('latin1');
    const contentStreams: string[] = [];
    const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch: RegExpExecArray | null;

    while ((streamMatch = streamPattern.exec(pdfText)) !== null) {
      try {
        contentStreams.push(inflateSync(Buffer.from(streamMatch[1], 'latin1')).toString('latin1'));
      } catch {
        continue;
      }
    }

    const pageContent = contentStreams.join('\n');
    expect(pageContent).toContain('0.4666666666666667 0.7529411764705882 0.9882352941176471 scn');
    expect(pageContent).toContain('0 0.47843137254901963 0.8 SCN');
    expect(pageContent).toContain('0.1568627450980392 0.6549019607843137 0.27058823529411763 scn');
    expect(pageContent).toContain('re');
    expect(pageContent).toContain(' l');
    expect(pageContent).toContain('\nS');
  });
});
