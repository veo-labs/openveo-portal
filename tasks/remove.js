'use strict';

// Remove files or directories
// For more information about Grunt remove, have a look at @openveo/api
module.exports = {

  // Remove project's compiled documentation
  doc: {
    src: [
      '<%= project.documentationDeployPath %>'
    ]
  }

};
