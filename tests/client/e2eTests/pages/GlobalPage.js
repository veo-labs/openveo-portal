'use strict';

const e2e = require('@openveo/test').e2e;

const Page = e2e.pages.Page;

/**
 * Creates a new HeaderPage representing a simple back end page.
 */
class GlobalPage extends Page {

  constructor() {
    super();

    this.logoElement = element(by.css('a#logo'));
    this.connectionButtonElement = element(by.css('button.log-in-button'));
    this.menuItemsElements = element.all(by.css('.menu button'));
    this.homeMenuElement = this.menuItemsElements.get(0);
    this.searchMenuElement = this.menuItemsElements.get(1);
    this.activeItemElement = element(by.className('md-active'));
    this.path = '';
  }

  onLoaded() {
    return browser.executeAsyncScript(`
      const callback = arguments[arguments.length - 1];
      var $injector = angular.injector(['ov.locale']);
      $injector.invoke(['translations', function(translations) {
        callback(translations);
}]);
    `).then((translations) => {
      this.translations = translations;
      return browser.wait(this.EC.presenceOf(this.logoElement), 2000, 'Missing Logo Link');
    });
  }

  reload(path) {
    this.path = path;
    return this.load();
  }
  clickSearchItem() {
    return this.searchMenuElement.click();
  }
  clickHomeItem() {
    return this.homeMenuElement.click();
  }
  clickLogo() {
    return this.logoElement.click();
  }
  getActiveItemText() {
    return this.activeItemElement.getText();
  }

  closeDialog() {
    return this.dialogElement.element(by.css('button[aria-label=close]')).click();
  }

}

module.exports = GlobalPage;
