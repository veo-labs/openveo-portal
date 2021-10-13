'use strict';

const url = require('url');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const SearchPage = process.require('tests/client/e2eTests/pages/SearchPage.js');

// Load assertion library
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Search page', () => {
  let page;

  // Prepare page
  before(() => {
    page = new SearchPage();
    page.load();
  });

  afterEach(() => {
    page.reload('search');
  });

  it('should display page element', () => {
    assert.eventually.ok(page.pageTitleElement.isPresent(), 'page title should be displayed');
  });

  it('should display advanced search block', () => {
    assert.eventually.ok(page.advancedSearchBlockElement.isDisplayed(),
      'Advanced Search button should be displayed');
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed');
  });

  it('should open advanced search block on click on advancedSearchBlockElement', () => {
    page.clickAdvancedSearchBlock();
    assert.eventually.ok(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be open on click');
  });

  it('should close advanced search block on click on an open advancedSearchBlockElement', () => {
    page.clickAdvancedSearchBlock();
    page.clickAdvancedSearchBlock();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate advanced form');
  });

  it('should open/close advanced search block on click on advancedSearchBlockElement', () => {
    page.clickAdvancedSearchBlock();
    page.clickAdvancedSearchButton();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate advanced form');
  });

  it('should close advanced search block on search', () => {
    page.clickAdvancedSearchBlock();
    page.searchSubmit();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate form');
  });

  it('should switch url on search action', () => {
    const keys = 'test';
    const expectedPath = `/search?sortBy=date&sortOrder=desc&query=${keys}&searchInPois=0`;
    page.setSearch(keys);
    page.searchSubmit();

    return browser.getCurrentUrl().then(function(browserUrl) {
      const currentUrl = new url.URL(browserUrl);
      assert.equal(currentUrl.pathname + currentUrl.search, expectedPath, `Path should be ${expectedPath}`);
    });
  });

});
