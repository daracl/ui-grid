import { deepCopy, merge } from '../../src/util/utils';

describe('merge (prototype pollution guard)', () => {
  afterEach(() => {
    // 테스트가 실패해서 실제로 오염되더라도 다른 테스트에 영향 주지 않도록 정리
    delete (Object.prototype as any).polluted;
  });

  it('does not pollute Object.prototype via a JSON-parsed __proto__ key', () => {
    // JSON.parse는 __proto__를 실제 own property로 만들기 때문에 실제 공격 벡터와 동일한 형태
    const malicious = JSON.parse('{"__proto__": {"polluted": "yes"}}');

    merge({}, malicious);

    expect(({} as any).polluted).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')).toBe(false);
  });

  it('does not copy a constructor key', () => {
    const malicious = { constructor: { polluted: true } };

    const result = merge({}, malicious);

    expect((result as any).constructor).toBe(Object);
  });

  it('does not copy a prototype key', () => {
    const malicious = { prototype: { polluted: true } };

    const result = merge({}, malicious);

    expect((result as any).prototype).toBeUndefined();
  });

  it('still merges normal keys correctly', () => {
    const result = merge({}, { aaa: 'bbb', ccc: 'ddd' }, { bbb: 'bbb', aaa: 'aaa' });

    expect(result).toEqual({ aaa: 'aaa', bbb: 'bbb', ccc: 'ddd' });
  });

  it('still deep-merges nested plain objects', () => {
    const result = merge({}, { a: { x: 1, y: 1 } }, { a: { y: 2, z: 2 } });

    expect(result).toEqual({ a: { x: 1, y: 2, z: 2 } });
  });
});

describe('deepCopy (prototype pollution guard)', () => {
  afterEach(() => {
    delete (Object.prototype as any).polluted;
  });

  it('does not pollute Object.prototype when deep-copying a malicious row item', () => {
    // GridOptions.items로 들어오는 row 데이터가 merge({}, item) 형태로 복제되는 경로(EditCellRenderer, Summary 등)를 재현
    const maliciousRow = JSON.parse('{"name":"John","__proto__":{"polluted":"yes"}}');

    deepCopy(maliciousRow);

    expect(({} as any).polluted).toBeUndefined();
  });

  it('still deep-copies normal row data correctly', () => {
    const row = { name: 'John', address: { city: 'Seoul' } };

    const copied = deepCopy(row);

    expect(copied).toEqual(row);
    expect(copied).not.toBe(row);
    expect(copied.address).not.toBe(row.address);
  });
});
