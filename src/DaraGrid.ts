import { getGroupSummaryFields } from '@/util/groupSummaryUtils';
import { GridOptions } from '@t/GridOptions';

import { HIDDEN_ELEMENT_SELECTOR, LINE_NUMBER_NAME } from './constants';
import { BodyStyle, ThemeType } from './constantStyles';

import { FieldItem } from '@t/GridField';
import { Message } from '@t/Message';
import { PagingInfo } from '@t/PagingInfo';
import { ALL_ICONS } from './constantIcons';
import { AddRowOptions, RowId, RowSelectOptions, SearchMode, ViewItem } from './types/Common';
import { createHTMLElement } from './util/domUtils';
import { Language } from './util/Language';
import { resolveClassName } from './util/styleUtils';
import { isUndefined } from './util/utils';
import { GridMain } from './view/GridMain';
import { setDefaultOptions } from './defaultGridOption';
import type {
  PdfCellBorders,
  PdfCellChart,
  PdfExportOptions,
  PdfTableData,
} from './export/pdf/PdfConverter';
import { normalizePdfCellValue } from './export/pdf/PdfValue';
import { loadPdfModule } from '@/export/pdf/loadPdfModule';
import { GroupPdfRenderer } from './export/pdf/GroupPdfRenderer';
import { PdfRendererContext } from './export/pdf/PdfRenderer';
import { SimplePdfRenderer } from './export/pdf/SimplePdfRenderer';
import { createPdfHeaderRows } from './export/pdf/PdfHeader';
import { BarRenderer } from './renderer/view/BarRenderer';
import { SparklineRenderer } from './renderer/view/SparklineRenderer';
import { SparklineRendererBar } from './renderer/view/SparklineRendererBar';
import { RefChartValue } from './types/RefValue';
import type { ExcelExportOptions } from './export/excel/ExcelConverter';
import { loadExcelModule } from '@/export/excel/loadExcelModule';
import { TreeDataManager } from './service/TreeDataManager';
import type { CsvExportOptions } from './export/csv/CsvConverter';
import { loadCsvModule } from '@/export/csv/loadCsvModule';
import { RendererFactory } from './view/builder/RendererFactory';
import type { JsonExportOptions } from './export/json/JsonConverter';
import { loadJsonModule } from '@/export/json/loadJsonModule';

declare const APP_VERSION: string;

let HIDDEN_ELEMENT: HTMLElement | null = null;

/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export class DaraGrid {
  public static VERSION = `${APP_VERSION}`;

  private gridMain: GridMain;

  constructor(gridElement: HTMLElement, options: GridOptions, message?: Message) {
    if (gridElement == null || isUndefined(gridElement)) {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.createGrid(gridElement, options, message);
  }

  initGlobalConfig() {
    if (HIDDEN_ELEMENT === null) {
      const hiddenElement = createHTMLElement('div', HIDDEN_ELEMENT_SELECTOR.replace('.', ''));
      document.body.appendChild(hiddenElement);
      HIDDEN_ELEMENT = hiddenElement;
    }
  }

  public static create(gridElement: HTMLElement, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static message(message: Message): void {
    Language.setGlobalMessage(message);
  }

  public static setDefaultOptions(options: GridOptions): void {
    setDefaultOptions(options);
  }

  private createGrid(gridElement: HTMLElement, opts: GridOptions, message?: Message) {
    this.initGlobalConfig();

    this.gridMain = new GridMain(this, gridElement, opts, message);
    this.gridMain.init();
  }

  public getOptions(): GridOptions {
    return this.gridMain.options();
  }

  public instanceId() {
    return this.gridMain.uid();
  }

  /**
   * grid instance 구하기
   *
   * @param {(HTMLElement | string)} eleOrId grid element, grid uid
   * @returns {DaraGrid} 그리드 object
   */
  public static instance(eleOrId: HTMLElement | string): DaraGrid | null {
    return GridMain.getInstance(eleOrId);
  }
  /**
   * 모든 field 얻기
   */
  public getFields(): FieldItem[] {
    return this.gridMain.config().currentFields;
  }

  /**
   * 그리드의 전체 행 데이터를 반환한다.
   *
   * @returns 전체 행 데이터 배열
   */
  public getItems() {
    return this.gridMain.config().dataManager.getAllRowItems();
  }

  /**
   * 내보내기 가능한 현재 뷰의 모든 행을 PDF로 다운로드합니다.
   *
   * 사용자 정의 글꼴은 fetch 등의 방법으로 읽은 ArrayBuffer 또는 Uint8Array로 전달합니다.
   */
  public async exportPdf(options: PdfExportOptions = {}): Promise<Blob> {
    const { PdfConverter } = await loadPdfModule();
    const cfg = this.gridMain.config();
    const fields = cfg.currentFields.filter((field) => !field.hidden && !field.$isAside);
    const lineNumberField = cfg.currentFields.find((field) => field.name === LINE_NUMBER_NAME && !field.hidden);
    const displayFields = lineNumberField ? [lineNumberField, ...fields] : fields;
    const gridOptions = this.gridMain.options();
    const cellStyleProbe = this.createPdfCellStyleResolver(displayFields, fields);
    const rendererContext: PdfRendererContext = {
      fields,
      lineNumberField,
      lineNumberStart: gridOptions.footer.paging?.enabled ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0,
      viewItems: cfg.dataManager.getViewItems(),
      groupingFields: gridOptions.groupingFields ?? [],
      summaryFieldNames: getGroupSummaryFields(gridOptions),
      summaryItems: gridOptions.groupSummaryFields,
      getRowItem: (id) => cfg.dataManager.getRowItem(id),
      getCellStyles: cellStyleProbe.getCellStyles,
      getCellCharts: (viewItem) => {
        if (viewItem.groupRowType) {
          return fields.map(() => undefined);
        }
        const item = cfg.dataManager.getRowItem(viewItem.id);
        return fields.map((field) => this.getPdfCellChart(field, item));
      },
      getHeaderCellBorders: cellStyleProbe.getHeaderCellBorders,
      getHeaderCellStyles: cellStyleProbe.getHeaderCellStyles,
      tableBorders: cellStyleProbe.tableBorders,
    };
    const renderer = rendererContext.groupingFields.length
      ? new GroupPdfRenderer(rendererContext)
      : new SimplePdfRenderer(rendererContext);
    const converter = new PdfConverter();
    let tableData: PdfTableData;
    try {
      tableData = renderer.render();
      tableData.firstPageHeader = createPdfHeaderRows(gridOptions.fields, displayFields, tableData);
    } finally {
      cellStyleProbe.destroy();
    }
    const blob = await converter.convert(tableData, options);
    converter.download(blob, options.fileName);
    return blob;
  }

  /** CSV를 필요한 시점에 로드하여 실제 데이터 행을 다운로드한다. */
  public async exportCsv(options: CsvExportOptions = {}): Promise<Blob> {
    const { CsvConverter, createCsvData } = await loadCsvModule();
    const data = createCsvData(this.createDataExportContext(options), options);
    const converter = new CsvConverter();
    const blob = converter.convert(data.headers, data.rows, options);
    converter.download(blob, options.fileName);
    return blob;
  }

  /** JSON 모듈을 필요한 시점에 로드하고 필드명을 키로 하는 행 배열을 다운로드한다. */
  public async exportJson(options: JsonExportOptions = {}): Promise<Blob> {
    const { JsonConverter, createJsonData } = await loadJsonModule();
    const data = createJsonData(this.createDataExportContext(options), options);
    const converter = new JsonConverter();
    const blob = converter.convert(data, options);
    converter.download(blob, options.fileName);
    return blob;
  }

  /** CSV·JSON의 대상 행과 열을 선택하며 화면·선택 상태는 유지한다. */
  private createDataExportContext(
    options: Pick<CsvExportOptions, 'visibleOnly' | 'selectedOnly' | 'includeHiddenColumns'>,
  ): PdfRendererContext {
    const cfg = this.gridMain.config();
    const manager = cfg.dataManager;
    let viewItems = options.visibleOnly
      ? manager.getViewItems()
      : manager instanceof TreeDataManager
      ? manager.getAllTreeViewItems()
      : manager.getOriginalViewItems();
    if (options.selectedOnly) {
      const selected = new Set(this.getSelectedRowIds());
      viewItems = viewItems.filter((item) => selected.has(item.id));
    }
    let fields = cfg.currentFields.filter((field) => !field.$isAside && !field.hidden);
    if (options.includeHiddenColumns) {
      const factory = new RendererFactory(this.gridMain);
      const visible = new Map(fields.map((field) => [field.name, field]));
      const flatten = (items: FieldItem[]): FieldItem[] => items.flatMap((field) =>
        field.children?.length ? flatten(field.children) : [visible.get(field.name) ?? factory.createRenderer({ ...field })],
      );
      fields = flatten(this.gridMain.options().fields);
    }
    return {
      fields,
      viewItems,
      groupingFields: [],
      summaryFieldNames: [],
      getRowItem: (id) => manager.getRowItem(id),
    };
  }

  /** 현재 뷰의 표시 값·그룹 합계·셀 병합을 XLSX로 다운로드한다. */
  public async exportExcel(options: ExcelExportOptions = {}): Promise<Blob> {
    const { ExcelConverter, createExcelData } = await loadExcelModule();
    const cfg = this.gridMain.config();
    const gridOptions = this.gridMain.options();
    const fields = cfg.currentFields.filter((field) => !field.hidden && !field.$isAside);
    const lineNumberField = options.includeRowNumber === false
      ? undefined
      : cfg.currentFields.find((field) => field.name === LINE_NUMBER_NAME && !field.hidden);
    const displayFields = lineNumberField ? [lineNumberField, ...fields] : fields;
    const probe = this.createPdfCellStyleResolver(displayFields, fields);
    const converter = new ExcelConverter();
    let blob: Blob;
    try {
      const data = createExcelData(
        {
          fields,
          lineNumberField,
          lineNumberStart: gridOptions.footer.paging?.enabled ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0,
          viewItems:
            cfg.dataManager instanceof TreeDataManager && options.includeCollapsed !== false
              ? cfg.dataManager.getAllTreeViewItems()
              : cfg.dataManager.getViewItems(),
          groupingFields: gridOptions.groupingFields ?? [],
          summaryFieldNames: getGroupSummaryFields(gridOptions),
          summaryItems: gridOptions.groupSummaryFields,
          getRowItem: (id) => cfg.dataManager.getRowItem(id),
          getCellStyles: probe.getCellStyles,
          getHeaderCellBorders: probe.getHeaderCellBorders,
          getHeaderCellStyles: probe.getHeaderCellStyles,
          rowHeight: cfg.rowHeight,
          getCellCharts: (viewItem) =>
            viewItem.groupRowType
              ? fields.map(() => undefined)
              : fields.map((field) => this.getPdfCellChart(field, cfg.dataManager.getRowItem(viewItem.id))),
        },
        options.mergeCells === false ? [] : gridOptions.rowSpanFields ?? [],
      );
      data.headerRows = createPdfHeaderRows(gridOptions.fields, displayFields, data);
      blob = converter.convert(data, options);
    } finally {
      probe.destroy();
    }
    converter.download(blob, options.fileName);
    return blob;
  }

  private createPdfCellStyleResolver(displayFields: FieldItem[], dataFields: FieldItem[]) {
    const cfg = this.gridMain.config();
    const gridOptions = this.gridMain.options();
    const viewItems = cfg.dataManager.getViewItems();
    const gridElement = this.gridMain.element().getElement();
    const opaqueBackground = (...elements: Element[]) =>
      elements
        .map((element) => window.getComputedStyle(element).backgroundColor)
        .find((color) => color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)');
    const body = gridElement.querySelector('.dg-body');
    const headerGradient = (cell: Element) => {
      // 헤더 셀은 투명하고 실제 테마 배경은 상위 영역에 그려진다.
      for (let element: Element | null = cell; element && gridElement.contains(element); element = element.parentElement) {
        const style = window.getComputedStyle(element);
        const colors = style.backgroundImage?.startsWith('linear-gradient(')
          ? style.backgroundImage.match(/rgba?\([^)]+\)/g)
          : undefined;
        if (colors?.length === 2) return { startColor: colors[0], endColor: colors[1] };
        if (opaqueBackground(element)) return undefined;
      }
      return undefined;
    };
    const tableBody =
      body?.querySelector('.dg-region[data-region="center"] .dg-body-table tbody') ??
      body?.querySelector('.dg-body-table tbody');

    if (!body || !tableBody) {
      throw new Error('Unable to resolve grid cell styles for PDF export');
    }

    const probeRow = document.createElement('tr');
    probeRow.className = 'dg-row';
    probeRow.style.visibility = 'hidden';
    probeRow.style.height = '0';
    probeRow.setAttribute('aria-hidden', 'true');

    const probeCells = displayFields.map(() => {
      const cell = document.createElement('td');
      cell.className = 'dg-cell';
      probeRow.appendChild(cell);
      return cell;
    });

    tableBody.appendChild(probeRow);
    const headerCells = displayFields.map((field) => {
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
        ? 'left'
        : cfg.fieldHeaderGroup.leafRight.includes(field)
          ? 'right'
          : 'center';
      return gridElement.querySelector<HTMLElement>(
        `.dg-header .dg-region[data-region="${region}"] [data-header-cell-position="${field.$resizeIdx}"]`,
      ) ?? undefined;
    });

    return {
      tableBorders: this.getPdfCellBorders(gridElement.querySelector('.dg-main') ?? gridElement),
      getCellStyles: (viewItem: ViewItem, rowIndex: number) => {
        const rowClasses = ['dg-row'];
        if (viewItem.groupRowType) {
          rowClasses.push(
            'dg-group-row',
            viewItem.groupRowType === 'group'
              ? 'dg-group-header'
              : viewItem.groupRowType === 'groupSummary'
                ? 'dg-group-summary'
                : 'dg-grand-summary',
          );
        }
        probeRow.className = rowClasses.join(' ');

        const item = viewItem.groupRowType ? undefined : cfg.dataManager.getRowItem(viewItem.id);
        const rowBackground = window.getComputedStyle(probeRow).backgroundColor;
        let previousDataItem: Record<string, unknown> | undefined;
        if (!viewItem.groupRowType && rowIndex > 0) {
          for (let previousIndex = rowIndex - 1; previousIndex >= 0; previousIndex--) {
            const previousViewItem = viewItems[previousIndex];
            if (previousViewItem && !previousViewItem.groupRowType) {
              previousDataItem = cfg.dataManager.getRowItem(previousViewItem.id);
              break;
            }
          }
        }

        const styles = displayFields.map((field, fieldIndex) => {
          const cell = probeCells[fieldIndex];
          const classes = ['dg-cell'];
          if (field.name === LINE_NUMBER_NAME) {
            classes.push('dg-aside', 'dg-line-number');
          }
          if (viewItem.groupRowType) {
            classes.push('dg-group-cell');
          } else if (item) {
            if (field.cellClassName && dataFields.includes(field)) {
              classes.push(
                ...resolveClassName(field.cellClassName, {
                  rowIdx: rowIndex,
                  col: field.$colSeq,
                  field,
                  item,
                }),
              );
            }
            const groupingFieldIndex = (gridOptions.groupingFields ?? []).indexOf(field.name);
            const sameGroup =
              groupingFieldIndex >= 0 &&
              previousDataItem !== undefined &&
              (gridOptions.groupingFields ?? [])
                .slice(0, groupingFieldIndex + 1)
                .every((name) => Object.is(item[name], previousDataItem?.[name]));
            if (sameGroup && rowIndex < viewItems.length - 1) {
              classes.push('dg-group-continuation');
            }
          }
          cell.className = classes.join(' ');

          const cellBackground = window.getComputedStyle(cell).backgroundColor;
          const background =
            cellBackground && cellBackground !== 'transparent' && cellBackground !== 'rgba(0, 0, 0, 0)'
              ? cellBackground
              : rowBackground && rowBackground !== 'transparent' && rowBackground !== 'rgba(0, 0, 0, 0)'
                ? rowBackground
                : opaqueBackground(body, gridElement);
          return { background, borders: this.getPdfCellBorders(cell), textColor: window.getComputedStyle(cell).color };
        });
        const backgrounds = styles.map((style) => style.background);
        const borders = styles.map((style) => style.borders);
        return { backgrounds, borders, textColors: styles.map((style) => style.textColor || undefined) };
      },
      getHeaderCellBorders: () => headerCells.map((cell) => (cell ? this.getPdfCellBorders(cell) : undefined)),
      getHeaderCellStyles: () => ({
        gradients: headerCells.map((cell) => cell ? headerGradient(cell) : undefined),
        backgrounds: headerCells.map((cell) =>
          cell ? opaqueBackground(cell, cell.parentElement ?? gridElement, gridElement) : undefined,
        ),
        borders: headerCells.map((cell) => (cell ? this.getPdfCellBorders(cell) : undefined)),
        textColors: headerCells.map((cell) => (cell ? window.getComputedStyle(cell).color || undefined : undefined)),
      }),
      destroy: () => probeRow.remove(),
    };
  }

  private getPdfCellBorders(cell: Element): PdfCellBorders | undefined {
    const style = window.getComputedStyle(cell);
    const styleValues = [
      style.borderTopWidth,
      style.borderRightWidth,
      style.borderBottomWidth,
      style.borderLeftWidth,
      style.borderTopStyle,
      style.borderRightStyle,
      style.borderBottomStyle,
      style.borderLeftStyle,
    ];
    if (styleValues.every((value) => value === '')) {
      return undefined;
    }

    const readSide = (width: string, color: string, borderStyle: string) => {
      const numericWidth = Number.parseFloat(width);
      if (
        !Number.isFinite(numericWidth) ||
        numericWidth <= 0 ||
        borderStyle === 'none' ||
        borderStyle === 'hidden' ||
        color === 'transparent' ||
        color === 'rgba(0, 0, 0, 0)'
      ) {
        return undefined;
      }
      const style = ['dashed', 'dotted', 'double'].includes(borderStyle)
        ? borderStyle as 'dashed' | 'dotted' | 'double'
        : undefined;
      return { width: numericWidth, color, ...(style ? { style } : {}) };
    };

    return {
      top: readSide(style.borderTopWidth, style.borderTopColor, style.borderTopStyle),
      right: readSide(style.borderRightWidth, style.borderRightColor, style.borderRightStyle),
      bottom: readSide(style.borderBottomWidth, style.borderBottomColor, style.borderBottomStyle),
      left: readSide(style.borderLeftWidth, style.borderLeftColor, style.borderLeftStyle),
    };
  }

  private getPdfCellChart(field: FieldItem, item: Record<string, unknown>): PdfCellChart | undefined {
    const rendererType = field.renderer.type;
    const value = field.$renderer.getValue(item);

    if (rendererType === 'bar' && field.$renderer instanceof BarRenderer) {
      const refValue = field.$renderer.getRefValue(value, item) as RefChartValue | undefined;
      const chartValue = Number(refValue?.percent ?? value);
      if (!Number.isFinite(chartValue)) {
        return undefined;
      }
      const positiveColor = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue('--bar-positive-bg').trim();
      const negativeColor = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue('--bar-negative-bg').trim();
      return {
        type: 'bar',
        value: chartValue,
        minimum: field.renderer.rule?.minimum ?? 0,
        maximum: field.renderer.rule?.maximum ?? 100,
        label: normalizePdfCellValue(refValue?.label ?? value),
        color: chartValue < 0 ? negativeColor || '#ff8989' : positiveColor || '#77c0fc',
      };
    }

    if (
      (rendererType === 'sparkline' && field.$renderer instanceof SparklineRenderer) ||
      (rendererType === 'sparklineBar' && field.$renderer instanceof SparklineRendererBar)
    ) {
      const refValue = field.$renderer.getRefValue(value, item) as RefChartValue | undefined;
      const values = refValue?.value ?? value;
      if (!Array.isArray(values) || !values.every((entry) => typeof entry === 'number' && Number.isFinite(entry))) {
        return undefined;
      }
      return { type: rendererType, values: [...values] };
    }

    return undefined;
  }

  /**
   * 현재 표시 중인 모든 레이어(드롭다운, 팝업 등)를 숨긴다.
   */
  public hideLayer() {
    this.gridMain.hideLayer('all');
  }

  /**
   * 그리드에 focusout 처리를 설정한다.
   *
   * 포커스를 잃었을 때 필요한 UI 처리(예: 레이어 닫기)를 수행한다.
   */
  public setFocusOut() {
    this.gridMain.setGridFocusOut();
  }

  /**
   * 툴바에 설정된 현재 값을 반환한다.
   *
   * @returns 툴바 값 객체
   */
  public getToolbarValues() {
    return this.gridMain.getToolbarValues();
  }

  /**
   * 툴바 값을 설정한다.
   *
   * @param values - 설정할 툴바 값 객체
   */
  public setToolbarValues(values: any) {
    this.gridMain.setToolbarValues(values);
  }

  /**
   * item index 값으로 item 얻기
   *
   * @param {number[]} indexs index
   * @returns {{}}
   */
  public getItemsByIndexs(indexs: number[]) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    const viewItems = dataManager.getViewItems();
    for (const index of indexs) {
      const viewItem = viewItems[index];
      if (viewItem) {
        result.push(dataManager.getRowItem(viewItem.id));
      }
    }
    return result;
  }

  public selectRowById(rowId: RowId, opts: RowSelectOptions) {
    return this.gridMain.config().dataManager.selectRowById(rowId, opts);
  }

  /**
   * 지정한 행 ID에 해당하는 데이터를 반환합니다.
   *
   * @param rowId 조회할 행의 ID
   * @returns 행 ID에 해당하는 데이터 객체
   */
  public getItemById(rowId: RowId) {
    return this.gridMain.config().dataManager.getRowItem(rowId);
  }

  /**
   * 지정한 행 ID 목록에 해당하는 데이터들을 반환합니다.
   *
   * 반환되는 배열의 순서는 전달된 rowIds의 순서와 동일합니다.
   *
   * @param rowIds 조회할 행 ID 목록
   * @returns 행 ID 목록에 해당하는 데이터 객체 배열
   */
  public getItemsByIds(rowIds: RowId[]) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    for (const rowId of rowIds) {
      result.push(dataManager.getRowItem(rowId));
    }
    return result;
  }

  public setPaging(paging: PagingInfo) {
    this.gridMain.setPaging(paging);
  }

  /**
   * set items
   *
   * @param {any[]} items
   */
  public setItems(items: any[]) {
    this.gridMain.setItems(items);
  }

  public clearItems() {
    this.gridMain.clearItems();
  }

  /**
   * 행 데이터를 추가
   *
   * @param items - 추가할 행 데이터 배열
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   *
   * @example
   * // 기본 추가
   * grid.addItems(items, {});
   *
   * @example
   * // 특정 행의 앞에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'before',
   * });
   *
   * @example
   * // 특정 행의 뒤에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'after',
   * });
   *
   * @example
   * // 특정 행의 내부에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'inside',
   * });
   */
  public addItems(items: any[], addOpts?: AddRowOptions) {
    this.gridMain.addItems(items, addOpts);
  }

  /**
   * 새로운 item을 Grid에 추가
   *
   *
   * @param item 추가할 item
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   * @example
   * // 특정 행의 내부에 생성
   * grid.createItem(item, {
   *   rowId: targetRowId,
   *   position: 'before'|'after'|'inside', <-- inside 트리 형식일때 사용.
   * });
   */
  public createItem(item: any, addOpts?: AddRowOptions) {
    this.gridMain.createItem(item, addOpts);
  }

  /**
   * remove row item
   *
   * @param {any[]} ids rowid
   */
  public removeItems(ids: any[]) {
    this.gridMain.removeItems(ids);
  }

  public setSize(width: number, height: number) {
    this.gridMain.setSize(width, height, true);
  }

  /**
   * 현재 선택된 정보를 반환
   *
   * header field 정보와 선택 모드에 따라 선택된 Row 또는 Cell 정보
   * 필요 시 숫자 필드의 합계 정보
   *
   * @param numberFieldSummary 숫자 필드의 정보를 포함할지 여부
   * @returns 선택 정보
   */
  public getSelection(numberFieldSummary = false) {
    return this.gridMain.selectionInfo.selectionData('json', numberFieldSummary);
  }

  /**
   * 현재 선택된 row 를 반환
   * @returns 선택 row
   */
  public getSelectedRows() {
    return this.gridMain.selectionInfo.selectionRows();
  }

  /**
   * 현재 선택된 row ids 를 반환
   * @returns 선택된 row id 배열
   */
  public getSelectedRowIds() {
    return this.gridMain.selectionInfo.selectionRowIds();
  }

  /**
   * get checked items
   *
   * @returns {*}
   */
  public getCheckedItems(names?: string | string[]) {
    return this.gridMain.getCheckedItems(names);
  }

  /**
   * get checked items
   *
   * @returns {*}
   */
  public getCheckedIds() {
    return this.gridMain.getCheckedIds();
  }

  /**
   * 현재 체크된 항목들에서 지정한 필드(`name`)의 값을 배열로 반환합니다.
   *
   * @param name - 반환할 필드명 (예: 'id', 'code', 'name' 등)
   * @returns 체크된 항목들의 해당 필드값 배열
   *
   * 예시:
   * - name이 "id"인 경우 → 체크된 row들의 id만 추출하여 배열로 반환
   */
  public getCheckedItemByName(name: string) {
    return this.gridMain.getCheckedItemByName(name);
  }

  /**
   * set all check items
   *
   * @param {boolean} checked
   */
  public setAllCheckedItems(checked: boolean) {
    this.gridMain.setAllCheckedItems(checked);
  }

  /**
   * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   *
   */
  public setCheckedItemByValue(name: string, values: any) {
    this.gridMain.setCheckedItemByValue(name, values);
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public addCheckedItemByValue(name: string, values: any) {
    this.gridMain.addCheckedItemByValue(name, values);
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public unCheckedItemByValue(name: string, values: any) {
    this.gridMain.unCheckedItemByValue(name, values);
  }

  /**
   * 변경된 행 데이터를 반환
   *
   * 추가, 수정, 삭제 등 데이터 변경 상태가 있는 item만 반환
   *
   * @returns 변경된 행 데이터 배열
   */
  public getChangedItems() {
    return this.gridMain.getChangedItems();
  }

  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (예: 'light', 'dark').
   *                    생략하거나 빈 값이면 그리드별 테마 지정을 해제하고 상위 요소의 data-daracl-theme 를 따른다.
   */
  public setTheme(themeName?: ThemeType | '') {
    this.gridMain.setTheme(themeName);
  }

  /**
   * 그리드 스타일 변경
   *
   *  BodyStyle 스타일
   *  ex) default, striped, borderless, list
   *
   * @param styleName 적용할 그리드 스타일
   *
   */
  public setStyle(styleName: BodyStyle) {
    this.gridMain.setGridStyle(styleName);
  }

  /**
   * grid height
   *
   * @public
   * @returns {*}
   */
  public getGridHeight(): number {
    return this.gridMain.getCurrentSize().height;
  }

  public copyData() {
    this.gridMain.getBody().copyData();
  }

  public changeContextMenuHeader(label: string) {
    this.gridMain.getContextMenu().changeHeader(label);
  }

  public expandAll() {
    this.gridMain.expandAll();
  }

  public collapseAll() {
    this.gridMain.collapseAll();
  }

  public search(searchText: string, opts: SearchMode) {
    return this.gridMain.getDataSearch().search(searchText, opts ?? {});
  }

  public static setIcons(icons: any) {
    Object.assign(ALL_ICONS, icons);
  }

  /**
   * grid destroy
   *
   * @public
   */
  public destroy() {
    this.gridMain.destroy();
  }
}
