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
    this.connexionButtonElement = element(by.css('a.log-in-button'));
    this.homeMenuElement = element(by.css('md-tab-item[aria-controls=tab-content-0]'));
    this.searchMenuElement = element(by.css('md-tab-item[aria-controls=tab-content-1]'));
    this.activeItemElement = element(by.className('md-active'));

    this.dialogElement = element(by.css('.dialog-video'));
    this.speedDialElement = this.dialogElement.element(by.css('md-fab-speed-dial'));
    this.dialActionElement = this.dialogElement.all(by.css('md-fab-actions button'));

    this.shareLinkElement = this.dialogElement.element(by.css('.share-code a'));

    Object.defineProperties(this, {
      path: {
        value: '',
        writable: true
      }
    });
  }

  onLoaded() {
    return browser.wait(this.EC.presenceOf(this.logoElement), 2000, 'Missing Logo Link');
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
