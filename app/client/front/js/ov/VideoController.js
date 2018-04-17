'use strict';

(function(app) {

  /**
   *
   * @param {type} $scope
   * @param {type} $locale
   * @param {type} $timeout
   * @param {type} $location
   * @returns {VideoController_L3.VideoController}
   */
  function VideoController($scope, $locale, $timeout, $location, $analytics, videoService, searchService, $sce) {
    $scope.defaultMode = 'both';
    if ($scope.video.metadata) {
      var template = $scope.video.metadata.template || '';
      if (template.match(/^mix-/))
        $scope.defaultMode = 'media';
    }
    if ($scope.video.category) {
      searchService.getCategoryName($scope.video.category).then(function(val) {
        $scope.categoryName = val;
      });
    }

    $scope.dialIsOpen = false;
    $scope.language = $locale.id;
    $scope.shareOpen = false;
    $scope.shareItems = [
      {name: 'UI.LINK', icon: 'link', direction: 'bottom', action: function(video) {
        delete $scope.shareText;
        var port = ($location.port() != 80 && $location.port() != 443) ? ':' + $location.port() : '';
        $scope.shareLink = $location.protocol() + '://' + $location.host() + port + '/video/' + video.id;
        $scope.shareOpen = !$scope.shareOpen;
      }},
      {name: 'UI.CODE',
        icon: 'code',
        direction: 'bottom',
        action: function(video) {
          delete $scope.shareLink;
          var port = ($location.port() != 80 && $location.port() != 443) ? ':' + $location.port() : '';
          $scope.shareText =
                  '<iframe width="768" height="500" ' +
                  'src="' + $location.protocol() + '://' + $location.host() + port + '/video/' + video.id +
                  '?iframe=true&hidedetail=false" frameborder="0"></iframe>';

          $scope.shareOpen = !$scope.shareOpen;
        }}
    ];
    $scope.showFullInfos = false;
    $scope.toggleFullInfosLabel = 'UI.MORE';

    $scope.toggleFullInfos = function() {
      $scope.showFullInfos = !$scope.showFullInfos;
      $scope.toggleFullInfosLabel = $scope.showFullInfos ? 'UI.LESS' : 'UI.MORE';
    };

    var myPlayer = document.getElementById('openveo-player');
    var playerController;
    var videoDuration;

    /**
     * Executes, safely, the given function in AngularJS process.
     *
     * @param {Function} functionToExecute The function to execute as part of
     * the angular digest process.
     */
    function safeApply(functionToExecute) {

      // Execute each apply on a different loop
      $timeout(function() {

        // Make sure we're not on a digestion cycle
        var phase = $scope.$root.$$phase;

        if (phase === '$apply' || phase === '$digest')
          functionToExecute();
        else
          $scope.$apply(functionToExecute);
      }, 1);
    }

    angular.element(myPlayer).on('durationChange', function(event, duration) {
      safeApply(function() {
        videoDuration = duration;

        // only gets called once
        if (!playerController || duration) {
          playerController = angular.element(myPlayer).controller('ovPlayer');
        }
      });
    });

    angular.element(myPlayer).on('ovPlay', function(event) {
      $analytics.pageTrack($location.path());
      $analytics.eventTrack('play', {value: $scope.video.id});
      videoService.increaseVideoView($scope.video.id, videoDuration);
    });

    // Listen to player errors
    // If an error occurs go back to catalog with an alert
    angular.element(myPlayer).on('error', function(event, error) {
      $scope.$emit('setAlert', 'danger', error && error.message, 8000);
    });

    $scope.$watch('vctl.dialIsOpen', function(newValue, oldValue) {
      if (newValue === true) {
        $scope.shareOpen = false;
      }
    });

    $scope.trustedHTML = function(string) {
      return $sce.trustAsHtml(string);
    };
  }

  app.controller('VideoController', VideoController);
  VideoController.$inject = [
    '$scope',
    '$locale',
    '$timeout',
    '$location',
    '$analytics',
    'videoService',
    'searchService',
    '$sce'
  ];

})(angular.module('ov.portal'));
