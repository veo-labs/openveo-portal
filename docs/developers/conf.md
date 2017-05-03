# Introduction

Some project's development configuration is made in **conf.json** file.

# Load JavaScript files

The list of JavaScript files to load are defined in **conf.json**:

```js
{
  scriptLibFiles: { // List of JavaScript files to load first
    base: [ // List of JavaScript files to load on both development and production environments
      ...
    ],
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

# Load CSS files

The list of CSS files to load are defined in **conf.json**:

```js
{
  cssFiles: [ // List of CSS files to load
    ...
  ]
}
```
