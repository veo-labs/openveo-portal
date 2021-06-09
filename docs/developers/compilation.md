# Introduction

OpenVeo Portal is written using AngularJS and SASS / Compass. SASS files need to be compiled to generate the CSS and JavaScript files can be minified and aggregated for better performance. Front office and back office are two different applications and are not compiled the same way.

# Compile OpenVeo portal

You can compile the whole OpenVeo Portal (front office client and back office client) using:

    npm run build

# Compile only front office

You can compile the SASS files of the front office using the following command:

    npm run build:front-office-client

You can also automatically compile SASS files of the front office on changes using:

    npm run watch:front-office-client

# Compile only back office

You can compile the back office client using the following command:

    npm run build:back-office-client

To compile the back office client with source maps:

    npm run build:back-office-client -- --with-source-maps

It will generate source maps for both SASS files and JavaScript files.

You can also compile automatically the back office client on changes using:

    npm run watch:back-office-client
