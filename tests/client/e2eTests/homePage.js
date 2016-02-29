'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var HomePage = process.require('tests/client/e2eTests/pages/HomePage.js');

// Load assertion library
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Home page', function() {
  var page;

  // Prepare page
  before(function() {
    page = new HomePage();
    page.load();
  });

  // Remove all extra applications after each test then reload the page
  afterEach(function() {
    page.refresh();
  });

  it('should display page title', function() {

    // Fill me
    assert.ok(true);

  });

});
