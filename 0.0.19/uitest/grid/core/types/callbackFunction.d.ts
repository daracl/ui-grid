import type { Loading } from "../Loading";

export interface OptionCallback {
  (obj: any): any;
}

export interface ajaxCallback {
  (value: any, xhr: XMLHttpRequest | Response | null, loadingInstance?: Loading | null): void;
}
