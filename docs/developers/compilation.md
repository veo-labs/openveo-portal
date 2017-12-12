# Introduction

OpenVeo Portal is written using AngularJS and SASS / Compass. SASS files need to be compiled to generate the CSS and JavaScript files can be minified and aggregated for better performance. Front office and back office are two different applications and are not compiled the same way.

# Compile front office

## Compiling SASS files

You can compile the SASS files of the front office using the following command:

    grunt compass:dist

Or you can watch SASS files changes using the following command:

    grunt

## Compiling JavaScript files

You'll probably want to compile AngularJS files, in production, for better performance. You can do it using:

    grunt dist

# Compile back office

## Compiling SASS files and JavaScript files

You can compile the back office SASS files and JavaScript files using the following command:

    grunt build-admin

It will generate source maps for both SASS files and JavaScript files. You can compile the back office without source maps using the following command (for production):

    grunt build-admin --production

If you want the back office to be automatically compiled when a SASS file or a JavaScript file is changed use the following command:

    grunt watch:admin