import type { GridOptions } from '@/types/GridOptions';

/** 그리드를 파괴한 뒤 숨김 컨테이너나 document.body에 요소가 남지 않는지 확인한다. */
describe('그리드 파괴 시 정리', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;

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
    document.body.innerHTML = '';
  });

  const options = (extra: Record<string, unknown> = {}): GridOptions =>
    ({
      width: 500,
      height: 300,
      editable: true,
      rowIdField: 'id',
      selectionMode: 'multiCell',
      fields: [
        { name: 'id' },
        { name: 'name', editRenderer: { type: 'text' } },
        { name: 'trend', renderer: { type: 'sparkline', refValue: (_field: unknown, value: unknown) => ({ value }) } },
        { name: 'bars', renderer: { type: 'sparklineBar', refValue: (_field: unknown, value: unknown) => ({ value }) } },
      ],
      contextMenu: { enabled: true, items: [{ key: 'k', label: 'K' }] },
      body: { rowMove: { enabled: true, dragHandle: 'ALL' } },
      items: [{ id: 1, name: 'a', trend: [1, 2, 3], bars: [3, 2, 1] }],
      ...extra,
    } as unknown as GridOptions);

  const create = (extra: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    return { element, grid: DaraGrid.create(element, options(extra)) };
  };

  const hiddenChildren = () => document.querySelector('.dg-hidden-layers')?.children.length ?? 0;

  it('컨텍스트 메뉴와 행 이동 도우미를 숨김 컨테이너에서 제거한다', () => {
    const first = create();
    first.grid.destroy();
    first.element.remove();
    const baseline = hiddenChildren();

    for (let i = 0; i < 20; i++) {
      const { grid, element } = create();
      expect(hiddenChildren()).toBeGreaterThan(baseline);
      grid.destroy();
      element.remove();
    }

    expect(hiddenChildren()).toBe(baseline);
  });

  it('sparkline 툴팁처럼 document.body에 만든 요소도 제거한다', () => {
    const before = document.body.children.length;
    const { grid, element } = create();
    const fields = (grid as unknown as { gridMain: any }).gridMain.config().currentFields as {
      name: string;
      $renderer: { showTooltip(x: number, y: number, value: string): void };
    }[];

    // 마우스를 올렸을 때 지연 생성되는 툴팁을 만든다.
    fields.filter((field) => ['trend', 'bars'].includes(field.name)).forEach((field) => field.$renderer.showTooltip(10, 10, '1'));
    expect(document.body.querySelectorAll('div[style*="position: fixed"]').length).toBe(2);

    grid.destroy();
    element.remove();

    expect(document.body.querySelectorAll('div[style*="position: fixed"]')).toHaveLength(0);
    expect(document.body.children.length).toBe(before + 1); // 숨김 컨테이너 하나만 남는다.
  });

  it('행 이동 드래그 중에 파괴해도 자동 스크롤 예약이 남지 않는다', () => {
    const cancel = jest.spyOn(window, 'cancelAnimationFrame');
    const { grid } = create();
    const handler = (grid as unknown as { gridMain: any }).gridMain
      .getBody()
      .bodyEvent.handlers.find((candidate: { constructor: { name: string } }) => candidate.constructor.name === 'RowMoveHandler');
    handler.dragAnimationId = 12345;

    grid.destroy();

    expect(cancel).toHaveBeenCalledWith(12345);
    expect(handler.dragAnimationId).toBe(0);
    cancel.mockRestore();
  });

  it('컨텍스트 메뉴를 쓰지 않는 그리드도 오류 없이 파괴된다', () => {
    const { grid } = create({ contextMenu: undefined, body: undefined });

    expect(() => grid.destroy()).not.toThrow();
  });
});
