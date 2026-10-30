import { TextDecoder, TextEncoder } from 'util';
import type { GridOptions } from '@/types/GridOptions';

/** Excel로 내보낼 때 병합(rowSpan)되는 셀의 스타일이 화면과 같은 기준(병합 영역 맨 위 셀)으로 만들어지는지 확인한다. */
describe('Excel 내보내기: 병합 셀 스타일', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  let styleSpy: jest.SpyInstance;
  let downloadSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: TextEncoder });
    Object.defineProperty(globalThis, 'TextDecoder', { configurable: true, value: TextDecoder });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  beforeEach(() => {
    const { ExcelConverter } = require('@/export/excel/ExcelConverter');
    downloadSpy = jest.spyOn(ExcelConverter.prototype, 'download').mockImplementation(() => undefined);
    // 테마 CSS가 없는 jsdom에서 줄무늬 행(짝 #010101, 홀 #020202)과 strong 클래스(빨간 배경)를 흉내 낸다.
    styleSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(((element: Element) => {
      const odd = !!element.closest('tr')?.previousElementSibling;
      const isCell = element.tagName === 'TD';
      const className = (element.className || '').toString();

      return {
        backgroundColor:
          element.tagName === 'TR'
            ? odd
              ? 'rgb(2, 2, 2)'
              : 'rgb(1, 1, 1)'
            : isCell && className.includes('strong')
              ? 'rgb(255, 0, 0)'
              : 'transparent',
        color: 'rgb(0, 0, 0)',
        borderTopWidth: '',
        borderRightWidth: isCell ? '1px' : '',
        borderBottomWidth: isCell ? '1px' : '',
        borderLeftWidth: '',
        borderTopStyle: '',
        borderRightStyle: isCell ? 'solid' : '',
        borderBottomStyle: isCell ? 'solid' : '',
        borderLeftStyle: '',
        borderTopColor: '',
        borderRightColor: 'rgb(9, 9, 9)',
        borderBottomColor: 'rgb(8, 8, 8)',
        borderLeftColor: '',
        getPropertyValue: () => '',
        backgroundImage: 'none',
      } as unknown as CSSStyleDeclaration;
    }) as typeof window.getComputedStyle);
  });

  afterEach(() => {
    styleSpy.mockRestore();
    downloadSpy.mockRestore();
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const readText = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsText(blob);
    });

  /** 내보낸 xlsx에서 병합 목록과 셀별 스타일(채우기·오른쪽/아래 테두리 색)을 읽는다. */
  const exportSheet = async (options: Record<string, unknown>) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, { width: 700, height: 300, ...options } as unknown as GridOptions);
    grids.push(grid);

    const text = await readText(await grid.exportExcel({ includeRowNumber: false }));
    const sheet = text.slice(text.indexOf('<worksheet'), text.indexOf('</worksheet>'));
    const styles = text.slice(text.indexOf('<styleSheet'), text.indexOf('</styleSheet>'));

    const fills = [...styles.matchAll(/<fill>(.*?)<\/fill>/g)].map((match) => match[1].match(/rgb="([^"]+)"/)?.[1]);
    const borders = [...styles.matchAll(/<border>(.*?)<\/border>/g)].map((match) => ({
      right: match[1].match(/<right style="[^"]*"><color rgb="([^"]+)"/)?.[1],
      bottom: match[1].match(/<bottom style="[^"]*"><color rgb="([^"]+)"/)?.[1],
    }));
    const xfs = [...styles.slice(styles.indexOf('<cellXfs')).matchAll(/<xf [^>]*fillId="(\d+)"[^>]*borderId="(\d+)"/g)].map(
      (match) => ({ fill: fills[Number(match[1])], border: borders[Number(match[2])] }),
    );
    const cellStyles = new Map<string, { fill?: string; right?: string; bottom?: string }>();
    for (const match of sheet.matchAll(/<c r="([A-Z]+\d+)" s="(\d+)"/g)) {
      const xf = xfs[Number(match[2])];
      cellStyles.set(match[1], { fill: xf.fill, right: xf.border.right, bottom: xf.border.bottom });
    }

    return {
      merges: [...sheet.matchAll(/<mergeCell ref="([^"]+)"/g)].map((match) => match[1]),
      style: (ref: string) => cellStyles.get(ref),
      cellCount: cellStyles.size,
    };
  };

  const items = [
    { category: 'A', name: 'a1' },
    { category: 'A', name: 'a2' },
    { category: 'A', name: 'a3' },
    { category: 'B', name: 'b1' },
    { category: 'B', name: 'b2' },
    { category: 'C', name: 'c1' },
  ];
  const baseFields = [
    { name: 'category', width: 100 },
    { name: 'name', width: 100 },
  ];

  it('같은 값이 이어진 행을 병합하고, 병합 범위 안의 모든 셀에 스타일을 쓴다', async () => {
    const sheet = await exportSheet({ rowSpanFields: ['category'], fields: baseFields, items });

    expect(sheet.merges).toEqual(['A2:A4', 'A5:A6']);
    // 헤더 1행 + 데이터 6행 × 2열. 병합으로 가려지는 셀(A3, A4, A6)도 스타일을 가진다.
    expect(sheet.cellCount).toBe(14);
    ['A3', 'A4', 'A6'].forEach((ref) => expect(sheet.style(ref)).toBeDefined());
  });

  it('병합 영역의 맨 위 셀이 그 행의 줄무늬 배경을 가진다 (화면의 병합 셀과 같은 기준)', async () => {
    const sheet = await exportSheet({ rowSpanFields: ['category'], fields: baseFields, items });

    // A2는 첫 데이터 행(짝), A5는 네 번째 데이터 행(홀)이다.
    expect(sheet.style('A2')?.fill).toBe('FF010101');
    expect(sheet.style('A5')?.fill).toBe('FF020202');
    // 병합 영역 안쪽의 가려지는 셀은 각자의 행 줄무늬를 유지한다.
    expect(sheet.style('A3')?.fill).toBe('FF020202');
    expect(sheet.style('A4')?.fill).toBe('FF010101');
    // 병합되지 않은 열도 같은 규칙이다.
    expect(sheet.style('B2')?.fill).toBe('FF010101');
    expect(sheet.style('B3')?.fill).toBe('FF020202');
  });

  it('병합 영역의 오른쪽·아래 테두리는 영역 끝 셀의 스타일에서 온다', async () => {
    const sheet = await exportSheet({ rowSpanFields: ['category'], fields: baseFields, items });

    ['A2', 'A3', 'A4', 'A5', 'A6', 'A7'].forEach((ref) => {
      expect(sheet.style(ref)).toMatchObject({ right: 'FF090909', bottom: 'FF080808' });
    });
  });

  it('조건부 클래스(cellClassName)가 병합 영역의 위 셀과 가려지는 셀에 같은 값으로 적용된다', async () => {
    const sheet = await exportSheet({
      rowSpanFields: ['category'],
      fields: [
        { name: 'category', width: 100, cellClassName: ({ item }: { item: { category: string } }) => (item.category === 'B' ? 'strong' : '') },
        { name: 'name', width: 100 },
      ],
      items,
    });

    // B 그룹(A5:A6)은 두 행 모두 빨간 배경이고, 병합 영역 맨 위 셀(A5)도 빨간 배경이다.
    expect(sheet.style('A5')?.fill).toBe('FFFF0000');
    expect(sheet.style('A6')?.fill).toBe('FFFF0000');
    // 다른 그룹의 병합 영역은 영향을 받지 않는다.
    expect(sheet.style('A2')?.fill).toBe('FF010101');
    expect(sheet.style('A7')?.fill).toBe('FF020202');
  });

  it('여러 단계 병합에서도 각 병합 영역의 맨 위 셀이 자기 행 스타일을 가진다', async () => {
    const sheet = await exportSheet({
      rowSpanFields: ['region', 'category'],
      fields: [{ name: 'region', width: 80 }, { name: 'category', width: 80 }, { name: 'name', width: 80 }],
      items: [
        { region: 'R1', category: 'A', name: 'n1' },
        { region: 'R1', category: 'A', name: 'n2' },
        { region: 'R1', category: 'B', name: 'n3' },
        { region: 'R2', category: 'B', name: 'n4' },
      ],
    });

    expect(sheet.merges).toEqual(['A2:A4', 'B2:B3']);
    expect(sheet.style('A2')?.fill).toBe('FF010101'); // region R1 맨 위 = 첫 행(짝)
    expect(sheet.style('B2')?.fill).toBe('FF010101'); // category A 맨 위 = 첫 행(짝)
    expect(sheet.style('A5')?.fill).toBe('FF020202'); // region R2는 네 번째 행(홀), 병합되지 않음
    expect(sheet.style('B4')?.fill).toBe('FF010101'); // category B(R1) 한 행짜리: 세 번째 행(짝)
  });

  it('그룹 합계 행을 건너서 병합하지 않는다', async () => {
    const sheet = await exportSheet({
      groupingFields: ['category'],
      rowSpanFields: ['name'],
      groupSummaryFields: [{ field: 'amount', expression: 'sum' }],
      fields: [
        { name: 'category', width: 100 },
        { name: 'name', width: 100 },
        { name: 'amount', width: 100 },
      ],
      items: [
        { category: 'A', name: 'same', amount: 1 },
        { category: 'A', name: 'same', amount: 2 },
        { category: 'B', name: 'same', amount: 3 },
      ],
    });

    // 같은 name('same')이 세 행 이어지지만 B 그룹은 합계 행 건너편이라 첫 그룹의 두 행만 병합한다.
    expect(sheet.merges).toEqual(['B2:B3']);
  });
});
