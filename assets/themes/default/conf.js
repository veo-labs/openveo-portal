'use strict';

var app = angular.module('ov.configuration', [],

// Set Links
 ['$provide', function($provide) {
  $provide.value('links', {
    contactMailTo: 'mailto:coucou@coucou.com',
    helpUrl: 'http://www.google.fr'
  });
}]);

// Set Themes
app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('grey')
	.warnPalette('red');
}]);
