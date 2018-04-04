# 3.1.0 / YYYY-MM-DD

## NEW FEATURES

- A live page has been added to present a live stream from Wowza or Youtube. Live page can be activated or deactivated and access can be restricted using user groups. Live can be configured through the new back office interface.
- Add a back office to OpenVeo Portal accessible by navigating to /be URI when connected with the super administrator. Only the super administrator can access the back office. Actually the back office contains two pages: the dashboard which indicates the version of OpenVeo Portal and warns you if a new version is available, and the settings page to configure a live. The back office observes the Material specification and is responsive.

## DEPENDENCIES

- **angular-material** has been upgraded from 1.1.4 to **1.1.5**
- **@openveo/api** has been upgraded from 4.\* to **5.\***
- **@openveo/test** has been upgraded from 5.\* to **6.\***

# 3.0.0 / 2017-10-19

## BREAKING CHANGES

- Authentication configuration has changed to be able to handle more authentication strategies. All property names under "auth" object, in your **serverConf.json** file, must be valid strategies, thus you have to **remove the "auth.type"** or your server won't start as "type" is not a valid strategy.
- Use of theming colors has changed:
  - Footer links are now accent hue 3
  - Theme inverse has been removed, only default theme is used now
  - Menu and links backgrounds are now background 100
- CAS configuration now expects the following attributes to be set: userIdAttribute and userNameAttribute
- Error codes have changed please (see app/server/httpErrors.js)
- Remove accent on footer links
- passwordHashKey is now required in conf.json and must be added before updating OpenVeo Portal

## BUG FIXES

- Hide connection button if no authentication mechanism has been configured

# 2.1.0 / 2017-09-18

## NEW FEATURES

- Video title has been removed from the shared page
- The aspect of the whole display is now smaller and 4 columns of videos are now displayed instead of 3
- Make better use of colors for default theme, blue colors are now only there to show important information and context
- Connection / deconnection button on mobile devices has been moved next to the logotype
- To be able to connect with multiple authentication providers, a connection dialog (and page) is now available instead of a simple button
- Add authentication using LDAP
- Add authentication using CAS
- Add authentication using local database

## BUG FIXES

- Remove glyph next to the logotype on Internet Explorer 10

## DEPENDENCIES

- **chai** has been upgraded from 3.5.0 to **4.0.2**
- **chai-as-promised** has been upgraded from 6.0.0 to **7.1.1**
- **passport** has been upgraded from 0.3.2 to **0.4.0**
- **angular-material** has been upgraded from 1.0.8 to **1.1.4**

# 2.0.1 / 2017-06-13

## BUG FIXES

- Add missing files to versions. Compiled files were not included into tags.

# 2.0.0 / 2017-05-04

## NEW FEATURES

- Improve search engine when searching by text
- Upgrade to AngularJS 1.6.4

## BREAKING CHANGES

- Drop support for Node.js &lt;7.4.0
- Drop support for NPM &lt;4.0.5
- Drop support for OpenVeo Publish &lt;3.0.0

## BUG FIXES

- Fix SASS warning when compiling
- Fix bug when player throw an undefined error
- Fix CAS certificate issue when root CA is not part of the well known CAs
- Take CAS user groups into account. CAS user groups didn't have any impact on the available videos. It has now. If a CAS user belongs to a group not listed in "privateFilter" configuration option, he will still be able to access all videos belonging to his groups. To resume, a connected user can access all videos belonging to groups listed in "privateFilter" plus all videos belonging to groups listed in "publicFilter" plus all videos belonging to his CAS groups.
- Add missing style.css file for default theme
- Fix requests on localhost/piwik.js with default theme
- Fix translations on Internet Explorer. Only english translations could be displayed on Internet Explorer even if the browser was in another supported language.
- Remove duplicate "&" in iframe share code
- Remove blue outlines on the player icons
- Change help link and email contact in default theme which were pointing to a real company
- Remove hyperlink on share url which was pointing to the actual page

## DEPENDENCIES

- **async** has been updated from 1.5.2 to **2.1.4**
- **body-parser** has been updated from 1.15.0 to **1.15.2**
- **consolidate** has been updated from 0.14.0 to **0.14.5**
- **cookie-parser** has been updated from 1.4.1 to **1.4.3**
- **express** has been updated from 4.13.4 to **4.14.0**
- **express-session** has been updated from 1.13.0 to **1.14.2**
- **mustache** has been updated from 2.2.1 to **2.3.0**
- **node-cache** has been updated from 3.2.1 to **4.1.1**
- **nopt** has been updated from 3.0.6 to **4.0.1**
- **serve-favicon** has been updated from 2.3.0 to **2.3.2**
- **shortid** has been updated from 2.2.4 to **2.2.6**
- **xml2js** has been updated from 0.4.16 to **0.4.17**
- **grunt** has been updated from 0.4.5 to **1.0.1**
- **grunt-contrib-uglify** has been updated from 1.0.1 to **2.0.0**
- **grunt-eslint** has been updated from 18.1.0 to **19.0.0**
- **grunt-mkdocs** has been updated from 0.1.3 to **0.2.0**
- **grunt-mocha-test** has been updated from 0.12.7 to **0.13.2**
- **grunt-protractor-runner** has been updated from 4.0.0 to **5.0.0**
- **mocha** has been updated from 2.4.5 to **3.2.0**
- **nodemon** has been updated from 1.9.2 to **1.11.0**
- **pre-commit** has been updated from 1.1.2 to **1.2.2**
- **connect-mongo** has been updated removed
- **mongodb** has been updated removed
- **winston** has been updated removed
- **grunt-extend-config** has been updated removed
- **grunt-init** has been updated removed
- **grunt-remove** has been updated removed
- **grunt-rename** has been updated removed

# 1.1.1 / 2017-01-04

- Update Readme to refer to the right license

# 1.1.0 / 2016-12-29

- Update Player to allow multisources video
- Enable classic UI navigation (without popin)

# 1.0.2 / 2016-09-09

- Debug calendar selected date
- Debug request when period selected is only one day
- Debug webservice to avoid token problem
- Add reset feature on select field

# 1.0.1 / 2016-07-19

- Debugging video freeze updating videoJs and Dash dependencies
- Debug SSL certificate to communicate with webservices

# 1.0.0 / 2016-05-31

Firt stable version of OpenVeo Portal .

Adds the following features :

- View last published videos on Openveo Publish
- Search for videos by properties, category, date or title and description
- Connect to a CAS authent to enable user to see private video
- Record video views number in Openveo
- Send statistics to a Piwik server
- Theming portal according to client to personalize wording, colors, ...
