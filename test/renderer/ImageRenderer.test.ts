import type { GridOptions } from '@/types/GridOptions';

describe('ImageRenderer', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  afterEach(() => {
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const render = (sources: string[]) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 80 },
        { name: 'pic', width: 200, renderer: { type: 'image' } },
      ],
      items: sources.map((pic, index) => ({ id: index + 1, pic })),
    } as unknown as GridOptions);
    grids.push(grid);

    return Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-row')).map((row) =>
      (row.querySelector('img.dg-cell-content') as HTMLImageElement | null)?.getAttribute('src') ?? null,
    );
  };

  it('http(s)·상대 경로·이미지 data URL은 그대로 표시한다', () => {
    const sources = ['https://example.com/a.png', '/img/b.png', 'c.png', 'data:image/png;base64,AAAA'];
    expect(render(sources)).toEqual(sources);
  });

  it('javascript:·이미지가 아닌 data: 등 허용되지 않은 스킴은 src를 설정하지 않는다', () => {
    const rendered = render([
      'javascript:alert(1)',
      ' JaVaScRiPt:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ]);
    expect(rendered).toEqual([null, null, null, null]);
  });
});
