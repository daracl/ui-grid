export interface Message {
  required: string;
  selection: string;

  // string
  string?: {
    minLength?: string;
    maxLength?: string;
    between?: string;
  };

  // number message
  number?: {
    nan?: string;
    minimum?: string;
    exclusiveMinimum?: string;
    maximum?: string;
    exclusiveMaximum?: string;
    between?: string;
    betweenExclusiveMin?: string;
    betweenExclusiveMax?: string;
    betweenExclusiveMinMax?: string;
  };

  // 정규식 메시지
  regexp?: {
    mobile?: string;
    email?: string;
    url?: string;
    number?: string;
    alpha?: string;
    "alpha-num"?: string;
    variable?: string;
    "number-char"?: string;
    "upper-char"?: string;
    "upper-char-special"?: string;
    "upper-char-special-number"?: string;
  };
  "search.label": string;

  "no.data": string;
  "select.all": string;
  all: string;
  select: string;
  search: string;
  prev: string;
  next: string;
}
