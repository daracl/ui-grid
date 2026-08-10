import { Config } from '@t/GridConfig';

import { ToolbarOptions } from '@/types/GridOptions';
import { isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { isEmpty } from '@/util/utils';

export class ToolbarScroll {
  private readonly config: Config;
  private readonly toolbarElement: HTMLElement;
  private readonly toolbarOpts: ToolbarOptions;

  private arrowScrollFrame: number | null = null;

  constructor(config: Config, toolbarElement: HTMLElement, toolbarOpts: ToolbarOptions) {
    this.config = config;
    this.toolbarElement = toolbarElement;
    this.toolbarOpts = toolbarOpts;
  }

  public init(): void {
    this.initWheelEvent();
    this.initArrowEvents();
  }

  public resizeArrowVisibility(): void {
    if (!this.toolbarOpts?.enabled) {
      return;
    }

    if (this.toolbarOpts.arrowEnabled === false) {
      this.toolbarElement.classList.remove('dg-has-scroll');
      return;
    }

    const scrollElement = this.getScrollElement();

    if (!scrollElement) return;

    const hasScroll = scrollElement.scrollWidth > scrollElement.clientWidth;

    if (hasScroll) {
      this.toolbarElement.classList.add('dg-has-scroll');
    } else {
      this.toolbarElement.classList.remove('dg-has-scroll');
      scrollElement.scrollLeft = 0;
    }
  }

  public destroy(): void {
    this.stopArrowScrolling();
  }

  private initWheelEvent(): void {
    const scrollElement = this.getScrollElement();

    if (!scrollElement) return;

    const { eventManager } = this.config;

    eventManager.off(scrollElement, 'wheel DOMMouseScroll');

    eventManager.on(
      { el: scrollElement, type: 'wheel DOMMouseScroll' },
      (evt: WheelEvent) => {
        if (scrollElement.scrollWidth <= scrollElement.clientWidth) return;

        const delta = evt.deltaY;

        if (isEmpty(delta) || isShiftKey(evt)) return;

        stopPreventCancel(evt);

        scrollElement.scrollLeft += delta;
      },
      { passive: false },
    );
  }

  private initArrowEvents(): void {
    const arrowContainer = this.toolbarElement.querySelector('.dg-toolbar-arrow') as HTMLElement | null;

    if (!arrowContainer) return;

    const leftButton = arrowContainer.querySelector('[data-direction="left"]') as HTMLButtonElement | null;

    const rightButton = arrowContainer.querySelector('[data-direction="right"]') as HTMLButtonElement | null;

    if (leftButton) {
      this.bindArrowEvents(leftButton, 'left');
    }

    if (rightButton) {
      this.bindArrowEvents(rightButton, 'right');
    }
  }

  private bindArrowEvents(button: HTMLButtonElement, direction: 'left' | 'right'): void {
    const { eventManager } = this.config;

    eventManager.on({ el: button, type: 'mousedown touchstart' }, () => this.startArrowScrolling(direction));

    eventManager.on({ el: button, type: 'mouseup mouseleave touchend touchcancel' }, () => this.stopArrowScrolling());
  }

  private startArrowScrolling(direction: 'left' | 'right'): void {
    this.stopArrowScrolling();

    const scroll = () => {
      this.scrollByDirection(direction);
      this.arrowScrollFrame = requestAnimationFrame(scroll);
    };

    scroll();
  }

  private stopArrowScrolling(): void {
    if (this.arrowScrollFrame === null) return;

    cancelAnimationFrame(this.arrowScrollFrame);
    this.arrowScrollFrame = null;
  }

  private scrollByDirection(direction: 'left' | 'right'): void {
    const scrollElement = this.getScrollElement();

    if (!scrollElement) return;

    const moveOffset = 50;

    scrollElement.scrollLeft += direction === 'left' ? -moveOffset : moveOffset;
  }

  private getScrollElement(): HTMLElement | null {
    return this.toolbarElement.querySelector('.dg-toolbar-scroll') as HTMLElement | null;
  }
}
