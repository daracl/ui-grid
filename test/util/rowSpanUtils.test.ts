import { getRowSpanEnd, getRowSpanKeys, getRowSpanRange } from '../../src/util/rowSpanUtils';

const rows: Record<string, any> = {
  1: { a: 'A', b: 'x' },
  2: { a: 'A', b: 'x' },
  3: { a: 'A', b: 'y' },
  4: { a: 'B', b: 'y' },
  6: { a: 'B', b: 'y' },
};

// id 5는 그룹 합계 행
const viewItems: any[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5, groupRowType: 'groupSummary' },
  { id: 6 },
];
const getRowItem = (id: any) => rows[id];

describe('rowSpanUtils', () => {
  it('병합 키는 자기 자신까지의 상위 필드를 포함한다', () => {
    expect(getRowSpanKeys(['a', 'b'], 'a')).toEqual(['a']);
    expect(getRowSpanKeys(['a', 'b'], 'b')).toEqual(['a', 'b']);
    expect(getRowSpanKeys(['a', 'b'], 'c')).toEqual([]);
    expect(getRowSpanKeys(undefined, 'a')).toEqual([]);
  });

  it('병합 블록 끝(exclusive)을 구하고 limit과 그룹 행에서 멈춘다', () => {
    expect(getRowSpanEnd(viewItems, getRowItem, ['a'], 0)).toBe(3);
    expect(getRowSpanEnd(viewItems, getRowItem, ['a', 'b'], 0)).toBe(2);
    expect(getRowSpanEnd(viewItems, getRowItem, ['a'], 0, 2)).toBe(2);
    expect(getRowSpanEnd(viewItems, getRowItem, ['a'], 3)).toBe(4);
    expect(getRowSpanEnd(viewItems, getRowItem, ['a'], 4)).toBe(5);
    expect(getRowSpanEnd(viewItems, getRowItem, [], 0)).toBe(1);
  });

  it('행이 속한 병합 블록 범위를 구한다', () => {
    expect(getRowSpanRange(viewItems, getRowItem, ['a'], 1)).toEqual({ start: 0, end: 2 });
    expect(getRowSpanRange(viewItems, getRowItem, ['a', 'b'], 2)).toEqual({ start: 2, end: 2 });
    expect(getRowSpanRange(viewItems, getRowItem, ['a'], 5)).toEqual({ start: 5, end: 5 });
    expect(getRowSpanRange(viewItems, getRowItem, [], 1)).toEqual({ start: 1, end: 1 });
  });

  describe('여러 단계 그룹 소계 행과 함께 병합(이어 그리기)', () => {
    const groupingFields = ['p', 'n'];
    const data: Record<string, any> = {
      1: { p: 'P1', n: 'A' },
      2: { p: 'P1', n: 'A' },
      3: { p: 'P1', n: 'B' },
      4: { p: 'P2', n: 'A' },
    };
    const sub = (id: string, depth: number, values: string[]) => ({
      id,
      groupRowType: 'groupSummary',
      groupDepth: depth,
      groupValues: values,
    });
    // P1: A, A, A소계, B, B소계, P1소계 / P2: A, A소계, P2소계 / 총계
    const items: any[] = [
      { id: 1 },
      { id: 2 },
      sub('s1', 1, ['P1', 'A']),
      { id: 3 },
      sub('s2', 1, ['P1', 'B']),
      sub('s3', 0, ['P1']),
      { id: 4 },
      sub('s4', 1, ['P2', 'A']),
      sub('s5', 0, ['P2']),
      { id: 'g', groupRowType: 'grandSummary' },
    ];
    const get = (id: any) => data[id];

    it('상위 병합 필드는 하위 단계 소계 행까지 이어서 병합하고 자기 단계 소계에서 끊는다', () => {
      expect(getRowSpanEnd(items, get, ['p'], 0, items.length, groupingFields)).toBe(5);
      expect(getRowSpanEnd(items, get, ['p'], 6, items.length, groupingFields)).toBe(8);
    });

    it('하위 병합 필드는 자기 단계 소계에서 끊는다', () => {
      expect(getRowSpanEnd(items, get, ['p', 'n'], 0, items.length, groupingFields)).toBe(2);
      expect(getRowSpanEnd(items, get, ['p', 'n'], 3, items.length, groupingFields)).toBe(4);
    });

    it('그룹 행에서는 병합을 시작하지 않는다', () => {
      expect(getRowSpanEnd(items, get, ['p'], 2, items.length, groupingFields)).toBe(3);
      expect(getRowSpanEnd(items, get, ['p'], 5, items.length, groupingFields)).toBe(6);
    });

    it('블록 안의 하위 소계 행에서도 블록 범위를 구한다', () => {
      expect(getRowSpanRange(items, get, ['p'], 2, groupingFields)).toEqual({ start: 0, end: 4 });
      expect(getRowSpanRange(items, get, ['p'], 5, groupingFields)).toEqual({ start: 5, end: 5 });
      expect(getRowSpanRange(items, get, ['p'], 9, groupingFields)).toEqual({ start: 9, end: 9 });
    });

    it('병합 키가 그룹 필드가 아니면 소계 행에서 끊는다(기존 동작)', () => {
      expect(getRowSpanEnd(items, get, ['p'], 0, items.length, [])).toBe(2);
      expect(getRowSpanEnd(items, get, ['p'], 0, items.length, ['n'])).toBe(2);
    });
  });
});
