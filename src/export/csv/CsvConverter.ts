import { normalizeExportValue } from '../exportValue';
import { downloadExport } from '../downloadExport';
export interface CsvExportOptions {
  fileName?: string;
  /** 외부 인코딩 라이브러리 없이 지원하는 문자 인코딩. 기본값 utf-8. */
  encoding?: 'utf-8' | 'utf-16le';
  bom?: boolean;
  delimiter?: string;
  quote?: string;
  lineEnding?: '\r\n' | '\n' | '\r';
  includeHeader?: boolean;
  includeHiddenColumns?: boolean;
  selectedOnly?: boolean;
  visibleOnly?: boolean;
  nullValue?: string;
  useFormatter?: boolean;
  escapeFormula?: boolean;
}

export class CsvConverter {
  public serialize(headers: string[], rows: unknown[][], options: CsvExportOptions = {}): string {
    const delimiter = options.delimiter ?? ',';
    const quote = options.quote ?? '"';
    const lineEnding = options.lineEnding ?? '\r\n';
    if (
      !delimiter ||
      /[\r\n]/.test(delimiter) ||
      !quote ||
      Array.from(quote).length !== 1 ||
      /[\r\n]/.test(quote) ||
      delimiter.includes(quote)
    ) {
      throw new RangeError('CSV delimiter 또는 quote 옵션이 올바르지 않습니다.');
    }
    if (!['\r\n', '\n', '\r'].includes(lineEnding)) throw new RangeError('CSV lineEnding 옵션이 올바르지 않습니다.');
    const cell = (value: unknown): string => {
      let text = value == null ? options.nullValue ?? '' : normalizeExportValue(value);
      // 숫자 자체는 유지하고, 문자열 수식과 제어 문자로 시작하는 값은 텍스트로 보호한다.
      if (
        options.escapeFormula !== false &&
        typeof value !== 'number' &&
        (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text))
      )
        text = `'${text}`;
      return text.includes(delimiter) || text.includes(quote) || /[\r\n]/.test(text)
        ? quote + text.split(quote).join(quote + quote) + quote
        : text;
    };
    return [...(options.includeHeader === false ? [] : [headers]), ...rows]
      .map((row) => row.map(cell).join(delimiter))
      .join(lineEnding);
  }

  public convert(headers: string[], rows: unknown[][], options: CsvExportOptions = {}): Blob {
    const encoding = options.encoding ?? 'utf-8';
    if (encoding !== 'utf-8' && encoding !== 'utf-16le') throw new RangeError('지원하지 않는 CSV encoding입니다.');
    const text = (options.bom === false ? '' : '\ufeff') + this.serialize(headers, rows, options);
    if (encoding === 'utf-16le') {
      const bytes = new Uint8Array(text.length * 2);
      for (let index = 0; index < text.length; index++) {
        bytes[index * 2] = text.charCodeAt(index) & 255;
        bytes[index * 2 + 1] = text.charCodeAt(index) >>> 8;
      }
      return new Blob([bytes], { type: `text/csv;charset=${encoding}` });
    }
    return new Blob([text], { type: `text/csv;charset=${encoding}` });
  }

  public download(blob: Blob, fileName = 'export.csv'): void {
    downloadExport(blob, fileName, 'export.csv', 'csv');
  }
}
