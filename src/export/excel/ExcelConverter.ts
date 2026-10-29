import { downloadExport } from '../downloadExport';
import type { PdfCellBorders, PdfCellGradient, PdfHeaderCell } from '../pdf/PdfConverter';
import type { ExcelTableData } from './ExcelData';
import { columnName } from './ExcelData';
import { createZip } from './ZipWriter';
import { createChartDrawing } from './ExcelChartDrawing';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
  freezeHeader?: boolean;
  autoFilter?: boolean;
  includeRowNumber?: boolean;
  mergeCells?: boolean;
  /** 트리의 접힌 하위 행도 포함한다. 기본값 true, false이면 현재 표시되는 행만 내보낸다. */
  includeCollapsed?: boolean;
}

const MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const xml = (value: string) =>
  Array.from(value)
    .filter((char) => {
      const code = char.codePointAt(0)!;
      return (
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 32 && code <= 0xd7ff) ||
        (code >= 0xe000 && code <= 0xfffd) ||
        code >= 0x10000
      );
    })
    .join('')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function color(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) return 'FF' + (hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]).toUpperCase();
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgb) return fallback;
  const parts = rgb[1].split(/[,\s/]+/).filter(Boolean);
  const alpha =
    parts[3] === undefined ? 1 : Math.min(1, Math.max(0, parseFloat(parts[3]) / (parts[3].endsWith('%') ? 100 : 1)));
  const channels = parts
    .slice(0, 3)
    .map((part) => Math.max(0, Math.min(255, parseFloat(part) * (part.endsWith('%') ? 2.55 : 1))));
  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel)) || !Number.isFinite(alpha))
    return fallback;
  return (
    'FF' +
    channels
      .map((channel) =>
        Math.round(channel * alpha + 255 * (1 - alpha))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

export class ExcelConverter {
  public convert(data: ExcelTableData, options: ExcelExportOptions = {}): Blob {
    const headerCount = data.headerRows?.length || 1;
    if (!data.columns.length || data.columns.length > 16384 || data.rows.length + headerCount > 1048576)
      throw new RangeError('Invalid XLSX worksheet dimensions');
    const sheetName = options.sheetName ?? 'Grid';
    if (!sheetName.trim() || sheetName.length > 31 || /[\\/*?:[\]]/.test(sheetName) || /^'|'$/.test(sheetName))
      throw new Error('Invalid Excel sheet name');
    const fonts: string[] = ['<font><sz val="11"/><color rgb="FF222222"/><name val="Calibri"/></font>'];
    const fills = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>',
    ];
    const borders: string[] = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
    const xfs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
    const styleCache = new Map<string, number>();
    const register = (list: string[], value: string) => {
      const found = list.indexOf(value);
      if (found >= 0) return found;
      list.push(value);
      return list.length - 1;
    };
    const style = (header: boolean, column: number, row: number, headerCell?: PdfHeaderCell) => {
      const foreground = color(
        header ? headerCell?.textColor ?? data.headerTextColors?.[column] : data.cellTextColors?.[row]?.[column],
        'FF222222',
      );
      const background = header
        ? headerCell?.background ?? data.headerBackgrounds?.[column] ?? '#e9edf2'
        : data.cellBackgrounds?.[row]?.[column];
      const gradient: PdfCellGradient | undefined = header
        ? headerCell?.gradient ?? data.headerGradients?.[column]
        : undefined;
      const sides: PdfCellBorders = (header
        ? headerCell?.borders ?? data.headerCellBorders?.[column]
        : data.cellBorders?.[row]?.[column]) ?? {
        right: { color: '#cdcdcd', width: 1 },
        bottom: { color: '#cdcdcd', width: 1 },
      };
      const indent = header ? 0 : Math.max(0, Math.min(250, Math.floor(data.cellIndents?.[row]?.[column] ?? 0)));
      const align = indent ? 'left' : header ? 'center' : data.columns[column].align ?? 'left';
      const key = JSON.stringify([header, foreground, background, gradient, sides, align, indent]);
      const cached = styleCache.get(key);
      if (cached !== undefined) return cached;
      const font = register(
        fonts,
        `<font><sz val="11"/><color rgb="${foreground}"/><name val="Calibri"/>${header ? '<b/>' : ''}</font>`,
      );
      const fill = gradient
        ? register(
            fills,
            `<fill><gradientFill degree="90"><stop position="0"><color rgb="${color(
              gradient.startColor,
              'FFFFFFFF',
            )}"/></stop><stop position="1"><color rgb="${color(
              gradient.endColor,
              'FFF1F1F1',
            )}"/></stop></gradientFill></fill>`,
          )
        : background
        ? register(
            fills,
            `<fill><patternFill patternType="solid"><fgColor rgb="${color(
              background,
              'FFFFFFFF',
            )}"/><bgColor indexed="64"/></patternFill></fill>`,
          )
        : 0;
      const border = register(
        borders,
        '<border>' +
          (['left', 'right', 'top', 'bottom'] as const)
            .map((side) => {
              const value = sides[side];
              if (!value || !Number.isFinite(value.width) || value.width <= 0) return `<${side}/>`;
              const kind =
                value.style === 'dashed' || value.style === 'dotted' || value.style === 'double'
                  ? value.style
                  : value.width >= 3
                  ? 'thick'
                  : value.width >= 2
                  ? 'medium'
                  : 'thin';
              return `<${side} style="${kind}"><color rgb="${color(value.color, 'FFCDCDCD')}"/></${side}>`;
            })
            .join('') +
          '<diagonal/></border>',
      );
      const index = xfs.length;
      xfs.push(
        `<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${align}" vertical="center" wrapText="1"${
          indent ? ` indent="${indent}"` : ''
        }/></xf>`,
      );
      styleCache.set(key, index);
      return index;
    };
    const cell = (value: string | number | boolean, row: number, column: number) => {
      const reference = `${columnName(column)}${row + 1}`;
      const attrs = `r="${reference}" s="${style(
        row < headerCount,
        column,
        row - headerCount,
        headerOwners[row]?.[column],
      )}"`;
      if (typeof value === 'number' && Number.isFinite(value)) return `<c ${attrs}><v>${value}</v></c>`;
      if (typeof value === 'boolean') return `<c ${attrs} t="b"><v>${value ? 1 : 0}</v></c>`;
      const text = String(value ?? '');
      if (text.length > 32767) throw new RangeError(`Excel cell ${reference} exceeds 32767 characters`);
      // inlineStr를 사용해 '=' 등으로 시작하는 사용자 값을 수식으로 해석하지 않는다.
      return `<c ${attrs} t="inlineStr"><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
    };
    const headers = Array.from({ length: headerCount }, () => data.columns.map(() => ''));
    const headerOwners: (PdfHeaderCell | undefined)[][] = Array.from({ length: headerCount }, () => []);
    const headerMerges: string[] = [];
    if (data.headerRows?.length) {
      data.headerRows.forEach((cells, row) =>
        cells.forEach((item) => {
          headers[row][item.column] = item.label;
          for (let r = row; r < row + item.rowSpan; r++) {
            for (let c = item.column; c < item.column + item.colSpan; c++) headerOwners[r][c] = item;
          }
          if (item.rowSpan > 1 || item.colSpan > 1) {
            headerMerges.push(
              `${columnName(item.column)}${row + 1}:${columnName(item.column + item.colSpan - 1)}${row + item.rowSpan}`,
            );
          }
        }),
      );
    } else headers[0] = data.columns.map((column) => column.label ?? '');
    const rowHeight = Math.max(12, data.rowHeight ?? 26) * 0.75;
    const sheetRows = [...headers, ...data.rows]
      .map(
        (row, rowIndex) =>
          `<row r="${rowIndex + 1}" ht="${rowHeight}" customHeight="1"${
            rowIndex >= headerCount && data.outlineLevels
              ? ` outlineLevel="${data.outlineLevels[rowIndex - headerCount]}"`
              : ''
          }>${data.columns.map((_, column) => cell(row[column] ?? '', rowIndex, column)).join('')}</row>`,
      )
      .join('');
    const end = `${columnName(data.columns.length - 1)}${data.rows.length + headerCount}`;
    const merges =
      options.mergeCells === false
        ? []
        : [
            ...headerMerges,
            ...data.merges.map((ref) =>
              ref.replace(/([A-Z]+)(\d+)/g, (_, column, row) => `${column}${Number(row) + headerCount - 1}`),
            ),
          ];
    const drawing = createChartDrawing(data, color, xml, headerCount);
    const outlineLevel = data.outlineLevels?.reduce((max, level) => Math.max(max, level), 0) ?? 0;
    const worksheet = `<worksheet xmlns="${NS}" xmlns:r="${REL}">${
      data.outlineLevels ? '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' : ''
    }<dimension ref="A1:${end}"/><sheetViews><sheetView workbookViewId="0">${
      options.freezeHeader === false
        ? ''
        : `<pane ySplit="${headerCount}" topLeftCell="A${headerCount + 1}" activePane="bottomLeft" state="frozen"/>`
    }</sheetView></sheetViews><sheetFormatPr defaultRowHeight="${rowHeight}"${
      outlineLevel ? ` outlineLevelRow="${outlineLevel}"` : ''
    }/><cols>${data.columns
      .map(
        (column, index) =>
          `<col min="${index + 1}" max="${index + 1}" width="${Math.min(
            255,
            Math.max(1, ((column.width ?? 100) - 5) / 7),
          ).toFixed(2)}" customWidth="1"/>`,
      )
      .join('')}</cols><sheetData>${sheetRows}</sheetData>${
      options.autoFilter ? `<autoFilter ref="A${headerCount}:${end}"/>` : ''
    }${
      merges.length
        ? `<mergeCells count="${merges.length}">${merges
            .map((ref) => `<mergeCell ref="${xml(ref)}"/>`)
            .join('')}</mergeCells>`
        : ''
    }${drawing ? '<drawing r:id="rId1"/>' : ''}</worksheet>`;
    const files: Record<string, string> = {
      '[Content_Types].xml':
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      '_rels/.rels': `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      'xl/workbook.xml': `<workbook xmlns="${NS}" xmlns:r="${REL}"><sheets><sheet name="${xml(
        sheetName,
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      'xl/_rels/workbook.xml.rels': `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${REL}/styles" Target="styles.xml"/></Relationships>`,
      'xl/styles.xml': `<styleSheet xmlns="${NS}"><fonts count="${fonts.length}">${fonts.join(
        '',
      )}</fonts><fills count="${fills.length}">${fills.join('')}</fills><borders count="${
        borders.length
      }">${borders.join(
        '',
      )}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${
        xfs.length
      }">${xfs.join(
        '',
      )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      'xl/worksheets/sheet1.xml': worksheet,
    };
    if (drawing) {
      files['[Content_Types].xml'] = files['[Content_Types].xml'].replace(
        '</Types>',
        '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>',
      );
      files['xl/drawings/drawing1.xml'] = drawing;
      files[
        'xl/worksheets/_rels/sheet1.xml.rels'
      ] = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`;
    }
    // TS 5.7+ 의 Uint8Array<ArrayBufferLike> 는 BlobPart 와 맞지 않으므로 캐스팅한다(createZip은 ArrayBuffer 기반 배열을 반환).
    return new Blob([createZip(files) as BlobPart], { type: MIME });
  }

  public download(blob: Blob, fileName = 'grid-export.xlsx'): void {
    downloadExport(blob, fileName, 'grid-export.xlsx', 'xlsx');
  }
}
