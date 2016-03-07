'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const HomePage = process.require('tests/client/e2eTests/pages/HomePage.js');

// Load assertion library
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Home page', () => {
  let page;

  // Prepare page
  before(() => {
    page = new HomePage();
    page.load();
  });

  // Remove all extra applications after each test then reload the page
  afterEach(() => {
    page.refresh();
  });

  it('should display page title', () => {

    // Fill me
    assert.ok(true);

  });

});
