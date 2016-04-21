'use strict';

var app = angular.module('ov.configuration', [],

// Set Links
 ['$provide', function($provide) {
  $provide.value('links', {
    contactMailTo: 'mailto:info@veo-labs.com',
    helpUrl: 'http://www.veo-labs.com'
  });
}]);

// Set Themes
app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('grey')
	.warnPalette('red');
}]);
