'use strict';

const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const HomePage = process.require('tests/client/e2eTests/pages/HomePage.js');
const GlobalPage = process.require('tests/client/e2eTests/pages/GlobalPage.js');
const e2e = require('@openveo/test').e2e;
const Helper = e2e.helpers.Helper;
const WsModel = process.require('tests/client/e2eTests/models/WsModel.js');
const dataPath = path.join(process.root, 'tests/client/e2eTests/resources/data.json');
const dataResources = require(dataPath);


// Load assertion library
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Home page', () => {
  let page;
  let body;
  let videoHelper;

  // Prepare page
  before(() => {
    page = new HomePage();
    body = new GlobalPage();
    videoHelper = new Helper(new WsModel('videos'));
    page.load();
  });

  after(() => {
    return videoHelper.removeAllEntities();
  });

  // Element
  it('should display page title', () => {
    assert.eventually.ok(page.pageTitleElement.isPresent());
  });

  it('should display a "More video" button', () => {
    assert.eventually.ok(page.moreButtonElement.isPresent(), 'More Video button should be displayed');
  });

  // // Videos
  it('should display the list of 6 videos at most', () => {
    assert.eventually.isAtMost(page.videoElements.count(), 6, 'videos list length should be at most 6');
  });

  it('should display the video list sorted by date', () => {
    videoHelper.addEntities(dataResources.videos.date).then((addedVideos) => {
      page.refresh();

      return page.videoElementsByDate.map((elm, key) => {
        return {
          index: key,
          date: new Date(elm.getText())
        };
      }).then((result) => {
        const sorted = result.slice().sort((a, b) => {
          return b.date - a.date;
        });
        for (let i = 0; i < sorted.length; i++) {
          assert.equal(sorted[i].index, result[i].index, 'video list should be sorted by date');
        }
      });
    });
  });

  // Open dialog
  it('should open and close dialog on video click', () => {
    videoHelper.addEntities(dataResources.videos.to_open).then((addedVideos) => {
      page.refresh();

      return page.getPath().then((path) => {
        const oldpath = path;
        page.openVideo();
        assert.eventually.ok(body.dialogElement.isDisplayed(), 'dialog video should be displayed');
        assert.eventually.match(page.getPath(), /^\/video\/.+/, 'Url should change to /video/* when dialog is open');
        return page.firstVideoElement.element(by.css('.md-title')).getText().then((result) => {
          assert.eventually.equal(
            body.dialogElement.element(by.css('h2')).getText(),
            result,
            'dialog video should be displayed'
            );
          body.closeDialog();
          assert.eventually.isNotOk(body.dialogElement.isPresent(), 'dialog video should be displayed');
          assert.eventually.equal(page.getPath(), oldpath, 'Url should change back to old path when dialog is closed');
        });
      });
    });
  });

  // it('should display url on share options', () => {
  //   page.openVideo();
  //   browser.getCurrentUrl().then((result) => {
  //     body.overSpeedDial();
  //     assert.eventually.ok(body.dialActionElement.first().isDisplayed(),
   // 'Speed Dial opening should show first share button');
  //     assert.eventually.ok(body.dialActionElement.last().isDisplayed(),
   // 'Speed Dial opening should show first share button');
  //     body.clickFirstDial();
  //     assert.eventually.equal(body.shareLinkElement.getText(), result, 'share link should be equal with current url')
  //     body.closeDialog();
  //   });
  // });


  // Switch URL
  it('should switch url on "More video" button click', () => {
    browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
    page.clickMoreButton();
    assert.eventually.equal(page.getPath(), '/search', 'Path sould be /search');
  });

  it('should switch url on search action', () => {
    const keys = 'test';
    page.reload('');
    page.setSearch(keys);
    page.searchSubmit();
    assert.eventually.equal(page.getPath(), `/search?query=${keys}`, `Path sould be /search?query=${keys}`);
  });

});
