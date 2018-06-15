"use strict";!function(a){var b=["ngRoute","ngAnimate","ngMaterial","ngMessages","ngSanitize","ngCookies","angulartics","angulartics.piwik","ov.locale","ov.i18n","ov.configuration","ov.player","ov.authentication","ov.storage"],c=a.module("ov.portal",b);c.constant("webServiceBasePath","/ws/"),c.run(["$route","$rootScope","$location",function(a,b,c){var d=c.path;c.path=function(e,f){if(f===!1)var g=a.current,h=b.$on("$locationChangeSuccess",function(){a.current=g,h()});return d.apply(c,[e])}}]),c.config(["$mdDateLocaleProvider",function(b){var c=a.injector(["ng"]).get("$locale").id.slice(0,2);b.firstDayOfWeek=1,b.parseDate=function(a){var b=a.split("/");return"fr"==c?new Date(b[2],b[1]-1,b[0]):new Date(b[2],b[0]-1,b[1])},b.formatDate=function(a){if(a){var b=new Date(a),d=b.getDate(),e=b.getMonth()+1,f=b.getFullYear();return"fr"==c?d+"/"+e+"/"+f:e+"/"+d+"/"+f}return""}}]),c.config(["$routeProvider","$locationProvider","$httpProvider",function(b,c,d){b.when("/video/:mediaId",{templateUrl:"views/videoPage.html",controller:"VideoPageController",title:"VIDEO.PAGE_TITLE",resolve:{video:["$q","searchService","$route",function(a,b,c){var d=a.defer(),e=c.current.params.mediaId;return e?b.loadVideo(e).then(function(a){a.data.entity?d.resolve.apply(d,arguments):a.data.needAuth?d.reject({redirect:"/login",needAuth:!0}):d.reject({redirect:"/"})},function(a){b.cacheClear(),d.reject({redirect:"/"})}):d.reject({redirect:"/"}),d.promise}]}}),b.when("/search",{templateUrl:"views/search.html",controller:"SearchController",title:"SEARCH.PAGE_TITLE",reloadOnSearch:!1,resolve:{result:["$location","searchService","$filter",function(b,c,d){var e=a.copy(b.search());if(e.sortBy=e.sortBy?"views":"date",e.sortOrder=e.sortOrder?"asc":"desc",e.dateStart&&(e.dateStart=Number(e.dateStart)),e.dateEnd){var f=new Date(Number(e.dateEnd));f.setDate(f.getDate()+1),e.dateEnd=f.getTime()}return e=c.cleanSearch(e),c.search(e,{limit:12})}],filters:["searchService",function(a){return a.getFilters()}]}}),openVeoPortalSettings.live&&b.when("/live-event",{templateUrl:"views/live.html",controller:"LiveController",title:"LIVE.PAGE_TITLE"}),b.when("/login",{templateUrl:"views/login.html",controller:"LoginFormController",controllerAs:"loginCtrl",title:"LOGIN.PAGE_TITLE"}),b.when("/",{templateUrl:"views/home.html",controller:"HomeController",title:"HOME.PAGE_TITLE",resolve:{promotedVideos:["searchService",function(a){return a.getPromotedVideos()}]}}).otherwise("/"),c.html5Mode(!0),d.interceptors.push("errorInterceptor")}])}(angular);;"use strict";!function(a,b){function c(a,b){var c,d;return a.data&&a.data.error&&(c=a.data.error.code,d=a.data.error.module),403===a.status?b("translate")("ERROR.FORBIDDEN"):400===a.status?b("translate")("ERROR.CLIENT")+" (code="+c+", module="+d+")":c&&d?b("translate")("ERROR.SERVER")+" (code="+c+", module="+d+")":b("translate")("ERROR.SERVER")}function d(a,b,d){return{responseError:function(a){return c(a,b),d.reject(a)}}}b.factory("errorInterceptor",d),d.$inject=["$rootScope","$filter","$q"]}(angular,angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c){c&&c.data?a.videos=c.data.filter(function(a){return a}):a.videos=[],a.search={},a.searchSubmit=function(){b.path("/search").search(a.search)}}a.controller("HomeController",b),b.$inject=["$scope","$location","promotedVideos"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c,d,e,f,g,h,i,j){function k(b){d(function(){var c=a.$root.$$phase;"$apply"===c||"$digest"===c?b():a.$apply(b)},1)}if(a.defaultMode="both",a.video.metadata){var l=a.video.metadata.template||"";l.match(/^mix-/)&&(a.defaultMode="media")}a.video.category&&h.getCategoryName(a.video.category).then(function(b){a.categoryName=b}),a.dialIsOpen=!1,a.language=c.id,a.shareOpen=!1,a.shareItems=[{name:"UI.LINK",icon:"link",direction:"bottom",action:function(b){delete a.shareText;var c=80!=e.port()&&443!=e.port()?":"+e.port():"";a.shareLink=e.protocol()+"://"+e.host()+c+"/video/"+b.id,a.shareOpen=!a.shareOpen}},{name:"UI.CODE",icon:"code",direction:"bottom",action:function(b){delete a.shareLink;var c=80!=e.port()&&443!=e.port()?":"+e.port():"";a.shareText='<iframe width="768" height="500" src="'+e.protocol()+"://"+e.host()+c+"/video/"+b.id+'?iframe&hidedetail" frameborder="0"></iframe>',a.shareOpen=!a.shareOpen}}],a.showFullInfos=!1,a.toggleFullInfosLabel="UI.MORE",a.toggleFullInfos=function(){a.showFullInfos=!a.showFullInfos,a.toggleFullInfosLabel=a.showFullInfos?"UI.LESS":"UI.MORE"};var m,n,o=document.getElementById("openveo-player");angular.element(o).on("needPoiConversion",function(c,d){b.post(j+"videos/"+a.video.id+"/poi/convert",{duration:d}).then(function(b){a.video=b.data.entity})}),angular.element(o).on("durationChange",function(a,b){k(function(){n=b,m&&!b||(m=angular.element(o).controller("ovPlayer"))})}),angular.element(o).on("ovPlay",function(b){f.pageTrack(e.path()),f.eventTrack("play",{value:a.video.id}),g.increaseVideoView(a.video.id,n)}),angular.element(o).on("error",function(b,c){a.$emit("setAlert","danger",c&&c.message,8e3)}),a.$watch("vctl.dialIsOpen",function(b,c){b===!0&&(a.shareOpen=!1)}),a.trustedHTML=function(a){return i.trustAsHtml(a)}}a.controller("VideoController",b),b.$inject=["$scope","$http","$locale","$timeout","$location","$analytics","videoService","searchService","$sce","webServiceBasePath"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b){a.video=b.data.entity,a.playerType="youtube"==a.video.type?"youtube":"html"}a.controller("VideoPageController",b),b.$inject=["$scope","video"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b){a.closeToast=function(){b.hide()}}function c(a,b,c,d){a.video=c,a.playerType="youtube"==c.type?"youtube":"html",a.dialogIsFull=d("sm")||d("xs"),a.hide=function(){b.hide()},a.cancel=function(){b.cancel()},a.$watch(function(){return d("sm")||d("xs")},function(b){a.dialogIsFull=b===!0})}function d(a,b,d,e,f,g,h,i,j,k,l,m,n,o){var p=this,q=i.search(),r=openVeoPortalSettings.authenticationStrategies;this.currentNavItem=null,this.isLoggingOut=!1,b.context={keepContext:!1},b.isIframe=q.iframe||!1,b.hideDetailVideo=q.hidedetail||!1,b.links=0===Object.keys(d).length&&JSON.stringify(d)===JSON.stringify({})?null:d,b.page={title:"",path:"",selectedTab:-1},b.user=openVeoPortalSettings.user||n.getUserInfo()||null,b.isAuth=!!openVeoPortalSettings.authenticationMechanisms.length,b.isAdmin=b.user&&b.user.id===openVeoPortalSettings.superAdminId,b.isLive=openVeoPortalSettings.live,b.theme=openVeoPortalSettings.theme,b.useDialog=openVeoPortalSettings.useDialog,b.$on("$routeChangeStart",function(a,c){"/login"!==i.path()||!b.user&&b.isAuth||i.path("/")}),b.$on("$routeChangeSuccess",function(c,d){b.page.title=a.current&&a.current.title||b.title,b.page.path=i.path(),b.page.selectedTab=-1,"/"===b.page.path?p.currentNavItem="home":"/search"===b.page.path?p.currentNavItem="search":"/live"===b.page.path?p.currentNavItem="live":p.currentNavItem=null,l.pageTrack(b.page.path)}),b.$on("$routeChangeError",function(a,c,d,e){e&&e.redirect?(i.path(e.redirect),e.needAuth&&b.showToast(j("translate")("ERROR.FORBIDDEN"))):(i.path("/"),"500"!=e.status&&"502"!=e.status||b.showToast(j("translate")("ERROR.SERVER")))}),b.openVideo=function(a,d){if(!b.useDialog)return void i.path("/video/"+d.id,!0);b.context.keepContext=!1;var f=i.path(),h=i.search();b.dialogUseFullScreen=g("sm")||g("xs"),b.dialog={controller:c,templateUrl:"views/dialogVideo.html",parent:angular.element(document.body),targetEvent:a,locals:{video:null},clickOutsideToClose:!0,fullscreen:b.dialogUseFullScreen},m.loadVideo(d.id).then(function(a){a.data.entity?(i.path("/video/"+d.id,!1).search({}),b.dialog.locals.video=a.data.entity,e.show(b.dialog).finally(function(){b.context.keepContext=!0,i.path(f,!1).search(h)}).catch(angular.noop)):a.data.needAuth?(i.path("/login"),b.showToast(j("translate")("ERROR.FORBIDDEN"))):i.path("/")},function(a){m.cacheClear(),i.path("/"),"500"!=a.status&&"502"!=a.status||b.showToast(j("translate")("ERROR.SERVER"))}),b.$watch(function(){return g("sm")||g("xs")},function(a){b.dialogUseFullScreen=a===!0})},b.onTabSelected=function(a){"/search"==a?i.path(a):i.path(a).search({})},b.showToast=function(a){var b=f.simple().textContent(a).position("top center").hideDelay(3e3);f.show(b)},b.logout=function(){n.logout().then(function(){n.setUserInfo(),i.path("/")})},this.showLoginDialog=function(){var a=h.newPanelPosition().relativeTo(".log-in-button").addPanelPosition(h.xPosition.CENTER,h.yPosition.CENTER),b=h.newPanelAnimation().duration(50).openFrom(".log-in-button").closeTo(".log-in-button").withAnimation(h.animation.SCALE),c={id:"loginDialog",attachTo:angular.element(document.body),controller:"LoginFormController",controllerAs:"loginCtrl",templateUrl:"views/dialogLogin.html",clickOutsideToClose:!0,escapeToClose:!0,panelClass:"login-panel",position:a,animation:b};h.open(c)},this.logout=function(){var a=this;b.user&&(l.eventTrack("Logout"),b.user.origin===r.CAS?k.location.href="/be"+o+"logout":(this.isLoggingOut=!0,n.logout().then(function(){a.isLoggingOut=!1,b.user=null,n.setUserInfo(),k.location.href="/"})))},this.goToBackOffice=function(){k.location.href="/be"}}function e(a){return{restrict:"A",link:function(b,c,d){d.$observe("ngSrc",function(d){a.get(d).then(function(){}).catch(function(){c.attr("src","/themes/"+b.theme+"/images/placeholder.jpg")})})}}}a.controller("MainController",d),a.controller("DialogController",c),a.controller("ToastController",b),d.$inject=["$route","$scope","links","$mdDialog","$mdToast","$mdMedia","$mdPanel","$location","$filter","$window","$analytics","searchService","authenticationService","webServiceBasePath"],c.$inject=["$scope","$mdDialog","video","$mdMedia"],b.$inject=["$scope","$mdToast"],e.$inject=["$http"],a.directive("checkImage",e)}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c){function d(d){return!o[d]||o[d].needAuth?a.get(c+"videos/"+d).then(function(a){return o[d]=a.data.entity,a}):b.when({data:{entity:o[d]}})}function e(){return l&&Object.keys(l).length?b.when({data:l}):a.get(c+"filters").then(function(a){return l=a.data,a})}function f(){return m&&Object.keys(m).length?b.when({data:m}):a.get(c+"categories").then(function(a){return m=a.data,a})}function g(a){var c=this;return a?c.getCategories().then(function(b){return b.data[a]}):b.reject(new Error("Category id not defined"))}function h(){return n&&Object.keys(n).length?b.when({data:n}):a.get(c+"videos/promoted",{params:{auto:!0}}).then(function(a){return n=a.data,a})}function i(b,d,e){var f={};e&&(f.timeout=e);var g={filter:b,pagination:d};return a.post(c+"videos",g,f)}function j(){o={},l={},m={},n={}}function k(a){var b=Object.keys(a),c=angular.copy(a);return b.map(function(b){""!==c[b]&&c[b]!==!1&&"false"!==c[b]||delete a[b]}),a}var l,m,n,o={};return{cacheClear:j,loadVideo:d,getFilters:e,getCategories:f,getCategoryName:g,getPromotedVideos:h,search:i,cleanSearch:k}}a.factory("searchService",b),b.$inject=["$http","$q","webServiceBasePath"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c,d,e,f,g,h){function i(b){var c=angular.copy(b);c.dateStart&&(c.dateStart=new Date(Number(c.dateStart))),c.dateEnd&&(c.dateEnd=new Date(Number(c.dateEnd)));for(var d in c)for(var e=0;e<a.filters.length;e++)if(d===a.filters[e].id){"dateTime"===a.filters[e].type&&(c[d]=new Date(Number(c[d])));break}return c}function j(){a.isLoading=!0,l&&l.resolve(),l=c.defer();var b=angular.copy(a.search),d=angular.copy(a.pagination);for(var f in b)b[f]instanceof Date&&(b[f]=b[f].getTime());if(b.dateEnd){var g=new Date(b.dateEnd);g.setDate(g.getDate()+1),b.dateEnd=g.getTime()}b.sortBy=b.sortBy?"views":"date",b.sortOrder=b.sortOrder?"asc":"desc",e.search(b,d,l).then(function(b){if(b.data.error)return a.isLoading=!1,void a.showToast("error");a.videos=b.data.entities,a.pagination=b.data.pagination,a.isLoading=!1,k=!0;var c=a.search.query?a.search.query:"",d=a.search.categories?a.search.categories:"";h.trackSiteSearch(c,d,a.pagination.size)})}var k=!1,l=c.defer();a.videos=f.data.entities||[],a.filters=g.data||[],a.pagination=angular.extend(a.pagination?a.pagination:{},f.data.pagination),a.showAdvancedSearch=!1,a.isLoading=!1,a.search=i(b.search()),a.searchSubmit=function(){var c=angular.copy(a.search);a.showAdvancedSearch=!1,c=e.cleanSearch(c);for(var d in c)c[d]instanceof Date&&(c[d]=c[d].getTime());b.search(c)},a.resetSearch=function(){a.search=i({query:a.search.query})},a.orderOnChange=function(){a.searchSubmit()},a.$watch("pagination.pages",function(b,c){for(var d=[],e=1;e<=b;e++)d.push(e);a.pages=d}),a.$watch("pagination.page",function(b,c){a.pagination.page=b,k?j():k=!0}),a.$on("$routeUpdate",function(c,d){a.search=i(b.search()),a.context&&a.context.keepContext?a.context.keepContext=!1:(k=!1,a.pagination.page=0,j())})}a.controller("SearchController",b),b.$inject=["$scope","$location","$q","$filter","searchService","result","filters","$analytics"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c,d,e){var f=this,g=openVeoPortalSettings.authenticationStrategies;this.hasCas=openVeoPortalSettings.authenticationMechanisms.indexOf(g.CAS)>=0,this.hasExternal=this.hasCas,this.hasInternal=openVeoPortalSettings.authenticationMechanisms.indexOf(g.LDAP)>=0||openVeoPortalSettings.authenticationMechanisms.indexOf(g.LOCAL)>=0,this.hasError=!1,this.isLogging=!1,this.signIn=function(){this.login&&this.password&&(this.isLogging=!0,d.eventTrack("Login"),e.login(this.login,this.password).then(function(a){e.setUserInfo(a.data),f.isLogging=!1,f.hasError=!1,c.location.href="/"},function(){f.isLogging=!1,f.hasError=!0,f.login=f.password=""}))}}a.controller("LoginFormController",b),b.$inject=["$scope","$location","$window","$analytics","authenticationService"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(a,b,c){function d(d,e){if(!b.get(d)&&e)return a.post(c+"statistics/video/views/"+d).then(function(){var a=new Date,c=new Date(a.getTime()+e);b.put(d,!0,{expires:c})})}return{increaseVideoView:d}}a.factory("videoService",b),b.$inject=["$http","$cookies","webServiceBasePath"]}(angular.module("ov.portal"));;"use strict";!function(a){function b(){}a.controller("LiveController",b),b.$inject=[]}(angular.module("ov.portal"));