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
    this.pageTitleElement = element(by.binding('HOME.TITLE'));
    this.moreButtonElement = element(by.binding('HOME.ALL_VIDEOS'));
    this.connexionButtonElement = element(by.binding('UI.LOGIN'));
    this.videoElements = element.all(by.repeater('video in videos').column('video.date'));

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
    return browser.wait(this.EC.presenceOf(this.pageTitleElement), 5000, 'Missing home page title');
  }
}

module.exports = HomePage;
