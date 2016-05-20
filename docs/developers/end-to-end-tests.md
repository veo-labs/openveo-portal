# Introduction

End to end tests are performed using [Protractor](http://www.protractortest.org/).

You need to have a running OpenVeo Web Service server before starting tests.

**WARNING** : Each time you launch end to end tests, all information are removed from OpenVeo ! Launch OpenVeo Web Service with option **--databaseConf** to specify a test database.

# Install Protractor globally

First of all you need to install Protractor, all information are available on Protractor's web site.

# Remove grunt-protractor-runner local protractor

    rm -rf node_modules/grunt-protractor-runner/node_modules/protractor

# Configure tests

To be able to launch end to end tests, OpenVeo Portal needs to find the selenium jar and the chrome driver file installed with Protractor.
You can specify the path of the selenium jar using **SELENIUM_JAR** environment variable and chrome driver using **CHROME_DRIVER** environment variable.

When launching tests, an OpenVeo Portal server is automatically spawned and must be configured through **serverTestConf.json**. Typically you may want to change the server port.

**~/.openveo/core/serverTestConf.json**

```json
{
  "port": 3004,
  "sessionSecret": "2bXELdIqoT9Tbv5i1RfcXGEIE+GQS+XYbwVn0qEx"
}
```

Finally the logger has to be configured through **loggerTestConf.json**. Typically you may want to deactivate logger standard output.

**~/.openveo/core/loggerTestConf.json**

```json
{
  "level": "info",
  "maxFileSize": 1048576,
  "maxFiles": 2,
  "fileName": "/tmp/openveo-portal.log",
  "console": false
}
```

**console: false** will deactivate standard output.

# Create test

Create your test file in **tests/client/e2eTests/** then update the list of suites, if necessary, in **tests/client/e2eTests/protractorSuites.json**.

# Debug

If a test fails, a screenshot of the browser at the instant is taken and available in **build/screenshots** of the core.

# Launch end to end tests

    # Launch all end to end tests on chrome
    grunt test-e2e --capabilities="{\"browserName\": \"chrome\"}" --directConnect=true

    # Launch all end to end tests on firefox
    grunt test-e2e --capabilities="{\"browserName\": \"firefox\"}" --directConnect=true