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

export interface Map<K, V> {
  clear(): void;
  delete(key: K): boolean;
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
  readonly size: number;
}
