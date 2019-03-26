angular.module('opa').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('opa-about.html',
    "<div class=\"opa-about\" layout=\"row\"><div layout=\"column\" ng-show=\"$ctrl.isLoaded\"><header layout=\"row\" layout-align=\"none center\"><h1 ng-bind=\"'DASHBOARD.ABOUT.TITLE' | opaTranslate\" flex=\"auto\"></h1><md-icon ng-if=\"$ctrl.information.version && !$ctrl.information.updateAvailable\" aria-label=\"{{'DASHBOARD.ABOUT.UP_TO_DATE' | opaTranslate}}\" class=\"opa-up-to-date\">check_circle<md-tooltip>{{'DASHBOARD.ABOUT.UP_TO_DATE' | opaTranslate}}</md-tooltip></md-icon><md-icon ng-if=\"$ctrl.information.version && $ctrl.information.updateAvailable\" aria-label=\"{{'DASHBOARD.ABOUT.NEED_UPGRADE' | opaTranslate}}\" md-colors=\"::{color: 'warn-A400'}\">new_releases</md-icon><opa-info-button opa-message=\"'DASHBOARD.ABOUT.INFO' | opaTranslate\" opa-accessibility=\"{{'DASHBOARD.ABOUT.INFO_BUTTON_DESCRIPTION' | opaTranslate}}\" opa-help=\"{{'DASHBOARD.ABOUT.INFO_BUTTON_TOOLTIP' | opaTranslate}}\"></opa-info-button></header><section flex=\"auto\"><p ng-bind-html=\"$ctrl.message\" ng-if=\"$ctrl.message\"></p><p ng-bind=\"'DASHBOARD.ABOUT.ERROR' | opaTranslate\" ng-if=\"!$ctrl.message\"></p></section><footer><md-button ng-if=\"$ctrl.information.version\" ng-href=\"{{$ctrl.information.versionSourcesUrl}}\" ng-bind=\"'DASHBOARD.ABOUT.VIEW_SOURCE' | opaTranslate\" aria-label=\"{{'DASHBOARD.ABOUT.VIEW_SOURCE' | opaTranslate}}\" target=\"_blank\" class=\"md-primary\"></md-button></footer></div><div layout=\"row\" layout-align=\"center center\" ng-show=\"!$ctrl.isLoaded\" flex=\"auto\" class=\"opa-loader\"><md-progress-circular md-mode=\"indeterminate\" md-diameter=\"30px\"></md-progress-circular></div></div>"
  );


  $templateCache.put('opa-dashboard.html',
    "<div class=\"opa-dashboard\" flex layout=\"row\"><div flex layout=\"column\" layout-padding><div><md-grid-list md-cols-xs=\"1\" md-cols-sm=\"2\" md-cols-md=\"2\" md-cols-gt-md=\"3\" md-cols-gt-lg=\"4\" md-gutter=\"16px\" md-row-height=\"4:3\" md-row-height-md=\"4:3\" md-row-height-gt-md=\"4:3\"><md-grid-tile class=\"md-whiteframe-2dp\"><opa-about></opa-about></md-grid-tile></md-grid-list></div></div></div>"
  );


  $templateCache.put('opa-promotedVideos.html',
    "<script type=\"text/ng-template\" id=\"opa-promotedVideos-button.html\"><md-button\n" +
    "             ng-click=\"$ctrl.save()\"\n" +
    "             ng-disabled=\"$ctrl.isSaving\"\n" +
    "             aria-label=\"{{'PROMOTED_VIDEOS.SUBMIT_BUTTON' | opaTranslate}}\"\n" +
    "             class=\"opa-submit md-raised md-primary md-whiteframe-1dp opa-submit-button\"\n" +
    "   >\n" +
    "    <span ng-bind=\"'PROMOTED_VIDEOS.SUBMIT_BUTTON' | opaTranslate\" ng-if=\"!$ctrl.isSaving\"></span>\n" +
    "    <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"20\" ng-if=\"$ctrl.isSaving\"></md-progress-circular>\n" +
    "  </md-button></script><script type=\"text/ng-template\" id=\"opa-promotedVideos-containers-2And4Cols.html\"><div flex=\"noshrink\" layout=\"row\" layout-wrap>\n" +
    "    <opa-media-container class=\"big\" opa-title=\"{{ $ctrl.containers[0].title }}\" opa-media=\"$ctrl.containers[0].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(0)\" opa-remove=\"$ctrl.clearContainer(0)\"></opa-media-container>\n" +
    "    <div layout=\"column\">\n" +
    "      <div layout=\"row\">\n" +
    "        <opa-media-container opa-title=\"{{ $ctrl.containers[1].title }}\" opa-media=\"$ctrl.containers[1].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(1)\" opa-remove=\"$ctrl.clearContainer(1)\"></opa-media-container>\n" +
    "        <opa-media-container opa-title=\"{{ $ctrl.containers[2].title }}\" opa-media=\"$ctrl.containers[2].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(2)\" opa-remove=\"$ctrl.clearContainer(2)\"></opa-media-container>\n" +
    "      </div>\n" +
    "      <div layout=\"row\">\n" +
    "        <opa-media-container opa-title=\"{{ $ctrl.containers[3].title }}\" opa-media=\"$ctrl.containers[3].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(3)\" opa-remove=\"$ctrl.clearContainer(3)\"></opa-media-container>\n" +
    "        <opa-media-container opa-title=\"{{ $ctrl.containers[4].title }}\" opa-media=\"$ctrl.containers[4].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(4)\" opa-remove=\"$ctrl.clearContainer(4)\"></opa-media-container>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div flex=\"noshrink\" layout=\"row\" layout-wrap>\n" +
    "    <opa-media-container ng-repeat=\"(i, container) in $ctrl.containers\" ng-if=\"i > 4\" opa-title=\"{{ container.title }}\" opa-media=\"container.media\" opa-edit=\"$ctrl.openMediaLibraryDialog(i)\" opa-remove=\"$ctrl.clearContainer(i)\"></opa-media-container>\n" +
    "  </div>\n" +
    "  <div layout=\"row\" ng-include=\"'opa-promotedVideos-button.html'\"></div></script><script type=\"text/ng-template\" id=\"opa-promotedVideos-containers-3Cols.html\"><div flex=\"noshrink\" layout=\"row\" layout-wrap>\n" +
    "    <opa-media-container class=\"big\" opa-title=\"{{ $ctrl.containers[0].title }}\" opa-media=\"$ctrl.containers[0].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(0)\" opa-remove=\"$ctrl.clearContainer(0)\"></opa-media-container>\n" +
    "    <div layout=\"column\">\n" +
    "      <opa-media-container opa-title=\"{{ $ctrl.containers[1].title }}\" opa-media=\"$ctrl.containers[1].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(1)\" opa-remove=\"$ctrl.clearContainer(1)\"></opa-media-container>\n" +
    "      <opa-media-container opa-title=\"{{ $ctrl.containers[2].title }}\" opa-media=\"$ctrl.containers[2].media\" opa-edit=\"$ctrl.openMediaLibraryDialog(2)\" opa-remove=\"$ctrl.clearContainer(2)\"></opa-media-container>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div flex=\"noshrink\" layout=\"row\" layout-wrap>\n" +
    "    <opa-media-container ng-repeat=\"(i, container) in $ctrl.containers\"ng-if=\"i > 2\" opa-title=\"{{ container.title }}\" opa-media=\"container.media\" opa-edit=\"$ctrl.openMediaLibraryDialog(i)\" opa-remove=\"$ctrl.clearContainer(i)\"></opa-media-container>\n" +
    "  </div>\n" +
    "  <div layout=\"row\" ng-include=\"'opa-promotedVideos-button.html'\"></div></script><div layout=\"row\" flex class=\"opa-promoted-videos\" ng-class=\"{'opa-error' : $ctrl.isError}\"><div layout=\"column\" flex class=\"opa-form\" ng-if=\"!$ctrl.isError\"><div class=\"opa-containers\" ng-class=\"$ctrl.containersClass\" layout=\"column\" ng-include=\"$ctrl.getContainersTemplate()\"></div></div><div layout=\"column\" layout-align=\"center center\" flex=\"auto\" class=\"opa-error-message\" ng-if=\"$ctrl.isError\"><md-icon>view_quilt</md-icon><span ng-bind=\"'PROMOTED_VIDEOS.ERROR_MESSAGE' | opaTranslate\"></span></div></div>"
  );


  $templateCache.put('opa-liveSettings.html',
    "<div class=\"opa-live-settings\" layout=\"column\" flex><form name=\"opaLiveSettings\"><div layout=\"row\" layout-align=\"start center\" flex=\"none\"><h2 class=\"md-title\" ng-bind=\"'SETTINGS.LIVE.TITLE' | opaTranslate\"></h2><opa-info-button opa-message=\"'SETTINGS.LIVE.INFO' | opaTranslate\" opa-accessibility=\"{{'SETTINGS.LIVE.INFO_BUTTON_DESCRIPTION' | opaTranslate}}\" opa-help=\"{{'SETTINGS.LIVE.INFO_BUTTON_TOOLTIP' | opaTranslate}}\"></opa-info-button></div><md-switch ng-model=\"$ctrl.settings.activated\" ng-change=\"$ctrl.callUpdate(); $ctrl.updateLiveSwitchMessage($ctrl.settings.activated)\" aria-label=\"{{'SETTINGS.LIVE.ACTIVATED_DESCRIPTION' | opaTranslate}}\" class=\"md-primary\" flex=\"none\">{{$ctrl.liveSwitchMessage | opaTranslate}}</md-switch><div layout=\"column\" flex=\"none\" ng-show=\"$ctrl.settings.activated\" class=\"opa-live-sub-settings\"><md-input-container flex=\"none\" class=\"opa-live-player\"><label ng-bind=\"'SETTINGS.LIVE.PLAYER_TYPE_LABEL' | opaTranslate\"></label><md-select ng-model=\"$ctrl.settings.playerType\" ng-change=\"$ctrl.callUpdate(); $ctrl.updateUrlErrorMessage($ctrl.settings.playerType); $ctrl.settings.url = null;\" ng-required=\"true\"><md-option ng-repeat=\"playerType in $ctrl.availablePlayers\" ng-bind=\"playerType.name | opaTranslate\" ng-value=\"playerType.id\"></md-option></md-select></md-input-container><md-input-container flex=\"none\" class=\"opa-live-url\"><label ng-bind=\"'SETTINGS.LIVE.URL_LABEL' | opaTranslate\"></label><input ng-model=\"$ctrl.settings.url\" ng-change=\"$ctrl.callUpdate();\" ng-required=\"$ctrl.settings.activated\" opa-stream-url-validator=\"$ctrl.settings.activated\" opa-type=\"$ctrl.settings.playerType\" name=\"liveUrl\"><div ng-messages=\"opaLiveSettings.liveUrl.$error\"><div ng-message=\"required\" ng-bind=\"'SETTINGS.LIVE.URL_EMPTY_ERROR' | opaTranslate\"></div><div ng-message=\"opaStreamUrl\" ng-bind=\"$ctrl.urlErrorMessage | opaTranslate\"></div></div></md-input-container><div layout=\"column\" flex=\"none\" ng-show=\"$ctrl.settings.playerType === 'wowza'\" class=\"opa-live-wowza-settings\"><md-input-container flex=\"none\" class=\"opa-live-wowza-license\"><label ng-bind=\"'SETTINGS.LIVE.PLAYER_LICENSE_LABEL' | opaTranslate\"></label><input ng-model=\"$ctrl.settings.wowza.playerLicenseKey\" ng-change=\"$ctrl.callUpdate();\" ng-required=\"$ctrl.settings.activated && $ctrl.settings.playerType === 'wowza'\" opa-license-key-validator=\"$ctrl.settings.activated && $ctrl.settings.playerType === 'wowza'\" name=\"wowzaPlayerLicenseKey\"><div ng-messages=\"opaLiveSettings.wowzaPlayerLicenseKey.$error\"><div ng-message=\"required\" ng-bind=\"'SETTINGS.LIVE.PLAYER_LICENSE_EMPTY_ERROR' | opaTranslate\"></div><div ng-message=\"opaLicenseKey\" ng-bind=\"'SETTINGS.LIVE.PLAYER_LICENSE_ERROR' | opaTranslate\"></div></div></md-input-container></div><md-checkbox ng-model=\"$ctrl.settings.private\" ng-change=\"$ctrl.callUpdate();\" aria-label=\"{{'SETTINGS.LIVE.PRIVATE_DESCRIPTION' | opaTranslate}}\" class=\"md-primary\" flex=\"none\"><span ng-bind=\"'SETTINGS.LIVE.PRIVATE_LABEL' | opaTranslate\"></span></md-checkbox><div layout=\"column\" flex=\"none\" ng-show=\"$ctrl.settings.private\" class=\"opa-live-private-settings\"><md-input-container flex=\"none\" class=\"opa-live-groups\"><label ng-bind=\"'SETTINGS.LIVE.GROUPS_LABEL' | opaTranslate\"></label><opa-tags name=\"liveGroups\" ng-model=\"$ctrl.settings.groups\" ng-change=\"$ctrl.callUpdate();\" opa-available-tags=\"$ctrl.opaGroups\" ng-required=\"$ctrl.settings.activated && $ctrl.settings.private\"></opa-tags><div ng-messages=\"opaLiveSettings.liveGroups.$error\"><div ng-message=\"required\" ng-bind=\"'SETTINGS.LIVE.GROUPS_EMPTY_ERROR' | opaTranslate\"></div></div></md-input-container></div></div></form></div>"
  );


  $templateCache.put('opa-settings.html',
    "<div layout=\"row\" flex class=\"opa-settings\" ng-class=\"{'opa-error' : $ctrl.isError}\"><div layout=\"column\" flex layout-padding class=\"opa-form\" ng-if=\"!$ctrl.isError\"><div layout=\"row\" flex><div layout=\"column\" flex flex-gt-xs=\"50\" flex-gt-md=\"33\"><opa-live-settings opa-groups=\"$ctrl.availableGroups\" opa-settings=\"$ctrl.liveSettings\" opa-on-update=\"$ctrl.updateLiveSettings(settings)\"></opa-live-settings><div flex=\"none\"><md-button ng-click=\"$ctrl.save()\" ng-disabled=\"$ctrl.isSaving || !$ctrl.isValid()\" aria-label=\"{{'SETTINGS.SUBMIT_BUTTON' | opaTranslate}}\" class=\"opa-submit md-raised md-primary md-whiteframe-1dp opa-submit-button\" tabindex=\"0\"><span ng-bind=\"'SETTINGS.SUBMIT_BUTTON' | opaTranslate\" ng-if=\"!$ctrl.isSaving\"></span><md-progress-circular md-mode=\"indeterminate\" md-diameter=\"20\" ng-if=\"$ctrl.isSaving\"></md-progress-circular></md-button></div></div></div></div><div layout=\"column\" layout-align=\"center center\" flex=\"auto\" class=\"opa-error-message\" ng-if=\"$ctrl.isError\"><md-icon>settings</md-icon><span ng-bind=\"'SETTINGS.ERROR_MESSAGE' | opaTranslate\"></span></div></div>"
  );


  $templateCache.put('opa-actionsButton.html',
    "<div ng-if=\"$ctrl.opaLabel && $ctrl.opaActions && $ctrl.opaActions.length\" class=\"opa-actions-button\" ng-class=\"{'opa-opened': $ctrl.isOpened}\" layout=\"column\"><button layout=\"row\" class=\"md-button\" ng-click=\"$ctrl.toggleActions()\" tabindex=\"0\"><md-icon ng-if=\"$ctrl.opaIcon\">{{$ctrl.opaIcon}}</md-icon><span flex=\"grow\" ng-bind=\"$ctrl.opaLabel\"></span><md-icon>keyboard_arrow_down</md-icon></button><div class=\"opa-actions-wrapper\"><ul><li ng-repeat=\"action in $ctrl.opaActions\" ng-if=\"action.label && action.action\" ng-class=\"{'opa-selected': action.selected}\"><a ng-click=\"action.action(action)\" ng-keypress=\"$ctrl.handleActionKeypress($event, action)\" layout=\"row\" layout-align=\"start center\" tabindex=\"{{$ctrl.isOpened ? '0' : '1'}}\" ng-class=\"{'opa-selected': action.selected}\"><md-icon flex=\"nogrow\" ng-if=\"action.icon\">{{action.icon}}</md-icon><span flex=\"auto\" ng-bind=\"action.label\"></span></a></li></ul></div></div>"
  );


  $templateCache.put('opa-info.html',
    "<div class=\"opa-info menu-panel\" md-whiteframe=\"4\" layout=\"column\" ng-if=\"ctrl.message\"><p ng-bind-html=\"ctrl.message\" flex=\"noshrink\"></p><footer layout=\"row\" layout-align=\"end none\" flex=\"none\"><md-button target=\"_blank\" class=\"md-primary\" ng-click=\"ctrl.close()\" ng-bind=\"ctrl.closeLabel\" aria-label=\"{{ctrl.closeAriaLabel}}\" tabindex=\"-1\"></md-button></footer></div>"
  );


  $templateCache.put('opa-infoButton.html',
    "<md-button class=\"md-icon-button opa-info-button\" aria-label=\"{{$ctrl.opaAccessibility}}\" opa-info=\"$ctrl.opaMessage\"><md-icon>info</md-icon><md-tooltip ng-if=\"$ctrl.opaHelp\" md-delay=\"800\">{{$ctrl.opaHelp}}</md-tooltip></md-button>"
  );


  $templateCache.put('opa-mediaContainer.html',
    "<div class=\"opa-media-container\" ng-class=\"{'opa-empty': !ctrl.opaMedia}\" ng-click=\"ctrl.onClick()\" tabindex=\"0\"><img class=\"opa-preview\" ng-if-start=\"ctrl.opaMedia\" ng-src=\"{{ ctrl.opaMedia.preview }}\"><div class=\"opa-overlay\"></div><md-button class=\"opa-remove-btn md-icon-button\" ng-click=\"ctrl.onRemove($event)\" ng-keydown=\"$event.stopImmediatePropagation()\" tabindex=\"0\"><md-icon aria-label=\"{{ 'MEDIA_CONTAINER.REMOVE' | opaTranslate }}\">close</md-icon></md-button><div ng-if-end class=\"opa-media-info\" layout=\"column\" layout-align=\"end none\"><md-truncate class=\"opa-media-title\" ng-bind=\"ctrl.opaMedia.title\"></md-truncate><span class=\"opa-media-date\" ng-bind=\"ctrl.opaMedia.date | date: 'mediumDate'\"></span></div><span class=\"opa-title\" ng-bind=\"ctrl.opaTitle\"></span></div>"
  );


  $templateCache.put('opa-mediaLibrary.html',
    "<div class=\"opa-media-library\" layout=\"column\"><md-toolbar class=\"md-whiteframe-4dp\" md-colors=\"{color: 'default-background-500', background: 'default-background-A100'}\"><form class=\"md-toolbar-tools\" flex layout=\"row\" layout-align=\"start center\" ng-submit=\"$ctrl.search()\"><md-button type=\"submit\" class=\"md-icon-button\" tabindex=\"-1\"><md-icon md-colors=\"{color: 'default-background-500'}\">search</md-icon></md-button><md-input-container flex layout=\"row\"><label ng-bind=\"'MEDIA_LIBRARY.FILTER_TOOLBAR.NAME' | opaTranslate\"></label><input ng-model=\"$ctrl.keyword\" autocomplete=\"off\"></md-input-container></form></md-toolbar><div class=\"opa-select-container\" layout=\"column\"><opa-media-select ng-model=\"$ctrl.ngModel\" opa-medias=\"$ctrl.medias\" opa-multiple=\"$ctrl.multiple\"></opa-media-select><md-progress-linear ng-show=\"$ctrl.isLoading\" md-mode=\"indeterminate\"></md-progress-linear></div></div>"
  );


  $templateCache.put('opa-mediaLibraryDialog.html',
    "<md-dialog class=\"opa-media-library-dialog\" ng-class=\"$ctrl.dialogSizeClass()\"><md-toolbar class=\"opa-toolbar\"><div class=\"md-toolbar-tools\"><h2 ng-bind=\"'MEDIA_LIBRARY_DIALOG.TITLE' | opaTranslate\"></h2><span flex></span><md-button class=\"md-icon-button\" ng-click=\"$ctrl.cancel()\"><md-icon aria-label=\"{{ 'MEDIA_LIBRARY_DIALOG.CLOSE'| opaTranslate }}\">cancel</md-icon></md-button></div></md-toolbar><md-dialog-content layout=\"column\"><opa-media-library layout=\"column\" ng-model=\"$ctrl.value\" opa-multiple=\"$ctrl.multiple\" tabindex=\"-1\" md-autofocus></opa-media-library></md-dialog-content><md-dialog-actions><md-button aria-label=\"{{ 'MEDIA_LIBRARY_DIALOG.VALIDATE' | opaTranslate }}\" ng-click=\"$ctrl.close()\" ng-bind=\"'MEDIA_LIBRARY_DIALOG.VALIDATE' | opaTranslate\"></md-button></md-dialog-actions></md-dialog>"
  );


  $templateCache.put('opa-mediaOption.html',
    "<div class=\"opa-media-option\"><img class=\"opa-thumbnail\" ng-src=\"{{ ctrl.opaMedia.preview }}\"><div class=\"opa-overlay\"></div><div class=\"opa-actions\" dir=\"rtl\"><md-checkbox aria-label=\"ctrl.opaMedia.title\" ng-model=\"ctrl.isChecked\" ng-change=\"ctrl.updateSelect()\" ng-blur=\"ctrl.onBlur()\" tabindex=\"-1\"></md-checkbox></div><div class=\"opa-media-info\" layout=\"column\"><md-truncate class=\"opa-media-title\" ng-bind=\"ctrl.opaMedia.title\"></md-truncate><span class=\"opa-media-date\" ng-bind=\"ctrl.opaMedia.date | date: 'mediumDate'\"></span></div></div>"
  );


  $templateCache.put('opa-mediaSelect.html',
    "<div class=\"opa-media-select\" layout=\"row\" layout-wrap layout-margin ng-blur=\"$ctrl.onBlur()\" ng-keyup=\"$ctrl.optionFocus($event)\" tabindex=\"0\"><opa-media-option flex=\"nogrow\" ng-repeat=\"media in $ctrl.opaMedias\" opa-checked=\"$ctrl.checkboxesStates[$index]\" opa-media=\"media\" opa-focus=\"$ctrl.focusStates[$index]\" opa-blur=\"$ctrl.onBlur()\"></opa-media-option></div>"
  );


  $templateCache.put('opa-nav.html',
    "<nav class=\"opa-nav\" layout=\"column\"><ul><li ng-repeat=\"item in $ctrl.opaMenu\"><a ng-if=\"item.label && item.action\" ng-class=\"{'opa-selected': item.selected}\" ng-click=\"item.action(item)\" ng-keypress=\"$ctrl.handleItemKeypress($event, item)\" ng-class=\"{'opa-selected': item.selected}\" layout=\"row\" layout-align=\"start center\" md-autofocus=\"$index == 0\" tabindex=\"0\"><md-icon flex=\"nogrow\" ng-if=\"item.icon\">{{item.icon}}</md-icon><span flex=\"auto\" ng-bind=\"item.label\"></span></a><md-divider ng-if=\"item.divider\"></md-divider><opa-actions-button ng-if=\"item.actions && item.label\" opa-label=\"{{item.label}}\" opa-icon=\"{{item.icon}}\" opa-actions=\"item.actions\"></opa-actions-button></li></ul></nav>"
  );


  $templateCache.put('opa-notification.html',
    "<md-toast class=\"opa-notification\"><div class=\"md-toast-content\" ng-class=\"{'opa-large': ctrl.$mdMedia('gt-sm')}\"><div layout=\"row\" layout-align=\"start center\"><span flex=\"grow\" ng-bind=\"ctrl.message\"></span><md-button ng-if=\"ctrl.closeButton\" ng-click=\"ctrl.hide()\" ng-bind=\"ctrl.closeLabel\" aria-label=\"{{ctrl.closeAriaLabel}}\" md-colors=\"::{color: 'accent'}\" tabindex=\"-1\"></md-button></div></div></md-toast>"
  );


  $templateCache.put('opa-tags.html',
    "<div class=\"opa-tags\"><input autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-keydown=\"$ctrl.handleInputKeys($event);\" ng-model=\"$ctrl.tag\" ng-change=\"$ctrl.autoComplete()\" ng-blur=\"$ctrl.invalidateUntouched()\" ng-model-options=\"{allowInvalid: true}\" class=\"form-control\"><ul><li ng-repeat=\"item in $ctrl.tags track by $index\" class=\"opa-tag\"><div ng-bind=\"item\"></div><button ng-click=\"$ctrl.removeTag($event, $index)\"><md-icon>cancel</md-icon></button></li></ul><ul class=\"ov-field-tags-auto-complete\" ng-show=\"$ctrl.autoCompleteValues.length && $ctrl.isAutoCompleteDisplayed\" tabindex=\"-1\"><li ng-repeat=\"tag in $ctrl.autoCompleteValues track by $index\" ng-click=\"$ctrl.addTag(tag.name)\" ng-keypress=\"$ctrl.handleAutoCompleteKeys($event, tag.name)\" tabindex=\"-1\"><div ng-bind=\"tag.name\"></div></li></ul></div>"
  );


  $templateCache.put('opa-toolbar.html',
    "<script type=\"text/ng-template\" id=\"opa-toolbar-action.html\"><!-- Icon action -->\n" +
    "  <md-button\n" +
    "             ng-if=\"action.type === 'icon' && action.icon && action.action\"\n" +
    "             ng-click=\"action.action()\"\n" +
    "             class=\"md-icon-button\"\n" +
    "             aria-label=\"{{action.accessibility}}\"\n" +
    "  >\n" +
    "    <md-icon>{{action.icon}}</md-icon>\n" +
    "    <md-tooltip ng-if=\"action.help\" md-delay=\"800\">{{action.help}}</md-tooltip>\n" +
    "  </md-button>\n" +
    "\n" +
    "  <!-- Text action -->\n" +
    "  <md-button\n" +
    "             ng-if=\"action.type === 'text' && action.label && action.action\"\n" +
    "             ng-click=\"action.action()\"\n" +
    "             ng-bind=\"action.label\"\n" +
    "             aria-label=\"{{action.accessibility}}\"\n" +
    "  ></md-button>\n" +
    "\n" +
    "  <!-- List action -->\n" +
    "  <md-menu ng-if=\"action.type === 'list' && action.icon && action.menu\">\n" +
    "    <md-button class=\"md-icon-button\" aria-label=\"{{action.accessibility}}\" ng-click=\"$mdMenu.open($event)\">\n" +
    "      <md-icon>{{action.icon}}</md-icon>\n" +
    "      <md-tooltip ng-if=\"action.help\" md-delay=\"800\">{{action.help}}</md-tooltip>\n" +
    "    </md-button>\n" +
    "    <md-menu-content class=\"opa-toolbar-menu\">\n" +
    "      <md-menu-item\n" +
    "                    ng-repeat=\"menuAction in action.menu\"\n" +
    "                    ng-class=\"{'opa-selected': menuAction.selected}\"\n" +
    "                    ng-if=\"menuAction.action && menuAction.label\"\n" +
    "                    md-colors=\"menuAction.selected ? {color: 'accent-500'} : {color: 'background-900'}\"\n" +
    "      >\n" +
    "        <md-button ng-click=\"menuAction.action(menuAction)\" ng-bind=\"menuAction.label\" aria-label=\"{{menuAction.accessibility}}\"></md-button>\n" +
    "      </md-menu-item>\n" +
    "    </md-menu-content>\n" +
    "  </md-menu>\n" +
    "\n" +
    "  <!-- Info action -->\n" +
    "  <opa-info-button\n" +
    "                   ng-if=\"action.type === 'info' && action.message\"\n" +
    "                   opa-message=\"action.message\"\n" +
    "                   opa-accessibility=\"{{action.accessibility}}\"\n" +
    "                   opa-help=\"{{action.help}}\"\n" +
    "  ></opa-info-button></script><md-toolbar class=\"opa-toolbar\"><header class=\"md-toolbar-tools\"><div ng-if=\"$ctrl.opaLeftActions && $ctrl.opaLeftActions.length\" layout=\"row\" flew=\"no\" class=\"opa-toolbar-left-actions\"><div ng-repeat=\"action in $ctrl.opaLeftActions\" layout=\"row\" ng-include=\"'opa-toolbar-action.html'\"></div></div><h1 flex=\"auto\" ng-bind=\"$ctrl.opaTitle\"></h1><div ng-if=\"$ctrl.opaRightActions && $ctrl.opaRightActions.length\" layout=\"row\" class=\"opa-toolbar-right-actions\"><div ng-repeat=\"action in $ctrl.opaRightActions\" layout=\"row\" ng-include=\"'opa-toolbar-action.html'\"></div></div></header></md-toolbar>"
  );

}]);
