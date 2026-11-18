import { GridMain } from '../view/GridMain.js';
import { Body } from '../view/main/body/Body.js';
import { Header } from '../view/main/header/Header';
export interface PointerContext {
    gridMain: GridMain;
    body?: Body;
    header?: Header;
}
