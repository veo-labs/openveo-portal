# Introduction

Some project's development configuration is made in **conf.json** file.

# Load libraries

The list of libraries to load are defined in **conf.json**:

```js
libraries: [
  {

    // The name of the library as defined in package.json file
    name: 'angular',

    // The mount path to use to access the library
    mountPath: 'angular-custom-mount-path',

    // The list of files to automatically load in the front office with paths relative to the library directory
    // Library will still be mounted even if there is no files to automatically load in the front office
    files: ['angular.min.js', 'angular-csp.css']

  },
  [...]
]
```

# Load front office JavaScript files

The list of JavaScript files of the front office to load are defined in **conf.json**:

```js
{
  scriptLibFiles: { // List of JavaScript files to load first
    dev: [ // List of JavaScript files to load on development environment
      ...
    ],
    prod: [ // List of JavaScript files to load on production environment
      ...
    ]
  },
  scriptFiles: { // List of JavaScript files to load next
    dev: [ // List of JavaScript files to load on development environment
      ...
    ],
    prod: [ // List of JavaScript files to load on production environment
      ...
    ]
  }
}
```

# Load front office CSS files

The list of CSS files to load are defined in **conf.json**:

```js
{
  cssFiles: [ // List of CSS files to load
    ...
  ]
}
```

# Load back office JavaScript files

Back office JavaScript files are loaded automatically, there is nothing to do about it.

# Load back office CSS files

Back office CSS files are loaded automatically, there is nothing to do about it.

# Load back office libraries files

Back office JavaScript and CSS files are loaded automatically however libraries used by the back office still need to be loaded in **conf.json**:

```js
{
  "be": {
    "libraries": [ // List of libraries to load
      {

        // The name of the library as defined in package.json file
        name: 'angular',

        // The list of files to automatically load in the back office with paths relative to the library directory
        files: ['angular.min.js', 'angular-csp.css']

      },
      [...]
    ]
  }
}
```
