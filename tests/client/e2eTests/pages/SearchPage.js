'use strict';

const e2e = require('@openveo/test').e2e;
const Page = e2e.pages.Page;

/**
 * Defines a page corresponding to portal Search page.
 */
class SearchPage extends Page {

  /**
   * Creates a new SearchPage.
   */
  constructor() {
    super();
    this.pageTitleElement = element(by.css('h1.md-display-1'));
    this.videoElements = element.all(by.repeater('video in videos'));
    this.firstVideoElement = this.videoElements.first();

    this.videoElementsByDate = element.all(by.repeater('video in videos').column('video.date'));
    this.videoElementsByViews = element.all(by.css('.nb-views > span.number'));
    this.searchInputElement = element(by.model('search.query'));
    this.searchSubmitbuttonElement = element(by.css('button#searchSubmit'));
    this.sortByButtonElement = element(by.model('search.sortBy'));
    this.sortOrderButtonElement = element(by.model('search.sortOrder'));

    this.advancedSearchBlocElement = element(by.css('.advanced-search'));
    this.advancedSearchFormElement = element(by.css('.advanced-search + .collapse'));
    this.advancedSearchButtonElement = element(by.css('button#advancedSearchSubmit'));
    this.advancedSearchCancelButtonElement = element(by.css('button#advancedSearchCancel'));

    Object.defineProperties(this, {
      path: {
        value: 'search',
        writable: true
      }
    });
  }

  /**
   * Checks if the Search page is loaded.
   *
   * @return {Promise} Promise resolving when page is fully loaded
   */
  onLoaded() {
    return browser.wait(this.EC.presenceOf(this.pageTitleElement), 2000, 'Missing Search page title');
  }

  /**
   * Fills the search field.
   *
   * @param {String} search The string to search
   * @return {Promise} Promise resolving when the field has been filled
   */
  reload(path) {
    this.path = path;
    return this.load();
  }
  setSearch(search) {
    return this.searchInputElement.sendKeys(search);
  }

  searchSubmit() {
    return this.searchSubmitbuttonElement.click();
  }

  clickSortByButton() {
    return this.sortByButtonElement.click();
  }

  clickSortOrderButton() {
    return this.sortOrderButtonElement.click();
  }

  clickAdvancedSearchBloc() {
    return this.advancedSearchBlocElement.click();
  }

  clickAdvancedSearchButton() {
    return this.advancedSearchButtonElement.click();
  }

  clickAdvancedSearchCancelButton() {
    return this.advancedSearchCancelButtonElement.click();
  }

  openVideo() {
    return this.firstVideoElement.click();
  }
}

module.exports = SearchPage;
