import { GridOptions } from '@/types/GridOptions';

const canvasContext = {
  font: '',
  measureText: (text: string) => ({ width: text.length * 8 }),
};

type GridInstance = InstanceType<typeof import('@/DaraGrid').DaraGrid>;

jest.mock('@/pdf/PdfConverter', () => ({
  PdfConverter: jest.fn().mockImplementation(() => ({
    convert: jest.fn(),
    download: jest.fn(),
  })),
  normalizePdfCellValue: (value: unknown) => (value == null ? '' : String(value)),
}));

describe('Grouped row selection', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grid: GridInstance | undefined;
  let clipboardDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(canvasContext) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  afterEach(() => {
    grid?.destroy();
    grid = undefined;

    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      clipboardDescriptor = undefined;
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('selects and copies grouped subtotal values', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      selectionMode: 'multiRow',
      groupingFields: ['category'],
      sumFields: ['amount'],
      fields: [
        { name: 'category', label: 'Category', width: 180 },
        { name: 'amount', label: 'Amount', width: 120 },
      ],
      items: [{ id: 'one', category: 'A', amount: 5 }],
    } as unknown as GridOptions);

    const clipboardWrite = jest.fn().mockResolvedValue(undefined);
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: clipboardWrite },
    });

    const subtotalCell = element.querySelector('.dg-group-summary .dg-cell') as HTMLElement;
    subtotalCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));

    expect(subtotalCell.classList.contains('dg-selection')).toBe(true);
    expect(grid.getSelection().data).toEqual([{ category: 'A 합계', amount: 5 }]);

    const keyInput = element.querySelector('.dg-text-editor') as HTMLElement;
    keyInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, code: 'KeyC' }));

    expect(clipboardWrite).toHaveBeenCalledWith('A 합계\t5');
  });
});
