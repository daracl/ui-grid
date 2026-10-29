import * as core from '@daracl/core/utils';
import * as utils from '../../src/util/utils';
import * as dom from '../../src/util/domUtils';
import { parseClipboard } from '../../src/util/gridUtils';
import { normalizeCssLength } from '../../src/util/styleUtils';

describe('core 공통 유틸 연결과 기존 계약', () => {
  it('공백과 원시 문자열 판별을 core에 위임한다', () => {
    expect(utils.isBlank).toBe(core.isBlank);
    expect(utils.isString).toBe(core.isString);
    expect(utils.isBlank(' \t\n')).toBe(true);
    expect(utils.isBlank(0)).toBe(false);
    expect(utils.isBlank(new String(''))).toBe(false);
  });

  it('클립보드 권한 거부 시 대체 복사 후 포커스와 DOM을 복원한다', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const copyDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    const writeText = jest.fn().mockRejectedValue(new Error('denied'));
    const copy = jest.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: copy });
    try {
      expect(utils.copyStringToClipboard('복사할 값')).toBeUndefined();
      await Promise.resolve();
      expect(writeText).toHaveBeenCalledWith('복사할 값');
      expect(copy).toHaveBeenCalledWith('copy');
      expect(document.querySelector('textarea')).toBeNull();
      expect(document.activeElement).toBe(button);
    } finally {
      button.remove();
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
      else Reflect.deleteProperty(navigator, 'clipboard');
      if (copyDescriptor) Object.defineProperty(document, 'execCommand', copyDescriptor);
      else Reflect.deleteProperty(document, 'execCommand');
    }
  });

  it('중복 구현 대신 core 함수를 참조한다', () => {
    expect(utils.isFunction).toBe(core.isFunction);
    expect(utils.deepCopy).toBe(core.deepCopy);
    expect(utils.removeItem).toBe(core.removeItem);
    expect(utils.replaceXss).toBe(core.xss);
    expect(utils.trim).toBe(core.trim);
    expect(dom.getBrowserSize).toBe(core.getBrowserSize);
    expect(parseClipboard).toBe(core.parseClipboard);
  });
  it('필드 옵션 복사 시 정규식은 복제하고 콜백·공유·순환 참조를 보존한다', () => {
    const callback = () => 'label';
    const shared = { pattern: /value/gi, optional: undefined, callback };
    const fields = [{ name: 'first', renderer: shared }, { name: 'second', renderer: shared }];
    const copied = utils.deepCopy(fields);
    expect(copied).not.toBe(fields);
    expect(copied[0]).not.toBe(fields[0]);
    expect(copied[0].renderer).not.toBe(shared);
    expect(copied[0].renderer).toBe(copied[1].renderer);
    expect(copied[0].renderer.pattern).toEqual(shared.pattern);
    expect(copied[0].renderer.pattern).not.toBe(shared.pattern);
    expect(copied[0].renderer.callback).toBe(callback);
    expect(Object.prototype.hasOwnProperty.call(copied[0].renderer, 'optional')).toBe(true);
    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    const clone = utils.deepCopy(cyclic);
    expect(clone.self).toBe(clone);
  });
  it('배열 복사 시 원본 참조와 빈 슬롯 처리 계약을 유지한다', () => {
    const source = [1, 2, 3];
    expect(utils.arrayCopy(source)).toEqual(source);
    expect(utils.arrayCopy(source)).not.toBe(source);
    expect(utils.arrayCopy(source, 1, 2)).toEqual([2]);
    const sparse = new Array<number>(2);
    expect(0 in utils.arrayCopy(sparse)).toBe(true);
    expect(0 in utils.arrayCopy(sparse, 0)).toBe(false);
  });
  it('grid의 숫자 문자열·빈 값·배열 객체 판별을 유지한다', () => {
    expect(utils.isNumber('12')).toBe(true);
    expect(utils.isNumber('')).toBe(false);
    expect(utils.isEmpty('')).toBe(false);
    expect(utils.isEmpty(null)).toBe(true);
    expect(utils.isEmpty([])).toBe(false);
    expect(utils.isEmpty({})).toBe(false);
    expect(utils.isObject([])).toBe(false);
    expect(utils.isString(new String('x'))).toBe(false);
    expect(utils.intValue('12px')).toBe(12);
    expect(() => utils.intValue(Symbol('value'))).toThrow(TypeError);
  });
  it('HTML 특수문자 변환·복원과 문자열 해시의 반환 형식을 유지한다', () => {
    const value = `<span title="a&b">'표시'</span>`;
    expect(utils.replaceXss(value)).toBe('&lt;span title=&quot;a&amp;b&quot;&gt;&#39;표시&#39;&lt;/span&gt;');
    expect(utils.unReplace(utils.replaceXss(value))).toBe(value);
    expect(utils.getHashCode('')).toBe(0);
    expect(typeof utils.getHashCode('필드')).toBe('string');
    expect(utils.isSameValue(null, undefined)).toBe(true);
    expect(utils.isSameValue(1, '1')).toBe(true);
  });
  it('기존 datetimepicker가 새 core를 사용해 날짜를 포맷하고 해석한다', () => {
    const { DateTimePicker } = require('@daracl/datetimepicker');
    const date = new Date(2023, 0, 2, 3, 4, 5);
    const format = 'YYYY-MM-DD HH:mm:ss';
    expect(DateTimePicker.format(date, format)).toBe('2023-01-02 03:04:05');
    expect(DateTimePicker.parser('2023-01-02 03:04:05', format)?.getTime()).toBe(date.getTime());
    expect(core.leftPadClamp('7', 2, '0')).toBe('07');
    expect(core.isNumeric('12')).toBe(true);
    expect(core.isFunction(() => undefined)).toBe(true);
  });
  it('인용된 탭·줄바꿈·큰따옴표가 있는 붙여넣기 데이터를 해석한다', () => {
    expect(parseClipboard('"첫\t셀"\t"여러\n줄"\r\n"큰""따옴표"\t끝')).toEqual([
      ['첫\t셀', '여러\n줄'],
      ['큰"따옴표', '끝'],
    ]);
    expect(parseClipboard('')).toEqual([['']]);
  });
  it('CSS 단위 변환과 공백으로 구분한 클래스 검사를 유지한다', () => {
    expect(normalizeCssLength(0)).toBe('');
    expect(normalizeCssLength(12)).toBe('12px');
    expect(normalizeCssLength('12')).toBe('12px');
    expect(normalizeCssLength('1rem')).toBe('1rem');
    const element = document.createElement('div');
    element.className = 'selected';
    expect(dom.hasClass(element, 'missing selected')).toBe(true);
    expect(dom.hasClass(element, ' \t ')).toBe(false);
  });
  it('레이어를 스크롤된 화면의 오른쪽·아래 경계 안에 배치한다', () => {
    const layer = document.createElement('div');
    jest.spyOn(layer, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 100, bottom: 80, width: 100, height: 80, x: 0, y: 0, toJSON: () => ({}),
    });
    const width = jest.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(300);
    const height = jest.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(200);
    const scrollX = jest.replaceProperty(window, 'pageXOffset', 20);
    const scrollY = jest.replaceProperty(window, 'pageYOffset', 40);
    try {
      expect(dom.outerLayerPosition(layer, { x: 310, y: 220 })).toEqual({ top: 155, left: 210 });
    } finally {
      width.mockRestore();
      height.mockRestore();
      scrollX.restore();
      scrollY.restore();
    }
  });
  it('공유 debounce가 마지막 인자와 this를 유지한다', () => {
    jest.useFakeTimers();
    try {
      const fn = jest.fn();
      const context = { run: utils.debounce(fn, 10) };
      context.run('first');
      context.run('last');
      jest.runAllTimers();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('last');
      expect(fn.mock.contexts[0]).toBe(context);
    } finally { jest.useRealTimers(); }
  });
});
