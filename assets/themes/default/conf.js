'use strict';

var app = angular.module('ov.configuration', [],
  ['$provide', function($provide) {
    $provide.value('links', {
      CONTACT: 'mailto:info@company.local',
      HELP: 'http://help.company.local'
    });
  }]
);

// Set Themes
app.config(['$mdThemingProvider', function($mdThemingProvider) {

  // Define a new color palette based on blue palette
  $mdThemingProvider.definePalette('primary', $mdThemingProvider.extendPalette('blue', {

    //  - Inputs: text color when focused
    //  - Toolbar: background
    //  - Date picker: icon when opened
    //  - Date picker: today date border
    //  - Date picker: selected date background color
    //  - Select: text color when opened
    //  - Spinner: color
    //  - Pagination: selected text color
    500: '#22bbea',

    // - Select menu: selected item text
    // - Buttons: hover background color
    600: '#006da3',

    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400', 'A100']
  }));

  // Define a new color palette based on blue palette
  $mdThemingProvider.definePalette('accent', $mdThemingProvider.extendPalette('blue', {

    // - Pagination: ink bar color
    // - Pagination: button effect
    A100: '#22bbea',

    // - Nav bar: selected button text
    // - Nav bar: effect color
    // - Nav bar: ink bar color
    // - Fab buttons: background color
    // - Switch: selected background color
    A200: '#22bbea',

    // - Fab buttons: hover background color
    A700: '#006da3',

    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400', 'A100']
  }));

  // Define a new color palette based on grey palette
  $mdThemingProvider.definePalette('background', $mdThemingProvider.extendPalette('grey', {

    // - Page: background color
    // - Buttons: background color
    50: '#fafafa',

    // - Header: background color
    // - Footer: background color
    100: '#f5f5f5',

    // - Date picker: separators
    // - Select: item hover background color
    200: '#eeeeee',

    // - Date picker: header background color
    // - Date picker: actual day background color
    // - Date picker: focused day background color
    300: '#e0e0e0',

    // - Buttons: hover background color when not raised
    // - Field arrows: background color when focused
    // - Switch: background color
    // - Select: item selected effect
    500: '#9e9e9e',

    // Tooltip: background color
    700: '#616161',

    // - Buttons: text color when raised
    // - Buttons: effect color when raised
    // - Select: item text color
    // - Select: item effect
    900: '#212121',

    // - Date picker: background color
    // - Date picker: border color
    // - Select: background color
    A100: '#ffffff',

    // Date picker: text color
    A200: '#000000',

    contrastDefaultColor: 'dark',
    contrastLightColors: ['600', '700', '800', '900', 'A200', 'A400', 'A700']
  }));

  // Define a new color palette based on deep-orange palette
  $mdThemingProvider.definePalette('warn', $mdThemingProvider.extendPalette('red', {

    // - Login error message color
    A700: '#dd2c00',

    contrastDefaultColor: 'dark',
    contrastLightColors: ['600', '700', '800', '900', 'A200', 'A400', 'A700']
  }));

  // Specify "default" theme
  $mdThemingProvider.theme('default')
    .primaryPalette('primary')
    .accentPalette('accent')
    .warnPalette('warn')
    .backgroundPalette('background');

  $mdThemingProvider.setDefaultTheme('default');
}]);
