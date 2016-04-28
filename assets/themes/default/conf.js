'use strict';

var app = angular.module('ov.configuration', [],

// Set Links
 ['$provide', function($provide) {
  $provide.value('links', {
    CONTACT: 'mailto:info@veo-labs.com',
    HELP: 'http://www.veo-labs.com'
  });
}]);

// Set Themes
app.config(['$mdThemingProvider', function($mdThemingProvider) {

	var defaultBlueMap = $mdThemingProvider.extendPalette('blue', {
		'500': '#22BBEA', //primary
		'600': '#006DA3', //button hover
		'A200': '#22BBEA', // accent
		'contrastDefaultColor': 'light',
	});
  	var defaultGreyMap = $mdThemingProvider.extendPalette('grey', {
  		'500': '#c6c6c6',
    	'A200': '#c6c6c6',
    	'contrastDefaultColor': 'light'
  	});
  	var defaultBackgroundMap = $mdThemingProvider.extendPalette('grey', {
  		'50': '#FFFFFF' //background
  	});
  	$mdThemingProvider.definePalette('defaultBlue', defaultBlueMap);
  	$mdThemingProvider.definePalette('defaultGrey', defaultGreyMap);
  	$mdThemingProvider.definePalette('defaultBackground', defaultBackgroundMap);

	$mdThemingProvider.theme('default')
	.primaryPalette('defaultBlue')
	.accentPalette('defaultGrey')
	.backgroundPalette('defaultBackground');

	// herit background from default
	$mdThemingProvider.theme('inverse')
	.primaryPalette('defaultBlue')
	.accentPalette('defaultGrey');

	$mdThemingProvider.setDefaultTheme('default');
}]);
