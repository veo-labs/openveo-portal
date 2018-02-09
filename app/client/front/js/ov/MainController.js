'use strict';

(function(app) {

  /**
   * Define toast controller for all toast in app
   * @param {type} $scope
   * @param {type} $mdToast
   * @returns {MainController_L3.ToastController}
   */
  function ToastController($scope, $mdToast) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  }

  /**
   * Define dialog controller for all dialog in app
   * @param {type} $scope
   * @param {type} $mdDialog
   * @param {type} video
   * @returns {MainController_L3.DialogController}
   */
  function DialogController($scope, $mdDialog, video, $mdMedia) {

    $scope.video = video;
    $scope.playerType = video.type == 'youtube' ? 'youtube' : 'html';
    $scope.dialogIsFull = ($mdMedia('sm') || $mdMedia('xs'));

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.$watch(function() {
      return ($mdMedia('sm') || $mdMedia('xs'));
    }, function(wantsFullScreen) {
      $scope.dialogIsFull = (wantsFullScreen === true);
    });
  }

  /**
   * Defines the main controller parent of all controllers in the
   * application. All actions not handled in partials are handled
   * by the main controller.
   */
  function MainController($route, $scope, links, $mdDialog, $mdToast, $mdMedia, $mdPanel,
  $location, $filter, $window, $analytics, searchService, authenticationService, webServiceBasePath) {
    var self = this;
    var urlParams = $location.search();
    var authenticationStrategies = openVeoPortalSettings.authenticationStrategies;
    this.currentNavItem = null;
    this.isLoggingOut = false;
    $scope.context = {keepContext: false};
    $scope.isIframe = urlParams['iframe'] || false;
    $scope.hideDetailVideo = urlParams['hidedetail'] || false;
    $scope.links = Object.keys(links).length === 0 && JSON.stringify(links) === JSON.stringify({}) ? null : links;
    $scope.page = {
      title: '',
      path: '',
      selectedTab: -1
    };
    $scope.user = openVeoPortalSettings.user || authenticationService.getUserInfo() || null;
    $scope.isAuth = openVeoPortalSettings.authenticationMechanisms.length ? true : false;
    $scope.isAdmin = $scope.user && $scope.user.id === openVeoPortalSettings.superAdminId;
    $scope.isLive = openVeoPortalSettings.live;
    $scope.theme = openVeoPortalSettings.theme;
    $scope.useDialog = openVeoPortalSettings.useDialog;

    // Listen to route change start event
    $scope.$on('$routeChangeStart', function(event, next) {

      // User is authenticated and request access to the login page or no authentication mechanism
      // has been found
      // Refuse access to the page and redirect to the home page
      if ($location.path() === '/login' && ($scope.user || !$scope.isAuth)) $location.path('/');

    });

    // Listen to route change success event
    $scope.$on('$routeChangeSuccess', function(event, route) {
      $scope.page.title = $route.current && $route.current.title || $scope.title;
      $scope.page.path = $location.path();
      $scope.page.selectedTab = -1;

      // Set current navigation item depending on the displayed page
      if ($scope.page.path === '/') self.currentNavItem = 'home';
      else if ($scope.page.path === '/search') self.currentNavItem = 'search';
      else if ($scope.page.path === '/live') self.currentNavItem = 'live';
      else self.currentNavItem = null;

      $analytics.pageTrack($scope.page.path);
    });

    // Listen to the route change error event
    // If user is not authenticated, redirect to the login page
    // otherwise redirect to the home page
    $scope.$on('$routeChangeError', function(event, current, previous, eventObj) {
      if (eventObj && eventObj.redirect) {
        $location.path(eventObj.redirect);

        if (eventObj.needAuth)
          $scope.showToast($filter('translate')('ERROR.FORBIDDEN'));
      } else {
        $location.path('/');
        if (eventObj.status == '500' || eventObj.status == '502')
          $scope.showToast($filter('translate')('ERROR.SERVER'));
      }
    });

    $scope.openVideo = function(ev, video) {

      // If dialog disable, open video by URL
      if (!$scope.useDialog) {
        $location.path('/video/' + video.id, true);
        return;
      }

      $scope.context.keepContext = false;
      var urlContext = $location.path();
      var searchContext = $location.search();

      $scope.dialogUseFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $scope.dialog = {
        controller: DialogController,
        templateUrl: 'views/dialogVideo.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          video: null
        },
        clickOutsideToClose: true,
        fullscreen: $scope.dialogUseFullScreen
      };

      searchService.loadVideo(video.id).then(function(result) {

        // video found and public or user authentified
        if (result.data.entity) {
          $location.path('/video/' + video.id, false).search({});

          $scope.dialog.locals.video = result.data.entity;
          $mdDialog.show($scope.dialog).finally(function() {
            $scope.context.keepContext = true;
            $location.path(urlContext, false).search(searchContext);
          }).catch(angular.noop);

        } else if (result.data.needAuth) {
          $location.path('/login');
          $scope.showToast($filter('translate')('ERROR.FORBIDDEN'));
        } else
          $location.path('/');

      }, function(error) {

        // error on call
        searchService.cacheClear();
        $location.path('/');
        if (error.status == '500' || error.status == '502')
          $scope.showToast($filter('translate')('ERROR.SERVER'));
      });

      $scope.$watch(function() {
        return ($mdMedia('sm') || $mdMedia('xs'));
      }, function(wantsFullScreen) {
        $scope.dialogUseFullScreen = (wantsFullScreen === true);
      });
    };

    $scope.onTabSelected = function(path) {
      if (path == '/search')
        $location.path(path);
      else // reset search on home page
        $location.path(path).search({});
    };

    $scope.showToast = function(message) {
      var toast = $mdToast.simple()
        .textContent(message)
        .position('top center')
        .hideDelay(3000);
      $mdToast.show(toast);
    };

    /**
     * Logs out connected user.
     *
     * @method logout
     */
    $scope.logout = function() {
      authenticationService.logout().then(function() {
        authenticationService.setUserInfo();
        $location.path('/');
      });
    };

    /**
     * Show the login dialog.
     *
     * @method showLoginDialog
     */
    this.showLoginDialog = function() {
      var position = $mdPanel.newPanelPosition()
      .relativeTo('.log-in-button')
      .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.CENTER);

      var animation = $mdPanel.newPanelAnimation()
      .duration(50)
      .openFrom('.log-in-button')
      .closeTo('.log-in-button')
      .withAnimation($mdPanel.animation.SCALE);

      var config = {
        id: 'loginDialog',
        attachTo: angular.element(document.body),
        controller: 'LoginFormController',
        controllerAs: 'loginCtrl',
        templateUrl: 'views/dialogLogin.html',
        clickOutsideToClose: true,
        escapeToClose: true,
        panelClass: 'login-panel',
        position: position,
        animation: animation
      };

      $mdPanel.open(config);
    };

    /**
     * Logouts connected user.
     *
     * @method logout
     */
    this.logout = function() {
      var self = this;

      if ($scope.user) {
        $analytics.eventTrack('Logout');

        if ($scope.user.origin === authenticationStrategies.CAS) {

          // CAS strategy needs a redirection
          $window.location.href = '/be' + webServiceBasePath + 'logout';

        } else {
          this.isLoggingOut = true;
          authenticationService.logout().then(function() {
            self.isLoggingOut = false;
            $scope.user = null;
            authenticationService.setUserInfo();
            $window.location.href = '/';
          });
        }
      }
    };

    /**
     * Navigates to administration interface (/be).
     *
     * This will leave this single page application.
     *
     * @method goToBackOffice
     */
    this.goToBackOffice = function() {
      $window.location.href = '/be';
    };
  }

  /**
   * Define placeholder directive on all video element
   */
  function ImageLoadedDirective($http) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        attrs.$observe('ngSrc', function(ngSrc) {
          $http.get(ngSrc).then(function() {

            // do nothing
          }).catch(function() {
            element.attr('src', '/themes/' + scope.theme + '/images/placeholder.jpg'); // set default image
          });
        });
      }
    };
  }

  app.controller('MainController', MainController);
  app.controller('DialogController', DialogController);
  app.controller('ToastController', ToastController);
  MainController.$inject = [
    '$route',
    '$scope',
    'links',
    '$mdDialog',
    '$mdToast',
    '$mdMedia',
    '$mdPanel',
    '$location',
    '$filter',
    '$window',
    '$analytics',
    'searchService',
    'authenticationService',
    'webServiceBasePath'
  ];
  DialogController.$inject = ['$scope', '$mdDialog', 'video', '$mdMedia'];
  ToastController.$inject = ['$scope', '$mdToast'];

  ImageLoadedDirective.$inject = ['$http'];
  app.directive('checkImage', ImageLoadedDirective);

})(angular.module('ov.portal'));
