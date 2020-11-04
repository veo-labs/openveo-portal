'use strict';

window.assert = chai.assert;
chai.should();

describe('LiveController', function() {
  let $rootScope;
  let $controller;
  let $filter;
  let $sce;
  let scope;
  let originalOpenVeoPortalSettings;

  // Load openveo module
  beforeEach(module('ov.portal'));

  // Dependencies injections
  beforeEach(inject(
    (_$rootScope_, _$controller_, _$filter_, _$sce_) => {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $filter = _$filter_;
      $sce = _$sce_;
    })
  );

  before(function() {
    originalOpenVeoPortalSettings = JSON.parse(JSON.stringify(openVeoPortalSettings));
  });

  afterEach(function() {
    openVeoPortalSettings = originalOpenVeoPortalSettings;
  });

  function initController() {
    scope = $rootScope.$new();

    $controller('LiveController', {
      $scope: scope,
      $filter,
      $sce
    });
  }

  it('should be able to build Youtube iframe URL', function() {
    const expectedVideoId = '123456';
    openVeoPortalSettings.live.playerType = 'youtube';
    openVeoPortalSettings.live.url = `https://www.youtube.com/watch?v=${expectedVideoId}`;
    initController();

    assert.equal($sce.getTrustedResourceUrl(scope.url), `https://www.youtube.com/embed/${expectedVideoId}`);
  });

  it('should be able to build Vimeo iframe URL', function() {
    const expectedVideoId = '123456';
    openVeoPortalSettings.live.playerType = 'vimeo';
    openVeoPortalSettings.live.url = `https://vimeo.com/event/${expectedVideoId}`;
    initController();

    assert.equal($sce.getTrustedResourceUrl(scope.url), `https://vimeo.com/event/${expectedVideoId}/embed`);
  });

  it('should be able to build Vodalys iframe URL', function() {
    const expectedVideoId = 'vpage2/0hjertPpReB2Dbmr';
    openVeoPortalSettings.live.playerType = 'vodalys';
    openVeoPortalSettings.live.url = `https://console.vodalys.studio/${expectedVideoId}`;
    initController();

    assert.equal($sce.getTrustedResourceUrl(scope.url), `https://console.vodalys.studio/${expectedVideoId}#?embedded=true`);
  });

  it('should be able to build Wowza player', function() {
    openVeoPortalSettings.live.playerType = 'wowza';
    openVeoPortalSettings.live.wowza.playerLicenseKey = 'license-key';
    openVeoPortalSettings.live.url = 'https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8';

    WowzaPlayer.create = chai.spy((id, configuration) => {
      const translate = $filter('translate');

      assert.equal(id, 'wowza-player', 'Wrong player id');
      assert.equal(configuration.license, openVeoPortalSettings.live.wowza.playerLicenseKey, 'Wrong player license');
      assert.equal(configuration.sourceURL, `${openVeoPortalSettings.live.url}?DVR`, 'Wrong URL');
      assert.equal(configuration.stringAuto, translate('LIVE.WOWZA.AUTO'), 'Wrong auto string');
      assert.equal(configuration.stringBuffering, translate('LIVE.WOWZA.BUFFERING'), 'Wrong buffering string');
      assert.equal(configuration.stringLiveLabel, translate('LIVE.WOWZA.LIVE_BUTTON'), 'Wrong live label string');
      assert.equal(
        configuration.stringCountdownTimerLabel,
        translate('LIVE.WOWZA.COUNT_DOWN'),
        'Wrong count down timer string'
      );
      assert.equal(
        configuration.stringErrorStreamUnavailable,
        translate('LIVE.WOWZA.STREAM_ERROR'),
        'Wrong error stream unavailable string'
      );
      assert.equal(
        configuration.stringErrorCORSStreamUnavailable,
        translate('LIVE.WOWZA.CORS_ERROR'),
        'Wrong error CORS stream unavailable string'
      );
      assert.equal(
        configuration.stringLiveEventEnded,
        translate('LIVE.WOWZA.LIVE_ENDED'),
        'Wrong live event ended string'
      );
      assert.equal(
        configuration.stringLiveSeekAlt,
        translate('LIVE.WOWZA.LIVE_BUTTON_OVER'),
        'Wrong live seek alt string'
      );
    });

    initController();

    WowzaPlayer.create.should.have.been.called.exactly(1);
  });

});
