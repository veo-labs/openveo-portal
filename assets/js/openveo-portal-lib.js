"use strict";angular.module("ov.i18n",["ov.locale"]),function(){function t(i){return function(t,n){if(t){for(var e=t.split("."),o=i,r=0;r<e.length;r++)o[e[r]]&&(o=o[e[r]]);return"object"==typeof o&&void 0!==n&&"SINGLE"in o&&"PLURAL"in o?0==n||1==n?o.SINGLE:o.PLURAL:"string"==typeof o?o:t}return t}}angular.module("ov.i18n").filter("translate",t),t.$inject=["translations"]}(),angular.module("ov.storage",[]).provider("storage",function(){var o=this;this.prefix="ov-",this.type="localStorage",this.$get=["$window",function(e){function t(t,n){e[o.type][o.prefix+t]=n}return{get:function(t){return e[o.type][o.prefix+t]},add:t,set:t,remove:function(t){e[o.type].removeItem(o.prefix+t)}}}]}),function(){function t(e,o){var n;return n=openVeoPortalSettings.user,{login:function(t,n){return e.post(o+"authenticate",{login:t,password:n})},logout:function(){return e.post("/be"+o+"logout")},getUserInfo:function(){return n},setUserInfo:function(t){n=t||null}}}angular.module("ov.authentication",[]).factory("authenticationService",t),t.$inject=["$http","webServiceBasePath"]}();