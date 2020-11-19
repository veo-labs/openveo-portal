# What's OpenVeo Portal?

OpenVeo Portal is a Node.js / AngularJS application. It embeds an HTTP applicative server based on [Express framework](http://expressjs.com/).

It aims to offer a portal to access medias exposed by an [OpenVeo](https://github.com/veo-labs/openveo-core) server associated to an [OpenVeo Publish](https://github.com/veo-labs/openveo-publish) plugin.

It includes the following features:

- An home page to present the most seen medias
- A live page to stream a live from Wowza, Youtube, Vimeo or Vodalys Studio
- A search engine
- Support for authentication using local database, [CAS](https://www.apereo.org/projects/cas) or [LDAP](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol)
- Themes
- Statistics with support for [Piwik](http://piwik.org/)
- An administration interface

## Authentication

OpenVeo Portal supports the following SSO (Single Sign On) providers:

- [LDAP](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol)
- [CAS](https://www.apereo.org/projects/cas)

## Compatibility

OpenVeo Portal has been tested on the following operating systems:

- Ubuntu 16.04

OpenVeo has been tested on the following:

- Google Chrome
- Mozilla Firefox
- Opera
- Edge

![Ubuntu](images/operating-systems/ubuntu.gif)

![Firefox](images/browsers/firefox.gif)
![Google Chrome](images/browsers/chrome.gif)
![Opera](images/browsers/opera.gif)
![Edge](images/browsers/edge.gif)

## Screenshots

### Home page
![Home page](images/screenshots/home-page.png)

### Player page
![Player page](images/screenshots/player-page.png)

### Back office dashboard
![Back office dashboard](images/screenshots/back-office-dashboard.png)

### Back office promoted videos configuration
![Back office promoted videos](images/screenshots/back-office-promoted-videos.png)

### Back office settings
![Back office settings](images/screenshots/back-office-settings.png)
