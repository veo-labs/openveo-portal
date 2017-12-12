'use strict';

window.assert = chai.assert;

describe('OpaIndexController', function() {
  let $controller;
  let $rootScope;
  let $q;
  let scope;
  let opaI18nFactory = {
    getLanguages: () => ['fr', 'en']
  };

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(function() {
    scope = $rootScope.$new();
  });

  describe('init', function() {

    it('should use first language in the list if no language specified', function() {
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        opaUserFactory: {
          getLanguage: () => null
        }
      });
      assert.equal(ctrl.userLanguage, opaI18nFactory.getLanguages()[0], 'Wrong language');
    });

    it('should use user language if specified', function() {
      const expectedLanguage = 'en';
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        opaUserFactory: {
          getLanguage: () => expectedLanguage
        }
      });
      assert.equal(ctrl.userLanguage, expectedLanguage, 'Wrong language');
    });

    it('should build languages menu items depending on available languages and select user language', function() {
      const expectedLanguage = 'en';
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        opaUserFactory: {
          getLanguage: () => expectedLanguage
        }
      });

      var validateLanguage = function(action) {
        if (action.code === expectedLanguage) {
          assert.isOk(action.selected, `Expected language ${action.code} to be selected`);
        } else
          assert.isNotOk(action.selected, `Unexpected selected language ${action.code}`);
      };

      assert.equal(
        ctrl.toolbarRightActions[1].menu.length,
        opaI18nFactory.getLanguages().length,
        'Wrong number of languages in toolbar actions'
      );

      ctrl.toolbarRightActions[1].menu.forEach(validateLanguage);

      assert.equal(
        ctrl.advancedNavMenu[3].actions.length,
        opaI18nFactory.getLanguages().length,
        'Wrong number of languages in side navigation'
      );

      ctrl.advancedNavMenu[3].actions.forEach(validateLanguage);
    });

  });

  describe('logout', function() {

    it('should be able to logout user and redirect it to the front office', function() {
      const windowMock = {
        location: {
          href: ''
        }
      };
      const opaUserFactory = {
        logout: chai.spy(() => $q.resolve()),
        getLanguage: () => 'en'
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory,
        $window: windowMock
      });

      ctrl.logout();
      scope.$digest();

      opaUserFactory.logout.should.have.been.called.exactly(1);
      assert.equal(windowMock.location.href, '/', 'Expected logout to redirect to the portal');
    });

  });

  describe('goTo', function() {

    it('should navigate to another internal page and close side navigation', function() {
      const expectedHref = '/another-view';
      const locationMock = {
        path: chai.spy((href) => href)
      };
      const sideNavMock = {
        close: chai.spy(() => {})
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        $location: locationMock,
        $mdSidenav: () => {
          return sideNavMock;
        }
      });

      ctrl.goTo({href: expectedHref});

      locationMock.path.should.have.been.called.exactly(1);
      sideNavMock.close.should.have.been.called.exactly(1);
    });

  });

  describe('goToPortal', function() {

    it('should be able to redirect user to the front office', function() {
      const windowMock = {
        location: {
          href: ''
        }
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        $window: windowMock
      });

      ctrl.goToPortal();
      scope.$digest();

      assert.equal(windowMock.location.href, '/', 'Expected user to be redirected to the portal');
    });

  });

  describe('setLanguage', function() {

    it('should be able to setLanguage and reload the page', function() {
      const windowMock = {
        location: {
          href: ''
        }
      };
      const opaUserFactory = {
        getLanguage: () => 'en',
        setLanguage: chai.spy(() => {})
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory,
        $window: windowMock
      });

      ctrl.setLanguage('fr');
      scope.$digest();

      opaUserFactory.setLanguage.should.have.been.called.exactly(1);
      assert.equal(windowMock.location.href, './', 'Expected page to be reloaded');
    });

  });

  describe('closeSideNavigation', function() {

    it('should be able to close the side navigation', function() {
      const sideNavMock = {
        close: chai.spy(() => {})
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        $mdSidenav: () => {
          return sideNavMock;
        }
      });

      ctrl.closeSideNavigation();

      sideNavMock.close.should.have.been.called.exactly(1);
    });

  });

  describe('toggleSideNavigation', function() {

    it('should be able to toggle the side navigation', function() {
      const sideNavMock = {
        toggle: chai.spy(() => {})
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory,
        $mdSidenav: () => {
          return sideNavMock;
        }
      });

      ctrl.toggleSideNavigation();

      sideNavMock.toggle.should.have.been.called.exactly(1);
    });

  });

  describe('selectMenuItem', function() {

    it('should be able to select the menu item corresponding to the given path', function() {
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory
      });

      ctrl.selectMenuItem('/wrong-path');
      assert.isNotOk(ctrl.navMenu[0].selected, `Unexpected selected item with path ${ctrl.navMenu[0].href}`);
      assert.isNotOk(
        ctrl.advancedNavMenu[0].selected,
        `Unexpected advanced selected item with path ${ctrl.navMenu[0].href}`
      );

      ctrl.selectMenuItem('/');
      assert.isOk(ctrl.navMenu[0].selected, 'Expected item with path / to be selected');
      assert.isOk(ctrl.navMenu[0].selected, 'Expected advanced item with path / to be selected');
    });

  });

  describe('$routeChangeStart', function() {

    it('should redirect user to front office if not authenticated', function() {
      const opaUserFactory = {
        getLanguage: () => 'en',
        isAuthenticated: () => false
      };
      const windowMock = {
        location: {
          href: ''
        }
      };
      $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory,
        $window: windowMock
      });

      scope.$broadcast('$routeChangeStart');

      assert.equal(windowMock.location.href, '/', 'Expected to be redirected to the front office');
    });

    it('should not redirect user to front office if authenticated', function() {
      const opaUserFactory = {
        getLanguage: () => 'en',
        isAuthenticated: () => true
      };
      const windowMock = {
        location: {
          href: 'not set'
        }
      };
      $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory,
        $window: windowMock
      });

      scope.$broadcast('$routeChangeStart');

      assert.equal(windowMock.location.href, 'not set', 'Unexpected redirection');
    });

    it('should indicate that the page is loading', function() {
      const opaUserFactory = {
        getLanguage: () => 'en',
        isAuthenticated: () => true
      };
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory
      });

      scope.$broadcast('$routeChangeStart');

      assert.isNotOk(ctrl.isViewLoaded, 'Expected page to be loading');
    });

  });

  describe('$routeChangeSuccess', function() {

    it('should be able to select menu item corresponding to new path', function() {
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory
      });

      scope.$broadcast('$routeChangeSuccess', {originalPath: '/'});

      assert.isOk(ctrl.navMenu[0].selected, 'Expected item with path / to be selected');
      assert.isOk(ctrl.navMenu[0].selected, 'Expected advanced item with path / to be selected');
    });

  });

  describe('opaViewLoaded', function() {

    it('should indicate that the view is loaded', function() {
      const ctrl = $controller('OpaIndexController', {
        $scope: scope,
        opaI18nFactory: opaI18nFactory
      });

      scope.$broadcast('opaViewLoaded');

      assert.isOk(ctrl.isViewLoaded, 'Expected view to be loaded');
    });

  });

  describe('opaHttpError', function() {

    it('should logout current user if the error corresponds to an authentication error', function() {
      const opaUserFactory = {
        getLanguage: () => 'en',
        logout: chai.spy(() => $q.resolve())
      };
      const opaNotificationFactory = {
        displayNotification: chai.spy(() => {})
      };
      $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaI18nFactory: opaI18nFactory
      });

      scope.$broadcast('opaHttpError', {authenticationError: true});

      opaUserFactory.logout.should.have.been.called.exactly(1);
      opaNotificationFactory.displayNotification.should.have.been.called.exactly(0);
    });

    it('should display a notification if the error is not an authentication error', function() {
      const opaUserFactory = {
        getLanguage: () => 'en',
        logout: chai.spy(() => $q.resolve())
      };
      const opaNotificationFactory = {
        displayNotification: chai.spy(() => {})
      };
      $controller('OpaIndexController', {
        $scope: scope,
        opaUserFactory: opaUserFactory,
        opaNotificationFactory: opaNotificationFactory,
        opaI18nFactory: opaI18nFactory
      });

      scope.$broadcast('opaHttpError', {message: 'Error message'});

      opaUserFactory.logout.should.have.been.called.exactly(0);
      opaNotificationFactory.displayNotification.should.have.been.called.exactly(1);
    });

  });

});
