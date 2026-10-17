import { Message } from '../types/Message.js';
import { ValidResult } from '../types/ValidResult.js';
import { FieldItem } from '../types/GridField';
/**
 * validation 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
export declare class Language {
    private lang;
    static setGlobalMessage(lang?: Message): void;
    /**
     * 다국어 메시지 등록
     *
     * @public
     * @param {?Message} [lang] 둥록할 메시지
     */
    setMessage(lang?: Message): void;
    /**
     * 메시지 얻기
     *
     * @public
     * @param {string} messageKey 메시지 키
     * @returns {*}
     */
    getMessage(messageKey: string): any;
    /**
     * ValidResult 값을 메시지로 변경.
     *
     * @public
     * @param {FieldItem} field
     * @param {ValidResult} validResult
     * @returns {string[]}
     */
    validMessage(field: FieldItem, validResult: ValidResult): string[];
}
