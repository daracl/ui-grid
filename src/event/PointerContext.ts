import { GridMain } from '@/view/GridMain';
import { Body } from '@/view/main/body/Body';
import { Header } from '../view/main/header/Header';

export interface PointerContext {
  gridMain: GridMain;
  body?: Body;
  header?: Header;
}
