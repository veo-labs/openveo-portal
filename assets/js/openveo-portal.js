"use strict";!function(t){var e=t.module("ov.portal",["ngRoute","ngAnimate","ngMaterial","ngMessages","ngSanitize","ngCookies","angulartics","angulartics.piwik","ov.locale","ov.i18n","ov.configuration","ov.player","ov.authentication","ov.storage"]);e.constant("webServiceBasePath","/ws/"),e.run(["$route","$rootScope","$location",function(r,a,i){var l=i.path;i.path=function(e,t){var n,o;return!1===t&&(n=r.current,o=a.$on("$locationChangeSuccess",function(){r.current=n,o()})),l.apply(i,[e])}}]),e.config(["$mdDateLocaleProvider",function(e){var o=t.injector(["ng"]).get("$locale").id.slice(0,2);e.firstDayOfWeek=1,e.parseDate=function(e){e=e.split("/");return"fr"==o?new Date(e[2],e[1]-1,e[0]):new Date(e[2],e[0]-1,e[1])},e.formatDate=function(e){if(e){var t=new Date(e),n=t.getDate(),e=t.getMonth()+1,t=t.getFullYear();return"fr"==o?n+"/"+e+"/"+t:e+"/"+n+"/"+t}return""}}]),e.config(["$routeProvider","$locationProvider","$httpProvider",function(e,t,n){e.when("/video/:mediaId",{templateUrl:"views/videoPage.html",controller:"VideoPageController",title:"VIDEO.PAGE_TITLE",resolve:{video:["$q","searchService","$route",function(e,t,n){var o=e.defer(),n=n.current.params.mediaId;return n?t.loadVideo(n).then(function(e){e.data.entity?o.resolve.apply(o,arguments):e.data.needAuth?o.reject({redirect:"/login",needAuth:!0}):o.reject({redirect:"/"})},function(e){t.cacheClear(),o.reject({redirect:"/"})}):o.reject({redirect:"/"}),o.promise}]}}),e.when("/search",{templateUrl:"views/search.html",controller:"SearchController",title:"SEARCH.PAGE_TITLE",reloadOnSearch:!1,resolve:{filters:["searchService",function(e){return e.getFilters()}]}}),openVeoPortalSettings.live.activated&&e.when("/live-event",{templateUrl:"views/live.html",controller:"LiveController",title:"LIVE.PAGE_TITLE"}),e.when("/login",{templateUrl:"views/login.html",controller:"LoginFormController",controllerAs:"loginCtrl",title:"LOGIN.PAGE_TITLE"}),e.when("/",{templateUrl:"views/home.html",controller:"HomeController",title:"HOME.PAGE_TITLE",resolve:{promotedVideos:["searchService",function(e){return e.getPromotedVideos()}]}}).otherwise("/"),t.html5Mode(!0),n.interceptors.push("errorInterceptor")}])}(angular),function(){function e(e,o,r){return{responseError:function(e){var t,n;return n=o,(t=e).data&&t.data.error&&(t.data.error.code,t.data.error.module),403===t.status?n("translate")("ERROR.FORBIDDEN"):400===t.status?n("translate")("ERROR.CLIENT"):n("translate")("ERROR.SERVER"),r.reject(e)}}}angular.module("ov.portal").factory("errorInterceptor",e),e.$inject=["$rootScope","$filter","$q"]}(angular),function(){function e(e,t,n){n&&n.data?e.videos=n.data.filter(function(e){return e}):e.videos=[],e.search={},e.searchSubmit=function(){t.path("/search").search(e.search)}}angular.module("ov.portal").controller("HomeController",e),e.$inject=["$scope","$location","promotedVideos"]}(),function(){function e(o,n,e,r,a,t,i,l,s,c){var u=a.search();o.start=Number(u.t)||o.startTime||0,o.defaultMode="split_50_50",o.video.metadata&&(o.video.metadata.template||"").match(/^mix-/)&&(o.defaultMode="split_1"),o.video.category&&l.getCategoryName(o.video.category).then(function(e){o.categoryName=e}),o.dialIsOpen=!1,o.language=e.id,o.shareOpen=!1,o.shareItems=[{name:"UI.LINK",icon:"link",direction:"bottom",action:function(e){delete o.shareText;var t=80!=a.port()&&443!=a.port()?":"+a.port():"";o.shareLink=a.protocol()+"://"+a.host()+t+"/video/"+e.id,o.shareOpen=!o.shareOpen}},{name:"UI.CODE",icon:"code",direction:"bottom",action:function(e){delete o.shareLink;var t=80!=a.port()&&443!=a.port()?":"+a.port():"";o.shareText='<iframe width="768" height="500" src="'+a.protocol()+"://"+a.host()+t+"/video/"+e.id+'?iframe&hidedetail" frameborder="0"></iframe>',o.shareOpen=!o.shareOpen}}],o.showFullInfos=!1,o.toggleFullInfosLabel="UI.MORE",o.toggleFullInfos=function(){o.showFullInfos=!o.showFullInfos,o.toggleFullInfosLabel=o.showFullInfos?"UI.LESS":"UI.MORE"};var h,e=document.getElementById("openveo-player");angular.element(e).on("needPoiConversion",function(e,t){n.post(c+"videos/"+o.video.id+"/poi/convert",{duration:t}).then(function(e){o.video=e.data.entity})}),angular.element(e).on("durationChange",function(e,t){var n;n=function(){h=t},r(function(){var e=o.$root.$$phase;"$apply"===e||"$digest"===e?n():o.$apply(n)},1)}),angular.element(e).on("play",function(e){t.pageTrack(a.path()),t.eventTrack("play",{value:o.video.id}),i.increaseVideoView(o.video.id,h)}),angular.element(e).on("error",function(e,t){o.$emit("setAlert","danger",t&&t.message,8e3)}),o.$watch("vctl.dialIsOpen",function(e,t){!0===e&&(o.shareOpen=!1)}),o.trustedHTML=function(e){return s.trustAsHtml(e)}}angular.module("ov.portal").controller("VideoController",e),e.$inject=["$scope","$http","$locale","$timeout","$location","$analytics","videoService","searchService","$sce","webServiceBasePath"]}(),function(){function e(e,t){e.video=t.data.entity,e.playerType="youtube"==e.video.type?"youtube":"html"}angular.module("ov.portal").controller("VideoPageController",e),e.$inject=["$scope","video"]}(),function(e){function t(e,t){e.closeToast=function(){t.hide()}}function m(t,e,n,o,r){t.video=n,t.startTime=o,t.playerType="youtube"==n.type?"youtube":"html",t.dialogIsFull=r("sm")||r("xs"),t.hide=function(){e.hide()},t.cancel=function(){e.cancel()},t.$watch(function(){return r("sm")||r("xs")},function(e){t.dialogIsFull=!0===e})}function n(n,a,e,i,t,l,o,s,c,r,u,h,d,g){var p=this,f=s.search(),v=openVeoPortalSettings.authenticationStrategies;this.currentNavItem=null,this.isLoggingOut=!1,a.context={keepContext:!1},a.isIframe=f.iframe||!1,a.hideDetailVideo=f.hidedetail||!1,a.links=0===Object.keys(e).length&&JSON.stringify(e)===JSON.stringify({})?null:e,a.page={title:"",path:"",selectedTab:-1},a.user=openVeoPortalSettings.user||d.getUserInfo()||null,a.isAuth=!!openVeoPortalSettings.authenticationMechanisms.length,a.isAdmin=a.user&&a.user.id===openVeoPortalSettings.superAdminId,a.isLive=openVeoPortalSettings.live.activated,a.theme=openVeoPortalSettings.theme,a.useDialog=openVeoPortalSettings.useDialog,a.$on("$routeChangeStart",function(e,t){"/login"!==s.path()||!a.user&&a.isAuth||s.path("/")}),a.$on("$routeChangeSuccess",function(e,t){a.page.title=n.current&&n.current.title||a.title,a.page.path=s.path(),a.page.selectedTab=-1,"/"===a.page.path?p.currentNavItem="home":"/search"===a.page.path?p.currentNavItem="search":"/live"===a.page.path?p.currentNavItem="live":p.currentNavItem=null,u.pageTrack(a.page.path)}),a.$on("$routeChangeError",function(e,t,n,o){o&&o.redirect?(s.path(o.redirect),o.needAuth&&a.showToast(c("translate")("ERROR.FORBIDDEN"))):(s.path("/"),"500"!=o.status&&"502"!=o.status||a.showToast(c("translate")("ERROR.SERVER")))}),a.openVideo=function(e,t,n){var o,r;n&&s.search("t",n),a.useDialog?(a.context.keepContext=!1,o=s.path(),r=s.search(),a.dialogUseFullScreen=l("sm")||l("xs"),a.dialog={controller:m,templateUrl:"views/dialogVideo.html",parent:angular.element(document.body),targetEvent:e,locals:{video:null},clickOutsideToClose:!0,fullscreen:a.dialogUseFullScreen},h.loadVideo(t.id).then(function(e){e.data.entity?(s.path("/video/"+t.id,!1).search({}),a.dialog.locals.video=e.data.entity,a.dialog.locals.startTime=n,i.show(a.dialog).finally(function(){a.context.keepContext=!0,s.path(o,!1).search(r)}).catch(angular.noop)):e.data.needAuth?(s.path("/login"),a.showToast(c("translate")("ERROR.FORBIDDEN"))):s.path("/")},function(e){h.cacheClear(),s.path("/"),"500"!=e.status&&"502"!=e.status||a.showToast(c("translate")("ERROR.SERVER"))}),a.$watch(function(){return l("sm")||l("xs")},function(e){a.dialogUseFullScreen=!0===e})):s.path("/video/"+t.id,!0)},a.onTabSelected=function(e){"/search"==e?(s.search("t",null),s.path(e)):s.path(e).search({})},a.showToast=function(e){e=t.simple().textContent(e).position("top center").hideDelay(3e3);t.show(e)},a.logout=function(){d.logout().then(function(){d.setUserInfo(),s.path("/")})},this.showLoginDialog=function(){var e=o.newPanelPosition().relativeTo(".log-in-button").addPanelPosition(o.xPosition.CENTER,o.yPosition.CENTER),t=o.newPanelAnimation().duration(50).openFrom(".log-in-button").closeTo(".log-in-button").withAnimation(o.animation.SCALE),t={id:"loginDialog",attachTo:angular.element(document.body),controller:"LoginFormController",controllerAs:"loginCtrl",templateUrl:"views/dialogLogin.html",clickOutsideToClose:!0,escapeToClose:!0,panelClass:"login-panel",position:e,animation:t};o.open(t)},this.logout=function(){var e=this;a.user&&(u.eventTrack("Logout",{}),a.user.origin===v.CAS?r.location.href="/be"+g+"logout":(this.isLoggingOut=!0,d.logout().then(function(){e.isLoggingOut=!1,a.user=null,d.setUserInfo(),r.location.href="/"})))},this.goToBackOffice=function(){r.location.href="/be"}}function o(o){return{restrict:"A",link:function(t,n,e){e.$observe("ngSrc",function(e){o.get(e).then(function(){}).catch(function(){n.attr("src","/themes/"+t.theme+"/images/placeholder.jpg")})})}}}e.controller("MainController",n),e.controller("DialogController",m),e.controller("ToastController",t),n.$inject=["$route","$scope","links","$mdDialog","$mdToast","$mdMedia","$mdPanel","$location","$filter","$window","$analytics","searchService","authenticationService","webServiceBasePath"],m.$inject=["$scope","$mdDialog","video","startTime","$mdMedia"],t.$inject=["$scope","$mdToast"],o.$inject=["$http"],e.directive("checkImage",o)}(angular.module("ov.portal")),function(){function e(r,e,a){var t,n,o,i={};return{cacheClear:function(){i={},t={},n={},o={}},loadVideo:function(t){return!i[t]||i[t].needAuth?r.get(a+"videos/"+t).then(function(e){return i[t]=e.data.entity,e}):e.when({data:{entity:i[t]}})},getFilters:function(){return t&&Object.keys(t).length?e.when({data:t}):r.get(a+"filters").then(function(e){return t=e.data,e})},getCategories:function(){return n&&Object.keys(n).length?e.when({data:n}):r.get(a+"categories").then(function(e){return n=e.data,e})},getCategoryName:function(t){return t?this.getCategories().then(function(e){return e.data[t]}):e.reject(new Error("Category id not defined"))},getPromotedVideos:function(){return o&&Object.keys(o).length?e.when({data:o}):r.get(a+"videos/promoted",{params:{auto:!0}}).then(function(e){return o=e.data,e})},search:function(e,t,n){var o={};return n&&(o.timeout=n),r.post(a+"videos",{filter:e,pagination:t},o)}}}angular.module("ov.portal").factory("searchService",e),e.$inject=["$http","$q","webServiceBasePath"]}(),function(){function e(l,n,e,o,t,r,a,s){var c,y=this,i=!1,u=e.defer();function h(e){return e instanceof Date?e:new Date(Number(e))}function d(e,t){return"dateTime"===e.type?h(t):"boolean"===e.type?!!Number(t):t}function g(e){var t,n,o,r={};for(n in r.sortBy=e.sortBy?"views":"date",r.sortOrder=e.sortOrder?"asc":"desc",e.dateStart&&(r.dateStart=e.dateStart.getTime()),e.dateEnd&&((t=new Date(e.dateEnd)).setHours(0),t.setMinutes(0),t.setSeconds(0),t.setMilliseconds(0),t.setDate(t.getDate()+1),r.dateEnd=t.getTime()-1),e.query&&(r.query=e.query),r.searchInPois=Number(e.searchInPois),e)for(var a=0;a<l.filters.length;a++){var i=l.filters[a];i.id===n&&(r[n]=(o=i,i=e[n],"dateTime"===o.type?i&&i.getTime():"boolean"===o.type?Number(i):i))}return r}function p(e){return g(e)}function f(n){var o={};return n.dateStart&&(o.dateStart=h(n.dateStart)),n.dateEnd&&(o.dateEnd=h(n.dateEnd)),n.query&&(o.query=n.query),o.sortBy="views"===n.sortBy,o.sortOrder="asc"===n.sortOrder,l.filters.forEach(function(e){for(var t in n)t===e.id&&(o[t]=d(e,n[t]));void 0===o[e.id]&&e.default&&(o[e.id]=d(e,e.default))}),void 0===n.searchInPois?o.searchInPois=Boolean(openVeoPortalSettings.search.pois):o.searchInPois=Boolean(Number(n.searchInPois)),o}function w(e){return(e=he.decode(e)).replace(/(<\/?[^>]*>)|(\n)|(\r\n)|(\u00a0)/gi,function(e,t,n,o,r){return t?"":n||o||r?" ":void 0}).replace(/ +/gi," ").trim()}function v(e){c=s("gt-md");var i=l.search&&l.search.query;return e.forEach(function(e){var t,n,o,r=c?50:45,a=c?40:15;e.title&&i&&(t=y.emphasisQuery(e.title,i,90)),e.title&&!t&&(t=y.emphasisQuery(e.title,w(e.title).split(" ")[0],90,!0)),e.pois.length?e.pois.forEach(function(e){e.name=y.emphasisQuery(e.rawName,i,a),e.description=y.emphasisQuery(e.rawDescription,i,a)}):r=c?200:90,e.rawDescription&&i&&(o=y.emphasisQuery(e.rawDescription,i,r)),e.rawLeadParagraph&&!o&&(n=w(e.rawLeadParagraph).split(" ")[0],o=y.emphasisQuery(e.rawLeadParagraph,n,r,!0)),e.title=t,e.description=o}),e}l.videos=[],l.filters=r.data||[],l.pagination={size:0,page:0,pages:0,limit:12},l.showAdvancedSearch=!1,l.isLoading=!0,y.emphasisQuery=function(e,t,n,o,r,a){if(!e||!t)return null;var i=w(e),l=i.split(" ").length;a||0===a||(a=l);var s=0===(r=!r&&0!==r?l:r)?"(?: +)":"(?:(?:[^ ]* +){1,"+(r=Math.min(r,l))+"})",c=0===a?"(?: +)":"(?:(?: +[^ ]*){1,"+(a=Math.min(a,l))+"})",u=t.replace(/(\?|\||\/|\(|\)|\{|\}|\[|\]|\\)/gi,"\\$1"),h=new RegExp("("+s+"|^)([^ ]*)("+u+"s?)([^ ]*)("+c+"|$)","i"),d=i.match(h);if(!d)return null;var g=d[3],p=d[1],f=d[5],v=d[2],m=d[4],$=0<d.index?"...":"",l="";d.index+p.length+v.length+g.length+m.length+f.length<i.length&&(l="...");s=o?g:"<strong>"+g+"</strong>",u=$.length+p.trimStart().length+v.length+g.length+m.length+f.trimEnd().length+l.length,c=$+p.trimStart()+v+s+m+f.trimEnd()+l;if(n&&u<n){h=u,s=0<d.index?i.substring(0,d.index).trim():"",d=i.substring(d.index+p.length+v.length+g.length+m.length+f.length,i.length).trim(),i=s?s.split(" "):[],s=d?d.split(" "):[],d=p.trim()?p.trim().split(" "):[],p=f.trim()?f.trim().split(" "):[],f=!0;if(i.length&&(!s.length||d.length<=p.length)){if((h=(h=1===i.length?u-$.length:h)+i[i.length-1].length+1)<=n)return y.emphasisQuery(e,t,n,o,++r,a);f=!1}if(s.length&&(!f||!i.length||p.length<=d.length)&&(h=(h=1===s.length?u-l.length:h)+s[0].length+1)<=n)return y.emphasisQuery(e,t,n,o,r,++a)}return n&&n<u&&g.length+v.length+m.length+$.length+l.length<u&&(r||0<a)?y.emphasisQuery(e,t,n,o,--r,--a):c},y.formatVideos=function(e){function o(e){e.rawName=e.name,e.rawDescription=e.description;var t=y.emphasisQuery(e.name,n),e=y.emphasisQuery(e.description,n);return!(!t&&!e)}var r=[],n=l.search.query;return e.forEach(function(e){var t=(e.tags||[]).filter(o),n=(e.chapters||[]).filter(o),n=t.concat(n).sort(function(e,t){return e.value===t.value?0:e.value<t.value?-1:1});r.push({id:e.id,title:e.title,rawLeadParagraph:e.leadParagraph,rawDescription:e.description,thumbnail:e.thumbnail,date:e.date,views:e.views,pois:n})}),v(r)},l.fetch=function(){return l.isLoading=!0,u&&u.resolve(),u=e.defer(),t.search(p(l.search),l.pagination,u).then(function(e){if(e.data.error)return l.isLoading=!1,void l.showToast("error");l.videos=y.formatVideos(e.data.entities),l.pagination=e.data.pagination,l.isLoading=!1,i=!0;var t=l.search.query||"",e=l.search.categories||"";a.trackSiteSearch(t,e,l.pagination.size)})},l.searchSubmit=function(){l.showAdvancedSearch=!1,n.search(p(l.search))},l.resetSearch=function(){l.search=f({query:l.search.query})},l.$watch("pagination.pages",function(e,t){for(var n=[],o=1;o<=e;o++)n.push(o);l.pages=n}),l.$watch("pagination.page",function(e,t){l.pagination.page=e,i?l.fetch():i=!0}),l.$on("$routeUpdate",function(e,t){l.search=f(n.search()),l.context&&l.context.keepContext?l.context.keepContext=!1:(i=!1,l.pagination.page=0,l.fetch())}),window.addEventListener("resize",function(){var t;c!==s("gt-md")&&(c=s("gt-md"),t=function(){v(l.videos)},o(function(){var e=l.$root.$$phase;"$apply"===e||"$digest"===e?t():l.$apply(t)},1))}),l.search=f(n.search()),l.fetch()}angular.module("ov.portal").controller("SearchController",e),e.$inject=["$scope","$location","$q","$timeout","searchService","filters","$analytics","$mdMedia"]}(),function(){function e(e,t,n,o,r){var a=this,i=openVeoPortalSettings.authenticationStrategies;this.hasCas=0<=openVeoPortalSettings.authenticationMechanisms.indexOf(i.CAS),this.hasExternal=this.hasCas,this.hasInternal=0<=openVeoPortalSettings.authenticationMechanisms.indexOf(i.LDAP)||0<=openVeoPortalSettings.authenticationMechanisms.indexOf(i.LOCAL),this.hasError=!1,this.isLogging=!1,this.signIn=function(){this.login&&this.password&&(this.isLogging=!0,o.eventTrack("Login",{}),r.login(this.login,this.password).then(function(e){r.setUserInfo(e.data),a.isLogging=!1,a.hasError=!1,n.location.href="/"},function(){a.isLogging=!1,a.hasError=!0,a.login=a.password=""}))}}angular.module("ov.portal").controller("LoginFormController",e),e.$inject=["$scope","$location","$window","$analytics","authenticationService"]}(),function(){function e(e,o,r){return{increaseVideoView:function(t,n){if(!o.get(t)&&n)return e.post(r+"statistics/video/views/"+t).then(function(){var e=new Date,e=new Date(e.getTime()+n);o.put(t,!0,{expires:e})})}}}angular.module("ov.portal").factory("videoService",e),e.$inject=["$http","$cookies","webServiceBasePath"]}(),function(){function e(e,t,n){var o,r;e.live=openVeoPortalSettings.live,e.url=n.trustAsResourceUrl(e.live.url),"youtube"===e.live.playerType?(o=e.live.url.match(/v=(.*)$/),e.url=n.trustAsResourceUrl("https://www.youtube.com/embed/"+o[1])):"vimeo"===e.live.playerType?(o=e.live.url.match(/event\/(.*)$/),e.url=n.trustAsResourceUrl("https://vimeo.com/event/"+o[1]+"/embed")):"vodalys"===e.live.playerType?(o=e.live.url.match(/console\.vodalys\.studio\/(.*)$/),e.url=n.trustAsResourceUrl("https://console.vodalys.studio/"+o[1]+"#?embedded=true")):"wowza"===e.live.playerType&&(r=videojs("videojs-player",{autoplay:!1,controls:!0,sources:[{src:e.live.url+"?DVR",type:"application/x-mpegURL"}],html5:{nativeControlsForTouch:!1,nativeAudioTracks:!1,nativeVideoTracks:!1},liveui:!0,preload:"auto"})),e.$on("$destroy",function(){r&&r.dispose()})}angular.module("ov.portal").controller("LiveController",e),e.$inject=["$scope","$filter","$sce"]}(),angular,angular.module("ov.portal").filter("millisecondsToTime",function(){return function(e){var t=parseInt(e);if(!isNaN(t)){var n=Math.floor(t/36e5),o=Math.floor((t-3600*n*1e3)/6e4),e=Math.floor(t/1e3-60*(60*n+o)),t=function(e){return("0"+e).slice(-2)};return(n?t(n)+":":"")+t(o)+":"+t(e)}}});