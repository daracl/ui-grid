import { CHUNK_SIZE } from '@/constants';

export function calcSummary(items: any[], mode: string, itemKey: string): number | string {
  if (mode !== 'min' && mode !== 'max' && mode !== 'sum' && mode !== 'average') {
    return `${mode} not valid`;
  }

  let count = 0;
  let result: number = mode === 'min' ? Infinity : mode === 'max' ? -Infinity : 0;

  const total = items.length;

  for (let start = 0; start < total; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, total);
    const chunk = items.slice(start, end);

    for (let i = 0; i < chunk.length; i++) {
      const val = chunk[i][itemKey];
      if (typeof val !== 'number') continue;

      switch (mode) {
        case 'min':
          if (val < result) result = val;
          break;
        case 'max':
          if (val > result) result = val;
          break;
        default: // sum or average
          result += val;
          break;
      }

      count++;
    }
  }

  if (count === 0) return 'not valid';
  return mode === 'average' ? result / count : result;
}
