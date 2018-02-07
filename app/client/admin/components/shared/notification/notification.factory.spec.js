'use strict';

window.assert = chai.assert;

describe('opaNotificationFactory', function() {
  let opaNotificationFactory;
  let $mdToastMock;
  let opaNotificationConfigurationMock;
  const expectedOptions = {
    closeLabel: 'Default close label',
    closeAriaLabel: 'Default close ARIA label'
  };

  // Load modules
  beforeEach(function() {
    $mdToastMock = {
      show: chai.spy(() => {})
    };
    opaNotificationConfigurationMock = {
      getOptions: () => {
        return expectedOptions;
      },
      setOptions: () => {}
    };
    module('opa', function($provide) {
      $provide.factory('$mdToast', () => {
        return $mdToastMock;
      });

      $provide.factory('opaNotificationConfiguration', function() {
        return opaNotificationConfigurationMock;
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

    it('should be able to specify the close button labels', function() {
      const expectedCloseLabel = 'Close label';
      const expectedCloseAriaLabel = 'Close ARIA label';
      $mdToastMock.build = (data) => {
        assert.equal(data.locals.closeLabel, expectedCloseLabel, 'Wrong close label');
        assert.equal(data.locals.closeAriaLabel, expectedCloseAriaLabel, 'Wrong close ARIA label');
      };
      opaNotificationFactory.displayNotification('Message', 0, expectedCloseLabel, expectedCloseAriaLabel);
    });

    it('should use close button labels from configuration if not specified', function() {
      opaNotificationConfigurationMock.getOptions = () => {
        return expectedOptions;
      };
      $mdToastMock.build = (data) => {
        assert.equal(data.locals.closeLabel, expectedOptions.closeLabel, 'Wrong close label');
        assert.equal(data.locals.closeAriaLabel, expectedOptions.closeAriaLabel, 'Wrong close ARIA label');
      };
      opaNotificationFactory.displayNotification('Message', 0);
    });

    it('should not do anything if message if not defined', function() {
      opaNotificationFactory.displayNotification();
      $mdToastMock.show.should.have.been.called.exactly(0);
    });

  });

});
