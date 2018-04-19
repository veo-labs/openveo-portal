'use strict';

window.assert = chai.assert;

describe('OpaMediaLibrary', function() {
  let $compile;
  let $rootScope;
  let $httpBackend;
  let scope;

  let emptyResult;
  let firstPageResult;
  let lastPageResult;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
    scope.ngModel = [];
    scope.multiple = true;
    scope.limit = 1;

    emptyResult = {
      entities: [],
      httpCode: 200,
      pagination: {
        limit: scope.limit,
        page: 0,
        pages: 0,
        size: 0
      }
    };

    firstPageResult = {
      entities: [
        {
          id: 1,
          title: 'First video',
          date: new Date(),
          thumbnail: 'http://fake.url/image.jpg'
        }
      ],
      httpCode: 200,
      pagination: {
        limit: scope.limit,
        page: 0,
        pages: 2,
        size: 1
      }
    };

    lastPageResult = {
      entities: [
        {
          id: 2,
          title: 'Last video',
          date: new Date(),
          thumbnail: 'http://fake.url/image.jpg'
        }
      ],
      httpCode: 200,
      pagination: {
        limit: scope.limit,
        page: 1,
        pages: 2,
        size: 1
      }
    };
  });

  // Checks if no HTTP request stays without response
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch the first page without search pattern on init', function() {
    let element = angular.element(
      '<opa-media-library ng-model="ngModel" opa-multiple="multiple" opa-results-per-page="limit"></opa-media-library>'
    );
    element = $compile(element)(scope);

    const checkData = (request) => {
      const ctrl = element.controller('opaMediaLibrary');
      const expectedData = {
        filter: {
          sortBy: ctrl.sortField,
          sortOrder: ctrl.sortDirection,
          include: ['id', 'title', 'date', 'thumbnail']
        },
        pagination: {
          limit: ctrl.limit
        }
      };

      assert.deepEqual(JSON.parse(request), expectedData, 'Unexpected data sent to OpenVeo Web Service');

      return true;
    };

    $httpBackend.expect('POST', '/be/ws/videos', checkData).respond(emptyResult);
    scope.$digest();

    $httpBackend.flush();
  });

  it('should fetch the first page on search form submit', function() {
    let element = angular.element(
      '<opa-media-library ng-model="ngModel" opa-multiple="multiple" opa-results-per-page="limit"></opa-media-library>'
    );
    element = $compile(element)(scope);

    $httpBackend.when('POST', '/be/ws/videos').respond(firstPageResult);
    scope.$digest();
    $httpBackend.flush();

    const ctrl = element.controller('opaMediaLibrary');
    const expectedData = {
      filter: {
        query: 'TEST',
        sortBy: ctrl.sortField,
        sortOrder: ctrl.sortDirection,
        include: ['id', 'title', 'date', 'thumbnail']
      },
      pagination: {
        limit: ctrl.limit
      }
    };

    assert.equal(ctrl.medias.length, 1);

    $httpBackend.expect('POST', '/be/ws/videos', expectedData).respond(emptyResult);
    element.find('input').controller('ngModel').$setViewValue(expectedData.filter.query);
    scope.$apply();
    element.find('form').triggerHandler('submit');
    $httpBackend.flush();

    assert.equal(ctrl.medias.length, 0);
  });

  it('should append media on addNextPage()', function() {
    let element = angular.element(
      '<opa-media-library ng-model="ngModel" opa-multiple="multiple" opa-results-per-page="limit"></opa-media-library>'
    );
    element = $compile(element)(scope);

    $httpBackend.when('POST', '/be/ws/videos').respond(firstPageResult);
    scope.$digest();

    const ctrl = element.controller('opaMediaLibrary');
    const expectedData = {
      filter: {
        sortBy: ctrl.sortField,
        sortOrder: ctrl.sortDirection,
        include: ['id', 'title', 'date', 'thumbnail']
      },
      pagination: {
        page: 1,
        limit: ctrl.limit
      }
    };

    $httpBackend.flush();

    assert.equal(ctrl.medias.length, 1);

    $httpBackend.expect('POST', '/be/ws/videos', expectedData).respond(lastPageResult);
    ctrl.addNextPage();
    $httpBackend.flush();
    assert.equal(ctrl.medias.length, 2);
  });

});
