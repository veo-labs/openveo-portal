"use strict";!function(t){var e=t.module("ov.portal",["ngRoute","ngAnimate","ngMaterial","ngMessages","ngSanitize","ngCookies","angulartics","angulartics.piwik","ov.locale","ov.i18n","ov.configuration","ov.player","ov.authentication","ov.storage"]);e.constant("webServiceBasePath","/ws/"),e.run(["$route","$rootScope","$location",function(n,i,l){var a=l.path;l.path=function(e,t){if(!1===t)var r=n.current,o=i.$on("$locationChangeSuccess",function(){n.current=r,o()});return a.apply(l,[e])}}]),e.config(["$mdDateLocaleProvider",function(e){var i=t.injector(["ng"]).get("$locale").id.slice(0,2);e.firstDayOfWeek=1,e.parseDate=function(e){var t=e.split("/");return"fr"==i?new Date(t[2],t[1]-1,t[0]):new Date(t[2],t[0]-1,t[1])},e.formatDate=function(e){if(e){var t=new Date(e),r=t.getDate(),o=t.getMonth()+1,n=t.getFullYear();return"fr"==i?r+"/"+o+"/"+n:o+"/"+r+"/"+n}return""}}]),e.config(["$routeProvider","$locationProvider","$httpProvider",function(e,t,r){e.when("/video/:mediaId",{templateUrl:"views/videoPage.html",controller:"VideoPageController",title:"VIDEO.PAGE_TITLE",resolve:{video:["$q","searchService","$route",function(e,t,r){var o=e.defer(),n=r.current.params.mediaId;return n?t.loadVideo(n).then(function(e){e.data.entity?o.resolve.apply(o,arguments):e.data.needAuth?o.reject({redirect:"/login",needAuth:!0}):o.reject({redirect:"/"})},function(e){t.cacheClear(),o.reject({redirect:"/"})}):o.reject({redirect:"/"}),o.promise}]}}),e.when("/search",{templateUrl:"views/search.html",controller:"SearchController",title:"SEARCH.PAGE_TITLE",reloadOnSearch:!1,resolve:{filters:["searchService",function(e){return e.getFilters()}]}}),openVeoPortalSettings.live&&e.when("/live-event",{templateUrl:"views/live.html",controller:"LiveController",title:"LIVE.PAGE_TITLE"}),e.when("/login",{templateUrl:"views/login.html",controller:"LoginFormController",controllerAs:"loginCtrl",title:"LOGIN.PAGE_TITLE"}),e.when("/",{templateUrl:"views/home.html",controller:"HomeController",title:"HOME.PAGE_TITLE",resolve:{promotedVideos:["searchService",function(e){return e.getPromotedVideos()}]}}).otherwise("/"),t.html5Mode(!0),r.interceptors.push("errorInterceptor")}])}(angular);;"use strict";!function(){function r(r,e,o){return{responseError:function(r){var t,a;return a=e,(t=r).data&&t.data.error&&(t.data.error.code,t.data.error.module),403===t.status?a("translate")("ERROR.FORBIDDEN"):400===t.status?a("translate")("ERROR.CLIENT"):a("translate")("ERROR.SERVER"),o.reject(r)}}}angular.module("ov.portal").factory("errorInterceptor",r),r.$inject=["$rootScope","$filter","$q"]}(angular);;"use strict";!function(){function o(o,e,t){t&&t.data?o.videos=t.data.filter(function(o){return o}):o.videos=[],o.search={},o.searchSubmit=function(){e.path("/search").search(o.search)}}angular.module("ov.portal").controller("HomeController",o),o.$inject=["$scope","$location","promotedVideos"]}();;"use strict";!function(){function e(n,o,e,a,i,t,r,l,s,c){var d=i.search();n.start=Number(d.t)||n.startTime||0,n.defaultMode="split_50_50",!n.video.metadata||(n.video.metadata.template||"").match(/^mix-/)&&(n.defaultMode="split_1");n.video.category&&l.getCategoryName(n.video.category).then(function(e){n.categoryName=e}),n.dialIsOpen=!1,n.language=e.id,n.shareOpen=!1,n.shareItems=[{name:"UI.LINK",icon:"link",direction:"bottom",action:function(e){delete n.shareText;var t=80!=i.port()&&443!=i.port()?":"+i.port():"";n.shareLink=i.protocol()+"://"+i.host()+t+"/video/"+e.id,n.shareOpen=!n.shareOpen}},{name:"UI.CODE",icon:"code",direction:"bottom",action:function(e){delete n.shareLink;var t=80!=i.port()&&443!=i.port()?":"+i.port():"";n.shareText='<iframe width="768" height="500" src="'+i.protocol()+"://"+i.host()+t+"/video/"+e.id+'?iframe&hidedetail" frameborder="0"></iframe>',n.shareOpen=!n.shareOpen}}],n.showFullInfos=!1,n.toggleFullInfosLabel="UI.MORE",n.toggleFullInfos=function(){n.showFullInfos=!n.showFullInfos,n.toggleFullInfosLabel=n.showFullInfos?"UI.LESS":"UI.MORE"};var u,p=document.getElementById("openveo-player");angular.element(p).on("needPoiConversion",function(e,t){o.post(c+"videos/"+n.video.id+"/poi/convert",{duration:t}).then(function(e){n.video=e.data.entity})}),angular.element(p).on("durationChange",function(e,t){var o;o=function(){u=t},a(function(){var e=n.$root.$$phase;"$apply"===e||"$digest"===e?o():n.$apply(o)},1)}),angular.element(p).on("play",function(e){t.pageTrack(i.path()),t.eventTrack("play",{value:n.video.id}),r.increaseVideoView(n.video.id,u)}),angular.element(p).on("error",function(e,t){n.$emit("setAlert","danger",t&&t.message,8e3)}),n.$watch("vctl.dialIsOpen",function(e,t){!0===e&&(n.shareOpen=!1)}),n.trustedHTML=function(e){return s.trustAsHtml(e)}}angular.module("ov.portal").controller("VideoController",e),e.$inject=["$scope","$http","$locale","$timeout","$location","$analytics","videoService","searchService","$sce","webServiceBasePath"]}();;"use strict";!function(){function e(e,o){e.video=o.data.entity,e.playerType="youtube"==e.video.type?"youtube":"html"}angular.module("ov.portal").controller("VideoPageController",e),e.$inject=["$scope","video"]}();;"use strict";!function(t){function e(t,e){t.closeToast=function(){e.hide()}}function v(e,t,o,n,i){e.video=o,e.startTime=n,e.playerType="youtube"==o.type?"youtube":"html",e.dialogIsFull=i("sm")||i("xs"),e.hide=function(){t.hide()},e.cancel=function(){t.cancel()},e.$watch(function(){return i("sm")||i("xs")},function(t){e.dialogIsFull=!0===t})}function o(o,a,t,l,n,s,i,r,c,e,u,h,g,d){var p=this,m=r.search(),f=openVeoPortalSettings.authenticationStrategies;this.currentNavItem=null,this.isLoggingOut=!1,a.context={keepContext:!1},a.isIframe=m.iframe||!1,a.hideDetailVideo=m.hidedetail||!1,a.links=0===Object.keys(t).length&&JSON.stringify(t)===JSON.stringify({})?null:t,a.page={title:"",path:"",selectedTab:-1},a.user=openVeoPortalSettings.user||g.getUserInfo()||null,a.isAuth=!!openVeoPortalSettings.authenticationMechanisms.length,a.isAdmin=a.user&&a.user.id===openVeoPortalSettings.superAdminId,a.isLive=openVeoPortalSettings.live,a.theme=openVeoPortalSettings.theme,a.useDialog=openVeoPortalSettings.useDialog,a.$on("$routeChangeStart",function(t,e){"/login"!==r.path()||!a.user&&a.isAuth||r.path("/")}),a.$on("$routeChangeSuccess",function(t,e){a.page.title=o.current&&o.current.title||a.title,a.page.path=r.path(),a.page.selectedTab=-1,"/"===a.page.path?p.currentNavItem="home":"/search"===a.page.path?p.currentNavItem="search":"/live"===a.page.path?p.currentNavItem="live":p.currentNavItem=null,u.pageTrack(a.page.path)}),a.$on("$routeChangeError",function(t,e,o,n){n&&n.redirect?(r.path(n.redirect),n.needAuth&&a.showToast(c("translate")("ERROR.FORBIDDEN"))):(r.path("/"),"500"!=n.status&&"502"!=n.status||a.showToast(c("translate")("ERROR.SERVER")))}),a.openVideo=function(t,e,o){if(o&&r.search("t",o),a.useDialog){a.context.keepContext=!1;var n=r.path(),i=r.search();a.dialogUseFullScreen=s("sm")||s("xs"),a.dialog={controller:v,templateUrl:"views/dialogVideo.html",parent:angular.element(document.body),targetEvent:t,locals:{video:null},clickOutsideToClose:!0,fullscreen:a.dialogUseFullScreen},h.loadVideo(e.id).then(function(t){t.data.entity?(r.path("/video/"+e.id,!1).search({}),a.dialog.locals.video=t.data.entity,a.dialog.locals.startTime=o,l.show(a.dialog).finally(function(){a.context.keepContext=!0,r.path(n,!1).search(i)}).catch(angular.noop)):t.data.needAuth?(r.path("/login"),a.showToast(c("translate")("ERROR.FORBIDDEN"))):r.path("/")},function(t){h.cacheClear(),r.path("/"),"500"!=t.status&&"502"!=t.status||a.showToast(c("translate")("ERROR.SERVER"))}),a.$watch(function(){return s("sm")||s("xs")},function(t){a.dialogUseFullScreen=!0===t})}else r.path("/video/"+e.id,!0)},a.onTabSelected=function(t){"/search"==t?(r.search("t",null),r.path(t)):r.path(t).search({})},a.showToast=function(t){var e=n.simple().textContent(t).position("top center").hideDelay(3e3);n.show(e)},a.logout=function(){g.logout().then(function(){g.setUserInfo(),r.path("/")})},this.showLoginDialog=function(){var t=i.newPanelPosition().relativeTo(".log-in-button").addPanelPosition(i.xPosition.CENTER,i.yPosition.CENTER),e=i.newPanelAnimation().duration(50).openFrom(".log-in-button").closeTo(".log-in-button").withAnimation(i.animation.SCALE),o={id:"loginDialog",attachTo:angular.element(document.body),controller:"LoginFormController",controllerAs:"loginCtrl",templateUrl:"views/dialogLogin.html",clickOutsideToClose:!0,escapeToClose:!0,panelClass:"login-panel",position:t,animation:e};i.open(o)},this.logout=function(){var t=this;a.user&&(u.eventTrack("Logout",{}),a.user.origin===f.CAS?e.location.href="/be"+d+"logout":(this.isLoggingOut=!0,g.logout().then(function(){t.isLoggingOut=!1,a.user=null,g.setUserInfo(),e.location.href="/"})))},this.goToBackOffice=function(){e.location.href="/be"}}function n(n){return{restrict:"A",link:function(e,o,t){t.$observe("ngSrc",function(t){n.get(t).then(function(){}).catch(function(){o.attr("src","/themes/"+e.theme+"/images/placeholder.jpg")})})}}}t.controller("MainController",o),t.controller("DialogController",v),t.controller("ToastController",e),o.$inject=["$route","$scope","links","$mdDialog","$mdToast","$mdMedia","$mdPanel","$location","$filter","$window","$analytics","searchService","authenticationService","webServiceBasePath"],v.$inject=["$scope","$mdDialog","video","startTime","$mdMedia"],e.$inject=["$scope","$mdToast"],n.$inject=["$http"],t.directive("checkImage",n)}(angular.module("ov.portal"));;"use strict";!function(){function t(o,t,i){var e,n,r,a={};return{cacheClear:function(){a={},e={},n={},r={}},loadVideo:function(e){return!a[e]||a[e].needAuth?o.get(i+"videos/"+e).then(function(t){return a[e]=t.data.entity,t}):t.when({data:{entity:a[e]}})},getFilters:function(){return e&&Object.keys(e).length?t.when({data:e}):o.get(i+"filters").then(function(t){return e=t.data,t})},getCategories:function(){return n&&Object.keys(n).length?t.when({data:n}):o.get(i+"categories").then(function(t){return n=t.data,t})},getCategoryName:function(e){return e?this.getCategories().then(function(t){return t.data[e]}):t.reject(new Error("Category id not defined"))},getPromotedVideos:function(){return r&&Object.keys(r).length?t.when({data:r}):o.get(i+"videos/promoted",{params:{auto:!0}}).then(function(t){return r=t.data,t})},search:function(t,e,n){var r={};n&&(r.timeout=n);var a={filter:t,pagination:e};return o.post(i+"videos",a,r)}}}angular.module("ov.portal").factory("searchService",t),t.$inject=["$http","$q","webServiceBasePath"]}();;"use strict";!function(){function e(h,r,e,a,t,n,i,o){var c,B=this,s=!1,l=e.defer();function u(e){return e instanceof Date?e:new Date(Number(e))}function d(e,t){return"dateTime"===e.type?u(t):"boolean"===e.type?!!Number(t):t}function g(e){return function(e){var t,r,a={};if(a.sortBy=e.sortBy?"views":"date",a.sortOrder=e.sortOrder?"asc":"desc",e.dateStart&&(a.dateStart=e.dateStart.getTime()),e.dateEnd){var n=new Date(e.dateEnd);n.setDate(n.getDate()+1),a.dateEnd=n.getTime()}for(var i in e.query&&(a.query=e.query),a.searchInPois=Number(e.searchInPois),e)for(var s=0;s<h.filters.length;s++){var o=h.filters[s];o.id===i&&(a[i]=(t=o,r=e[i],"dateTime"===t.type?r&&r.getTime():"boolean"===t.type?Number(r):r))}return a}(e)}function p(r){var a={};return r.dateStart&&(a.dateStart=u(r.dateStart)),r.dateEnd&&(a.dateEnd=u(r.dateEnd)),r.query&&(a.query=r.query),a.sortBy="views"===r.sortBy,a.sortOrder="asc"===r.sortOrder,h.filters.forEach(function(e){for(var t in r)t===e.id&&(a[t]=d(e,r[t]));void 0===a[e.id]&&e.default&&(a[e.id]=d(e,e.default))}),void 0===r.searchInPois?a.searchInPois=Boolean(openVeoPortalSettings.search.pois):a.searchInPois=Boolean(Number(r.searchInPois)),a}function I(e){return(e=he.decode(e)).replace(/(<\/?[^>]*>)|(\n)|(\r\n)|(\u00a0)/gi,function(e,t,r,a,n){return t?"":r||a||n?" ":void 0}).replace(/ +/gi," ").trim()}function f(e){c=o("gt-md");var s=h.search&&h.search.query;return e.forEach(function(e){var t,r,a=c?50:45,n=c?40:15;if(e.title&&s&&(t=B.emphasisQuery(e.title,s,90)),e.title&&!t&&(t=B.emphasisQuery(e.title,I(e.title).split(" ")[0],90,!0)),e.pois.length?e.pois.forEach(function(e){e.name=B.emphasisQuery(e.rawName,s,n),e.description=B.emphasisQuery(e.rawDescription,s,n)}):a=c?200:90,e.rawDescription&&s&&(r=B.emphasisQuery(e.rawDescription,s,a)),e.rawLeadParagraph&&!r){var i=I(e.rawLeadParagraph).split(" ")[0];r=B.emphasisQuery(e.rawLeadParagraph,i,a,!0)}e.title=t,e.description=r}),e}h.videos=[],h.filters=n.data||[],h.pagination={size:0,page:0,pages:0,limit:12},h.showAdvancedSearch=!1,h.isLoading=!0,B.emphasisQuery=function(e,t,r,a,n,i){if(!e||!t)return null;var s,o,h=I(e),c=h.split(" ").length;n||0===n||(n=c),i||0===i||(i=c),s=0===n?"(?: +)":"(?:(?:[^ ]* +){1,"+(n=Math.min(n,c))+"})",o=0===i?"(?: +)":"(?:(?: +[^ ]*){1,"+(i=Math.min(i,c))+"})";var l=t.replace(/(\?|\||\/|\(|\)|\{|\}|\[|\]|\\)/gi,"\\$1"),u=new RegExp("("+s+"|^)([^ ]*)("+l+"s?)([^ ]*)("+o+"|$)","i"),d=h.match(u);if(!d)return null;var g=d[3],p=d[1],f=d[5],m=d[2],v=d[4],y=0<d.index?"...":"",w="";d.index+p.length+m.length+g.length+v.length+f.length<h.length&&(w="...");var $=a?g:"<strong>"+g+"</strong>",S=y.length+p.trimStart().length+m.length+g.length+v.length+f.trimEnd().length+w.length,E=y+p.trimStart()+m+$+v+f.trimEnd()+w;if(r&&S<r){var q=S,b=0<d.index?h.substring(0,d.index).trim():"",P=h.substring(d.index+p.length+m.length+g.length+v.length+f.length,h.length).trim(),Q=b?b.split(" "):[],x=P?P.split(" "):[],D=p.trim()?p.trim().split(" "):[],L=f.trim()?f.trim().split(" "):[],N=!0;if(Q.length&&(!x.length||D.length<=L.length)){if(1===Q.length&&(q=S-y.length),(q=q+Q[Q.length-1].length+1)<=r)return B.emphasisQuery(e,t,r,a,++n,i);N=!1}if(x.length&&(!N||!Q.length||L.length<=D.length)&&(1===x.length&&(q=S-w.length),(q=q+x[0].length+1)<=r))return B.emphasisQuery(e,t,r,a,n,++i)}return r&&r<S&&g.length+m.length+v.length+y.length+w.length<S&&(n||0<i)?B.emphasisQuery(e,t,r,a,--n,--i):E},B.formatVideos=function(e){function n(e){e.rawName=e.name,e.rawDescription=e.description;var t=B.emphasisQuery(e.name,a),r=B.emphasisQuery(e.description,a);return!(!t&&!r)}var i=[],a=h.search.query;return e.forEach(function(e){var t=(e.tags||[]).filter(n),r=(e.chapters||[]).filter(n),a=t.concat(r).sort(function(e,t){return e.value===t.value?0:e.value<t.value?-1:1});i.push({id:e.id,title:e.title,rawLeadParagraph:e.leadParagraph,rawDescription:e.description,thumbnail:e.thumbnail,date:e.date,views:e.views,pois:a})}),f(i)},h.fetch=function(){return h.isLoading=!0,l&&l.resolve(),l=e.defer(),t.search(g(h.search),h.pagination,l).then(function(e){if(e.data.error)return h.isLoading=!1,void h.showToast("error");h.videos=B.formatVideos(e.data.entities),h.pagination=e.data.pagination,h.isLoading=!1,s=!0;var t=h.search.query?h.search.query:"",r=h.search.categories?h.search.categories:"";i.trackSiteSearch(t,r,h.pagination.size)})},h.searchSubmit=function(){h.showAdvancedSearch=!1,r.search(g(h.search))},h.resetSearch=function(){h.search=p({query:h.search.query})},h.$watch("pagination.pages",function(e,t){for(var r=[],a=1;a<=e;a++)r.push(a);h.pages=r}),h.$watch("pagination.page",function(e,t){h.pagination.page=e,s?h.fetch():s=!0}),h.$on("$routeUpdate",function(e,t){h.search=p(r.search()),h.context&&h.context.keepContext?h.context.keepContext=!1:(s=!1,h.pagination.page=0,h.fetch())}),window.addEventListener("resize",function(){var t;c!==o("gt-md")&&(c=o("gt-md"),t=function(){f(h.videos)},a(function(){var e=h.$root.$$phase;"$apply"===e||"$digest"===e?t():h.$apply(t)},1))}),h.search=p(r.search()),h.fetch()}angular.module("ov.portal").controller("SearchController",e),e.$inject=["$scope","$location","$q","$timeout","searchService","filters","$analytics","$mdMedia"]}();;"use strict";!function(){function t(t,i,n,o,s){var a=this,e=openVeoPortalSettings.authenticationStrategies;this.hasCas=0<=openVeoPortalSettings.authenticationMechanisms.indexOf(e.CAS),this.hasExternal=this.hasCas,this.hasInternal=0<=openVeoPortalSettings.authenticationMechanisms.indexOf(e.LDAP)||0<=openVeoPortalSettings.authenticationMechanisms.indexOf(e.LOCAL),this.hasError=!1,this.isLogging=!1,this.signIn=function(){this.login&&this.password&&(this.isLogging=!0,o.eventTrack("Login",{}),s.login(this.login,this.password).then(function(t){s.setUserInfo(t.data),a.isLogging=!1,a.hasError=!1,n.location.href="/"},function(){a.isLogging=!1,a.hasError=!0,a.login=a.password=""}))}}angular.module("ov.portal").controller("LoginFormController",t),t.$inject=["$scope","$location","$window","$analytics","authenticationService"]}();;"use strict";!function(){function e(e,o,t){return{increaseVideoView:function(i,n){if(!o.get(i)&&n)return e.post(t+"statistics/video/views/"+i).then(function(){var e=new Date,t=new Date(e.getTime()+n);o.put(i,!0,{expires:t})})}}}angular.module("ov.portal").factory("videoService",e),e.$inject=["$http","$cookies","webServiceBasePath"]}();;"use strict";!function(){function o(){}angular.module("ov.portal").controller("LiveController",o),o.$inject=[]}();;"use strict";angular,angular.module("ov.portal").filter("millisecondsToTime",function(){return function(r){var e=parseInt(r);if(!isNaN(e)){var o=Math.floor(e/36e5),t=Math.floor((e-3600*o*1e3)/6e4),n=Math.floor(e/1e3-60*(60*o+t)),a=function(r){return("0"+r).slice(-2)};return(o?a(o)+":":"")+a(t)+":"+a(n)}}});