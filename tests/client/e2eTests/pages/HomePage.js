'use strict';

const GlobalPage = require('./GlobalPage.js');

/**
 * Defines a page corresponding to portal home page.
 */
class HomePage extends GlobalPage {

  /**
   * Creates a new HomePage.
   */
  constructor() {
    super();
    this.path = '';
    this.pageTitleElement = element(by.css('h1.md-headline'));
    this.moreButtonElement = element(by.binding('HOME.ALL_VIDEOS'));
  }

  /**
   * Checks if the home page is loaded.
   *
   * @return {Promise} Promise resolving when page is fully loaded
   */
  onLoaded() {
    super.onLoaded();
    return browser.wait(this.EC.presenceOf(this.pageTitleElement), 2000, 'Missing home page title');
  }

}

module.exports = HomePage;
