import { GroupDataManager } from '@/service/GroupDataManager';
import { FieldItem } from '@/types/GridField';
import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

describe('GroupDataManager', () => {
  it.each([false, true])('controls group and grand summary rows independently (group: %s)', (group) => {
    const config = { rowHeight: 24, rowIdField: 'id', dataInfo: { rowLength: 0, lastRow: 0 }, searchEnabled: false };
    const gridMain = { config: () => config, getSummary: () => ({ drawData: jest.fn() }) } as unknown as GridMain;
    const manager = new GroupDataManager(
      {
        rowIdField: 'id',
        footer: { enabled: false },
        groupingFields: ['category'],
        groupSummaryFields: [{ field: 'amount', expression: 'avg' }],
        showGroupSummary: group,
        showGrandSummary: !group,
      } as unknown as GridOptions,
      gridMain,
    );
    manager.setItems([{ id: '1', category: 'A', amount: 12 }]);
    const rows = manager.getViewItems();
    expect(rows.some((row) => row.groupRowType === 'groupSummary')).toBe(group);
    expect(rows.some((row) => row.groupRowType === 'grandSummary')).toBe(!group);
  });
  it('supports expressions and callbacks over detail rows and refreshes callback dependencies', () => {
    const config = { rowHeight: 24, rowIdField: 'id', dataInfo: { rowLength: 0, lastRow: 0 }, searchEnabled: false };
    const gridMain = {
      config: () => config,
      getSummary: () => ({ drawData: jest.fn() }),
      selectionInfo: { initSelection: jest.fn() },
      calcBody: jest.fn(),
      refreshBody: jest.fn(),
    } as unknown as GridMain;
    const custom = jest.fn((items: any[]) =>
      items.reduce((sum, item) => sum + item.price * item.quantity - (item.discount ?? 0), 0),
    );
    const options = {
      rowIdField: 'id',
      footer: { enabled: false },
      groupingFields: ['category'],
      groupSummaryFields: [
        { field: 'quantity', expression: 'sum' },
        { field: 'price', expression: 'avg' },
        { field: 'count', expression: 'count' },
        { field: 'total', expression: custom },
      ],
    } as unknown as GridOptions;
    const manager = new GroupDataManager(options, gridMain);
    manager.setItems([
      { id: '1', category: 'A', quantity: 2, price: 10 },
      { id: '2', category: 'A', quantity: 3, price: 20 },
      { id: '3', category: 'B', quantity: 1, price: 30 },
    ]);
    const summaries = () => manager.getViewItems().filter((item) => item.groupRowType);
    expect(summaries().map((item) => item.groupSums)).toEqual([
      { quantity: 5, price: 15, count: 2, total: 80 },
      { quantity: 1, price: 30, count: 1, total: 30 },
      { quantity: 6, price: 20, count: 3, total: 110 },
    ]);
    expect(custom.mock.calls.map(([items]) => items.length)).toEqual([2, 1, 3]);
    expect(custom.mock.calls.every(([items]) => items.every((item: any) => !item.groupRowType))).toBe(true);
    // 출력 집계 열에 없는 참조 필드가 바뀌어도 함수를 다시 계산한다.
    manager.setChangeValue(manager.getRowItem('1'), { name: 'price' } as FieldItem, 40);
    expect(summaries().slice(-1)[0]?.groupSums?.total).toBe(170);
    manager.setChangeValue(manager.getRowItem('1'), { name: 'discount' } as FieldItem, 5);
    expect(summaries().slice(-1)[0]?.groupSums?.total).toBe(165);
    options.groupSummaryFields = [];
    manager.setItems([{ id: '4', category: 'C', price: 5 }]);
    expect(summaries()).toEqual([]);
  });
  it('keeps detail rows together and adds leaf-group subtotals and a grand total', () => {
    const config = {
      rowHeight: 24,
      rowIdField: 'id',
      dataInfo: { rowLength: 0, lastRow: 0 },
      searchEnabled: false,
    };
    const gridMain = {
      config: () => config,
      getSummary: () => ({ drawData: jest.fn() }),
    } as unknown as GridMain;
    const options = {
      rowIdField: 'id',
      footer: { enabled: false },
      groupingFields: ['country', 'product'],
      groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
      showGroupSummary: true,
      showGrandSummary: true,
    } as unknown as GridOptions;
    const manager = new GroupDataManager(options, gridMain);

    manager.setItems([
      { id: '1', country: 'KR', product: 'A', amount: 5 },
      { id: '2', country: 'KR', product: 'A', amount: 7 },
      { id: '3', country: 'KR', product: 'B', amount: 2 },
      { id: '4', country: 'US', product: 'C', amount: 4 },
    ]);

    const viewItems = manager.getViewItems();
    const subtotalRows = viewItems.filter((item) => item.groupRowType === 'groupSummary');
    const grandTotal = viewItems.find((item) => item.groupRowType === 'grandSummary');

    expect(viewItems.map((item) => item.groupRowType)).toEqual([
      undefined,
      undefined,
      'groupSummary',
      undefined,
      'groupSummary',
      undefined,
      'groupSummary',
      'grandSummary',
    ]);
    expect(viewItems.some((item) => item.groupRowType === 'group')).toBe(false);
    expect(
      subtotalRows.map(({ groupField, groupValue, groupSums }) => [groupField, groupValue, groupSums?.amount]),
    ).toEqual([
      ['product', 'A', 12],
      ['product', 'B', 2],
      ['product', 'C', 4],
    ]);
    expect(grandTotal?.groupSums?.amount).toBe(18);
    expect(manager.convertViewItemsToRowItems()).toHaveLength(4);

    manager.setChangeValue(manager.getRowItem('1'), { name: 'amount' } as FieldItem, 8);

    expect(manager.getViewItems().find((item) => item.groupRowType === 'grandSummary')?.groupSums?.amount).toBe(21);
  });

  it('can independently hide subtotal and grand-total rows', () => {
    const config = {
      rowHeight: 24,
      rowIdField: 'id',
      dataInfo: { rowLength: 0, lastRow: 0 },
      searchEnabled: false,
    };
    const gridMain = {
      config: () => config,
      getSummary: () => ({ drawData: jest.fn() }),
    } as unknown as GridMain;
    const options = {
      rowIdField: 'id',
      footer: { enabled: false },
      groupingFields: ['country'],
      groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
      showGroupSummary: false,
      showGrandSummary: true,
    } as unknown as GridOptions;
    const manager = new GroupDataManager(options, gridMain);

    manager.setItems([{ id: '1', country: 'KR', amount: 5 }]);

    expect(manager.getViewItems().map((item) => item.groupRowType)).toEqual([undefined, 'grandSummary']);
  });
});
