'use strict';

/**
 * @module opa
 */

/**
 * Info button presents an information button opening a dialog with a message.
 *
 * It uses opa-info directive to display the message.
 *
 *     <opa-info-button
 *       opa-message="'MESSAGE_TRANSLATION_ID' | opaTranslate"
 *       opa-label="LABEL_TRANSLATION_ID' | opaTranslate"
 *     ></opa-info-button>
 *
 * Available attributes are:
 *   - [String] **opa-message**: The wrapped version of the message that can be used as a trusted
 *     variant in $sce.HTML context
 *   - [String] **opa-label**: An AngularJS expression evaluating to a string containing the button accessibility text
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaInfo** Directive opening a panel with a message and a close button
 *
 * @class opa
 */

(function(app) {

  app.component('opaInfoButton', {
    templateUrl: 'opa-infoButton.html',
    controller: 'OpaInfoButtonController',
    bindings: {
      opaMessage: '<',
      opaLabel: '<'
    }
  });

})(angular.module('opa'));
