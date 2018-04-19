'use strict';

window.assert = chai.assert;

describe('OpaPromotedVideosController', function() {
  let $componentController;
  let $rootScope;
  let $q;
  let $mdDialog;
  let $mdMedia;
  let opaSettingsFactory;
  let opaVideosFactory;
  let opaNotificationFactory;
  let opaUrlFactory;

  // Load modules
  beforeEach(function() {
    module('opa', ($provide) => {
      $mdDialog = {
        show: (options) => $q.resolve({})
      };
      $mdMedia = (mediaQuery) => true;
      opaSettingsFactory = {
        updateSetting: (id, value) => $q.resolve()
      };
      opaVideosFactory = {
        getPromotedVideos: () => $q.resolve({data: new Array(9)}),
        getVideo: chai.spy((id) => $q.resolve({}))
      };
      opaNotificationFactory = {
        displayNotification: chai.spy(() => {})
      };
      opaUrlFactory = {
        setUrlParameter: (url, parameter, value) => `${url}?${parameter}=${value}`
      };
    });
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should emit an "opaViewLoaded" event when loaded', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaViewLoaded', handleEvent);

    const ctrl = $componentController('opaPromotedVideos', {
      $element: {},
      $mdDialog,
      $mdMedia,
      opaSettingsFactory,
      opaVideosFactory,
      opaNotificationFactory,
      opaUrlFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
  });

  it('should emit an "opaViewLoaded" event and set error if loading promoted videos failed', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaViewLoaded', handleEvent);

    opaVideosFactory.getPromotedVideos = () => $q.reject();

    const ctrl = $componentController('opaPromotedVideos', {
      $element: {},
      $mdDialog,
      $mdMedia,
      opaSettingsFactory,
      opaVideosFactory,
      opaNotificationFactory,
      opaUrlFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
    assert.isOk(ctrl.isError, 'Expected component to be on error');
  });

  it('should create containers at initialization', function() {
    const expectedPromotedVideos = [
      {
        id: '42',
        thumbnail: 'thumbnail42.jpg'
      },
      {
        id: '43',
        thumbnail: 'thumbnail43.jpg'
      },
      {
        id: '44',
        thumbnail: 'thumbnail44.jpg'
      }
    ];

    opaVideosFactory.getPromotedVideos = () => $q.resolve({data: expectedPromotedVideos});

    const ctrl = $componentController('opaPromotedVideos', {
      $element: {},
      $mdDialog,
      $mdMedia,
      opaSettingsFactory,
      opaVideosFactory,
      opaNotificationFactory,
      opaUrlFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    assert.lengthOf(ctrl.containers, expectedPromotedVideos.length, 'Wrong number of containers');
    assert.equal(ctrl.containers[0].title, 1, 'Wrong first container title');
    assert.equal(ctrl.containers[0].style, 'publish-16by9-300', 'Wrong first container style');
    assert.equal(ctrl.containers[0].media.id, expectedPromotedVideos[0].id, 'Wrong first container media');
    assert.equal(
      ctrl.containers[0].media.preview,
      `${expectedPromotedVideos[0].thumbnail}?style=publish-16by9-300`,
      'Wrong first container media preview'
    );

    for (let i = 1; i < expectedPromotedVideos.length; i++) {
      assert.equal(ctrl.containers[i].title, i + 1, `Wrong container ${i} style`);
      assert.equal(ctrl.containers[i].style, 'publish-16by9-142', `Wrong container ${i} style`);
      assert.equal(ctrl.containers[i].media.id, expectedPromotedVideos[i].id, `Wrong container ${i} media`);
      assert.equal(
        ctrl.containers[i].media.preview,
        `${expectedPromotedVideos[i].thumbnail}?style=publish-16by9-142`,
        `Wrong container ${i} media preview`
      );
    }
  });

  it('should create 9 containers if no promoted videos configured', function() {
    opaVideosFactory.getPromotedVideos = () => $q.resolve({});

    const ctrl = $componentController('opaPromotedVideos', {
      $element: {},
      $mdDialog,
      $mdMedia,
      opaSettingsFactory,
      opaVideosFactory,
      opaNotificationFactory,
      opaUrlFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    assert.lengthOf(ctrl.containers, 9, 'Wrong number of containers');
    assert.equal(ctrl.containers[0].title, 1, 'Wrong first container title');
    assert.equal(ctrl.containers[0].style, 'publish-16by9-300', 'Wrong first container style');
    assert.isUndefined(ctrl.containers[0].media, 'Unexpected first container media');

    for (let i = 1; i < 9; i++) {
      assert.equal(ctrl.containers[i].title, i + 1, `Wrong container ${i} style`);
      assert.equal(ctrl.containers[i].style, 'publish-16by9-142', `Wrong container ${i} style`);
      assert.isUndefined(ctrl.containers[i].media, `Unexpected container ${i} media`);
    }
  });

  describe('openMediaLibraryDialog', function() {

    it('should open a media library dialog with selected media', function() {
      const expectedIndex = 1;
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      ctrl.containers = [
        {
          title: '1',
          media: {
            id: '42'
          }
        },
        {
          title: '2',
          media: {
            id: '43'
          }
        }
      ];

      $mdDialog.show = chai.spy((options) => {
        assert.equal(options.controller, 'OpaMediaLibraryDialogController', 'Wrong controller');
        assert.equal(options.locals.value, ctrl.containers[expectedIndex].media.id, 'Wrong media');
        return $q.resolve({});
      });

      ctrl.openMediaLibraryDialog(expectedIndex);
      $rootScope.$digest();
      $mdDialog.show.should.have.been.called.exactly(1);
    });

    it('should be able to open a media library dialog if no media selected', function() {
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      $mdDialog.show = chai.spy((options) => {
        assert.isUndefined(options.locals.value, 'Unexpected media');
        return $q.resolve({});
      });

      ctrl.openMediaLibraryDialog(1);
      $rootScope.$digest();
      $mdDialog.show.should.have.been.called.exactly(1);
    });

    it('should add selected media to the container when validated', function() {
      const expectedId = '42';
      const expectedIndex = 5;
      const expectedMedia = {
        id: expectedId,
        thumbnail: 'thumbnail.jpg'
      };
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      ctrl.containers[expectedIndex] = {
        title: String(expectedIndex),
        style: 'media-style'
      };

      opaVideosFactory.getVideo = chai.spy((id) => {
        assert.equal(id, expectedId, 'Wrong media id to fetch');
        return $q.resolve({
          data: {
            entity: expectedMedia
          }
        });
      });

      $mdDialog.show = chai.spy((options) => {
        return $q.resolve({value: expectedId});
      });

      ctrl.openMediaLibraryDialog(expectedIndex);
      $rootScope.$digest();
      $mdDialog.show.should.have.been.called.exactly(1);
      opaVideosFactory.getVideo.should.have.been.called.exactly(1);
      assert.equal(ctrl.containers[expectedIndex].media.id, expectedMedia.id, 'Wrong media id');
      assert.equal(
        ctrl.containers[expectedIndex].media.preview,
        `${expectedMedia.thumbnail}?style=${ctrl.containers[expectedIndex].style}`,
        'Wrong media preview'
      );
    });

    it('should not do anything if no media selected when validated', function() {
      const expectedIndex = 1;
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      $mdDialog.show = chai.spy((options) => {
        return $q.resolve({});
      });

      ctrl.openMediaLibraryDialog(expectedIndex);
      $rootScope.$digest();
      $mdDialog.show.should.have.been.called.exactly(1);
      opaVideosFactory.getVideo.should.have.been.called.exactly(0);
      assert.isUndefined(ctrl.containers[expectedIndex].media, 'Unexpected media');
    });

  });

  describe('clearContainer', function() {

    it('should remove a media from its container', function() {
      const expectedIndex = 1;
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      ctrl.containers[expectedIndex] = {
        title: String(expectedIndex),
        media: {}
      };

      ctrl.clearContainer(expectedIndex);
      assert.isUndefined(ctrl.containers[expectedIndex].media, 'Unexpected media');
    });

  });

  describe('save', function() {

    it('should save the ids of the promoted videos', function() {
      const expectedIds = [];
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      for (let i = 0; i < 9; i++) {
        expectedIds.push(String(i));
        ctrl.containers[i] = {
          title: String(i),
          media: {
            id: String(i)
          }
        };
      }

      opaSettingsFactory.updateSetting = chai.spy((id, value) => {
        assert.equal(id, 'promoted-videos', 'Wrong setting id');
        assert.deepEqual(value, expectedIds, 'Wrong ids');
        return $q.resolve();
      });

      ctrl.save();

      opaSettingsFactory.updateSetting.should.have.been.called.exactly(1);
      assert.ok(ctrl.isSaving, 'Should be saving');
      $rootScope.$digest();
      assert.isNotOk(ctrl.isSaving, 'Should not be saving anymore');
      opaNotificationFactory.displayNotification.should.have.been.called.exactly(1);
    });

    it('should save values for the 9 containers even if undefined', function() {
      const expectedIndex = 1;
      const ctrl = $componentController('opaPromotedVideos', {
        $element: {},
        $mdDialog,
        $mdMedia,
        opaSettingsFactory,
        opaVideosFactory,
        opaNotificationFactory,
        opaUrlFactory
      });
      ctrl.$onInit();
      $rootScope.$digest();

      ctrl.containers[expectedIndex] = {
        title: String(expectedIndex),
        media: {
          id: '42'
        }
      };

      opaSettingsFactory.updateSetting = chai.spy((id, value) => {
        assert.equal(id, 'promoted-videos', 'Wrong setting id');

        for (let i = 0; i < value.length; i++) {
          if (i === expectedIndex)
            assert.equal(value[i], ctrl.containers[expectedIndex].media.id, 'Wrong id');
          else
            assert.isUndefined(value[i], 'Unexpected id');
        }

        return $q.resolve();
      });

      ctrl.save();

      opaSettingsFactory.updateSetting.should.have.been.called.exactly(1);
      $rootScope.$digest();
    });

  });

});
