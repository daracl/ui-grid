/** @jest-environment node */
import { JsonConverter } from '@/export/json/JsonConverter';
import { createJsonData } from '@/export/json/JsonExport';
import type { FieldItem } from '@/types/GridField';

describe('JSON 내보내기', () => {
  const converter = new JsonConverter();
  it('한글과 원본 값 타입을 JSON 배열로 보존한다', async () => {
    const rows = [{ name: '한글', number: 12, flag: false, empty: null, values: [1, 2], nested: { a: 1 } }];
    const blob = converter.convert(rows);
    expect(blob.type).toBe('application/json;charset=utf-8');
    expect(await blob.text()).toBe(JSON.stringify(rows, null, 2));
    expect(await converter.convert(rows, { space: 0 }).text()).toBe(JSON.stringify(rows));
    expect(await converter.convert([]).text()).toBe('[]');
  });
  it('잘못된 들여쓰기는 오류로 전달한다', () => {
    for (const space of [-1, 11, 1.5, NaN]) expect(() => converter.convert([], { space })).toThrow(RangeError);
  });
  it('지정 필드만 출력하고 내부 상태·가상 행은 제외하며 원본을 변경하지 않는다', () => {
    const item = { amount: 1200, missing: undefined, internal: 'private' };
    const context = {
      fields: [
        { name: 'amount', $renderer: { getValue: () => '1,200' } },
        { name: 'missing', $renderer: { getValue: () => undefined } },
      ] as unknown as FieldItem[],
      viewItems: [{ id: 'a' }, { id: 'total', groupRowType: 'total' }] as any,
      groupingFields: [],
      sumFields: [],
      getRowItem: () => item,
    };
    expect(createJsonData(context)).toEqual([{ amount: 1200, missing: null }]);
    expect(createJsonData(context, { useFormatter: true })).toEqual([{ amount: '1,200', missing: '' }]);
    expect(item).toEqual({ amount: 1200, missing: undefined, internal: 'private' });
  });
});
