import type { GridOptions } from '@/types/GridOptions';

describe('행 ID 0 처리와 호스트 환경', () => {
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

  const create = (startId: number, options: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 500,
      height: 300,
      rowIdField: 'id',
      header: { sort: { enabled: true } },
      fields: [
        { name: 'id', width: 80 },
        { name: 'name', width: 160 },
      ],
      items: [0, 1, 2].map((offset) => ({ id: startId + offset, name: `apple${offset}` })),
      ...options,
    } as unknown as GridOptions);
    grids.push(grid);

    const main = (grid as unknown as { gridMain: any }).gridMain;
    const cfg = main.config();
    const dm = cfg.dataManager;
    const currentFlags = () =>
      [0, 1, 2].map((offset) => !!dm.getSearchMapItem(startId + offset)?.isCurrentMatch);

    return { grid, main, cfg, dm, currentFlags, element };
  };

  describe('검색', () => {
    it.each([0, 1])('첫 번째 일치 행만 현재 일치로 표시한다 (첫 행 ID: %s)', (startId) => {
      const { grid, cfg, currentFlags } = create(startId);

      const result = grid.search('apple', {} as never);

      expect(result.count).toBe(3);
      expect(currentFlags()).toEqual([true, false, false]);
      expect(cfg.searchMatchInfo.id).toBe(startId);
      expect(cfg.searchMatchInfo.rowIndex).toBe(0);
    });

    it('일치하는 행이 없을 때 정렬해도 ID가 0인 행을 현재 일치 행으로 오인하지 않는다', () => {
      const { grid, cfg, dm, element } = create(0);

      grid.search('zzz', {} as never);
      expect(cfg.searchMatchInfo.id).toBe('');

      // 정렬 아이콘을 눌러 검색이 켜진 상태에서 정렬을 다시 적용한다.
      const icon = element.querySelectorAll('.dg-header-cell .dg-sort-icon')[1];
      icon.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));

      expect(dm.getViewItems().length).toBe(3);
      expect(cfg.searchMatchInfo.rowIndex).toBe(-1);
      expect(cfg.searchMatchInfo.id).toBe('');
    });
  });

  describe('숨김 컨테이너', () => {
    const containerCount = () => document.querySelectorAll('.dg-hidden-layers').length;

    it('호스트가 body를 비운 뒤에 만든 그리드의 컨텍스트 메뉴는 DOM에 붙는다', () => {
      const options = { contextMenu: { enabled: true, items: [{ key: 'k', label: 'K' }] } };
      const first = create(1, options);
      expect(containerCount()).toBe(1);
      first.grid.destroy();
      grids = [];

      document.body.innerHTML = '';
      expect(containerCount()).toBe(0);

      const second = create(1, options);

      expect(containerCount()).toBe(1);
      const hidden = document.querySelector('.dg-hidden-layers') as HTMLElement;
      expect(hidden.querySelector('.dg-contextmenu')).not.toBeNull();
      second.grid.destroy();
    });

    it('컨테이너가 살아 있으면 새로 만들지 않고 재사용한다', () => {
      create(1);
      create(1);
      create(1);

      expect(containerCount()).toBe(1);
    });
  });
});
