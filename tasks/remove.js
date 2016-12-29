'use strict';

// Remove files or directories
// For more information about Grunt remove, have a look at https://www.npmjs.com/package/grunt-remove
module.exports = {

  // Remove project's compiled documentation
  doc: {
    dirList: [
      '<%= project.root %>/site'
    ]
  }

};
