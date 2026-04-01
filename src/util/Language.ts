import { Message } from '@t/Message';
import { FieldItem } from '../types/GridField';
import { ValidResult } from '@t/ValidResult';
import { RULES } from '@/constants';
import { merge } from './utils';

let localeMessage: Message = {
  required: '필수 입력사항 입니다.',
  selection: '선택',
  string: {
    minLength: '{minLength} 글자 이상으로 입력하세요.',
    maxLength: '{maxLength} 글자 이하로 입력하세요.',
    between: '{minLength} ~ {maxLength} 사이의 글자를 입력하세요.',
  },
  number: {
    nan: '숫자만 입력 가능 합니다.',
    minimum: '{minimum} 값과 같거나 커야 합니다',
    exclusiveMinimum: '{minimum} 보다 커야 합니다',
    maximum: '{maximum} 값과 같거나 작아야 합니다',
    exclusiveMaximum: '{maximum} 보다 작아야 합니다.',
    between: '{minimum}~{maximum} 사이의 값을 입력하세요.',
    betweenExclusiveMin: '{minimum} 보다 크고 {maximum} 보다 같거나 작아야 합니다',
    betweenExclusiveMax: '{minimum} 보다 같거나 크고 {maximum} 보다 작아야 합니다',
    betweenExclusiveMinMax: '{minimum} 보다 크고 {maximum} 보다 작아야 합니다',
  },
  regexp: {
    mobile: '핸드폰 번호가 유효하지 않습니다.',
    email: '이메일이 유효하지 않습니다.',
    url: 'URL이 유효하지 않습니다.',
    alpha: '영문만 입력 가능 합니다.',
    'alpha-num': '영문과 숫자만 입력 가능 합니다.',
    number: '숫자만 입력 가능 합니다.',
    variable: '값이 유효하지 않습니다.',
    'number-char': '숫자, 문자 각각 하나 이상 포함 되어야 합니다.',
    'upper-char': '대문자가 하나 이상 포함 되어야 합니다.',
    'upper-char-special': '대문자,소문자,특수문자 각각 하나 이상 포함 되어야 합니다.',
    'upper-char-special-number': '대문자,소문자,특수문자,숫자 각각 하나 이상 포함 되어야합니다.',
  },
  'search.label': '찾기',

  'no.data': 'No Data',
  'select.all': '전체선택',
  all: '전체',
  select: '선택',
  search: '검색',
  prev: '이전',
  next: '다음',
  row: '행',
  column: '열',
};

/**
 * validation 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
export class Language {
  private lang: Message = localeMessage;

  public static setGlobalMessage(lang?: Message) {
    localeMessage = merge(localeMessage, lang);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  public setMessage(lang?: Message) {
    this.lang = merge(this.lang, lang);
  }

  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  public getMessage(messageKey: string): any {
    return (this.lang as any)[messageKey];
  }

  /**
   * ValidResult 값을 메시지로 변경.
   *
   * @public
   * @param {EditRenderer} field
   * @param {ValidResult} validResult
   * @returns {string[]}
   */
  public validMessage(field: FieldItem, validResult: ValidResult): string[] {
    let messageFormat = '';

    const messageFormats: string[] = [];

    if (validResult.regexp) {
      messageFormat = (this.lang.regexp as any)[validResult.regexp];
      messageFormats.push(messageFormat);
    }

    (validResult.constraints ?? []).forEach((constraint) => {
      if (constraint === RULES.REQUIRED) {
        messageFormat = message(this.lang.required, field);
        messageFormats.push(messageFormat);
      }

      const renderType = field.editRenderer?.type;

      if (renderType == 'number' || renderType == 'range') {
        messageFormat = (this.lang.number as any)[constraint];
        messageFormats.push(messageFormat);
      } else {
        messageFormat = (this.lang.string as any)[constraint];
        messageFormats.push(messageFormat);
      }
    });

    const reMessage: string[] = [];

    const msgParam = Object.assign({}, { name: field.name, label: field.label }, field.editRenderer?.rule);
    messageFormats.forEach((msgFormat) => {
      if (msgFormat) {
        reMessage.push(message(msgFormat, msgParam));
      }
    });

    if (validResult.validator) {
      reMessage.push(validResult.validator.message);
    }

    return reMessage;
  }
}

const TOKEN_REGEX = /\{([A-Za-z0-9_.]+)\}/g;

function getValue(obj: any, path: string): unknown {
  const parts = path.split('.');
  let current: any = obj;

  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }

  return current;
}

function message(format: string, params: any): string {
  return format.replace(TOKEN_REGEX, (match, key: string) => {
    const value = getValue(params, key);
    return value === undefined || value === null ? match : String(value);
  });
}
