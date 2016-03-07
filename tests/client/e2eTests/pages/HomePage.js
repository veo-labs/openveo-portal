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
    return protractor.promise.fulfilled();
  }

}

module.exports = HomePage;
