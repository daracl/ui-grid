export interface OptionCallback {
  (...params: any[]): any;
}

/**
 *
 * @interface StringKeyMap
 * @typedef {StringKeyMap}
 */
export interface StringKeyMap {
  [key: string]: any;
}

/**
 *
 * @interface NumberKeyMap
 * @typedef {NumberKeyMap}
 */
export interface NumberKeyMap {
  [key: number]: any;
}

/**
 *
 * @interface AnyKeyMap
 * @typedef {AnyKeyMap}
 */
export interface AnyKeyMap {
  [key: any]: any;
}

interface StringArrayMap {
  [key: string]: string[];
}
