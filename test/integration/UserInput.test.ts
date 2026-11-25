import { ItemStatusMap, PointerStateMap, ROW_FIELD } from '@/constants';
import type { GridOptions } from '@/types/GridOptions';

/** 키보드·붙여넣기·행 이동 등 사용자 입력 경로 테스트 */
describe('사용자 입력', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

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
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  const rows = (count = 6) =>
    Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `n${i + 1}`, qty: String(i + 1) }));

  const create = (options: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      editable: true,
      selectionMode: 'multiCell',
      fields: [
        { name: 'id', width: 80, editable: false },
        { name: 'name', width: 120, editRenderer: { type: 'text' } },
        { name: 'qty', width: 100, editRenderer: { type: 'number' } },
      ],
      items: rows(),
      ...options,
    } as unknown as GridOptions);
    grids.push(grid);

    const main = (grid as unknown as { gridMain: any }).gridMain;
    const cfg = main.config();
    const dm = cfg.dataManager;
    const col = (name: string) => cfg.currentFields.findIndex((field: { name: string }) => field.name === name);
    const cell = (row: number, name: string) => element.querySelector(`[data-cell-position="${row},${col(name)}"]`) as HTMLElement;

    const click = (row: number, name: string) => {
      cell(row, name).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
    };
    const press = (code: string, init: KeyboardEventInit = {}) =>
      (element.querySelector('.dg-text-editor') as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, code, ...init }),
      );
    const paste = (text: string | null) => {
      const event = new Event('paste', { bubbles: true, cancelable: true }) as Event & { clipboardData: unknown };
      event.clipboardData = { getData: () => text };
      (element.querySelector('.dg-paste-area') as HTMLElement).dispatchEvent(event);
      return event;
    };
    const start = () => ({ row: cfg.selection.startCell.startIdx, col: cfg.selection.startCell.startCol });
    const values = (name: string) => dm.getViewItems().map((viewItem: { id: number }) => dm.getRowItem(viewItem.id)[name]);
    const ids = () => dm.getViewItems().map((viewItem: { id: number }) => viewItem.id);
    const status = (id: number) => dm.getRowItem(id)[ROW_FIELD.CUD];
    const history = () => (dm as unknown as { history: { isRecording(): boolean; canUndo(): boolean } }).history;

    return { grid, main, cfg, dm, element, col, cell, click, press, paste, start, values, ids, status, history };
  };

  it('한글 조합 중 Enter는 편집을 확정하지 않는다', () => {
    const t = create();
    t.click(0, 'name');
    t.press('Space');
    const input = document.querySelector('.dg-edit-input') as HTMLInputElement;
    input.value = '한';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
    expect(t.dm.getRowItem(1).name).toBe('n1');
    input.value = '한글';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(t.dm.getRowItem(1).name).toBe('한글');
  });

  it.each(['', 'a'])('textarea는 필수 및 최소 길이 검증을 적용한다 (%s)', (value) => {
    const t = create({
      fields: [{ name: 'name', width: 120, editRenderer: { type: 'textarea', required: true, rule: { minLength: 2 } } }],
    });
    t.click(0, 'name');
    t.press('Space');
    const input = document.querySelector('.dg-edit-textarea') as HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new FocusEvent('blur'));
    expect(t.dm.getRowItem(1).name).toBe('n1');
    input.value = '정상\n입력';
    input.dispatchEvent(new FocusEvent('blur'));
    expect(t.dm.getRowItem(1).name).toBe('정상\n입력');
  });

  it('편집 중 같은 ID의 데이터로 교체해도 이전 편집은 새 행과 이력을 변경하지 않는다', () => {
    const t = create();
    t.click(0, 'name');
    t.press('Space');
    const input = document.querySelector('.dg-edit-input') as HTMLInputElement;
    input.value = '이전 편집';
    t.grid.setItems([{ id: 1, name: '새 데이터' }]);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(t.dm.getRowItem(1).name).toBe('새 데이터');
    expect(t.history().canUndo()).toBe(false);
    expect(t.cell(0, 'name').textContent).toContain('새 데이터');
  });

  it('변경 콜백에서 데이터를 교체하면 이전 편집을 취소한다', () => {
    let replace: () => void;
    const t = create({
      fields: [{ name: 'name', width: 120, editRenderer: { type: 'text', change: () => replace() } }],
    });
    replace = () => t.grid.setItems([{ id: 1, name: '콜백 데이터' }]);
    t.click(0, 'name');
    t.press('Space');
    const input = document.querySelector('.dg-edit-input') as HTMLInputElement;
    input.value = '이전 편집';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(t.dm.getRowItem(1).name).toBe('콜백 데이터');
    expect(t.history().canUndo()).toBe(false);
    expect(t.cell(0, 'name').textContent).toContain('콜백 데이터');
  });

  describe('키보드', () => {
    /** requestAnimationFrame 콜백을 모아 두었다가 flush()에서 실행한다. */
    const mockAnimationFrames = () => {
      let frames: FrameRequestCallback[] = [];
      let frameId = 0;
      const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        frames.push(cb);
        return ++frameId;
      });
      return {
        flush: () => {
          for (let i = 0; i < 10 && frames.length > 0; i++) {
            const pending = frames;
            frames = [];
            pending.forEach((cb) => cb(0));
          }
        },
        restore: () => spy.mockRestore(),
      };
    };

    it('방향키로 선택 셀을 이동하고 가장자리에서는 더 이동하지 않는다', () => {
      const t = create();
      t.click(0, 'name');
      expect(t.start()).toEqual({ row: 0, col: t.col('name') });

      t.press('ArrowDown');
      expect(t.start().row).toBe(1);
      t.press('ArrowRight');
      expect(t.start().col).toBe(t.col('qty'));
      t.press('ArrowRight');
      expect(t.start().col).toBe(t.col('qty'));
      t.press('ArrowUp');
      t.press('ArrowUp');
      expect(t.start().row).toBe(0);
      t.press('ArrowUp');
      expect(t.start().row).toBe(0);
      t.press('ArrowLeft');
      t.press('ArrowLeft');
      expect(t.start().col).toBe(t.col('id'));
    });

    it('rowSpan 병합 셀은 블록 단위로 상하 이동하고 좌우 이동 시 Excel처럼 원래 행으로 복귀한다', () => {
      const groups = ['A', 'A', 'A', 'B', 'B', 'C'];
      const t = create({
        rowSpanFields: ['grp'],
        fields: [
          { name: 'id', width: 80 },
          { name: 'grp', width: 80 },
          { name: 'name', width: 120 },
        ],
        items: rows().map((row, i) => ({ ...row, grp: groups[i] })),
      });

      t.click(1, 'name');
      t.press('ArrowLeft');
      expect(t.start()).toEqual({ row: 0, col: t.col('grp') });
      t.press('ArrowRight');
      expect(t.start()).toEqual({ row: 1, col: t.col('name') });

      t.press('ArrowLeft');
      t.press('ArrowDown');
      expect(t.start()).toEqual({ row: 3, col: t.col('grp') });
      t.press('ArrowDown');
      expect(t.start().row).toBe(5);
      t.press('ArrowDown');
      expect(t.start().row).toBe(5);
      t.press('ArrowUp');
      expect(t.start().row).toBe(3);
      t.press('ArrowUp');
      expect(t.start().row).toBe(0);

      // 상하 이동 후에는 기준 행이 새 위치로 바뀐다.
      t.press('ArrowRight');
      expect(t.start()).toEqual({ row: 0, col: t.col('name') });
    });

    it('좌우 이동으로 화면 밖 기준 행에 복귀하면 그 행이 보이도록 세로 스크롤한다', () => {
      const frames = mockAnimationFrames();

      try {
        const t = create({
          rowSpanFields: ['grp'],
          fields: [
            { name: 'grp', width: 80 },
            { name: 'name', width: 120 },
          ],
          items: rows(60).map((row, i) => ({ ...row, grp: i < 40 ? 'A' : 'B' })),
        });
        frames.flush();
        const press = (code: string) => {
          t.press(code);
          frames.flush();
        };
        const scroll = t.cfg.scroll;
        const insideViewRow = scroll.insideViewRow;
        expect(insideViewRow).toBeGreaterThan(1);

        t.click(0, 'name');
        frames.flush();
        for (let i = 0; i < insideViewRow; i++) press('ArrowDown');
        expect(t.start().row).toBe(insideViewRow);
        expect(scroll.startIdx).toBe(1);

        // 병합 셀(블록 시작 0행)로 이동하면 위로 스크롤된다.
        press('ArrowLeft');
        expect(t.start()).toEqual({ row: 0, col: t.col('grp') });
        expect(scroll.startIdx).toBe(0);

        // 기준 행(insideViewRow)은 온전히 보이는 범위 바로 아래이므로 다시 스크롤되어야 한다.
        press('ArrowRight');
        expect(t.start()).toEqual({ row: insideViewRow, col: t.col('name') });
        expect(scroll.startIdx).toBe(1);
      } finally {
        frames.restore();
      }
    });

    describe('병합 블록으로 아래 이동 시 블록이 최대한 보이도록 스크롤', () => {
      const spanFields = [
        { name: 'grp', width: 80 },
        { name: 'name', width: 120 },
      ];
      const createSpanGrid = (groupOf: (rowIdx: number, insideViewRow: number) => string, count = 90) => {
        // 같은 크기 그리드에서 온전히 보이는 행 수를 먼저 구해 데이터를 만든다.
        const insideViewRow = create({ rowSpanFields: ['grp'], fields: spanFields, items: rows(count) }).cfg.scroll
          .insideViewRow;
        const t = create({
          rowSpanFields: ['grp'],
          fields: spanFields,
          items: rows(count).map((row, i) => ({ ...row, grp: groupOf(i, insideViewRow) })),
        });
        return { t, insideViewRow };
      };

      it('블록이 화면보다 짧으면 블록 끝을 화면 맨 아래에 맞춘다', () => {
        const frames = mockAnimationFrames();
        try {
          // 0 ~ insideViewRow-1 은 단독 행, 그 다음부터 3행씩 병합
          const { t, insideViewRow } = createSpanGrid((i, ivr) => (i < ivr ? `u${i}` : `g${Math.floor((i - ivr) / 3)}`));
          frames.flush();
          t.click(insideViewRow - 1, 'grp');
          t.press('ArrowDown');
          frames.flush();

          expect(t.start()).toEqual({ row: insideViewRow, col: t.col('grp') });
          // 블록(insideViewRow ~ insideViewRow+2) 끝이 화면 마지막 온전한 행
          expect(t.cfg.scroll.startIdx).toBe(insideViewRow + 2 - (insideViewRow - 1));
        } finally {
          frames.restore();
        }
      });

      it('블록이 화면보다 길면 블록 시작을 화면 맨 위에 맞춘다', () => {
        const frames = mockAnimationFrames();
        try {
          const { t, insideViewRow } = createSpanGrid((i, ivr) => `g${Math.floor(i / (ivr + 5))}`);
          frames.flush();
          const blockSize = insideViewRow + 5;
          t.click(0, 'grp');
          t.press('ArrowDown');
          frames.flush();

          expect(t.start()).toEqual({ row: blockSize, col: t.col('grp') });
          expect(t.cfg.scroll.startIdx).toBe(blockSize);
        } finally {
          frames.restore();
        }
      });

      it('블록 시작이 보여도 블록이 화면 아래로 넘치면 블록 전체가 보이도록 스크롤한다', () => {
        const frames = mockAnimationFrames();
        try {
          // 마지막 온전한 행(insideViewRow-1)에서 3행 병합 블록이 시작된다.
          const { t, insideViewRow } = createSpanGrid((i, ivr) =>
            i < ivr - 1 ? `u${i}` : `g${Math.floor((i - (ivr - 1)) / 3)}`,
          );
          frames.flush();
          t.click(insideViewRow - 2, 'grp');
          t.press('ArrowDown');
          frames.flush();

          expect(t.start()).toEqual({ row: insideViewRow - 1, col: t.col('grp') });
          expect(t.cfg.scroll.startIdx).toBe(2);
        } finally {
          frames.restore();
        }
      });

      it('병합되지 않은 열과 좌우 이동은 블록이 넘쳐도 스크롤하지 않는다', () => {
        const frames = mockAnimationFrames();
        try {
          const { t, insideViewRow } = createSpanGrid((i, ivr) =>
            i < ivr - 1 ? `u${i}` : `g${Math.floor((i - (ivr - 1)) / 3)}`,
          );
          frames.flush();
          t.click(insideViewRow - 2, 'name');
          t.press('ArrowDown');
          frames.flush();
          expect(t.start()).toEqual({ row: insideViewRow - 1, col: t.col('name') });
          expect(t.cfg.scroll.startIdx).toBe(0);

          t.press('ArrowLeft');
          frames.flush();
          expect(t.start()).toEqual({ row: insideViewRow - 1, col: t.col('grp') });
          expect(t.cfg.scroll.startIdx).toBe(0);
        } finally {
          frames.restore();
        }
      });
    });

    it('여러 단계 그룹 소계와 병합: 상위 병합 셀은 하위 소계 행까지 이어지고 키보드는 블록 단위로 이동한다', () => {
      const t = create({
        groupingFields: ['grp', 'sub'],
        rowSpanFields: ['grp', 'sub'],
        groupSummaryFields: [{ field: 'qty', expression: 'sum' }],
        fields: [
          { name: 'grp', width: 80 },
          { name: 'sub', width: 80 },
          { name: 'qty', width: 100 },
        ],
        items: [
          { id: 1, grp: 'A', sub: 'x', qty: 1 },
          { id: 2, grp: 'A', sub: 'x', qty: 2 },
          { id: 3, grp: 'A', sub: 'y', qty: 3 },
          { id: 4, grp: 'B', sub: 'x', qty: 4 },
        ],
      });
      // 행: A x, A x, x합계, A y, y합계, A합계, B x, x합계, B합계, 총계
      expect(t.cfg.scroll.insideViewRow).toBeGreaterThanOrEqual(10);

      const grpCell = t.cell(0, 'grp') as HTMLTableCellElement;
      expect(grpCell.rowSpan).toBe(5);
      expect(grpCell.textContent).toContain('A');
      // 블록 안 하위 소계 행의 grp 칸은 병합 셀에 가려진다.
      expect(t.cell(2, 'grp').style.display).toBe('none');
      expect(t.cell(4, 'grp').style.display).toBe('none');
      // 자기 단계 소계(A합계)는 별도 셀로 라벨을 표시한다.
      expect(t.cell(5, 'grp').style.display).not.toBe('none');
      expect(t.cell(5, 'grp').textContent).toContain('A 합계');
      expect((t.cell(6, 'grp') as HTMLTableCellElement).rowSpan).toBe(2);
      expect((t.cell(0, 'sub') as HTMLTableCellElement).rowSpan).toBe(2);

      t.click(0, 'grp');
      t.press('ArrowDown');
      expect(t.start()).toEqual({ row: 5, col: t.col('grp') });
      t.press('ArrowDown');
      expect(t.start().row).toBe(6);
      t.press('ArrowUp');
      expect(t.start().row).toBe(5);
      t.press('ArrowUp');
      expect(t.start().row).toBe(0);

      // 하위 소계 행(x합계)에서 grp 열로 이동하면 병합 블록 시작으로 맞춘다.
      t.click(2, 'qty');
      t.press('ArrowLeft');
      t.press('ArrowLeft');
      expect(t.start()).toEqual({ row: 0, col: t.col('grp') });
    });

    it('rowSpan 병합은 온전히 보이는 행까지만 하고 일부만 보이는 마지막 행은 별도 셀로 그린다', () => {
      const t = create({
        height: 333,
        rowSpanFields: ['grp'],
        fields: [
          { name: 'grp', width: 80 },
          { name: 'name', width: 120 },
        ],
        items: rows(60).map((row) => ({ ...row, grp: 'A' })),
      });
      const { insideViewRow, viewRow } = t.cfg.scroll;
      // 일부만 보이는 행이 있는 높이인지 확인
      expect(viewRow).toBe(insideViewRow + 1);

      const first = t.cell(0, 'grp') as HTMLTableCellElement;
      const partial = t.cell(insideViewRow, 'grp') as HTMLTableCellElement;
      expect(first.rowSpan).toBe(insideViewRow);
      expect(t.cell(insideViewRow - 1, 'grp').style.display).toBe('none');
      expect(partial.style.display).not.toBe('none');
      expect(partial.rowSpan).toBe(1);
      expect(partial.textContent).toContain('A');
    });

    it('Home·End는 첫·마지막 열로, Ctrl+방향키는 첫·마지막 행으로 이동한다', () => {
      const t = create();
      t.click(2, 'name');

      t.press('End');
      expect(t.start()).toEqual({ row: 2, col: t.col('qty') });
      t.press('Home');
      expect(t.start()).toEqual({ row: 2, col: t.col('id') });
      t.press('ArrowDown', { ctrlKey: true });
      expect(t.start().row).toBe(5);
      t.press('ArrowUp', { ctrlKey: true });
      expect(t.start().row).toBe(0);
    });

    it('Enter는 아래로, Tab은 오른쪽으로 이동한다', () => {
      const t = create();
      t.click(0, 'id');

      t.press('Enter');
      expect(t.start()).toEqual({ row: 1, col: t.col('id') });
      t.press('Tab');
      expect(t.start()).toEqual({ row: 1, col: t.col('name') });
    });

    it('PageDown·PageUp은 한 화면씩 이동하고 범위를 벗어나지 않는다', () => {
      const t = create({ items: rows(100) });
      t.click(0, 'name');

      t.press('PageDown');
      const afterDown = t.start().row;
      expect(afterDown).toBeGreaterThan(1);
      expect(afterDown).toBeLessThan(100);

      t.press('PageUp');
      expect(t.start().row).toBe(0);
      t.press('PageUp');
      expect(t.start().row).toBe(0);
    });

    it('Ctrl+A는 다중 선택 모드에서 전체를 선택하고 방향키로 해제한다', () => {
      const t = create();
      t.click(0, 'name');

      t.press('KeyA', { ctrlKey: true });
      expect(t.cfg.selection.all).toBe(true);
      t.press('ArrowDown');
      expect(t.cfg.selection.all).toBe(false);
    });

    it('단일 선택 모드에서는 Ctrl+A로 전체를 선택하지 않는다', () => {
      const t = create({ selectionMode: 'singleCell' });
      t.click(0, 'name');

      t.press('KeyA', { ctrlKey: true });
      expect(t.cfg.selection.all).not.toBe(true);
    });

    it('편집 가능한 셀에서 글자를 입력하면 빈 편집기가 열린다', () => {
      const t = create();
      t.click(1, 'name');
      t.press('KeyX');

      const input = document.querySelector('.dg-edit-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.value).toBe('');
    });

    it('읽기 전용 셀에서는 글자를 입력해도 편집기가 열리지 않는다', () => {
      const t = create();
      t.click(0, 'id');
      t.press('KeyX');

      expect(document.querySelector('.dg-edit-input')).toBeNull();
    });

    it('Space는 현재 값을 유지한 채 편집기를 연다', () => {
      const t = create();
      t.click(1, 'name');
      t.press('Space');

      const input = document.querySelector('.dg-edit-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.value).toBe('n2');
    });

    it('Ctrl+Z·Ctrl+Y·Ctrl+Shift+Z로 되돌리기와 다시 실행을 한다', () => {
      const t = create();
      t.click(0, 'name');
      t.dm.setChangeValue(t.dm.getRowItem(1), t.cfg.allFieldMap.get('name'), 'changed');
      expect(t.values('name')[0]).toBe('changed');

      t.press('KeyZ', { ctrlKey: true });
      expect(t.values('name')[0]).toBe('n1');
      t.press('KeyY', { ctrlKey: true });
      expect(t.values('name')[0]).toBe('changed');
      t.press('KeyZ', { ctrlKey: true });
      expect(t.values('name')[0]).toBe('n1');
      t.press('KeyZ', { ctrlKey: true, shiftKey: true });
      expect(t.values('name')[0]).toBe('changed');
    });

    it('Ctrl+C는 선택 영역을 클립보드에 복사한다', () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      const t = create();
      t.click(1, 'name');

      t.press('KeyC', { ctrlKey: true });
      expect(writeText).toHaveBeenCalledWith('n2');
    });

    it('선택 모드가 none이면 Ctrl+C로 복사하지 않는다', () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      const t = create({ selectionMode: 'none' });

      t.press('KeyC', { ctrlKey: true });
      expect(writeText).not.toHaveBeenCalled();
    });

    it('Ctrl+F는 검색이 켜져 있을 때만 검색 창을 연다', () => {
      const on = create({ search: { enabled: true } });
      const spyOn = jest.spyOn(on.main.getDataSearch(), 'openSearch').mockReturnValue(true);
      on.press('KeyF', { ctrlKey: true });
      expect(spyOn).toHaveBeenCalledTimes(1);

      const off = create();
      const spyOff = jest.spyOn(off.main.getDataSearch(), 'openSearch');
      off.press('KeyF', { ctrlKey: true });
      expect(spyOff).not.toHaveBeenCalled();
    });
  });

  describe('붙여넣기', () => {
    it('선택한 셀부터 탭·줄 단위로 값을 채우고 한 번의 되돌리기로 모두 복원한다', () => {
      const t = create();
      t.click(1, 'name');

      t.paste('a\t10\nb\t20\nc\t30');

      expect(t.values('name')).toEqual(['n1', 'a', 'b', 'c', 'n5', 'n6']);
      expect(t.values('qty').slice(0, 5)).toEqual(['1', '10', '20', '30', '5']);
      expect(t.status(2)).toBe(ItemStatusMap.MODIFY);
      expect(t.status(1)).toBe(ItemStatusMap.READ);

      t.dm.undo();
      expect(t.values('name')).toEqual(rows().map((row) => row.name));
      expect(t.values('qty')).toEqual(rows().map((row) => row.qty));
      expect(t.history().isRecording()).toBe(false);
    });

    it('열이 모자라면 넘치는 값은 무시한다', () => {
      const t = create();
      t.click(0, 'qty');

      t.paste('5\tignored\tignored');

      expect(t.values('qty')[0]).toBe('5');
      expect(t.values('name')[0]).toBe('n1');
    });

    it('행이 모자라면 신규 행을 만들어 채운다', () => {
      const t = create();
      t.click(4, 'name');

      t.paste('a\nb\nc\nd');

      expect(t.ids()).toHaveLength(8);
      expect(t.values('name').slice(4)).toEqual(['a', 'b', 'c', 'd']);
      expect(t.dm.getChangedItems().filter((item: Record<string, unknown>) => item[ROW_FIELD.CUD] === ItemStatusMap.CREATE)).toHaveLength(2);
    });

    it('따옴표로 감싼 값은 복원하고 =로 시작하는 값은 수식 방지 접두를 붙인다', () => {
      const t = create();
      t.click(0, 'name');

      t.paste('"say ""hi"""\n=SUM(A1)');

      expect(t.values('name').slice(0, 2)).toEqual(['say "hi"', "'=SUM(A1)"]);
    });

    it('pasteBefore로 텍스트를 바꾸고, 빈 값을 반환하면 붙여넣지 않는다', () => {
      const pasteAfter = jest.fn();
      const t = create({
        body: { pasteBefore: (text: string) => (text === 'skip' ? '' : text.toUpperCase()), pasteAfter },
      });
      t.click(0, 'name');

      t.paste('abc');
      expect(t.values('name')[0]).toBe('ABC');
      expect(pasteAfter).toHaveBeenCalledWith('ABC');

      t.paste('skip');
      expect(t.values('name')[0]).toBe('ABC');
      expect(pasteAfter).toHaveBeenCalledTimes(1);
    });

    it('빈 클립보드 텍스트는 아무것도 바꾸지 않는다', () => {
      const t = create();
      t.click(0, 'name');

      t.paste('');
      t.paste(null);

      expect(t.values('name')).toEqual(rows().map((row) => row.name));
      expect(t.history().canUndo()).toBe(false);
    });

    it('유효하지 않은 값을 만나면 거기서 중단하고, 이후 편집은 정상적으로 되돌릴 수 있다', () => {
      const t = create();
      t.click(0, 'qty');

      const event = t.paste('11\nabc\n33');

      expect(event.defaultPrevented).toBe(true);
      // 거부된 값('abc')에서 중단하므로 앞의 값만 적용하고 이후 값은 적용하지 않는다.
      expect(t.values('qty').slice(0, 3)).toEqual(['11', '2', '3']);
      // 중단되어도 이력 트랜잭션이 열린 채 남지 않는다.
      expect(t.history().isRecording()).toBe(false);

      t.dm.setChangeValue(t.dm.getRowItem(1), t.cfg.allFieldMap.get('name'), 'after');
      expect(t.history().isRecording()).toBe(false);
      t.dm.undo();
      expect(t.values('name')[0]).toBe('n1');
    });
  });

  describe('행 이동', () => {
    const create6 = (rowMove: Record<string, unknown> = {}) => {
      const calls: string[] = [];
      const t = create({
        deleteMode: 'hard',
        body: {
          rowMove: {
            enabled: true,
            dragHandle: 'ALL',
            dragStart: () => void calls.push('dragStart'),
            dragOver: (p: { dropItemIdx: number; position: string }) => void calls.push(`dragOver:${p.dropItemIdx}:${p.position}`),
            drop: (p: { dropItemIdx: number; position: string }) => void calls.push(`drop:${p.dropItemIdx}:${p.position}`),
            dragEnd: (p: { dropItemIdx: number }) => void calls.push(`dragEnd:${p.dropItemIdx}`),
            ...rowMove,
          },
        },
      });

      const handler = t.main
        .getBody()
        .bodyEvent.handlers.find((candidate: { constructor: { name: string } }) => candidate.constructor.name === 'RowMoveHandler');
      const rowHeight = t.cfg.rowHeight as number;

      const session = (rowIndex: number, name = 'name') => {
        const viewItem = t.dm.getViewItems()[rowIndex];
        const cellInfo = {
          rowIndex,
          item: t.dm.getRowItem(viewItem.id),
          viewItem,
          field: t.cfg.currentFields[t.col(name)],
        };
        return {
          state: PointerStateMap.DRAGGING,
          event: new MouseEvent('pointerdown'),
          startPos: { x: 10, y: rowHeight * rowIndex + 2 },
          currentPos: { x: 10, y: rowHeight * rowIndex + 2 },
          cellInfo,
          cellEl: t.cell(rowIndex, name),
          clickManager: { getClickCount: () => 1 },
        } as any;
      };

      /** startRow 행을 잡아 y 좌표(행 번호 기준, 행 상단에서 offset px)로 끌어 놓는다. */
      const drag = (startRow: number, overRow: number, offset = 2, x = 20) => {
        const s = session(startRow);
        handler.canHandle(s);
        handler.startCellInfo = s.cellInfo;
        const started = handler.onActivate(s);
        s.currentPos = { x, y: rowHeight * overRow + offset };
        handler.onPointerMove(s);
        return { s, started };
      };

      return { ...t, calls, handler, rowHeight, session, drag };
    };

    it('아래로 끌어 놓으면 대상 행 뒤로(AFTER) 이동하고 콜백을 순서대로 호출한다', () => {
      const t = create6();
      const { s } = t.drag(0, 4);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6]);
      expect(t.grid.getItems().map((item: { id: number }) => item.id)).toEqual([2, 3, 4, 1, 5, 6]);
      expect(t.calls[0]).toBe('dragStart');
      expect(t.calls).toContain('drop:3:after');
      expect(t.calls[t.calls.length - 1]).toBe('dragEnd:3');
    });

    it('위로 끌어 놓으면 대상 행 앞으로(BEFORE) 이동한다', () => {
      const t = create6();
      const { s } = t.drag(4, 1);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([1, 5, 2, 3, 4, 6]);
      expect(t.calls).toContain('drop:1:before');
    });

    it('자기 자신이나 바로 아래 위치에 놓으면 이동하지 않는다', () => {
      const t = create6();
      const { s } = t.drag(2, 2);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(t.calls.some((call) => call.startsWith('drop'))).toBe(false);
    });

    it('dragStart가 false를 반환하면 시작하지 않는다', () => {
      const t = create6({ dragStart: () => false });
      const s = t.session(0);
      t.handler.canHandle(s);
      t.handler.startCellInfo = s.cellInfo;

      expect(t.handler.onActivate(s)).toBe(false);
      expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('dragOver가 false를 반환하면 놓아도 이동하지 않는다', () => {
      const t = create6({ dragOver: () => false });
      const { s } = t.drag(0, 4);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('drop이 false를 반환하면 원래 순서를 유지한다', () => {
      const t = create6({ drop: () => false });
      const { s } = t.drag(0, 4);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('그리드 바깥에서 놓으면 이동하지 않는다', () => {
      const t = create6();
      const { s } = t.drag(0, 3);
      s.currentPos = { x: 5000, y: 5000 };
      t.handler.onPointerMove(s);
      t.handler.onPointerUp(s);

      expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('dragHandle로 지정한 필드에서만 시작할 수 있다', () => {
      const t = create6({ dragHandle: 'name' });

      expect(t.handler.canHandle(t.session(0, 'name'))).toBe(true);
      expect(t.handler.canHandle(t.session(0, 'qty'))).toBe(false);
    });

    describe('이동한 순서 유지', () => {
      const moved = (t: ReturnType<typeof create6>) => {
        const { s } = t.drag(0, 4);
        t.handler.onPointerUp(s);
        expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6]);
      };

      it('행을 추가해도 유지된다', () => {
        const t = create6();
        moved(t);

        t.grid.addItems([{ id: 99, name: 'z', qty: '9' }]);
        expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6, 99]);
        expect(t.grid.getItems().map((item: { id: number }) => item.id)).toEqual([2, 3, 4, 1, 5, 6, 99]);
      });

      it('행을 삭제하거나 되돌리기를 해도 유지된다', () => {
        const t = create6();
        moved(t);

        t.grid.removeItems([3]);
        expect(t.ids()).toEqual([2, 4, 1, 5, 6]);

        t.dm.setChangeValue(t.dm.getRowItem(2), t.cfg.allFieldMap.get('name'), 'x');
        t.dm.undo();
        expect(t.ids()).toEqual([2, 4, 1, 5, 6]);
      });

      it('검색을 켰다 해제해도 유지된다', () => {
        const t = create6();
        moved(t);

        t.grid.search('n', {} as never);
        t.grid.search('', {} as never);
        expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6]);
      });

      it('연속으로 옮겨도 마지막 순서가 유지된다', () => {
        const t = create6();
        moved(t);

        const { s } = t.drag(5, 0, 2);
        t.handler.onPointerUp(s);
        expect(t.ids()).toEqual([6, 2, 3, 4, 1, 5]);

        t.grid.addItems([{ id: 99, name: 'z', qty: '9' }]);
        expect(t.ids()).toEqual([6, 2, 3, 4, 1, 5, 99]);
      });

      it('정렬이 켜져 있으면 이동은 화면에만 적용하고 원본 순서는 바꾸지 않는다', () => {
        const t = create6();
        t.dm.dataSort([{ name: 'id', field: t.cfg.allFieldMap.get('id'), ascOrder: true, sortCell: 1 }], {});
        const { s } = t.drag(0, 4);
        t.handler.onPointerUp(s);
        expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6]);

        // 정렬 기준이 다시 적용되면 정렬 순서로 돌아가고, 원본은 처음 순서 그대로이다.
        t.grid.addItems([{ id: 99, name: 'z', qty: '9' }]);
        expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6, 99]);
      });

      it('검색 중에는 이동을 화면에만 적용하고, 해제하면 원본 순서로 돌아간다', () => {
        const t = create6();
        t.grid.search('n', {} as never);
        const { s } = t.drag(0, 4);
        t.handler.onPointerUp(s);
        expect(t.ids()).toEqual([2, 3, 4, 1, 5, 6]);

        t.grid.search('', {} as never);
        expect(t.ids()).toEqual([1, 2, 3, 4, 5, 6]);
      });
    });
  });
});
