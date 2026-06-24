import { Config } from '@t/GridConfig';

import { ALL_SELECT_VALUE, SearchDirection, SearchDirectionMap } from '@/constants';
import { SearchMode } from '@/types/Common';
import { getLayerElement, hasClass, innerLayerPosition } from '@/util/domUtils';
import { isEnter, isEsc, stopPreventCancel } from '@/util/eventUtils';
import { html } from '@/util/htmlTemplate';
import { toggleClass } from '@/util/styleUtils';
import { GridMain } from '@/view/GridMain';
import { SearchOptions } from '@t/GridOptions';
import { DataSearch } from './DataSearch';
import { merge } from '@/util/utils';

/**
 * simple search class
 *
 * @class SimpleDataSearch
 * @typedef {SimpleDataSearch}
 */
export class SimpleDataSearch extends DataSearch {
  private searchElement: HTMLElement;

  private searchTextElement: HTMLInputElement;
  private searchFieldElement: HTMLSelectElement;
  private matchCountElement: HTMLSpanElement;

  constructor(gridMain: GridMain) {
    super(gridMain);
    this.createTemplate();
  }

  openSearch() {
    this.gridMain.openLayer(this.searchElement);

    this.searchTextElement.focus();

    return true;
  }

  createTemplate() {
    const searchOpts = this.searchOpts;

    if (searchOpts.mode != 'full') {
      this.simpleTemplate();
    }
  }

  /**
   * simple search template
   *
   * @private
   */
  private simpleTemplate() {
    const rendererContainer = this.gridMain.getRendererContainer();

    const fields = this.cfg.currentFields;

    let searchElement = this.searchElement;
    if (!searchElement) {
      const template = [];

      searchElement = getLayerElement('div', 'dg-search-simple', 'help-tooltip');

      template.push(
        `<select class="dg-search-field"><option value="${ALL_SELECT_VALUE}">${this.gridMain
          .i18n()
          .getMessage('all')}</option>`,
      );
      for (const field of fields) {
        if (field.$isAside) continue;
        template.push(`<option value="${field.name}">${field.label}</option>`);
      }
      template.push('</select>');

      template.push(html`<div class="dg-search-container">
          <input type="text" class="dg-search-text" placeholder="Search" />
          <div class="dg-search-icons">
            <button class="dg-icon-button" type="button" data-search-type="mc" title="Match Case">Aa</button>
            <button class="dg-icon-button" type="button" data-search-type="mww" title="Match Whole Word">
              <span class="dg-whole-word-icon">ab</span>
            </button>
            <button class="dg-icon-button" type="button" data-search-type="regex" title="Use Regex">.*</button>
          </div>
        </div>
        <span class="dg-search-btn">
          <span class="dg-btn dg-search-prev" title="${this.gridMain.i18n().getMessage('prev')}"></span>
          <span class="dg-btn dg-search-next" title="${this.gridMain.i18n().getMessage('next')}"></span>
        </span>
        <span class="dgMatchCount"></span>`);

      searchElement.innerHTML = template.join('');

      rendererContainer.appendChild(searchElement);

      this.searchElement = searchElement;
    }

    const searchStyle = searchElement.style;

    searchStyle.height = 'auto';

    const headerElement = this.gridMain.getHeader().getHeaderElement();

    const searchIconElement = headerElement.find('.dg-search-icon');

    const openPosition = innerLayerPosition(rendererContainer, searchIconElement, searchElement);

    searchStyle.top = `${openPosition.top - 5}px`;
    searchStyle.left = `${openPosition.left + 12}px`;

    this.searchTextElement = this.searchElement.querySelector('.dg-search-text') as HTMLInputElement;
    this.searchFieldElement = this.searchElement.querySelector('.dg-search-field') as HTMLSelectElement;
    this.matchCountElement = this.searchElement.querySelector('.dgMatchCount') as HTMLSpanElement;

    this.initSimpleModeEvent();
  }

  /**
   *  init simple search event
   */
  initSimpleModeEvent() {
    const cfg = this.gridMain.config();

    const eventManager = cfg.eventManager;
    const searchParameter = cfg.searchParameter;
    const searchTextElement = this.searchTextElement;

    eventManager.off(searchTextElement, 'keydown');
    eventManager.on({ el: searchTextElement, type: 'keydown' }, (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.isComposing) return;

      if (isEnter(e)) {
        e.preventDefault();
        this.simpleSearch(SearchDirectionMap.NEXT);
      } else if (isEsc(e)) {
        cfg.searchEnable = false;
        this.gridMain.hideLayer(this.searchElement);
      }
    });

    const searchPrevBtnElement = this.searchElement.querySelector('.dg-search-prev') as HTMLElement;

    eventManager.off(searchPrevBtnElement, 'mousedown');
    eventManager.on({ el: searchPrevBtnElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);
      this.simpleSearch(SearchDirectionMap.PREV);
    });

    const searchNextBtnElement = this.searchElement.querySelector('.dg-search-next') as HTMLElement;

    eventManager.off(searchNextBtnElement, 'mousedown');
    eventManager.on({ el: searchNextBtnElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);
      this.simpleSearch(SearchDirectionMap.NEXT);
    });

    const searchIconElement = this.searchElement.querySelectorAll('.dg-icon-button');

    eventManager.off(searchIconElement, 'mousedown');
    eventManager.on({ el: searchIconElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);

      const evtElement = e.currentTarget as HTMLElement;

      const dataSearchType = evtElement.getAttribute('data-search-type');

      const activeFlag = !hasClass(evtElement, 'on');

      if (dataSearchType == 'mc') {
        searchParameter.matchCase = activeFlag;
      } else if (dataSearchType == 'mww') {
        searchParameter.matchWholeWord = activeFlag;
      } else if (dataSearchType == 'regex') {
        searchParameter.useRegex = activeFlag;
      }

      toggleClass(evtElement, 'on');
    });
  }

  public search(searchText: string, opts: SearchMode): boolean {
    const cfg = this.gridMain.config();

    const options = merge({}, this.defaultSearchOpts, opts);

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.allFieldNames;
    }

    cfg.dataManager.search(searchText, opts);

    this.setMatchCountText();

    if (searchText == '') {
      cfg.searchEnable = false;
      this.matchCountElement.textContent = '';
      this.gridMain.getBody().clearSearchHighlight();
    } else {
      cfg.searchEnable = true;
    }

    this.gridMain.refreshBody(true, 'search');
    this.gridMain.getHeader().setSearchIcon(cfg.searchEnable);

    return true;
  }

  private simpleSearch(direction: SearchDirection) {
    const searchText = this.searchTextElement.value;
    const searchField = this.searchFieldElement.value || ALL_SELECT_VALUE;

    const cfg = this.gridMain.config();
    const searchParameter = cfg.searchParameter;

    searchParameter.searchText = searchText;
    searchParameter.searchFields = searchField;

    this.search(searchText, {
      matchCase: searchParameter.matchCase,
      matchWholeWord: searchParameter.matchWholeWord,
      useRegex: searchParameter.useRegex,
      searchFields: searchField,
      direction: direction,
    } as SearchMode);
  }

  setMatchCountText() {
    const searchMatchInfo = this.cfg.searchMatchInfo;

    if (searchMatchInfo.matchCount > 0) {
      this.matchCountElement.textContent = searchMatchInfo.currentMatchIndex + '/' + searchMatchInfo.matchCount;
    } else {
      this.matchCountElement.textContent = '0/0';
    }
  }
}
