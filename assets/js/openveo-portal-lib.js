"use strict";!function(a){a.module("ov.i18n",["ov.locale"])}(angular);;"use strict";!function(a){function b(a){return function(b,c){if(b){for(var d=b.split("."),e=a,f=0;f<d.length;f++)e[d[f]]&&(e=e[d[f]]);return"object"==typeof e&&"undefined"!=typeof c&&"SINGLE"in e&&"PLURAL"in e?0==c||1==c?e.SINGLE:e.PLURAL:"string"==typeof e?e:b}return b}}a.filter("translate",b),b.$inject=["translations"]}(angular.module("ov.i18n"));;"use strict";!function(a){function b(){var a=this;this.prefix="ov-",this.type="localStorage",this.$get=["$window",function(b){function c(c){return b[a.type][a.prefix+c]}function d(c,d){b[a.type][a.prefix+c]=d}function e(c){b[a.type].removeItem(a.prefix+c)}return{get:c,add:d,set:d,remove:e}}]}var c=a.module("ov.storage",[]);c.provider("storage",b)}(angular);;"use strict";!function(a){function b(a){function b(){g=openVeoPortalSettings.user}function c(b,c){return a.post(h+"authenticate",{login:b,password:c})}function d(){return a.post(h+"logout")}function e(){return g}function f(a){g=a?a:null}var g,h="/";return b(),{login:c,logout:d,getUserInfo:e,setUserInfo:f}}var c=a.module("ov.authentication",[]);c.factory("authenticationService",b),b.$inject=["$http"]}(angular);