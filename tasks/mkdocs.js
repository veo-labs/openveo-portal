'use strict';

// Generate documentation
// For more information about Grunt mkdocs, have a look at https://www.npmjs.com/package/grunt-mkdocs
module.exports = {

  // Generate project's documentation
  portal: {
    src: '<%= project.root %>',
    options: {
      clean: true
    }
  }

};
