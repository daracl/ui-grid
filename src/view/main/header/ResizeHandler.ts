import { DaraElement } from '@/element/DaraElement';
import { PointerContext } from '@/event/PointerContext';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { HeaderResize } from '@/types/GridOptions';
import { getMaxColumnSize, isFixedLeftPostion, isFixedRightPostion } from '@/util/gridUtils';
import { isFunction } from '@/util/utils';
import { HeaderEvent } from './HeaderEvent';

/**
 * ResizeHandler class
 *
 * @class ResizeHandler
 * @typedef {ResizeHandler}
 */
export class ResizeHandler extends BasePointerHandler {
  priority = 1;
  protected readonly rowHeight: number;

  protected resizeOpts: HeaderResize;

  private readonly resizeUpdate;

  private readonly resizerHelperElement: DaraElement;

  private resizeIdx = 0;
  private resizeMoveX = 0;
  private positionLeft = 0;

  public constructor(context: PointerContext, headerEvent: HeaderEvent) {
    super(context);

    const resizeOpts = this.opts.header.resize;
    this.resizeOpts = resizeOpts;

    this.resizeUpdate = isFunction(resizeOpts.update) ? resizeOpts.update : undefined;

    this.resizerHelperElement = context.gridMain.element().findDaraElement('.dg-resize-helper');
  }

  onPointerDown(session: PointerSession): void {
    this.resizeIdx = session.cellInfo?.c || 0;
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;

    const resizeIdx = this.resizeIdx;

    const isLeftContent = isFixedLeftPostion(cfg, resizeIdx);
    const isRightContent = isFixedRightPostion(cfg, resizeIdx);

    let posLeft = 0;
    if (isRightContent) {
      for (let i = cfg.fixedRightIndex; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.positionLeft = cfg.dimensions.mainInsideWidth - cfg.dimensions.mainRightWidth + posLeft;
    } else if (isLeftContent) {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.positionLeft = posLeft;
    } else {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.positionLeft = posLeft - cfg.scroll.centerLeftPosition;
    }

    this.resizerHelperElement.addClass('active');
  }

  onPointerMove(session: PointerSession) {
    const resizeMoveX = session.currentPos.x - session.startPos.x;
    const moveLeftPosition = this.positionLeft + resizeMoveX;

    this.resizeMoveX = resizeMoveX;

    this.resizerHelperElement.css({ left: moveLeftPosition + 'px' });
  }

  onPointerUp(session: PointerSession) {
    if (this.resizerHelperElement.hasClass('active')) {
      this.resizerHelperElement.removeClass('active');
      document.documentElement.removeAttribute('onselectstart');

      this.headerColumnResize(this.resizeIdx, this.resizeMoveX);
    }
  }

  /**
   * header column resize
   *
   * @public
   * @param {number} resizeIdx resize index
   * @param {number} resizeWidth resize width
   */
  public headerColumnResize(resizeIdx: number, resizeWidth: number) {
    const cfg = this.cfg;

    const currentFireld = cfg.currentFields[resizeIdx];

    const w = currentFireld.$width + resizeWidth;

    const header = this.context.header;

    header?.setColumnWidth(resizeIdx, w);
    if (this.resizeUpdate) {
      this.resizeUpdate.call(null, { index: this.resizeIdx, width: w });
    }
  }

  onDoubleClick(session: PointerSession): void {
    const resizeIdx = this.resizeIdx;

    const field = this.cfg.currentFields[resizeIdx];

    const resizeW = getMaxColumnSize(this.cfg, this.opts, field, 0);

    this.context.header?.setColumnWidth(resizeIdx, resizeW);
  }
}
