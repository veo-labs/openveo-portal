'use strict';

const e2e = require('@openveo/test').e2e;
const Page = e2e.pages.Page;

/**
 * Defines a page corresponding to portal home page.
 */
class HomePage extends Page {

  /**
   * Creates a new HomePage.
   */
  constructor() {
    super();
    this.pageTitleElement = element(by.css('h1.md-display-1'));
    this.moreButtonElement = element(by.binding('HOME.ALL_VIDEOS'));
    this.videoElementsByDate = element.all(by.repeater('video in videos').column('video.date'));
    this.videoElements = element.all(by.repeater('video in videos'));
    this.firstVideoElement = this.videoElements.first();

    this.searchInputElement = element(by.model('search.query'));
    this.searchSubmitbuttonElement = element(by.css('button#submit'));

    Object.defineProperties(this, {
      path: {
        value: '',
        writable: true
      }
    });
  }

  /**
   * Checks if the home page is loaded.
   *
   * @return {Promise} Promise resolving when page is fully loaded
   */
  onLoaded() {
    return browser.wait(this.EC.presenceOf(this.pageTitleElement), 2000, 'Missing home page title');
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

  clickMoreButton() {
    return this.moreButtonElement.click();
  }

  openVideo() {
    return this.firstVideoElement.click();
  }
}

module.exports = HomePage;
