'use strict';

window.assert = chai.assert;

describe('opaNotificationFactory', function() {
  let opaNotificationFactory;
  let $mdToastMock;

  // Load modules
  beforeEach(function() {
    $mdToastMock = {
      show: chai.spy(() => {})
    };
    module('opa', function($provide) {
      $provide.factory('$mdToast', () => {
        return $mdToastMock;
      });
    });
  });

  // Dependencies injections
  beforeEach(inject(function(_opaNotificationFactory_) {
    opaNotificationFactory = _opaNotificationFactory_;
  }));

  describe('displayNotification', function() {

    it('should be able to display a notification', function() {
      const expectedMessage = 'Expected message';
      $mdToastMock.build = (data) => {
        assert.equal(data.locals.message, expectedMessage, 'Wrong message');
        assert.isOk(data.locals.closeButton, 'Missing close button');
      };

      opaNotificationFactory.displayNotification(expectedMessage);

      $mdToastMock.show.should.have.been.called.exactly(1);
    });

    it('should set delay to 0 if negative', function() {
      $mdToastMock.build = (data) => {
        assert.equal(data.hideDelay, 0, 'Wrong delay');
      };
      opaNotificationFactory.displayNotification('Message', -42);
    });

    it('should not add a close button if delay is positive', function() {
      $mdToastMock.build = (data) => {
        assert.isNotOk(data.locals.closeButton, 'Unexpected close button');
      };
      opaNotificationFactory.displayNotification('Message', 42);
    });

    it('should not do anything if message if not defined', function() {
      opaNotificationFactory.displayNotification();
      $mdToastMock.show.should.have.been.called.exactly(0);
    });

  });

});
