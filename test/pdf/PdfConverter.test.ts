/** @jest-environment node */

import { readFileSync } from 'fs';
import path from 'path';
import { inflateSync } from 'zlib';
import { normalizePdfColor, PdfConverter } from '@/pdf/PdfConverter';

describe('PdfConverter', () => {
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
