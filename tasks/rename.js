'use strict';

// Rename files or directories
// For more information about Grunt rename, have a look at https://www.npmjs.com/package/grunt-rename
module.exports = {

  // Rename project's documentation directory with projet'c version
  doc: {
    src: '<%= project.root %>/site/version',
    dest: '<%= project.root %>/site/<%= pkg.version %>'
  }

};
