'use strict';

// Rename files or directories
// For more information about Grunt rename, have a look at https://github.com/veo-labs/openveo-api
module.exports = {

  // Rename project documentation directory into project version
  doc: {
    src: '<%= project.root %>/site/version',
    dest: '<%= project.root %>/site/<%= pkg.version %>'
  }

};
