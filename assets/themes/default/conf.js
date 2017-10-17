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
    50: '#e3f2fd', // [Default color]: Not used
    100: '#bbdefb', // [Default color]: Not used
    200: '#90caf9', // [Default color]: Not used
    300: '#64b5f6', // [Default color]: Not used
    400: '#42a5f5', // [Default color]: Not used

    /*
      [OpenVeo color]
      - Input text color when focused
      - Toolbar background
      - Date picker icon when opened
      - Date picker today date border
      - Date picker selected date background color
      - Select text color when opened
      - Spinner color
      - Pagination selected text color
    */
    500: '#22bbea',
    600: '#006da3', // [OpenVeo color]: Select menu selected item text and effect color
    700: '#1976d2', // [Default color]: Not used
    800: '#1565c0', // [Default color]: Not used
    900: '#ff0000', // [Default color]: Not used
    A100: '#82b1ff', // [Default color]: Not used
    A200: '#448aff', // [Default color]: Not used
    A400: '#2979ff', // [Default color]: Not used
    A700: '#2962ff', // [Default color]: Not used
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400', 'A100']
  }));

  // Define a new color palette based on blue palette
  $mdThemingProvider.definePalette('accent', $mdThemingProvider.extendPalette('blue', {
    50: '#e3f2fd', // [Default color]: Not used
    100: '#bbdefb', // [Default color]: Not used
    200: '#90caf9', // [Default color]: Not used
    300: '#64b5f6', // [Default color]: Not used
    400: '#42a5f5', // [Default color]: Not used
    500: '#2196f3', // [Default color]: Not used
    600: '#1e88e5', // [Default color]: Not used
    700: '#1976d2', // [Default color]: Not used
    800: '#1565c0', // [Default color]: Not used
    900: '#0d47a1', // [Default color]: Not used
    A100: '#22bbea', // [OpenVeo color]: Ink bar in pagination / pagination button effect

    /*
      [OpenVeo color]
      - Selected button text and effect color inside a nav bar
      - Ink bar in nav bar
      - Fab buttons background color
      - Selected switch background color
    */
    A200: '#22bbea',
    A400: '#2979ff', // [Default color]: Not used
    A700: '#006da3', // [OpenVeo color]: Fab buttons hover background color
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400', 'A100']
  }));

  // Define a new color palette based on grey palette
  $mdThemingProvider.definePalette('background', $mdThemingProvider.extendPalette('grey', {
    50: '#fafafa', // [Default color]: Page and buttons background color
    100: '#f5f5f5', // [Default color]: Not used
    200: '#eeeeee', // [Default color]: Date picker separators / menu dialog item hover background color

    /*
      [Default color]
      - Date picker header background color
      - Date picker actual and focused day background color
    */

    300: '#e0e0e0',
    400: '#bdbdbd', // [Default color]: Not used

    /*
      [Default color]
      - Buttons hover background color when not raised
      - Field arrows background when focused
      - Switch background
      - Menu dialog item selected effect
    */
    500: '#9e9e9e',
    600: '#757575', // [Default color]: Not used
    700: '#616161', // [Default color]: Tooltip background color
    800: '#424242', // [Default color]: Not used

    /*
      [Default color]
      - Buttons text and effect color when raised
      - Menu dialog item text color
      - Menu dialog item effect
    */
    900: '#212121',
    A100: '#ffffff', // [Default color]: Date picker background-color and border-color / menu dialog background color
    A200: '#000000', // [Default color]: Date picker text color
    A400: '#303030', // [Default color]: Not used
    A700: '#616161', // [Default color]: Not used
    contrastDefaultColor: 'dark',
    contrastLightColors: ['600', '700', '800', '900', 'A200', 'A400', 'A700']
  }));

  // Specify "default" theme
  $mdThemingProvider.theme('default')
  .primaryPalette('primary')
  .accentPalette('accent')
  .backgroundPalette('background');

  $mdThemingProvider.setDefaultTheme('default');
}]);
