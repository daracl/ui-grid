import { DEFAULT_LINE_NUMBER_WIDTH, FOOTER_HEIGHT, LINE_NUMBER_NAME, ROW_CHECK_NAME, TOOLBAR_HEIGHT } from '@/constants';
import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

/**
 * view/builder 계층(FieldBuilder · FieldWidthCalculator · DimensionCalculator · RendererFactory)이
 * 만든 필드 구조·폭·치수·렌더러 계약을 실제 그리드 인스턴스로 검증한다.
 */
describe('view/builder', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  // constantRenders는 GridMain과 순환 참조가 있어 DaraGrid를 먼저 로드한 뒤 가져온다.
  type RendererMap = Record<string, new (...args: never[]) => object>;
  let ASIDE_RENDERER: RendererMap;
  let EDIT_RENDERER: RendererMap;
  let VIEW_RENDERER: RendererMap;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    DaraGrid = require('@/DaraGrid').DaraGrid;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ({ ASIDE_RENDERER, EDIT_RENDERER, VIEW_RENDERER } = require('@/constantRenders'));
  });

  afterEach(() => {
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const create = (extra: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 600,
      height: 300,
      rowIdField: 'id',
      fields: [
        { name: 'a', label: 'A', width: 100 },
        { name: 'b', label: 'B', width: 100 },
        { name: 'c', label: 'C', width: 100 },
      ],
      items: [
        { id: 1, a: 'a1', b: 'b1', c: 'c1' },
        { id: 2, a: 'a2', b: 'b2', c: 'c2' },
      ],
      ...extra,
    } as unknown as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: GridMain }).gridMain;
    return { grid, main, cfg: main.config() };
  };

  const normalWidthSum = (fields: { $isAside?: boolean; $width: number }[]) =>
    fields.filter((field) => !field.$isAside).reduce((sum, field) => sum + field.$width, 0);

  describe('FieldBuilder', () => {
    it('aside 필드는 order 순으로 앞에 배치되고 asideLength·startCol에 반영된다', () => {
      const { cfg } = create({ aside: { lineNumber: { enabled: true }, rowCheckbox: { enabled: true } } });

      expect(cfg.currentFields.slice(0, 2).map((field) => field.name)).toEqual([LINE_NUMBER_NAME, ROW_CHECK_NAME]);
      expect(cfg.dataInfo.asideLength).toBe(2);
      expect(cfg.dataInfo.startCol).toBe(2);
      expect(cfg.currentFields.map((field) => field.name).slice(2)).toEqual(['a', 'b', 'c']);
      expect(cfg.currentFields.every((field, index) => field.$colSeq === index)).toBe(true);
    });

    it('lineNumber를 끄면 aside 필드가 만들어지지 않는다', () => {
      const { cfg } = create({ aside: { lineNumber: { enabled: false } } });

      expect(cfg.dataInfo.asideLength).toBe(0);
      expect(cfg.currentFields.map((field) => field.name)).toEqual(['a', 'b', 'c']);
    });

    it('hidden 필드는 leaf 목록에서 제외된다', () => {
      const { cfg } = create({
        aside: { lineNumber: { enabled: false } },
        fields: [{ name: 'a', width: 100 }, { name: 'b', width: 100, hidden: true }, { name: 'c', width: 100 }],
      });

      expect(cfg.currentFields.map((field) => field.name)).toEqual(['a', 'c']);
      expect(cfg.dataInfo.colLength).toBe(2);
      expect(cfg.allFieldMap.has('b')).toBe(false);
    });

    it('children이 있으면 부모 colspan은 자식 colspan 합이고 헤더 depth가 늘어난다', () => {
      const { cfg } = create({
        aside: { lineNumber: { enabled: false } },
        fields: [
          { name: 'group', label: 'G', children: [{ name: 'a', width: 100 }, { name: 'b', width: 100 }] },
          { name: 'c', width: 100 },
        ],
      });

      expect(cfg.currentFields.map((field) => field.name)).toEqual(['a', 'b', 'c']);
      expect(cfg.fieldHeaderGroup.depth).toBe(2);
      const parent = cfg.fieldHeaderGroup.center[0].find((field) => field.name === 'group');
      expect(parent?.$colspan).toBe(2);
      expect(parent?.$isLeaf).toBe(false);
      expect(cfg.fieldHeaderGroup.heights).toHaveLength(2);
      expect(cfg.dimensions.mainHeaderHeight).toBe(cfg.fieldHeaderGroup.heights.reduce((a, b) => a + b, 0));
    });

    it('fixedLeftIndex·fixedRightIndex로 left/center/right 패널이 나뉜다', () => {
      const { cfg } = create({
        aside: { lineNumber: { enabled: false } },
        fixedLeftIndex: 1,
        fixedRightIndex: 3,
        fields: [
          { name: 'a', width: 100 },
          { name: 'b', width: 100 },
          { name: 'c', width: 100 },
          { name: 'd', width: 100 },
        ],
      });

      expect(cfg.currentFields.map((field) => field.$panel)).toEqual(['left', 'center', 'center', 'right']);
      expect(cfg.dimensions.mainLeftWidth).toBe(cfg.currentFields[0].$width);
      expect(cfg.dimensions.mainRightWidth).toBe(cfg.currentFields[3].$width);
    });

    it('최소 폭보다 작은 width는 header.resize.minWidth로 보정된다', () => {
      const { cfg } = create({
        aside: { lineNumber: { enabled: false } },
        header: { resize: { minWidth: 60 } },
        fields: [{ name: 'a', width: 20 }, { name: 'b', width: 100 }],
      });

      expect(cfg.currentFields[0].width).toBe(60);
      expect(cfg.currentFields[1].width).toBe(100);
    });

    it('header.view가 false이면 헤더 높이를 계산하지 않는다', () => {
      const { cfg } = create({ header: { view: false } });

      expect(cfg.dimensions.mainHeaderHeight).toBe(0);
    });

    it('정렬 버튼 사용 여부는 header.sort.enabled에서 시작하고, 정렬 가능한 필드가 있으면 켜진다', () => {
      const off = { header: { sort: { enabled: false } } };

      expect(create(off).cfg.enabledSortButton).toBe(false);
      expect(create({ ...off, fields: [{ name: 'a', width: 100, sort: false }] }).cfg.enabledSortButton).toBe(false);
      expect(create({ ...off, fields: [{ name: 'a', width: 100, sort: true }] }).cfg.enabledSortButton).toBe(true);
      expect(create().cfg.enabledSortButton).toBe(true);
    });
  });

  describe('FieldWidthCalculator', () => {
    it('필드 총 폭이 그리드보다 크면 가로 스크롤이 켜지고, 작으면 꺼진다', () => {
      const wide = create({ width: 200, aside: { lineNumber: { enabled: false } } });
      expect(wide.cfg.scroll.enabledHorizontal).toBe(true);

      const narrow = create({ width: 800, aside: { lineNumber: { enabled: false } } });
      expect(narrow.cfg.scroll.enabledHorizontal).toBe(false);
    });

    it('가로 스크롤이 없으면 남는 폭이 일반 필드에 분배되어 가용 폭을 채운다', () => {
      const { cfg } = create({ width: 800, aside: { lineNumber: { enabled: false } } });

      expect(normalWidthSum(cfg.currentFields as never)).toBe(cfg.dimensions.width - 1);
      expect(cfg.dimensions.mainTotalWidth).toBe(normalWidthSum(cfg.currentFields as never));
    });

    it('enabledWidthFixed이면 남는 폭을 분배하지 않고 지정한 width를 유지한다', () => {
      const { cfg } = create({ width: 800, enabledWidthFixed: true, aside: { lineNumber: { enabled: false } } });

      expect(cfg.currentFields.map((field) => field.$width)).toEqual([100, 100, 100]);
    });

    it('aside 필드는 남는 폭 분배에서 제외된다', () => {
      const { cfg } = create({ width: 800 });
      const lineNumber = cfg.currentFields[0];

      expect(lineNumber.$isAside).toBe(true);
      expect(lineNumber.$width).toBe(DEFAULT_LINE_NUMBER_WIDTH);
    });

    it('panel 폭 합이 mainTotalWidth와 같고 mainCenterViewWidth = 내부 폭 - (left+right)이다', () => {
      const { cfg } = create({ width: 800, fixedLeftIndex: 1, aside: { lineNumber: { enabled: false } } });
      const d = cfg.dimensions;

      expect(d.mainLeftWidth + d.mainCenterWidth + d.mainRightWidth).toBe(d.mainTotalWidth);
      expect(d.mainCenterViewWidth).toBe(d.mainInsideWidth - (d.mainLeftWidth + d.mainRightWidth));
    });

    it('setColumnWidth는 minWidth·maxWidth 범위로 제한한다', () => {
      const { main, cfg } = create({
        width: 800,
        aside: { lineNumber: { enabled: false } },
        header: { resize: { minWidth: 50, maxWidth: 200 } },
      });

      main.getStructureBuilder().setColumnWidth(0, 10);
      expect(cfg.currentFields[0].$width).toBe(50);

      main.getStructureBuilder().setColumnWidth(0, 999);
      expect(cfg.currentFields[0].$width).toBe(200);

      main.getStructureBuilder().setColumnWidth(0, 120);
      expect(cfg.currentFields[0].$width).toBe(120);
      expect(cfg.isHeaderResize).toBe(true);
    });

    it('존재하지 않는 컬럼 인덱스의 setColumnWidth는 무시한다', () => {
      const { main, cfg } = create({ aside: { lineNumber: { enabled: false } } });
      const before = cfg.currentFields.map((field) => field.$width);

      main.getStructureBuilder().setColumnWidth(99, 300);

      expect(cfg.currentFields.map((field) => field.$width)).toEqual(before);
      expect(cfg.isHeaderResize).toBe(false);
    });

    it('가로 스크롤을 끄면 컬럼 폭을 바꿔도 일반 필드 폭 합이 가용 폭에 맞게 재분배된다', () => {
      const { main, cfg } = create({
        width: 600,
        aside: { lineNumber: { enabled: false } },
        scroll: { horizontal: { enabled: false } },
      });
      const before = normalWidthSum(cfg.currentFields as never);

      main.getStructureBuilder().setColumnWidth(0, 300);

      expect(cfg.scroll.enabledHorizontal).toBe(false);
      expect(normalWidthSum(cfg.currentFields as never)).toBe(before);
      expect(cfg.currentFields[0].$width).toBeGreaterThan(cfg.currentFields[1].$width);
    });
  });

  describe('DimensionCalculator', () => {
    it('툴바·푸터가 꺼져 있으면 높이는 0이다', () => {
      const { cfg } = create();

      expect(cfg.dimensions.toolbarHeight).toBe(0);
      expect(cfg.dimensions.footerHeight).toBe(0);
    });

    it('툴바 높이는 행별 높이의 합이고, 지정하지 않은 행은 toolbar.height를 쓴다', () => {
      const toolbarOpts = {
        enabled: true,
        height: 30,
        items: [
          [{ position: 'left', height: 40, children: [] }],
          [{ position: 'left', children: [] }],
        ],
      };
      const { cfg } = create({ toolbar: toolbarOpts });

      expect(cfg.dimensions.toolbarHeight).toBe(40 + 30);
    });

    it('toolbar.height를 지정하지 않으면 기본 TOOLBAR_HEIGHT를 쓴다', () => {
      const { cfg } = create({ toolbar: { enabled: true, items: [[{ position: 'left', children: [] }]] } });

      expect(cfg.dimensions.toolbarHeight).toBe(TOOLBAR_HEIGHT);
    });

    it('items가 없으면 toolbar.enabled여도 높이는 0이다', () => {
      const { cfg } = create({ toolbar: { enabled: true, items: [] } });

      expect(cfg.dimensions.toolbarHeight).toBe(0);
    });

    it('footer가 켜지면 지정 높이 또는 기본 FOOTER_HEIGHT를 쓴다', () => {
      expect(create({ footer: { enabled: true } }).cfg.dimensions.footerHeight).toBe(FOOTER_HEIGHT);
      expect(create({ footer: { enabled: true, height: 50 } }).cfg.dimensions.footerHeight).toBe(50);
    });

    it('요약 영역 높이는 항목 높이 합에 테두리 보정(최대 2)을 더한다', () => {
      const { cfg } = create({ summary: { height: 20, items: [[{ name: 'a', label: 'x' }], [{ name: 'a', label: 'y' }]] } });

      expect(cfg.summary.heights).toEqual([20, 20]);
      expect(cfg.dimensions.mainSummaryHeight).toBe(40 + 2);
    });

    it('disableVerticalScroll이면 그리드 높이가 행 수에 맞춰지고 세로 스크롤은 꺼진다', () => {
      const { cfg } = create({ height: 600, scroll: { vertical: { enabled: false } } });

      expect(cfg.scroll.enabledVertical).toBe(false);
      expect(cfg.dimensions.mainBodyHeight).toBe(cfg.rowHeight * cfg.dataInfo.rowLength);
      expect(cfg.dimensions.height).toBe(
        cfg.dimensions.mainHeight + cfg.dimensions.toolbarHeight + cfg.dimensions.footerHeight,
      );
    });

    it('행이 영역을 넘으면 세로 스크롤이 켜지고 viewRow는 행 수를 넘지 않는다', () => {
      const items = Array.from({ length: 200 }, (_, index) => ({ id: index, a: `a${index}` }));
      const { cfg } = create({ height: 200, items });

      expect(cfg.scroll.enabledVertical).toBe(true);
      expect(cfg.scroll.viewRow).toBeGreaterThan(0);
      expect(cfg.scroll.viewRow).toBeLessThanOrEqual(cfg.dataInfo.rowLength);
    });

    it('높이가 최소 높이보다 작아도 최소 높이로 보정된다', () => {
      const { cfg } = create({ height: 10 });
      const d = cfg.dimensions;

      expect(d.height).toBeGreaterThanOrEqual(d.toolbarHeight + d.footerHeight + d.mainHeaderHeight + cfg.rowHeight);
    });
  });

  describe('RendererFactory', () => {
    const fieldOf = (cfg: ReturnType<typeof create>['cfg'], name: string) => cfg.allFieldMap.get(name)!;

    it('renderer 문자열 type에 맞는 뷰 렌더러를 만든다', () => {
      const { cfg } = create({
        fields: [{ name: 'a', width: 100, renderer: 'number' }, { name: 'b', width: 100, renderer: { type: 'link' } }],
      });

      expect(fieldOf(cfg, 'a').$renderer).toBeInstanceOf(VIEW_RENDERER.number);
      expect(fieldOf(cfg, 'b').$renderer).toBeInstanceOf(VIEW_RENDERER.link);
    });

    it('renderer를 생략하거나 알 수 없는 type이면 text 렌더러로 대체한다', () => {
      const { cfg } = create({
        fields: [{ name: 'a', width: 100 }, { name: 'b', width: 100, renderer: 'noSuchRenderer' }],
      });

      expect(fieldOf(cfg, 'a').$renderer).toBeInstanceOf(VIEW_RENDERER.text);
      expect(fieldOf(cfg, 'b').$renderer).toBeInstanceOf(VIEW_RENDERER.text);
      expect(fieldOf(cfg, 'b').renderer.type).toBe('text');
    });

    it('aside 필드는 ASIDE_RENDERER 구현을 쓴다', () => {
      const { cfg } = create({ aside: { lineNumber: { enabled: true }, rowCheckbox: { enabled: true } } });

      expect(fieldOf(cfg, LINE_NUMBER_NAME).$renderer).toBeInstanceOf(ASIDE_RENDERER.lineNumber);
      expect(fieldOf(cfg, ROW_CHECK_NAME).$renderer).toBeInstanceOf(ASIDE_RENDERER.rowCheckbox);
    });

    it('편집 가능한 필드는 renderer type에 맞는 편집 렌더러를 만든다', () => {
      const { cfg } = create({
        editable: true,
        fields: [
          { name: 'a', width: 100, editable: true },
          { name: 'b', width: 100, editable: true, renderer: 'number' },
          { name: 'c', width: 100, editable: true, editRenderer: 'password' },
        ],
      });

      expect(fieldOf(cfg, 'a').$editRenderer).toBeInstanceOf(EDIT_RENDERER.text);
      expect(fieldOf(cfg, 'b').$editRenderer).toBeInstanceOf(EDIT_RENDERER.number);
      expect(fieldOf(cfg, 'c').$editRenderer).toBeInstanceOf(EDIT_RENDERER.password);
    });

    it('편집 불가 필드는 편집 렌더러를 만들지 않는다', () => {
      const { cfg } = create();

      expect(fieldOf(cfg, 'a').$editRenderer).toBeUndefined();
    });
  });
});
