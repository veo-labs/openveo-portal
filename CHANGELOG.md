# 8.0.0 / YYYY-MM-DD

## BREAKING CHANGES

- No longer tested on NodeJS &lt; 16.3.0 and NPM &lt; 7.15.1
- No longer tested on Ubuntu 16.04 (tested on Ubuntu 18.04)
- OpenVeo Portal is no longer tested on Opera and Edge

## DEPENDENCIES

- **consolidate** has been upgraded from 0.15.1 to **0.16.0**

# 7.0.0 / 2020-11-19

## BREAKING CHANGES

- Custom themes need to update their translations, one can take the default theme as an example

## NEW FEATURES

- Add support for Vimeo live

# 6.0.0 / 2020-05-04

## BREAKING CHANGES

- Drop support for NodeJS &lt; 12.4.0 and NPM &lt; 6.9.0
- Drop support for OpenVeo Publish &lt;11.0.0

## NEW FEATURES

- Add a checkbox to advanced search form to perform search in titles and descriptions of chapters and tags. Default checkbox value can be customized from within the administration interface
- Use Roboto font family instead of default browser sans-serif font for the front end

## BUG FIXES

- Upgrade Wowza player which wasn't working with version 4.7.8 of Wowza
- Fix tooltip on "need upgrade" icon in dashboard "About" block which wasn't displayed

## DEPENDENCIES

- **@openveo/api** has been upgraded from 5.1.1 to **7.0.0**
- **@openveo/player** has been upgraded from 5.0.0 to **6.0.0**
- **@openveo/rest-nodejs-client** has been upgraded from 3.0.0 to **4.0.0**
- **@openveo/test** has been upgraded from 7.0.0 to **8.0.0**
- **async** has been upgraded from 2.1.4 to **3.2.0**
- **body-parser** has been upgraded from 1.15.2 to **1.19.0**
- **consolidate** has been upgraded from 0.14.5 to **0.15.1**
- **cookie-parser** has been upgraded from 1.4.3 to **1.4.5**
- **dashjs** has been upgraded from 2.9.2 to **3.0.3**
- **express** has been upgraded from 4.14.0 to **4.17.1**
- **express-session** has been upgraded from 1.14.2 to **1.17.0**
- **jsonpath-plus** has been upgraded from 0.15.0 to **3.0.0**
- **mustache** has been upgraded from 2.3.0 to **3.2.1**
- **node-cache** has been upgraded from 4.1.1 to **5.1.0**
- **nopt** has been upgraded from 4.0.1 to **4.0.3**
- **passport** has been upgraded from 0.4.0 to **0.4.1**
- **roboto-fontface** has been upgraded from 0.8.0 to **0.10.0**
- **semver** has been upgraded from 5.4.1 to **7.1.3**
- **serve-favicon** has been upgraded from 2.3.2 to **2.5.0**
- **shortid** has been upgraded from 2.2.6 to **2.2.15**
- **video.js** has been upgraded from 7.3.0 to **7.7.5**
- **videojs-contrib-dash** has been upgraded from 2.10.0 to **2.11.0**
- **chai** has been upgraded from 4.0.2 to **4.2.0**
- **chai-spies** has been upgraded from 0.7.1 to **1.0.0**
- **grunt** has been upgraded from 1.0.1 to **1.1.0**
- **grunt-cli** has been upgraded from 1.2.0 to **1.3.2**
- **grunt-angular-templates** has been upgraded from 1.1.0 to **1.2.0**
- **grunt-contrib-compass** sub dependencies have been upgraded
- **grunt-contrib-uglify** has been upgraded from 2.0.0 to **4.0.1**
- **grunt-contrib-watch** has been upgraded from 1.0.0 to **1.1.0**
- **grunt-contrib-yuidoc** sub dependencies have been upgraded
- **grunt-eslint** has been upgraded from 19.0.0 to **22.0.0**
- **grunt-gh-pages** has been upgraded from 2.0.0 to **3.1.0**
- **grunt-karma** has been upgraded from 2.0.0 to **3.0.2**
- **grunt-mkdocs** has been upgraded from 0.2.0 to **1.0.1**
- **grunt-mocha-test** has been upgraded from 0.13.2 to **0.13.3**
- **grunt-protractor-runner** sub dependencies have been upgraded
- **grunt-replace** sub dependencies have been upgraded
- **karma** has been upgraded from 1.3.0 to **4.4.1**
- **karma-chrome-launcher** has been upgraded from 2.0.0 to **3.1.0**
- **karma-firefox-launcher** has been upgraded from 1.0.0 to **1.3.0**
- **karma-ie-launcher** has been removed as no tests are performed on Internet Explorer
- **mocha** has been upgraded from 3.2.0 to **7.1.1**
- **mock-require** has been upgraded from 3.0.1 to **3.0.3**
- **nodemon** has been upgraded from 1.11.0 to **2.0.2**

# 5.3.1 / 2019-08-07

## BUG FIXES

- Fix non admin users authentication. This problem was introduced in version 4.0.0.

# 5.3.0 / 2019-03-26

## NEW FEATURES

- OpenVeo Portal does not use Bower anymore, it now uses NPM for both client and server dependencies
- Automatically remove all generated files before building project when executing grunt dist

## BUG FIXES

- Fix "grunt remove:doc" which hasn't worked since version 2.0.0
- Fix home page title english translation, "Latest videos" instead of "Last videos"

## DEPENDENCIES

- **video.js** has been upgraded from 5.9.2 to **7.3.0**
- **dashjs** has been upgraded from 2.1.1 to **2.9.2**
- **videojs-contrib-dash** has been upgraded from 2.4.0 to **2.10.0**
- **videojs-contrib-hls** has been removed. It is replaced by videojs-http-streaming which is a sub dependency of video.js since version 7.0.0
- **@openveo/player** has been upgraded from 4.0.0 to **5.0.0**

# 5.2.0 / 2019-01-28

- The size of the live player has been increased

# 5.1.0 / 2019-01-22

## NEW FEATURES

- Add support for Vodalys Studio live

# 5.0.1 / 2018-06-19

## BUG FIXES

- Fix connection to the administration interface which wasn't working when OpenVeo Portal was used with Piwik
- Fix missing dependency *esprima* while installing

# 5.0.0 / 2018-06-15

## BREAKING CHANGES

- Drop support for OpenVeo &lt;5.1.0
- Drop support for OpenVeo Publish &lt;7.0.0
- Search page with search parameters containing dates in the URL have changed and won't work anymore as literal dates have been replaced by timestamps. So if you have an URL with search results in your bookmarks you will have to update it

## NEW FEATURES

- Add support for custom properties of type *True / false* in advanced search
- Add support for custom properties of type *Date time* in advanced search. Searching by a custom property of type *Date time* will search all videos with a date between the entered date at midnight and next day at midnight

# 4.0.4 / 2018-05-30

## BUG FIXES

- Fix access to the back office due to missing files if installed using the archive (not the NPM package)

# 4.0.3 / 2018-05-25

## BUG FIXES

- Add missing breaking changes to the CHANGELOG of version 4.0.0. Custom themes also need to be modified

# 4.0.2 / 2018-05-14

## BUG FIXES

- Fix a bug introduced in version 4.0.0 about video shared page, the title of the video was displayed above of the player

# 4.0.1 / 2018-05-11

## BUG FIXES

- Remove use of inline styles on front office
- Fix category label on video information ("category" instead of "categorie")

# 4.0.0 / 2018-05-04

## BREAKING CHANGES

- Drop support for OpenVeo &lt; 5.0.0
- All requests to OpenVeo are now cached with a default cache to 10 seconds still customizable through conf.json configuration file
- Drop support for NodeJS &lt; 8.9.4 and NPM &lt; 5.6.0
- Custom themes need to be updated:
  - New translations have to be added:
    - *UI.BACK_OFFICE* The label of the menu item to access the back office
    - *UI.MORE* The tooltip message on a video page for the button to expend description
    - *UI.LESS* The tooltip message on a video page for the button to collapse description
    - *LIVE.PAGE_TITLE* The live page browser title (&lt;title&gt; tag)
    - *LIVE.TITLE* The live page title
    - *MENU.LIVE* The label of the menu item leading to the live page
  - If you want to configure a live based on Wowza you also need to add a file *openveo-portal-live-wowza-locale_en.js* for Wowza player translations. You can referer to *assets/themes/default/i18n/openveo-portal-live-wowza-locale_en.js* file for an example

## NEW FEATURES

- A live page has been added to present a live stream from Wowza or Youtube. Live page can be activated or deactivated and access can be restricted using user groups. Live can be configured through the new back office interface.
- Add a back office to OpenVeo Portal accessible by navigating to /be URI when connected with the super administrator. Only the super administrator can access the back office. Actually the back office contains three pages:
  - the dashboard which indicates the version of OpenVeo Portal and warns you if a new version is available
  - the promoted videos page to configure which videos to display on the portal home page
  - the settings page to configure a live
- The video page now displays the lead paragraph in addition to the description
- Add NPM npm-shrinkwrap.json file

## BUG FIXES

- Videos not published in OpenVeo can't be accessed by URL anymore
- The format of dates now respects the language of the portal
- Player now displays only the video by default if video stream contains both video and presentation

## DEPENDENCIES

- **angular-material** has been upgraded from 1.1.4 to **1.1.5**
- **openveo-player** has been upgraded from 2.\* to **4.\***
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
