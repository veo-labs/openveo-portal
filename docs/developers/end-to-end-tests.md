# Introduction

End to end tests are performed using [Protractor](http://www.protractortest.org/).

You need to have a running OpenVeo Web Service server before starting tests.

**WARNING** : Each time you launch end to end tests, all information are removed from OpenVeo ! Launch OpenVeo Web Service with option **--databaseConf** to specify a test database.

# Install selenium web driver and chrome driver

    node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update

# Configure tests

When launching tests, an OpenVeo Portal server is automatically spawned and must be configured through **serverTestConf.json**. Typically you may want to change the server port.

**~/.openveo/core/serverTestConf.json**

```json
{
  "port": 3004,
  "sessionSecret": "2bXELdIqoT9Tbv5i1RfcXGEIE+GQS+XYbwVn0qEx"
}
```

In order not to drop your development openveo-portal database, you need to configure a test openveo-portal database through **databaseTestConf.json**. Typically you may want to change the database, username and password.

**~/.openveo/core/databaseTestConf.json**

```json
{
  "type": "mongodb",
  "host": "localhost",
  "port": 27017,
  "database": "openveo-portal-test",
  "username": "openveo-test",
  "password": "openveo-test"
}
```

You will also need to configure your server by editing options relative to end-to-end tests. You need a **confTest.json** to typically set your test options like **publicFilter**.

**~/.openveo/core/confTest.json**

```json
{
  "theme": "default",
  "exposedFilter": [""],
  "categoriesFilter": "",
  "privateFilter": [""],
  "publicFilter": ["public"],
  "cache": {
    "filterTTL" : 600,
    "videoTTL" : 60
    },
  "useDialog": false
}
```

The logger has to be configured through **loggerTestConf.json**. Typically you may want to deactivate logger standard output.

**~/.openveo/core/loggerTestConf.json**

```json
{
  "level": "info",
  "maxFileSize": 1048576,
  "maxFiles": 2,
  "fileName": "/tmp/openveo-portal-test.log",
  "console": false
}
```

**console: false** will deactivate standard output.

Finally the Web Service has to be configured through **webservicesTestConf.json**. Typically you may want to have a different client or a different server.

```json
{
  "path": "http://127.0.0.1:3002",
  "certificate": "",
  "clientID": "B1535kPqe",
  "secretID": "a058d8ff7420b84708bd1ff4bacb8e4c42424cd0"
}
```

# Create test

Create your test file in **tests/client/e2eTests/** then update the list of suites, if necessary, in **tests/client/e2eTests/protractorSuites.json**.

# Debug

If a test fails, a screenshot of the browser at the instant is taken and available in **build/screenshots** of the project.

# Launch end to end tests

    # Launch all end to end tests on chrome
    grunt test-e2e --capabilities="{\"browserName\": \"chrome\"}" --directConnect=true

    # Launch all end to end tests on firefox
    grunt test-e2e --capabilities="{\"browserName\": \"firefox\"}" --directConnect=true

    # Launch only portal suite on chrome
    grunt test-e2e --capabilities="{\"browserName\": \"chrome\"}" --directConnect=true --suite="portal"