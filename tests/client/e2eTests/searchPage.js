'use strict';

const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const SearchPage = process.require('tests/client/e2eTests/pages/SearchPage.js');
const GlobalPage = process.require('tests/client/e2eTests/pages/GlobalPage.js');
const e2e = require('@openveo/test').e2e;
const Helper = e2e.helpers.Helper;
const WsModel = process.require('tests/client/e2eTests/models/WsModel.js');
const dataPath = path.join(process.root, 'tests/client/e2eTests/resources/data.json');
const dataResources = require(dataPath);


// Load assertion library
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Search page', () => {
  let page;
  let body;
  let videoHelper;

  const isOrderByViews = (inverse) => {
    return page.videoElementsByViews.map((elm, key) => {
      return {
        index: key,
        views: elm.getText()
      };
    }).then((result) => {
      const message = inverse ? 'video list should be sorted by views inverted' :
      'video list should be sorted by views';
      const sorted = result.slice().sort((a, b) => {
        if (inverse) return a.views - b.views;
        return b.views - a.views;
      });

      let isSorted = true;
      for (let i = 0; i < sorted.length; i++) {
        isSorted = isSorted && sorted[i].index == result[i].index;
      }
      assert.isTrue(isSorted, message);
    });
  };

  const isOrderByDate = (inverse) => {
    return page.videoElementsByDate.map((elm, key) => {
      return {
        index: key,
        date: elm.getText()
      };
    }).then((result) => {
      const message = inverse ? 'video list should be sorted by date inverted' :
      'video list should be sorted by date';
      const sorted = result.slice().sort((a, b) => {
        const tsa = new Date(a.date).getTime();
        const tsb = new Date(b.date).getTime();
        if (inverse) return tsa - tsb;
        return tsb - tsa;
      });

      let isSorted = true;
      for (let i = 0; i < sorted.length; i++) {
        isSorted = isSorted && sorted[i].index == result[i].index;
      }
      assert.isTrue(isSorted, message);
    });
  };


  // Prepare page
  before(() => {
    page = new SearchPage();
    body = new GlobalPage();
    videoHelper = new Helper(new WsModel('videos'));
    videoHelper.addEntities(dataResources.videos.home);
    page.load();
  });

  after(() => {
    return videoHelper.removeAllEntities();
  });

  afterEach(() => {
    page.reload('search');
  });

  it('should display page element', () => {
    assert.eventually.ok(page.pageTitleElement.isPresent(), 'page title should be displayed');
    assert.eventually.isAtMost(page.videoElements.count(), 9, 'videos list length should be at most 9 by page');
  });

  // Open dialog
  it('should open and close dialog on video click', () => {
    page.getPath().then((path) => {
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

  // Open/Close Advanced Search
  it('should display advanced search bloc', () => {
    assert.eventually.ok(page.advancedSearchBlocElement.isDisplayed(),
      'Advanced Search button should be displayed');
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed');
  });

  it('should open advanced search bloc on click on advancedSearchBlocElement', () => {
    page.clickAdvancedSearchBloc();
    assert.eventually.ok(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be open on click');
  });

  it('should close advanced search bloc on click on an open advancedSearchBlocElement', () => {
    page.clickAdvancedSearchBloc();
    page.clickAdvancedSearchBloc();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate advanced form');
  });

  it('should open/close advanced search bloc on click on advancedSearchBlocElement', () => {
    page.clickAdvancedSearchBloc();
    page.clickAdvancedSearchButton();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate advanced form');
  });

  it('should close advanced search bloc on search', () => {
    page.clickAdvancedSearchBloc();
    page.searchSubmit();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after validate form');
  });

  it('should close advanced search bloc on sortBy button', () => {
    page.clickAdvancedSearchBloc();
    page.clickSortByButton();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after click on order button');
  });

  it('should close advanced search bloc on sortOrder button', () => {
    page.clickAdvancedSearchBloc();
    page.clickSortOrderButton();
    assert.eventually.isNotOk(page.advancedSearchFormElement.isDisplayed(),
      'Advanced Search form should be collapsed after click on order button');
  });

  // Sort by and order
  it('should display the video list sorted by date by default', () => {
    isOrderByDate();
  });

  it('should display the video list sorted by views on orderBy button click', () => {
    page.clickSortByButton();

    isOrderByViews();
  });

  it('should display the video list sorted by views, less view first, on sortOrder button click', () => {
    page.clickSortByButton();
    page.clickSortOrderButton();

    isOrderByViews(true);
  });

  it('should display the video list sorted by date, older first, on sortOrder button click', () => {
    page.clickSortByButton();
    page.clickSortOrderButton();
    page.clickSortByButton();

    isOrderByDate(true);
  });

  it('should display the video list sorted by date, on orderBy button click', () => {
    page.clickSortByButton();
    page.clickSortOrderButton();
    page.clickSortByButton();
    page.clickSortOrderButton();

    isOrderByDate();
  });

  // Search
  it('should switch url on search action', () => {
    const keys = 'test';
    page.setSearch(keys);
    page.searchSubmit();
    assert.eventually.equal(page.getPath(), `/search?query=${keys}`, `Path sould be /search?query=${keys}`);
  });

});
