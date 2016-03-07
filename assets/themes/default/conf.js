'use strict';

angular.module('ov.configuration', [], ['$provide', function($provide) {
  $provide.value('links', {
      contactMailTo: 'mailto:coucou@coucou.com',
      helpUrl: 'http://www.google.fr'
  });
}]);
