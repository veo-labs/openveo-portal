'use strict';

// Remove files or directories
// For more information about Grunt remove, have a look at @openveo/api
module.exports = {

  // Remove project's built files and directories
  build: {
    src: [
      '<%= project.buildPath %>',
      '<%= project.adminDeployJsPath %>/openveo-portal-admin.*',
      '<%= project.adminDeployCssPath %>/index.css*',
      '<%= project.adminDeployViewsPath %>/index.html',
      '<%= project.frontDeployCssPath %>/style.css*',
      '<%= project.frontDeployJsPath %>/openveo-portal*'
    ]
  }

};
