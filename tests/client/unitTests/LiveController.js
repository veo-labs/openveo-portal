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

  it('should be able to build Video.js player', function() {
    openVeoPortalSettings.live.playerType = 'wowza';
    openVeoPortalSettings.live.url = 'https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8';

    videojs = chai.spy((id, configuration) => {
      assert.equal(id, 'videojs-player', 'Wrong player id');
      assert.isNotOk(configuration.autoplay, 'Unexpected player autoplay');
      assert.ok(configuration.controls, 'Expected player controls');
      assert.lengthOf(configuration.sources, 1, 'Expected only one player source');
      assert.equal(configuration.sources.src, `${openVeoPortalSettings.live.url}?DVR`, 'Wrong player source URL');
      assert.equal(configuration.sources.type, 'application/x-mpegURL', 'Wrong player source type');
      assert.ok(configuration.liveui, 'Expected player live interface');
      assert.isNotOk(configuration.html5.nativeControlsForTouch, 'Unexpected player native touch controls');
      assert.isNotOk(configuration.html5.nativeAudioTracks, 'Unexpected player native audio tracks');
      assert.isNotOk(configuration.html5.nativeVideoTracks, 'Unexpected player native video tracks');
    });

    initController();

    videojs.should.have.been.called.exactly(1);
  });

});
