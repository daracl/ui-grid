import { Config } from './GridConfig';

export type EventElementType = Element | string | NodeListOf<Element> | null | Document | Element[];
/**
 * event options
 *
 */
export interface EventOptions {
  el: EventElementType;
  type: string;
  selector?: string;
  cfg?: Config;
}
