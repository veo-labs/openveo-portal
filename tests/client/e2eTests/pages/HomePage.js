'use strict';

var util = require('util');
var e2e = require('@openveo/test').e2e;
var Page = e2e.Page;

/**
 * Creates a new HomePage.
 */
function HomePage() {
  HomePage.super_.call(this);

  // Page path
  this.path = '';
}

module.exports = HomePage;
util.inherits(HomePage, Page);

/**
 * Checks if the home page is loaded.
 *
 * @return {Promise} Promise resolving when page is fully loaded
 */
HomePage.prototype.onLoaded = function() {
  return protractor.promise.fulfilled();
};
