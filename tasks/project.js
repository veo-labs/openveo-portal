'use strict';

var path = require('path');

module.exports = {
  root: path.join(__dirname, '..'),
  client: '<%= project.root %>/app/client',
  server: '<%= project.root %>/app/server',
  assets: '<%= project.root %>/assets',
  defaultTheme: '<%= project.assets %>/themes/default',
  uglify: '<%= project.root %>/build/uglify',
  tests: '<%= project.root %>/tests',
  sass: '<%= project.client %>/front/compass/sass',
  frontJS: '<%= project.client %>/front/js',
  fonts: '<%= project.assets %>/lib/bootstrap-sass/assets/fonts',
  fontHttpPath: '/lib/bootstrap-sass/assets/fonts',
  cssAssets: '<%= project.assets %>/css',
  jsAssets: '<%= project.assets %>/js'
};
