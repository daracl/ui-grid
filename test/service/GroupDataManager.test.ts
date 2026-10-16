import { GroupDataManager } from '@/service/GroupDataManager';
import { FieldItem } from '@/types/GridField';
import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

describe('GroupDataManager', () => {
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
      sumFields: ['amount'],
      showGroupSum: true,
      showGrandSum: true,
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
    expect(subtotalRows.map(({ groupField, groupValue, groupSums }) => [groupField, groupValue, groupSums?.amount])).toEqual([
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
      sumFields: ['amount'],
      showGroupSum: false,
      showGrandSum: true,
    } as unknown as GridOptions;
    const manager = new GroupDataManager(options, gridMain);

    manager.setItems([{ id: '1', country: 'KR', amount: 5 }]);

    expect(manager.getViewItems().map((item) => item.groupRowType)).toEqual([undefined, 'grandSummary']);
  });
});
