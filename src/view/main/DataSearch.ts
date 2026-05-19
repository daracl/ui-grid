import { Config } from '@t/GridConfig';

import { ALL_SELECT_VALUE } from '@/constants';
import { getLayerElement, hasClass, innerLayerPosition } from '@/util/domUtils';
import { isEnter, isEsc, stopPreventCancel } from '@/util/eventUtils';
import { SearchOptions } from '@t/GridOptions';
import { toggleClass } from '@/util/styleUtils';
import { GridMain } from '@/view/GridMain';
import { html } from '@/util/htmlTemplate';

/**
 * DataSearch class
 *
 * @class DataSearch
 * @typedef {DataSearch}
 */
export class DataSearch {
  private readonly gridMain: GridMain;

  private readonly cfg: Config;

  private readonly searchOpts: SearchOptions;

  private searchElement: HTMLElement;

  private searchTextElement: HTMLInputElement;
  private searchFieldElement: HTMLSelectElement;

  constructor(gridMain: GridMain) {
    this.cfg = gridMain.config();
    this.searchOpts = gridMain.options().search;
    this.gridMain = gridMain;
    this.createTemplate();
  }

  openSearch() {
    this.gridMain.openLayer(this.searchElement);

    this.searchTextElement.focus();
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

      template.push('<select class="dg-search-field">');
      template.push(`<option value="${ALL_SELECT_VALUE}">${this.gridMain.i18n().getMessage('all')}</option>`);
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
          <span class="search-nav-up" title="${this.gridMain.i18n().getMessage('prev')}"></span>
          <span class="search-nav-down" title="${this.gridMain.i18n().getMessage('next')}"></span>
        </span>`);

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
        this.simpleSearch();
      } else if (isEsc(e)) {
        cfg.searchEnable = false;
        this.gridMain.hideLayer(this.searchElement);
      }
    });

    const searchBtnElement = this.searchElement.querySelector('.dg-search-btn') as HTMLElement;

    eventManager.off(searchBtnElement, 'click');
    eventManager.on({ el: searchBtnElement, type: 'click' }, (e: UIEvent) => {
      stopPreventCancel(e);
      this.simpleSearch();
    });

    const searchIconElement = this.searchElement.querySelectorAll('.dg-icon-button');

    eventManager.off(searchIconElement, 'click');
    eventManager.on({ el: searchIconElement, type: 'click' }, (e: UIEvent) => {
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

  simpleSearch() {
    const searchText = this.searchTextElement.value;
    const searchField = this.searchFieldElement.value || ALL_SELECT_VALUE;

    const cfg = this.gridMain.config();
    const searchParameter = cfg.searchParameter;

    searchParameter.searchText = searchText;
    searchParameter.searchFields = searchField;

    cfg.dataManager.search(searchText, {
      matchCase: searchParameter.matchCase,
      matchWholeWord: searchParameter.matchWholeWord,
      useRegex: searchParameter.useRegex,
      searchFields: searchField,
    });

    if (searchText == '') {
      cfg.searchEnable = false;
      this.gridMain.getBody().clearSearchHighlight();
    } else {
      cfg.searchEnable = true;
    }

    this.gridMain.refreshBody(true, 'search');
    this.gridMain.getHeader().setSearchIcon(cfg.searchEnable);
  }
}
