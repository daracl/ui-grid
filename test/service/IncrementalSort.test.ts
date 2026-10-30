import type { DataManager } from '@/service/DataManager';
import type { GridOptions } from '@/types/GridOptions';
import { compareCachedValue } from '@/util/utils';

type Row = { id: number; name: string | null; score: number | null };

describe('정렬 중 행 추가·삭제와 검색 해제 (증분 정렬)', () => {
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

  /** 재현 가능한 난수 */
  const random = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const NAMES = ['a', 'b', 'c', 'd', null];
  const makeRow = (id: number, rnd: () => number): Row => ({
    id,
    name: NAMES[Math.floor(rnd() * NAMES.length)],
    score: rnd() < 0.1 ? null : Math.floor(rnd() * 4),
  });

  const setup = (rows: Row[], sortOpts: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 80 },
        { name: 'name', width: 120 },
        { name: 'score', width: 100 },
      ],
      items: rows.map((row) => ({ ...row })),
      ...extra,
    } as unknown as GridOptions);
    grids.push(grid);

    const main = (grid as unknown as { gridMain: { config(): { dataManager: DataManager; allFieldMap: Map<string, never> } } })
      .gridMain;
    const cfg = main.config();
    const dm = cfg.dataManager;
    const sort = (ascName: boolean, ascScore: boolean) =>
      dm.dataSort(
        [
          { name: 'name', field: cfg.allFieldMap.get('name'), ascOrder: ascName, sortCell: 1 },
          { name: 'score', field: cfg.allFieldMap.get('score'), ascOrder: ascScore, sortCell: 2 },
        ] as never,
        sortOpts as never,
      );
    const viewIds = () => dm.getViewItems().map((viewItem) => viewItem.id);

    /** 현재 원본 순서를 기준으로 전체를 안정 정렬한 기대 결과 */
    const expected = (ascName: boolean, ascScore: boolean, nullsLast = false) => {
      const original = (dm as unknown as { originalViewItems: { id: number }[] }).originalViewItems;
      const value = (id: number) => dm.getRowItem(id) as Row;
      return original
        .map((viewItem, index) => ({ id: viewItem.id, index }))
        .sort((a, b) => {
          const byName = compareCachedValue(value(a.id).name, value(b.id).name, ascName, nullsLast);
          if (byName !== 0) return byName;
          const byScore = compareCachedValue(value(a.id).score, value(b.id).score, ascScore, nullsLast);
          return byScore !== 0 ? byScore : a.index - b.index;
        })
        .map((entry) => entry.id);
    };

    return { grid, dm, sort, viewIds, expected, cfg };
  };

  it.each([
    [true, true],
    [false, true],
    [true, false],
  ])('임의의 추가·삭제를 반복해도 전체를 다시 정렬한 결과와 같고 전체 재정렬은 하지 않는다 (name asc: %s, score asc: %s)', (ascName, ascScore) => {
    const rnd = random(ascName ? 7 : 11);
    let nextId = 1;
    const rows = Array.from({ length: 40 }, () => makeRow(nextId++, rnd));
    const { grid, dm, sort, viewIds, expected } = setup(rows);
    sort(ascName, ascScore);
    expect(viewIds()).toEqual(expected(ascName, ascScore));

    const fullSort = jest.spyOn(dm, 'getSortData');
    for (let step = 0; step < 200; step++) {
      const current = viewIds();
      if (rnd() < 0.55 || current.length < 5) {
        const count = 1 + Math.floor(rnd() * 3);
        const added = Array.from({ length: count }, () => makeRow(nextId++, rnd));
        const base = current[Math.floor(rnd() * current.length)];
        const position = rnd() < 0.5 ? 'before' : 'after';
        if (rnd() < 0.5) grid.addItems(added, { rowId: base, position });
        else grid.addItems(added);
      } else {
        const count = 1 + Math.floor(rnd() * 3);
        grid.removeItems(Array.from({ length: count }, () => current[Math.floor(rnd() * current.length)]).filter((id, i, all) => all.indexOf(id) === i));
      }
      expect(viewIds()).toEqual(expected(ascName, ascScore));
    }
    expect(fullSort).not.toHaveBeenCalled();
  });

  it('nullsLast 옵션에서도 같은 결과이다', () => {
    const rnd = random(3);
    let nextId = 1;
    const { grid, sort, viewIds, expected } = setup(
      Array.from({ length: 30 }, () => makeRow(nextId++, rnd)),
      { nullsLast: true },
    );
    sort(false, true);
    for (let step = 0; step < 60; step++) {
      grid.addItems([makeRow(nextId++, rnd)]);
      grid.removeItems([viewIds()[Math.floor(rnd() * viewIds().length)]]);
      expect(viewIds()).toEqual(expected(false, true, true));
    }
  });

  it('추가 행이 많으면 전체를 다시 정렬하고 결과는 같다', () => {
    const rnd = random(5);
    let nextId = 1;
    const { grid, dm, sort, viewIds, expected } = setup(Array.from({ length: 30 }, () => makeRow(nextId++, rnd)));
    sort(true, true);
    const fullSort = jest.spyOn(dm, 'getSortData');

    grid.addItems(Array.from({ length: 100 }, () => makeRow(nextId++, rnd)));
    expect(fullSort).toHaveBeenCalled();
    expect(viewIds()).toEqual(expected(true, true));
  });

  it('사용자 정렬 함수(customSorting)는 전체를 다시 정렬한다', () => {
    const rnd = random(9);
    let nextId = 1;
    const customSorting = jest.fn((rows: Record<string, unknown>[]) => rows);
    const { grid, dm, sort } = setup(
      Array.from({ length: 10 }, () => makeRow(nextId++, rnd)),
      { customSorting },
    );
    sort(true, true);
    const fullSort = jest.spyOn(dm, 'getSortData');

    grid.addItems([makeRow(nextId++, rnd)]);
    expect(fullSort).toHaveBeenCalled();
  });

  it('검색 중에는 증분 정렬을 쓰지 않고, 해제하면 추가·삭제가 반영된 정렬 결과이다', () => {
    const rnd = random(13);
    let nextId = 1;
    const { grid, dm, sort, viewIds, expected } = setup(Array.from({ length: 40 }, () => makeRow(nextId++, rnd)));
    sort(true, true);

    grid.search('1', { hideNonMatched: true } as never);
    const fullSort = jest.spyOn(dm, 'getSortData');
    grid.addItems([{ id: 1000, name: 'a', score: 1 }]);
    expect(fullSort).toHaveBeenCalled();

    grid.search('', {} as never);
    expect(viewIds()).toEqual(expected(true, true));
    expect(viewIds()).toContain(1000);
  });

  describe('검색 해제 시 정렬 결과 재사용', () => {
    it('값이 그대로면 다시 정렬하지 않고 같은 순서를 돌려준다', () => {
      const rnd = random(21);
      let nextId = 1;
      const { grid, dm, sort, viewIds, expected } = setup(Array.from({ length: 60 }, () => makeRow(nextId++, rnd)));
      sort(true, false);
      const before = viewIds();

      grid.search('1', { hideNonMatched: true } as never);
      expect(viewIds().length).toBeLessThan(before.length);

      const fullSort = jest.spyOn(dm, 'getSortData');
      grid.search('', {} as never);
      expect(fullSort).not.toHaveBeenCalled();
      expect(viewIds()).toEqual(before);
      expect(viewIds()).toEqual(expected(true, false));
    });

    it('검색하는 동안 정렬 기준 값이 바뀌었으면 캐시를 쓰지 않고 새로 정렬한다', () => {
      const rnd = random(33);
      let nextId = 1;
      const { grid, dm, sort, viewIds, expected, cfg } = setup(
        Array.from({ length: 30 }, () => makeRow(nextId++, rnd)),
        {},
        { editable: true },
      );
      sort(true, true);

      grid.search('1', { hideNonMatched: true } as never);
      const target = dm.getRowItem(viewIds()[0]) as Row;
      dm.setChangeValue(target, cfg.allFieldMap.get('name') as never, 'zz');

      const fullSort = jest.spyOn(dm, 'getSortData');
      grid.search('', {} as never);
      expect(fullSort).toHaveBeenCalled();
      expect(viewIds()).toEqual(expected(true, true));
    });

    it('검색하는 동안 행이 추가·삭제됐으면 캐시를 쓰지 않는다', () => {
      const rnd = random(44);
      let nextId = 1;
      const { grid, dm, sort, viewIds, expected } = setup(Array.from({ length: 30 }, () => makeRow(nextId++, rnd)));
      sort(true, true);

      grid.search('1', { hideNonMatched: true } as never);
      grid.addItems([{ id: 900, name: 'b', score: 2 }]);
      grid.removeItems([viewIds()[0]]);

      grid.search('', {} as never);
      expect(viewIds()).toEqual(expected(true, true));
      void dm;
    });
  });
});
