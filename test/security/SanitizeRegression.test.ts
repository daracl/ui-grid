import type { GridOptions } from '@/types/GridOptions';

/** XSS 방어 회귀 테스트: 사용자·서버 데이터가 스크립트 실행 가능한 HTML로 삽입되지 않아야 한다. */
describe('XSS 방어 회귀', () => {
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
    jest.useRealTimers();
  });

  const create = (options: Record<string, unknown>) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, { width: 640, height: 320, ...options } as unknown as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: any }).gridMain;
    return { grid, main, element };
  };

  /** 스크립트를 실행하거나 이벤트 핸들러·javascript: 주소를 가진 요소가 없는지 확인한다. */
  const expectNoActiveContent = (root: ParentNode) => {
    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('iframe, object, embed')).toBeNull();
    root.querySelectorAll('*').forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        expect(attr.name.toLowerCase().startsWith('on')).toBe(false);
        if (['href', 'src'].includes(attr.name.toLowerCase())) {
          expect(/^javascript:(?!void)/i.test(attr.value.replace(/\s/g, ''))).toBe(false);
        }
      });
    });
  };

  const PAYLOAD =
    '<b>ok</b><script>window.__xss=1</script><img src="x" onerror="window.__xss=2"><a href="javascript:window.__xss=3">link</a>';

  describe('셀 HTML 렌더러', () => {
    it('스크립트·이벤트 핸들러·javascript: 주소를 제거하고 안전한 태그는 유지한다', () => {
      const { element } = create({
        rowIdField: 'id',
        fields: [
          { name: 'id', width: 60 },
          { name: 'html', width: 300, renderer: { type: 'html' } },
        ],
        items: [
          { id: 1, html: PAYLOAD },
          { id: 2, html: 'plain text' },
          { id: 3, html: null },
        ],
      });

      const cells = Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-row')).map(
        (row) => row.querySelectorAll('.dg-cell')[1] as HTMLElement,
      );
      expect(cells).toHaveLength(3);
      cells.forEach((cell) => expectNoActiveContent(cell));

      expect(cells[0].querySelector('b')?.textContent).toBe('ok');
      expect(cells[0].querySelector('a')?.getAttribute('href') ?? '').not.toMatch(/javascript:/i);
      expect(cells[1].textContent).toBe('plain text');
      expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
    });

    it('화면을 덮을 수 있는 position 스타일은 제거하고 일반 스타일은 유지한다', () => {
      const { element } = create({
        rowIdField: 'id',
        fields: [{ name: 'html', width: 300, renderer: { type: 'html' } }],
        items: [
          { id: 1, html: '<span style="position:fixed;top:0;left:0;color:red">overlay</span>' },
          { id: 2, html: '<span style="position : absolute">overlay2</span>' },
          { id: 3, html: '<span style="color:blue">ok</span>' },
        ],
      });

      const spans = Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-row span')) as HTMLElement[];
      const byText = (text: string) => spans.find((span) => span.textContent === text)!;
      expect(byText('overlay').getAttribute('style') ?? '').not.toMatch(/position/i);
      expect(byText('overlay2').getAttribute('style') ?? '').not.toMatch(/position/i);
      expect(byText('ok').style.color).toBe('blue');
    });

    it('HTML 문자 참조(&amp;)가 있는 텍스트도 그대로 표시한다', () => {
      const { element } = create({
        rowIdField: 'id',
        fields: [{ name: 'html', width: 300, renderer: { type: 'html' } }],
        items: [{ id: 1, html: 'a &amp; b' }],
      });
      expect(element.querySelector('.dg-region[data-region="center"] .dg-row .dg-cell')?.textContent).toBe('a & b');
    });
  });

  describe('툴바', () => {
    const toolbar = (children: Record<string, unknown>[]) => ({
      enabled: true,
      items: [[{ position: 'left', children }]],
    });

    it('HTML 렌더러는 defaultValue(문자열·함수)를 정리해서 넣는다', () => {
      const { element } = create({
        fields: [{ name: 'name' }],
        items: [{ name: 'a' }],
        toolbar: toolbar([
          { name: 'h1', renderer: { type: 'html' }, defaultValue: `<i>one</i>${PAYLOAD}` },
          { name: 'h2', renderer: { type: 'html' }, defaultValue: () => `<i>two</i>${PAYLOAD}` },
        ]),
      });

      const toolbarElement = element.querySelector('.dg-toolbar') as HTMLElement;
      expect(toolbarElement).not.toBeNull();
      expectNoActiveContent(toolbarElement);
      expect(toolbarElement.textContent).toContain('one');
      expect(toolbarElement.textContent).toContain('two');
      expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
    });

    it('링크 렌더러는 javascript: 주소를 거부하고 안전한 주소에는 rel을 붙인다', () => {
      const { element } = create({
        fields: [{ name: 'name' }],
        items: [{ name: 'a' }],
        toolbar: toolbar([
          { name: 'bad', label: 'bad', renderer: { type: 'link' }, defaultValue: { href: 'javascript:alert(1)', label: 'bad', target: '_blank' } },
          { name: 'good', label: 'good', renderer: { type: 'link' }, defaultValue: { href: 'https://example.com/a', label: 'good', target: '_blank' } },
        ]),
      });

      const links = Array.from(element.querySelectorAll('.dg-toolbar a.dg-link, .dg-toolbar a')) as HTMLAnchorElement[];
      const bad = links.find((a) => a.textContent === 'bad')!;
      const good = links.find((a) => a.textContent === 'good')!;

      expect(bad.getAttribute('href')).toBe('javascript:void(0);');
      expect(good.getAttribute('href')).toBe('https://example.com/a');
      expect(good.rel).toBe('noopener noreferrer');
    });

    it('필드 라벨의 HTML은 텍스트로 표시한다', () => {
      const { element } = create({
        fields: [{ name: 'name' }],
        items: [{ name: 'a' }],
        toolbar: toolbar([{ name: 't', label: '<img src=x onerror="window.__xss=4">L', renderer: { type: 'text' } }]),
      });

      const label = element.querySelector('.dg-toolbar .dg-label') as HTMLElement;
      expect(label.querySelector('img')).toBeNull();
      expect(label.textContent).toContain('<img src=x onerror="window.__xss=4">L');
    });
  });

  describe('헤더', () => {
    it('필드 라벨의 HTML은 텍스트로 표시한다', () => {
      const { element } = create({
        fields: [
          { name: 'a', label: '<img src=x onerror="window.__xss=5">이름' },
          { name: 'b', label: 'A & B' },
        ],
        items: [{ a: 1, b: 2 }],
      });

      const header = element.querySelector('.dg-header') as HTMLElement;
      expect(header.querySelector('img')).toBeNull();
      expect(header.textContent).toContain('<img src=x onerror="window.__xss=5">이름');
      expect(header.textContent).toContain('A & B');
    });

    it('도움말 내용은 정리해서 표시한다', () => {
      jest.useFakeTimers();
      const { element, main } = create({
        header: { help: { enabled: true, showDelay: 0, content: `<b>help</b>${PAYLOAD}` } },
        fields: [{ name: 'a', label: 'A' }],
        items: [{ a: 1 }],
      });

      const help = element.querySelector('.dg-header .dg-header-help') as HTMLElement;
      expect(help).not.toBeNull();
      help.dispatchEvent(new MouseEvent('mouseenter'));
      jest.runAllTimers();

      const tooltip = main.getRendererLayerElement().querySelector('.dg-header-help-tooltip') as HTMLElement;
      expect(tooltip).not.toBeNull();
      expectNoActiveContent(tooltip);
      expect(tooltip.querySelector('b')?.textContent).toBe('help');
      expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
    });
  });

  describe('검색 필드 선택', () => {
    it('필드 이름·라벨을 이스케이프한다', () => {
      const { main } = create({
        search: { enabled: true },
        fields: [{ name: 'x"><img src=x onerror=1>', label: '"><img src=x onerror="window.__xss=6">라벨' }],
        items: [{}],
      });

      main.getDataSearch().simpleTemplate?.();
      const select = main.getRendererLayerElement().querySelector('.dg-search-field') as HTMLSelectElement;
      expect(select).not.toBeNull();
      expect(select.querySelector('img')).toBeNull();
      const option = select.querySelectorAll('option')[1];
      expect(option.textContent).toBe('"><img src=x onerror="window.__xss=6">라벨');
      expect(option.value).toBe('x"><img src=x onerror=1>');
    });
  });

  describe('행 이동', () => {
    it('dragTemplate이 만든 HTML을 정리해서 드래그 도우미에 넣는다', () => {
      const { main } = create({
        rowIdField: 'id',
        fields: [
          { name: 'id', width: 60 },
          { name: 'name', width: 120 },
        ],
        items: [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
        ],
        body: {
          rowMove: { enabled: true, dragHandle: 'ALL', dragTemplate: () => `<b>moving</b>${PAYLOAD}` },
        },
      });

      const body = main.getBody();
      const handler = body.bodyEvent.handlers.find((candidate: { onActivate?: unknown }) => 'onActivate' in candidate);
      expect(handler).toBeDefined();

      const cfg = main.config();
      const field = cfg.currentFields.find((candidate: { name: string }) => candidate.name === 'name');
      const viewItem = cfg.dataManager.getViewItems()[0];
      const cellInfo = {
        rowIndex: 0,
        item: cfg.dataManager.getRowItem(viewItem.id),
        viewItem,
        field,
      };
      handler.startCellInfo = cellInfo;
      handler.onActivate({
        event: new MouseEvent('pointerdown'),
        cellInfo,
        cellEl: document.createElement('div'),
      });

      // 숨김 영역이 다른 테스트에서 지워졌을 수 있으므로 핸들러가 가진 도우미 요소를 직접 확인한다.
      const helper = handler.rowMoveElement.querySelector('.dg-row-move-content') as HTMLElement;
      expect(helper).not.toBeNull();
      expectNoActiveContent(helper);
      expect(helper.querySelector('b')?.textContent).toBe('moving');
      expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
    });
  });

  describe('번역 메시지', () => {
    it('검색 창의 이전·다음 버튼 제목과 전체 항목 이름을 이스케이프한다', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      const grid = DaraGrid.create(
        element,
        {
          width: 640,
          height: 320,
          search: { enabled: true },
          fields: [{ name: 'a', label: 'A' }],
          items: [{ a: 1 }],
        } as unknown as GridOptions,
        {
          prev: '"><img src=x onerror="window.__xss=9">',
          next: '" onmouseover="window.__xss=10',
          all: '<b>전체</b><img src=x onerror="window.__xss=11">',
        } as never,
      );
      grids.push(grid);

      const layer = (grid as unknown as { gridMain: any }).gridMain.getRendererLayerElement() as HTMLElement;
      const search = layer.querySelector('.dg-search-simple') as HTMLElement;
      expect(search).not.toBeNull();

      expectNoActiveContent(search);
      expect(search.querySelector('img')).toBeNull();
      expect(search.querySelector('.dg-search-prev')?.getAttribute('title')).toBe('"><img src=x onerror="window.__xss=9">');
      expect(search.querySelector('.dg-search-next')?.getAttribute('title')).toBe('" onmouseover="window.__xss=10');
      expect(search.querySelector('.dg-search-field option')?.textContent).toBe('<b>전체</b><img src=x onerror="window.__xss=11">');
      expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
    });
  });

  describe('컨텍스트 메뉴', () => {
    it('라벨·키·핫키·클래스 이름을 이스케이프한다', () => {
      const { main } = create({ fields: [{ name: 'a' }], items: [{ a: 1 }] });

      const html = main.getContextMenu().template(
        [
          {
            key: 'k"x',
            label: '<img src=x onerror="window.__xss=7">',
            hotkey: '<b>Ctrl</b>',
            itemClass: 'ok" onmouseover="window.__xss=8',
          },
          { key: 'c', label: '<i>c</i>', checkbox: true },
        ],
        'top',
        0,
      );

      const holder = document.createElement('ul');
      holder.innerHTML = html;
      expectNoActiveContent(holder);
      expect(holder.querySelector('img, b, i')).toBeNull();
      expect(holder.textContent).toContain('<img src=x onerror="window.__xss=7">');
      expect(holder.textContent).toContain('<b>Ctrl</b>');
      expect(holder.querySelectorAll('[onmouseover]')).toHaveLength(0);
    });
  });
});
