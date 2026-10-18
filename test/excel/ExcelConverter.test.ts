/** @jest-environment node */
import { crc32 } from 'zlib';
import { ExcelConverter } from '@/export/excel/ExcelConverter';
import { createExcelData } from '@/export/excel/ExcelData';
import { createZip } from '@/export/excel/ZipWriter';
import { FieldItem } from '@/types/GridField';
import { ViewItem } from '@/types/Common';

function unzip(bytes: Uint8Array): Record<string, string> {
  const buffer = Buffer.from(bytes);
  const files: Record<string, string> = {};
  let offset = 0;
  while (buffer.readUInt32LE(offset) === 0x04034b50) {
    expect(buffer.readUInt16LE(offset + 8)).toBe(0);
    const size = buffer.readUInt32LE(offset + 18);
    const nameSize = buffer.readUInt16LE(offset + 26);
    const extraSize = buffer.readUInt16LE(offset + 28);
    const name = buffer.subarray(offset + 30, offset + 30 + nameSize).toString('utf8');
    const start = offset + 30 + nameSize + extraSize;
    const data = buffer.subarray(start, start + size);
    expect(crc32(data)).toBe(buffer.readUInt32LE(offset + 14));
    files[name] = data.toString('utf8');
    offset = start + size;
  }
  expect(buffer.readUInt32LE(offset)).toBe(0x02014b50);
  expect(buffer.readUInt32LE(buffer.length - 22)).toBe(0x06054b50);
  expect(buffer.readUInt32LE(buffer.length - 6)).toBe(offset);
  return files;
}

describe('dependency-free XLSX export', () => {
  it('exports every header level and shifts merges, filters, outlines and charts below it', async () => {
    const data = {
      columns: [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ],
      rows: [
        ['one', ''],
        ['two', ''],
      ],
      merges: ['A2:A3'],
      outlineLevels: [1, 2],
      headerRows: [
        [{ label: 'Top', column: 0, colSpan: 2, rowSpan: 1 }],
        [{ label: 'Middle', column: 0, colSpan: 2, rowSpan: 1 }],
        [
          { label: 'A', column: 0, colSpan: 1, rowSpan: 1 },
          { label: 'B', column: 1, colSpan: 1, rowSpan: 1 },
        ],
      ],
      cellCharts: [[undefined, { type: 'sparkline' as const, values: [1, 2, 3] }]],
    };
    const blob = new ExcelConverter().convert(data, { autoFilter: true });
    const files = unzip(new Uint8Array(await blob.arrayBuffer()));
    const sheet = files['xl/worksheets/sheet1.xml'];
    expect(sheet).toContain('>Top</t>');
    expect(sheet).toContain('>Middle</t>');
    expect(sheet).toContain('ref="A1:B1"');
    expect(sheet).toContain('ref="A2:B2"');
    expect(sheet).toContain('ref="A4:A5"');
    expect(sheet).toContain('dimension ref="A1:B5"');
    expect(sheet).toContain('ySplit="3" topLeftCell="A4"');
    expect(sheet).toContain('autoFilter ref="A3:B5"');
    expect(sheet).toMatch(/<row r="4"[^>]*outlineLevel="1"/);
    expect(files['xl/drawings/drawing1.xml']).toContain('<xdr:row>3</xdr:row>');
    const unmerged = unzip(
      new Uint8Array(await new ExcelConverter().convert(data, { mergeCells: false }).arrayBuffer()),
    );
    expect(unmerged['xl/worksheets/sheet1.xml']).not.toContain('<mergeCell ');
  });

  it('exports tree depth as cell indentation and worksheet row outlines', async () => {
    const fields = [
      { name: 'name', label: '조직', renderer: { type: 'tree' }, $renderer: { getValue: (item: any) => item.name } },
    ] as FieldItem[];
    const data = createExcelData({
      fields,
      groupingFields: [],
      summaryFieldNames: [],
      viewItems: [
        { id: 'a', depth: 0 },
        { id: 'b', depth: 1 },
        { id: 'c', depth: 2 },
      ] as unknown as ViewItem[],
      getRowItem: (id) => ({ name: String(id) }),
    });
    expect(data.cellIndents).toEqual([[0], [1], [2]]);
    const files = unzip(new Uint8Array(await new ExcelConverter().convert(data).arrayBuffer()));
    expect(files['xl/styles.xml']).toContain('indent="1"');
    expect(files['xl/styles.xml']).toContain('indent="2"');
    expect(files['xl/worksheets/sheet1.xml']).toContain('outlineLevel="2"');
    expect(files['xl/worksheets/sheet1.xml']).toContain('summaryBelow="0"');
  });
  it('packages bar and sparkline vectors instead of array-valued cells', async () => {
    const fields = ['bar', 'line', 'bars'].map((name) => ({
      name,
      label: name,
      renderer: { type: name === 'bar' ? 'bar' : 'sparkline' },
      $renderer: { getValue: () => [1, 5, 2] },
    })) as unknown as FieldItem[];
    const data = createExcelData({
      fields,
      groupingFields: [],
      summaryFieldNames: [],
      viewItems: [{ id: 'a' }] as ViewItem[],
      getRowItem: () => ({}),
      getCellCharts: () => [
        { type: 'bar', value: -5, minimum: -10, maximum: 10, label: '-5 & <label>', color: '#ff8989' },
        { type: 'sparkline', values: [1, 5, 2] },
        { type: 'sparklineBar', values: [1, 5, 2] },
      ],
      rowHeight: 30,
    });
    expect(data.rows).toEqual([['', '', '']]);
    const files = unzip(new Uint8Array(await new ExcelConverter().convert(data).arrayBuffer()));
    const drawing = files['xl/drawings/drawing1.xml'];
    expect(drawing.match(/<xdr:twoCellAnchor /g)).toHaveLength(3);
    expect(drawing).toContain('-5 &amp; &lt;label&gt;');
    expect(drawing).toContain('val="FF8989"');
    expect(drawing).toContain('<a:custGeom>');
    expect(drawing).toContain('prst="ellipse"');
    const ids = [...drawing.matchAll(/cNvPr id="(\d+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(files['xl/worksheets/sheet1.xml']).not.toContain('[1,5,2]');
    expect(files['xl/worksheets/sheet1.xml']).toContain('<drawing r:id="rId1"/>');
    expect(files['xl/worksheets/_rels/sheet1.xml.rels']).toContain('../drawings/drawing1.xml');
    expect(files['[Content_Types].xml']).toContain('application/vnd.openxmlformats-officedocument.drawing+xml');
  });
  it('writes a valid UTF-8 ZIP with CRCs and directory offsets', () => {
    expect(unzip(createZip({ '한글.xml': '<test>한글</test>', empty: '' }))).toEqual({
      '한글.xml': '<test>한글</test>',
      empty: '',
    });
  });
  it('writes native numbers and booleans, safe strings, styles, widths, and merges', async () => {
    const blob = new ExcelConverter().convert(
      {
        columns: [
          { name: 'name', label: '이름 & <분류>', width: 180 },
          { name: 'amount', label: 'Amount', align: 'right' },
        ],
        rows: [
          ['=HYPERLINK("https://example.com")', 0],
          ['한글\nline', false],
        ],
        merges: ['A2:A3'],
        headerGradients: [{ startColor: '#525252', endColor: '#000000' }],
        headerTextColors: ['#e0e0e0'],
        cellBackgrounds: [['#ff0000']],
      },
      { sheetName: '내보내기', autoFilter: true },
    );
    const files = unzip(new Uint8Array(await blob.arrayBuffer()));
    expect(Object.keys(files)).toHaveLength(6);
    expect(files['[Content_Types].xml']).toContain('spreadsheetml.sheet.main+xml');
    expect(files['xl/workbook.xml']).toContain('name="내보내기"');
    expect(files['xl/_rels/workbook.xml.rels']).toContain('Target="worksheets/sheet1.xml"');
    const sheet = files['xl/worksheets/sheet1.xml'];
    expect(sheet).toContain('이름 &amp; &lt;분류&gt;');
    expect(sheet).toContain('=HYPERLINK(&quot;https://example.com&quot;)');
    expect(sheet).not.toContain('<f>');
    expect(sheet).toMatch(/r="B2" s="\d+"><v>0<\/v>/);
    expect(sheet).toMatch(/r="B3" s="\d+" t="b"><v>0<\/v>/);
    expect(sheet).toContain('<mergeCell ref="A2:A3"/>');
    expect(sheet).toContain('state="frozen"');
    expect(sheet).toContain('<autoFilter ref="A1:B3"/>');
    expect(files['xl/styles.xml']).toContain('gradientFill');
    expect(files['xl/styles.xml']).toContain('FFE0E0E0');
    expect(files['xl/styles.xml']).toContain('FFFF0000');
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
  it('rejects invalid worksheet dimensions, names, and overlong cells', () => {
    const converter = new ExcelConverter();
    expect(() => converter.convert({ columns: [], rows: [], merges: [] })).toThrow(RangeError);
    const data = { columns: [{ name: 'x', label: 'X' }], rows: [], merges: [] };
    expect(() => converter.convert(data, { sheetName: 'bad/name' })).toThrow('sheet name');
    expect(() => converter.convert({ ...data, rows: [['a'.repeat(32768)]] })).toThrow('32767');
  });
  it('supports empty data and optional header freezing and filtering', async () => {
    const blob = new ExcelConverter().convert(
      { columns: [{ name: 'x', label: 'X' }], rows: [], merges: [] },
      { freezeHeader: false },
    );
    const files = unzip(new Uint8Array(await blob.arrayBuffer()));
    expect(files['xl/worksheets/sheet1.xml']).toContain('ref="A1:A1"');
    expect(files['xl/worksheets/sheet1.xml']).not.toContain('<pane');
    expect(files['xl/worksheets/sheet1.xml']).not.toContain('<autoFilter');
  });
  it('merges hierarchical rowSpan values without crossing group summaries', () => {
    const items: Record<string, any> = {
      a: { category: 'A', code: 'X', amount: 0 },
      b: { category: 'A', code: 'X', amount: 2 },
      c: { category: 'B', code: 'X', amount: 3 },
    };
    const fields = ['category', 'code', 'amount'].map((name) => ({
      name,
      label: name,
      renderer: { type: name === 'amount' ? 'number' : 'text' },
      $renderer: { getValue: (item: any) => item[name] },
    })) as FieldItem[];
    const context = {
      fields,
      viewItems: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as ViewItem[],
      groupingFields: [],
      summaryFieldNames: [],
      getRowItem: (id: string | number) => items[id],
    };
    const data = createExcelData(context, ['category', 'code']);
    expect(data.merges).toEqual(['A2:A3', 'B2:B3']);
    expect(data.rows[0][2]).toBe(0);
    expect(data.rows[1]).toEqual(['', '', 2]);
    const grouped = createExcelData(
      {
        ...context,
        groupingFields: ['category'],
        summaryFieldNames: ['amount'],
        viewItems: [
          { id: 'a' },
          { id: 'b' },
          {
            id: 'sum',
            groupRowType: 'groupSummary',
            groupField: 'category',
            groupValue: 'A',
            groupSums: { amount: 2 },
          },
          { id: 'c' },
        ] as ViewItem[],
      },
      ['category'],
    );
    expect(grouped.merges).toEqual(['A2:A3']);
    expect(grouped.rows[2]).toEqual(['A 합계', '', 2]);
  });
});
