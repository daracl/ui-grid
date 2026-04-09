import { Config } from './GridConfig';

/**
 * event options
 *
 */
export interface EventOptions {
  el: Element | string | NodeList | null | Document | Element[];
  type: string;
  selector?: string;
  cfg?: Config;
}
