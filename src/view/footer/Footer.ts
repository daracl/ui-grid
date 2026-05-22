import { Config, Selection } from '@t/GridConfig';
import { FooterOptions, PagingParam } from '@t/GridOptions';

import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { getPagingInfo } from '@/util/pagingUtil';
import * as utils from '@/util/utils';
import { PagingInfo } from '@t/PagingInfo';
import { GridMain } from '../GridMain';
import { ALIGN } from '@/constants';
import { html } from '@/util/htmlTemplate';

/**
 * Footer class
 *
 * @class Footer
 * @typedef {Footer}
 */
export class Footer {
  private readonly gridMain: GridMain;

  private readonly footerOpts: FooterOptions;

  private selectionStatusElement: DaraElement;

  private footerElement: DaraElement;

  private readonly selectionInfo: SelectionInfo;

  private readonly cfg: Config;

  private readonly isSelectionInfo: boolean;

  private pagingInfoElement: DaraElement;

  private paingElement: DaraElement;

  private readonly _isActive: boolean;

  constructor(gridMain: GridMain) {
    this.footerOpts = gridMain.options().footer;
    this.gridMain = gridMain;
    this._isActive = this.footerOpts?.enabled ?? false;

    if (!this._isActive) {
      return;
    }

    this.selectionInfo = gridMain.selectionInfo;
    this.cfg = this.gridMain.config();
    this.isSelectionInfo = !utils.isUndefined(this.footerOpts.selection);
  }

  /**
   * init footer event
   */
  init() {
    const footerElement = this.gridMain.element().findDaraElement('.dg-footer');

    if (!this.isEnabled()) {
      footerElement.getElement().remove();
      return;
    }

    this.footerElement = footerElement;

    this.selectionStatusElement = footerElement.findDaraElement('.dg-selection-status');

    footerElement.css({ height: `${this.cfg.dimensions.footerHeight}px` });
    footerElement.findDaraElement('.dg-status').addClass(ALIGN[this.footerOpts.selection?.position ?? 'center']);

    if (this.footerOpts.paging?.enabled) {
      this.paingElement = footerElement.findDaraElement('.dg-paging');
      this.pagingInfoElement = footerElement.findDaraElement('.dg-paging-info');
      this.paingElement.addClass(ALIGN[this.footerOpts.paging?.position ?? 'center']);
      this.pagingInfoElement.addClass(ALIGN[this.footerOpts.paging?.formatPosition ?? 'center']);
      this.initPagingEvent();

      this.setPagingTemplate(this.cfg.paging);
    }
  }

  public isEnabled() {
    return this._isActive;
  }

  /**
   * init paging event
   */
  initPagingEvent() {
    const pagingCallback = this.footerOpts.paging?.callback;
    const pagingElement = this.paingElement.getElement();
    this.cfg.eventManager.on({ el: pagingElement, type: 'click', selector: '.dg-page-num' }, (e: UIEvent) => {
      const pageNumElement = (e.target as HTMLElement).closest('.dg-page-num');

      const pageNum = utils.intValue(pageNumElement?.getAttribute('pageno') ?? '1');

      if (pagingCallback) {
        pagingCallback(pageNum);
      } else {
        this.goPage(pageNum, true);
      }

      return true;
    });
  }

  public goPage(pageNum: number, drawFlag = true) {
    if (utils.isUndefined(this.footerOpts.paging)) {
      throw new Error('enablePaging not enabled');
    }

    const pagingInfo = this.cfg.paging;
    pagingInfo.currPage = pageNum;
    pagingInfo.totalCount = pagingInfo.totalCount > 0 ? pagingInfo.totalCount : this.cfg.dataInfo.rowLength;

    if (pagingInfo.totalCount < 1) {
      this.setPagingInfo({ totalCount: 0 } as PagingInfo);
      this.paingElement.empty();
      return;
    }

    const pagingViewInfo = getPagingInfo(
      pagingInfo.totalCount,
      pagingInfo.currPage,
      pagingInfo.countPerPage,
      pagingInfo.unitPage,
    );

    this.setPagingTemplate(pagingViewInfo);

    const countPerPage = pagingViewInfo?.countPerPage;
    const startIdx = (pagingViewInfo?.currPage - 1) * countPerPage;

    this.cfg.dataManager.setViewItems(this.cfg.dataManager.getCurrentItems(), startIdx, startIdx + countPerPage);

    if (drawFlag) {
      this.gridMain.selectionInfo.setSelectionRangeInfo({} as Selection, true);
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: 0 });
      this.gridMain.refreshBody(drawFlag, 'footer draw');
    }
  }

  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  public setSelectionStatus(dataInfo?: any) {
    if (this.isSelectionInfo && this.footerOpts.enabled) {
      const dataInfo = this.selectionInfo.selectionData('json', true);

      if (!utils.isUndefined(dataInfo) && dataInfo?.summary?.count > 1) {
        const selectionFormat = this.footerOpts.selection?.format;
        let statusText = '';
        if (utils.isString(selectionFormat)) {
          dataInfo.summary.enableSummary = dataInfo.summary.numFieldCount > 0;
          statusText = utils.replaceMesasgeFormat(selectionFormat, dataInfo.summary);
        } else if (utils.isFunction(selectionFormat)) {
          statusText = selectionFormat(dataInfo);
        }

        this.selectionStatusElement.text(statusText);
      } else {
        this.selectionStatusElement.text('');
      }
    }
  }

  /**
   * set paging info
   *
   * @param pagingInfo paging info
   */
  private setPagingInfo(pagingInfo: PagingInfo) {
    if (this.footerOpts.paging?.enabled) {
      const countPerPage = pagingInfo.countPerPage;

      const start = (pagingInfo.currPage - 1) * countPerPage;

      const statusInfo: any = {
        start: start + 1,
        end: start + countPerPage,
        total: pagingInfo.totalCount,
      };

      statusInfo.end = statusInfo.end > pagingInfo.totalCount ? pagingInfo.totalCount : statusInfo.end;

      if (pagingInfo.totalCount > 0) {
        const statusFormat = this.footerOpts.paging?.format;
        let statusText = '';
        if (utils.isString(statusFormat)) {
          statusText = utils.replaceMesasgeFormat(statusFormat, statusInfo);
        } else if (utils.isFunction(statusFormat)) {
          statusText = statusFormat(statusInfo);
        }

        this.pagingInfoElement.text(statusText);
      } else {
        this.pagingInfoElement.text('');
      }
    }
  }

  /**
   * paging
   *
   * @public
   * @param {PagingInfo} pagingInfo paging info
   * @returns {this}
   */
  public setPagingTemplate(pagingInfo: PagingInfo) {
    this.cfg.paging = pagingInfo;

    this.setPagingInfo(pagingInfo);

    let currP = pagingInfo.currPage;
    if (currP == 0) currP = 1;
    const preP_is = pagingInfo.prePage_is;
    const currS = pagingInfo.currStartPage;
    let currE = pagingInfo.currEndPage;
    if (currE == 0) currE = 1;
    const nextO = 1 * currP + 1;
    const preO = currP - 1;
    const strHTML = [];

    strHTML.push('<ul >');

    if (currP <= 1) {
      strHTML.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="dg-page-num page-icon" pageno="' + preO + '">&laquo;</a></li>');
    }

    if (preP_is && currE - pagingInfo.unitPage >= 0) {
      strHTML.push(' <li class="dg-page-num" pageno="1"><a href="javascript:" >1...</a></li>');
    }

    let no = 0;
    for (no = currS * 1; no <= currE * 1; no++) {
      if (no == currP) {
        strHTML.push(' <li class="active"><a href="javascript:">' + no + '</a></li>');
      } else {
        strHTML.push(' <li class="dg-page-num" pageno="' + no + '"><a href="javascript:" >' + no + '</a></li>');
      }
    }

    if (currS + pagingInfo.unitPage < pagingInfo.totalPage) {
      strHTML.push(
        html`<li class="dg-page-num" pageno="${pagingInfo.totalPage}">
          ...<a href="javascript:">${pagingInfo.totalPage}</a>
        </li>`,
      );
    }

    if (currP == currE) {
      strHTML.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>');
    } else {
      strHTML.push(` <li><a href="javascript:" class="dg-page-num page-icon" pageno="${nextO}">&raquo;</a></li>`);
    }

    strHTML.push('</ul>');

    this.paingElement.html(strHTML.join(''));
  }
}
