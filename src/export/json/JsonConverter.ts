import { downloadExport } from '../downloadExport';

export interface JsonExportOptions {
  fileName?: string;
  /** 들여쓰기 공백 수. 기본값 2, 0이면 압축 출력. */
  space?: number;
  includeHiddenColumns?: boolean;
  selectedOnly?: boolean;
  visibleOnly?: boolean;
  /** 기본값 false: 숫자·boolean·배열·객체 등 원본 JSON 값을 유지한다. */
  useFormatter?: boolean;
}

export class JsonConverter {
  public convert(rows: Record<string, unknown>[], options: JsonExportOptions = {}): Blob {
    const space = options.space ?? 2;
    if (!Number.isInteger(space) || space < 0 || space > 10) {
      throw new RangeError('JSON space는 0부터 10까지의 정수여야 합니다.');
    }
    return new Blob([JSON.stringify(rows, null, space)], { type: 'application/json;charset=utf-8' });
  }

  public download(blob: Blob, fileName = 'export.json'): void {
    downloadExport(blob, fileName, 'export.json', 'json');
  }
}
