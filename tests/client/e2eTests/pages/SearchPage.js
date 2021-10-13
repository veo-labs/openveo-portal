'use strict';

const GlobalPage = require('./GlobalPage.js');

/**
 * Defines a page corresponding to portal Search page.
 */
class SearchPage extends GlobalPage {

  /**
   * Creates a new SearchPage.
   */
  constructor() {
    super();
    this.pageTitleElement = element(by.css('h1.md-headline'));
    this.searchInputElement = element(by.model('search.query'));
    this.searchSubmitbuttonElement = element(by.css('button#searchSubmit'));

    this.advancedSearchBlockElement = element(by.css('.advanced-search'));
    this.advancedSearchFormElement = element(by.css('.advanced-search + .collapse'));
    this.advancedSearchButtonElement = element(by.css('button#advancedSearchSubmit'));

    this.path = 'search';
  }

  /**
   * Checks if the Search page is loaded.
   *
   * @return {Promise} Promise resolving when page is fully loaded
   */
  onLoaded() {
    super.onLoaded();
    return browser.wait(this.EC.presenceOf(this.pageTitleElement), 2000, 'Missing Search page title');
  }

  /**
   * Fills the search field.
   *
   * @param {String} search The string to search
   * @return {Promise} Promise resolving when the field has been filled
   */
  setSearch(search) {
    return this.searchInputElement.sendKeys(search);
  }

  searchSubmit() {
    return this.searchSubmitbuttonElement.click();
  }

  clickAdvancedSearchBlock() {
    return this.advancedSearchBlockElement.click();
  }

  clickAdvancedSearchButton() {
    return this.advancedSearchButtonElement.click();
  }

}

module.exports = SearchPage;
