# Introduction

Configuration files are all in user's directory under **~/.openveo/portal**

- **~/.openveo/portal/conf.json**
- **~/.openveo/portal/databaseConf.json**
- **~/.openveo/portal/loggerConf.json**
- **~/.openveo/portal/serverConf.json**
- **~/.openveo/portal/webservicesConf.json**

**Nb :** You must restart OpenVeo Portal after modifications.

# Configure OpenVeo Portal

Open **~/.openveo/portal/conf.json**

```json
{
  "theme": "default", // The name of the theme to use (this is the name of the directory in assets/themes)
  "exposedFilter": [ // A list of custom properties' ids defined in OpenVeo Publish to add as search engine filters
    "VJWL6-0Cx",
    "NkLcut70x",
    "4yYs5f0Ag"
  ],
  "categoriesFilter": "1443702123703", // Id of the taxonomy "categories" defined in OpenVeo Publish
  "privateFilter": [ // A list of groups' ids, defined in OpenVeo, only content in this list of groups will be available to an authenticated user
    "4keznvtlW"
  ],
  "publicFilter": [ // A list of groups' ids, defined in OpenVeo, only content in this list of groups will be available to an anonymous user
    "Vyog3_KgW"
  ],
  "cache": {
    "filterTTL": 600, // Time (in seconds) to keep the list of categories and custom properties' values in cache
    "videoTTL": 60 // Time (in seconds) to keep information about a video in cache
  },
  "useDialog": true // Set if UI open videos in a dialog popin, if false user will open video by navigate to URL
}
```

# Configure database access

Open **~/.openveo/portal/databaseConf.json**

```json
{
  "type" : "mongodb", // Do not change
  "host" : "localhost", // MongoDB server host
  "port" : 27017, // MongoDB port
  "database" : "DATABASE_NAME", // Replace DATABASE_NAME by the name of the OpenVeo Portal database
  "username" : "DATABASE_USER_NAME", // Replace DATABASE_USER_NAME by the name of the database user
  "password" : "DATABASE_USER_PWD" // Replace DATABASE_USER_PWD  by the password of the database user
}
```

# Configure the logger

Open **~/.openveo/portal/loggerConf.json**

```json
{
  "fileName" : "/var/log/openveo/openveo-portal.log", // Path to application log file
  "level" : "info", // Log level
  "maxFileSize" : 1048576, // Maximum log file size (in Bytes)
  "maxFiles" : 2 // Maximum number of files archived
}
```

# Configure the server

Open **~/.openveo/core/serverConf.json**

```json
{
  "port": PORT, // Replace PORT by the HTTP server port to use (e.g. 3003)
  "sessionSecret": "SECRET", // Replace SECRET by a secret used to secure HTTP sessions
  "auth": {
    "type": "cas", // The authentication mechanism to use (only cas is supported right now)
    "cas": { // CAS configuration in case of type "cas"
      "version": "3", // The version of the CAS server
      "service": "https://my-openveo-portal.com", // The service to use to authenticate to the CAS server
      "url": "https://my-cas-server.com:8443/cas", // The url of the CAS server
      "certificate": "cas.crt" // The absolute path to the CAS server certificate if root CA is not in the Node.JS well known CAs
    }
  }
}
```

# Configure the access to OpenVeo Web Service

Open **~/.openveo/portal/webservicesConf.json**

```json
{
 "path": "https://www.my-openveo-ws.com", // Complete path to the web service (including port if necessary)
 "clientID": "65d6247f0293049523d6a5e2efdf49ac07b51600", // OpenVeo Portal id
 "secretID": "8a7b0d43a631b52cf15e89eba7a65f274ccc7f73", // OpenVeo Portal secret
 "certificate": "server.crt" // The absolute path to the OpenVeo Web Service certificate if root CA is not in the system well known CAs
}
```