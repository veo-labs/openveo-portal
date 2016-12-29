YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CAS",
        "CAS 2",
        "CAS1",
        "CAS3",
        "CasStrategy",
        "Server",
        "StatisticsController",
        "VideoCache",
        "defaultController",
        "errorController",
        "filterCache",
        "migrationLoader",
        "searchController"
    ],
    "modules": [
        "controllers",
        "core-loaders",
        "http-errors",
        "passport",
        "passport-cas",
        "portal-cache",
        "portal-controllers",
        "server"
    ],
    "allModules": [
        {
            "displayName": "controllers",
            "name": "controllers",
            "description": "Controllers provide all server route actions."
        },
        {
            "displayName": "core-loaders",
            "name": "core-loaders"
        },
        {
            "displayName": "http-errors",
            "name": "http-errors",
            "description": "The list of HTTP errors with, for each error, its associated hexadecimal code and HTTP return code.\nHTTP errors are sent by {{#crossLinkModule \"controllers\"}}{{/crossLinkModule}}."
        },
        {
            "displayName": "passport",
            "name": "passport",
            "description": "Defines passport strategies."
        },
        {
            "displayName": "passport-cas",
            "name": "passport-cas",
            "description": "Defines a passport cas strategy."
        },
        {
            "displayName": "portal-cache",
            "name": "portal-cache"
        },
        {
            "displayName": "portal-controllers",
            "name": "portal-controllers"
        },
        {
            "displayName": "server",
            "name": "server"
        }
    ],
    "elements": []
} };
});