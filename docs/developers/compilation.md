# Introduction

OpenVeo Portal is written using AngularJS and SASS / Compass. SASS files need to be compiled to generate the CSS and JavaScript files can be minified and aggregated for better performance. Front office and back office are two different applications and are not compiled the same way.

# Compile OpenVeo portal for production

You can compile the whole OpenVeo Portal (front office client and back office client) for production using:

    npm run build

# Compile front office

## Compile front office for production

You can compile the front office for production using the following command:

    npm run build:front-office-client

## Compile front office for development

You can compile the front office for development using the following command:

    npm run build:front-office-client:development

You can also automatically compile the front office on changes using:

    npm run watch:front-office-client

# Compile back office

## Compile back office for production

You can compile the back office client for production using the following command:

    npm run build:back-office-client

## Compile back office for development

You can compile the back office client for development using the following command:

    npm run build:back-office-client:development

You can also compile automatically the back office client on changes using:

    npm run watch:back-office-client
