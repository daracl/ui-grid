import { gridDataSearch, isPotentiallyCatastrophicRegex } from '@/util/searchUtils';

describe('정규식 검색 ReDoS 방어', () => {
  it.each([
    '(a+)+$',
    '(a*)*b',
    '(a|a)+$',
    '(a|aa)+$',
    '(a+(b)?)+$',
    '((a+))+$',
    '((a|aa))+$',
    '(?:a+)+$',
    '(a+)*$',
    '(a+){2,}$',
    '(\\w+\\s*)+$',
    '(.*a)+$',
    '^(([a-z])+.)+[A-Z]([a-z])+$',
  ])('위험한 패턴은 거부한다: %s', (pattern) => {
    expect(isPotentiallyCatastrophicRegex(pattern)).toBe(true);
  });

  it.each([
    'a+b',
    'abc',
    '(abc)+',
    '(foo)*bar',
    '(a+)?',
    '(?:ab)+c',
    '[a+]+',
    '\\(a+\\)+',
    '^\\d{3}-\\d{4}$',
    '(\\d+\\.){3}\\d+',
    '(\\d+\\.){1,3}',
    '(?<year>\\d{4})-(?<month>\\d{2})',
    '(?=a+)b',
    '.*foo.*',
    '[(]a+[)]',
  ])('일반적인 패턴은 허용한다: %s', (pattern) => {
    expect(isPotentiallyCatastrophicRegex(pattern)).toBe(false);
  });

  it('우회 형태의 위험한 패턴도 검색이 멈추지 않고 일반 텍스트 검색으로 처리된다', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const text = 'a'.repeat(30) + '!';
    const dm = { getRowItem: (id: number) => ({ id, text }) } as never;

    for (const pattern of ['(a+(b)?)+$', '((a+))+$', '((a|aa))+$']) {
      const started = performance.now();
      const result = gridDataSearch([{ id: 1, sortOrder: 0 }] as never, dm, pattern, {
        useRegex: true,
        searchFields: ['text'],
        matchCase: true,
      } as never);

      expect(performance.now() - started).toBeLessThan(500);
      expect(result.matchCount).toBe(0);
    }
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });

  it('안전한 정규식은 그대로 정규식으로 검색한다', () => {
    const dm = { getRowItem: (id: number) => ({ id, text: id === 1 ? 'order-123' : 'none' }) } as never;
    const result = gridDataSearch(
      [
        { id: 1, sortOrder: 0 },
        { id: 2, sortOrder: 1 },
      ] as never,
      dm,
      '^order-\\d+$',
      { useRegex: true, searchFields: ['text'], matchCase: true } as never,
    );

    expect(result.matchCount).toBe(1);
  });
});
