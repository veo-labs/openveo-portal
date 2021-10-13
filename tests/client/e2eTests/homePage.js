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

  afterEach(() => {
    page.reload('');
  });

  // Element
  it('should display page title', () => {
    assert.eventually.ok(page.pageTitleElement.isPresent());
  });

  it('should display a "More video" button', () => {
    assert.eventually.ok(page.moreButtonElement.isPresent(), 'More Video button should be displayed');
  });

});
