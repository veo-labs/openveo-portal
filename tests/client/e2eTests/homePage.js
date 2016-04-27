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
    assert.eventually.ok(page.pageTitleElement.isPresent());
  });

  it('should display the list of 6 video', () => {
    assert.eventually.isAtMost(page.videoElements.count(), 6);
  });

  it('should display the video list sorted by date', () => {

    return page.videoElements.map((elm, key) => {
      return {
        index: key,
        date: new Date(elm.getText())
      };
    }).then((result) => {
      const sorted = result.slice().sort((a, b) => {
        return b.date - a.date;
      });
      for (let i = 0; i < sorted.length; i++) {
        assert.equal(sorted[i].index, result[i].index);
      }
    });
  });

  it('should display a "More video" button', () => {
    assert.eventually.ok(page.moreButtonElement.isPresent());
  });

  it('should display a Login button', () => {
    assert.eventually.ok(page.connexionButtonElement.isPresent());
  });
});
