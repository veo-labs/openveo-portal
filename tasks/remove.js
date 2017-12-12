'use strict';

// Remove files or directories
// For more information about Grunt remove, have a look at https://github.com/veo-labs/openveo-api
module.exports = {

  // Remove project's compiled documentation
  doc: {
    dirList: [
      '<%= project.documentationDeployPath %>'
    ]
  }

};
