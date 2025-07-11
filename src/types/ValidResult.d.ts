import { RULES } from "../constants";

export interface ValidResult {
  name: string;
  constraints: any[];
  regexp?: string;
  validator?: any;
  message?: string;
}
