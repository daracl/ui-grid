import { validator } from '@/rule/validator';
import { FieldItem } from '@/types/GridField';
import { Config } from '@/types/GridConfig';

describe('감사: 필드 값 일치 검증', () => {
  const cfg = {
    allFieldMap: new Map([['password', { $renderer: { getValue: (row: { password: string }) => row.password } }]]),
  } as unknown as Config;

  it.each([
    ['identical', 'same', true],
    ['identical', 'other', false],
    ['different', 'same', false],
    ['different', 'other', true],
  ])('%s 규칙으로 %s 값을 검증한다', (rule, value, valid) => {
    const field = {
      name: 'confirmation',
      editRenderer: { [rule as string]: { field: 'password', message: 'invalid' } },
    } as unknown as FieldItem;
    const result = validator(value as string, field, { password: 'same' }, cfg, { name: field.name, constraints: [] });
    if (valid) expect(result).toBeNull();
    else expect(result?.message).toBe('invalid');
  });
});
