YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "TranslateFilter",
        "applicationService",
        "authenticationService",
        "storageProvider"
    ],
    "modules": [
        "ov",
        "ov.authentication",
        "ov.i18n",
        "ov.portal",
        "ov.storage"
    ],
    "allModules": [
        {
            "displayName": "ov",
            "name": "ov",
            "description": "Defines service to manage the video search."
        },
        {
            "displayName": "ov.authentication",
            "name": "ov.authentication",
            "description": "Service to authenticate / logout or manipulate authenticated user informations."
        },
        {
            "displayName": "ov.i18n",
            "name": "ov.i18n",
            "description": "Control internationalization."
        },
        {
            "displayName": "ov.portal",
            "name": "ov.portal",
            "description": "Main OpenVeo Portal module.\n\nInitializes routes."
        },
        {
            "displayName": "ov.storage",
            "name": "ov.storage",
            "description": "Helper module to manipulate local storage."
        }
    ],
    "elements": []
} };
});