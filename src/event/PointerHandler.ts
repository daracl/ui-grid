import { Config } from '@/types/GridConfig';
import { PointerContext } from './PointerContext';
import { PointerSession } from './PointerSession';
import { GridOptions } from '@/types/GridOptions';

export interface PointerHandler {
  priority: number;

  /** 이 세션을 처리할 수 있는가 */
  canHandle?(session: PointerSession): boolean | void;
}

export abstract class BasePointerHandler implements PointerHandler {
  priority = 0;

  protected readonly context: PointerContext;
  protected readonly cfg: Config;
  protected readonly opts: GridOptions;

  public constructor(context: PointerContext) {
    this.context = context;
    this.cfg = context.gridMain.config();
    this.opts = context.gridMain.options();
  }

  canHandle(session: PointerSession): boolean | void {
    return true;
  }

  /** pointer down 시점 */
  onPointerDown?(session: PointerSession): boolean | void;

  /** 실제 활성화 (drag 시작 등) */
  onActivate?(session: PointerSession): boolean | void;

  /** move 중 */
  onPointerMove?(session: PointerSession): boolean | void;

  /** pointer up */
  onPointerUp?(session: PointerSession): void;

  /** click */
  onClick?(session: PointerSession): void;

  /** double click */
  onDoubleClick?(session: PointerSession): void;

  /** 세션 취소 (ESC 등) */
  onCancel?(session: PointerSession): void;
}
