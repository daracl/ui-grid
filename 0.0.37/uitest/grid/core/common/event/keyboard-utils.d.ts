/**
 * keyboard event key
 *
 * @export
 * @param {KeyboardEvent} e  keyboard event
 * @returns {string} key
 */
export declare function keyboardEventKey(e: KeyboardEvent): string;
/**
 * event key code
 * @param e Event
 * @returns
 */
export declare function eventKeyCode(e: Event): number | undefined;
/**
 * shift key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isShiftKey(evt: Event): boolean;
/**
 * ctrl key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isCtrlKey(evt: Event): boolean;
/**
 * spacebar check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isSpacebar(evt: Event): boolean;
/**
 * enter key check
 *
 * @param {Event} evt event
 * @returns {boolean}
 */
export declare function isEnter(evt: Event): boolean;
