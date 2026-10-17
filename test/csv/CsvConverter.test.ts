/** @jest-environment node */
import { CsvConverter } from '@/export/csv/CsvConverter';
import { createCsvData } from '@/export/csv/CsvExport';
import type { FieldItem } from '@/types/GridField';

describe('CSV export', () => {
  const converter = new CsvConverter();
  it('escapes delimiters, quotes and embedded newlines with CRLF records', () => {
    expect(
      converter.serialize(
        ['이름', '값'],
        [
          ['한글,값', 'say "hi"'],
          ['줄\n바꿈', null],
        ],
      ),
    ).toBe('이름,값\r\n"한글,값","say ""hi"""\r\n"줄\n바꿈",');
  });
  it('supports custom separators, quote, null replacement, header exclusion and line endings', () => {
    expect(
      converter.serialize(
        ['Header'],
        [
          [null, 'a;b'],
          [undefined, "it's"],
        ],
        {
          includeHeader: false,
          delimiter: ';',
          quote: "'",
          nullValue: 'NULL',
          lineEnding: '\n',
        },
      ),
    ).toBe("NULL;'a;b'\nNULL;'it''s'");
  });
  it('protects text formulas and headers, preserving native negative numbers', () => {
    expect(converter.serialize(['=H'], [['=1', ' +1', '-1', '@A', '\tcmd', -12]])).toBe(
      "'=H\r\n'=1,' +1,'-1,'@A,'\tcmd,-12",
    );
    expect(converter.serialize([], [['=1']], { includeHeader: false, escapeFormula: false })).toBe('=1');
    expect(converter.serialize([], [[null]], { includeHeader: false, nullValue: '=1' })).toBe("'=1");
  });
  it('encodes UTF-8 and UTF-16LE with optional BOM', async () => {
    const utf8 = new Uint8Array(await converter.convert(['한글'], []).arrayBuffer());
    expect([...utf8.slice(0, 3)]).toEqual([239, 187, 191]);
    expect(Buffer.from(utf8.slice(3)).toString('utf8')).toBe('한글');
    expect(await converter.convert(['한글'], [], { bom: false }).text()).toBe('한글');
    const utf16 = Buffer.from(await converter.convert(['한글'], [], { encoding: 'utf-16le' }).arrayBuffer());
    expect([...utf16.slice(0, 2)]).toEqual([255, 254]);
    expect(utf16.subarray(2).toString('utf16le')).toBe('한글');
  });
  it('rejects unsupported encoding and malformed syntax options', () => {
    expect(() => converter.convert([], [], { encoding: 'euc-kr' as any })).toThrow(RangeError);
    for (const options of [{ quote: '' }, { delimiter: '\n' }, { quote: 'ab' }, { delimiter: '"' }]) {
      expect(() => converter.serialize([], [], options)).toThrow(RangeError);
    }
  });
  it('uses display values on request and raw values otherwise, excluding virtual rows', () => {
    const context = {
      fields: [{ name: 'amount', label: '금액', $renderer: { getValue: () => '1,200' } }] as unknown as FieldItem[],
      viewItems: [{ id: 'a' }, { id: 'total', groupRowType: 'total' }] as any,
      groupingFields: [],
      sumFields: [],
      getRowItem: () => ({ amount: 1200 }),
    };
    expect(createCsvData(context).rows).toEqual([['1,200']]);
    expect(createCsvData(context, { useFormatter: false }).rows).toEqual([[1200]]);
  });
});
