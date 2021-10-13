'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const GlobalPage = process.require('tests/client/e2eTests/pages/GlobalPage.js');

// Load assertion library
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Global Page', () => {
  let page;

  // Prepare page
  before(() => {
    page = new GlobalPage();
    page.load();
  });

  it('should display items', () => {
    assert.eventually.ok(page.homeMenuElement.isDisplayed(), 'Home menu should be displayed');
    assert.eventually.ok(page.searchMenuElement.isDisplayed(), 'All videos menu should be displayed');
  });

  it('should display a Login button', () => {
    assert.eventually.ok(page.connectionButtonElement.isDisplayed(), 'Login button should be displayed');
  });

  it('should switch url on All videos item menu click', () => {
    page.clickSearchItem();
    assert.eventually.equal(page.getPath(), '/search', 'Url should change to /search on All videos item menu click');
    assert.eventually.equal(
      page.getActiveItemText(),
      page.translations.MENU.ALL_VIDEOS.toUpperCase(),
      'Inkbar should be on All videos item menu'
    );
  });

  it('should switch url home item menu click', () => {
    page.clickHomeItem();
    assert.eventually.equal(page.getPath(), '/', 'Url should change to / on home item menu click');
    assert.eventually.equal(
      page.getActiveItemText(),
      page.translations.MENU.HOME.toUpperCase(),
      'Inkbar should be on Home item menu'
    );
  });

  it('should switch url on logo click', () => {
    page.clickSearchItem();
    page.clickLogo();
    assert.eventually.equal(page.getPath(), '/', 'Url should change to / on logo click');
    assert.eventually.equal(
      page.getActiveItemText(),
      page.translations.MENU.HOME.toUpperCase(),
      'Inkbar should be on Home item menu'
    );
  });
});

