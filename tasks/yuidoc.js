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
      paths: '<%= project.root %>/app/server',
      outdir: '<%= project.root %>/site/version/api/server',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  },

  // Generate yuidoc for the client part
  front: {
    name: 'OpenVeo Portal client',
    description: 'AngularJS OpenVeo Portal client side documentation',
    version: '<%= pkg.version %>',
    options: {
      paths: '<%= project.root %>/app/client',
      outdir: '<%= project.root %>/site/version/api/client',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  }

};
