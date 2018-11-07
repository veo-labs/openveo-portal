# Introduction

Some project's development configuration is made in **conf.json** file.

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

Back office JavaScript files are loaded automatically, there is nothing to do about it. However libraries used by the back office still need to be loaded in **conf.json**:

```js
{
  "be": {
    "scriptLibFiles": [ // List of JavaScript library files to load
      ...
    ]
  }
}
```

# Load back office CSS files

Back office CSS files are loaded automatically, there is nothing to do about it.
