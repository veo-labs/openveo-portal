'use strict';

// Generate yuidoc
// For more information about Grunt yuidoc, have a look at https://www.npmjs.com/package/grunt-contrib-yuidoc
module.exports = {

  // Generate yuidoc for the server part
  server: {
    name: 'OpenVeo Portal server',
    description: 'OpenVeo Portal server side documentation',
    version: '<%= pkg.version %>',
    options: {
      paths: '<%= project.serverSourcesPath %>',
      outdir: '<%= project.documentationServerApiDeployPath %>',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  },

  // Generate yuidoc for the client part
  'front-office': {
    name: 'OpenVeo Portal client',
    description: 'AngularJS OpenVeo Portal front documentation',
    version: '<%= pkg.version %>',
    options: {
      paths: '<%= project.frontJsSourcesPath %>',
      outdir: '<%= project.documentationFrontApiDeployPath %>',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  },

  // Generate yuidoc for the administration part
  'back-office': {
    name: 'OpenVeo Portal administration interface',
    description: 'AngularJS OpenVeo Portal administration interface documentation',
    version: '<%= pkg.version %>',
    options: {
      paths: '<%= project.adminSourcesPath %>',
      outdir: '<%= project.documentationAdminApiDeployPath %>',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  }

};
