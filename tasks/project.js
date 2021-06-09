'use strict';

const path = require('path');

module.exports = {
  root: path.join(__dirname, '..'),
  buildPath: '<%= project.root %>/build',
  uglifyBuildPath: '<%= project.buildPath %>/uglify',
  compassBuildPath: '<%= project.buildPath %>/compass',

  adminSourcesPath: '<%= project.root %>/app/client/admin',
  adminI18nSourcesPath: '<%= project.root %>/assets/be/js/i18n',
  adminDeployJsPath: '<%= project.root %>/assets/be/js',
  adminDeployCssPath: '<%= project.root %>/assets/be/css',
  adminDeployViewsPath: '<%= project.root %>/assets/be/views',

  frontDeployCssPath: '<%= project.root %>/assets/css',
  frontScssSourcesPath: '<%= project.root %>/app/client/front/compass/sass',
  frontJsSourcesPath: '<%= project.root %>/app/client/front/js',
  frontThemesSourcesPath: '<%= project.root %>/assets/themes',
  frontViewsSourcesPath: '<%= project.root %>/assets/views',
  frontDeployJsPath: '<%= project.root %>/assets/js',

  serverSourcesPath: '<%= project.root %>/app/server',

  clientTestSourcesPath: '<%= project.tests %>/client',
  clientLibrariesPath: '<%= project.root %>/assets/lib',

  documentationDeployPath: '<%= project.root %>/site',
  documentationServerApiDeployPath: '<%= project.documentationDeployPath %>/version/api/server',
  documentationFrontApiDeployPath: '<%= project.documentationDeployPath %>/version/api/client/front',
  documentationAdminApiDeployPath: '<%= project.documentationDeployPath %>/version/api/client/admin'
};
