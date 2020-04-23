'use strict';

window.assert = chai.assert;

describe('SearchController', function() {
  let $rootScope;
  let $controller;
  let $q;
  let $location;
  let scope;
  let controller;
  let expectedVideos = [];

  // Load openveo module
  beforeEach(module('ov.portal'));

  // Dependencies injections
  beforeEach(inject(
    (_$rootScope_, _$controller_, _$q_, _$location_) => {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $q = _$q_;
      $location = _$location_;
    })
  );

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();

    controller = $controller('SearchController', {
      $scope: scope,
      $location,
      $q,
      searchService: {
        search: () => Promise.resolve({data: {entities: expectedVideos, pagination: {size: 1}}})
      },
      $analytics: {
        trackSiteSearch: () => null
      },
      filters: {}
    });
  });

  describe('emphasisQuery', function() {

    it('should emphasis the first matching part of the text corresponding to the given query', function() {
      const query = 'Query keywords';
      const queryFirstWord = query.split(' ')[0];
      const queryRest = query.substring(queryFirstWord.length);
      const markedQuery = `<strong>${query}</strong>`;
      const queryMultiLines = `${queryFirstWord}\n${queryRest.trimStart()}`;
      const examples = [
        {text: query, res: markedQuery},
        {text: `With before words ${query}`, res: `With before words ${markedQuery}`},
        {text: `${query} with words after`, res: `${markedQuery} with words after`},
        {text: `With before words without space${query}`, res: `With before words without space${markedQuery}`},
        {text: `${query}with words after without space`, res: `${markedQuery}with words after without space`},
        {text: `Multilines ${queryMultiLines}`, res: `Multilines ${markedQuery}`},
        {text: `Multispaces  ${query}`, res: `Multispaces ${markedQuery}`},
        {text: `${query}  multispaces`, res: `${markedQuery} multispaces`},
        {text: `.${query}`, res: `.${markedQuery}`},
        {text: `,${query}`, res: `,${markedQuery}`},
        {text: `${query}.`, res: `${markedQuery}.`},
        {text: `${query},`, res: `${markedQuery},`},
        {text: `l'${query},`, res: `l'${markedQuery},`},
        {text: `-${query},`, res: `-${markedQuery},`},
        {text: `${query}au`, res: `${markedQuery}au`},
        {text: `${query}s`, res: `<strong>${query}s</strong>`},
        {text: `${query}s.`, res: `<strong>${query}s</strong>.`}
      ];

      for (let i = 0; i < examples.length; i++)
        assert.equal(controller.emphasisQuery(examples[i].text, query), examples[i].res, `Example ${i} failed`);
    });

    it('should remove HTML from text', function() {
      const query = 'Query keywords';
      const markedQuery = `<strong>${query}</strong>`;
      const queryFirstWord = query.split(' ')[0];
      const queryRest = query.substring(queryFirstWord.length);
      const examples = [
        {text: `<p>${query}</p>`, res: markedQuery},
        {text: `<a alt="Alt">${query}</a>`, res: markedQuery},
        {text: `<div><p>${query}</div></p>`, res: markedQuery},
        {text: `<strong>${queryFirstWord}</strong>${queryRest}`, res: markedQuery},
        {text: `<p>Text before</p><span>${query}</span>`, res: `Text before${markedQuery}`},
        {text: query.replace(' ', '&nbsp;'), res: markedQuery},
        {text: query.replace(' ', '    '), res: markedQuery}
      ];

      for (let i = 0; i < examples.length; i++)
        assert.equal(controller.emphasisQuery(examples[i].text, query), examples[i].res, `Example ${i} failed`);
    });

    it('should decode HTML entities in text', function() {
      const query = 'Query keywords';
      const markedQuery = `<strong>${query}</strong>`;
      const examples = [
        {text: `Texte en Fran&ccedil;ais avant ${query}`, res: `Texte en Français avant ${markedQuery}`},
        {text: `${query} &eacute;&amp;&colon;&#44;`, res: `${markedQuery} é&:,`}
      ];

      for (let i = 0; i < examples.length; i++)
        assert.equal(controller.emphasisQuery(examples[i].text, query), examples[i].res, `Example ${i} failed`);
    });

    it('should be able to emphasis a text containing HTML entities', function() {
      const query = 'Texte en Français avec des caractères spéciaux';
      const encodedQuery = he.encode(query, {useNamedReferences: true});
      const markedQuery = `<strong>${query}</strong>`;
      const examples = [
        {text: encodedQuery, res: markedQuery},
        {text: `Encoded query: ${encodedQuery}`, res: `Encoded query: ${markedQuery}`}
      ];

      for (let i = 0; i < examples.length; i++)
        assert.equal(controller.emphasisQuery(examples[i].text, query), examples[i].res, `Example ${i} failed`);
    });

    it('should be able to limit the number of returned characters', function() {
      const query = 'Query keywords';
      const total = query.length;
      const markedQuery = `<strong>${query}</strong>`;
      const ellipsis = '...';
      const examples = [
        {text: query, limit: 0, res: markedQuery},
        {text: query, limit: query.length, res: markedQuery},
        {text: query, limit: query.length + 1, res: markedQuery},
        {text: `Bef ${query} aft`, limit: 0, res: `Bef ${markedQuery} aft`},
        {text: `Bef ${query} aft`, limit: 1, res: `${ellipsis}${markedQuery}${ellipsis}`},
        {text: `Bef ${query} aft`, limit: 4 + total + 4, res: `Bef ${markedQuery} aft`},
        {text: `Bef ${query} aft`, limit: 4 + total + 4 + 1, res: `Bef ${markedQuery} aft`},
        {text: `Bef ${query} aft`, limit: -1, res: `${ellipsis}${markedQuery}${ellipsis}`},
        {text: `Bef ${query} aft`, limit: 4 + total + 4 - 1, res: `Bef ${markedQuery}${ellipsis}`},
        {text: `Bef ${query}`, limit: 4 + total, res: `Bef ${markedQuery}`},
        {text: `Bef ${query}`, limit: 4 + total - 1, res: `${ellipsis}${markedQuery}`},
        {text: `${query} aft`, limit: 4 + total, res: `${markedQuery} aft`},
        {text: `${query} aft`, limit: 4 + total - 1, res: `${markedQuery}${ellipsis}`},
        {text: `Wo bef ${query} wo aft`, limit: 14 + total, res: `Wo bef ${markedQuery} wo aft`},
        {text: `Wo bef ${query} wo aft`, limit: 14 + total - 1, res: `${ellipsis}bef ${markedQuery} wo${ellipsis}`},
        {text: `Wo bef ${query} wo aft`, limit: 7 + total + 6, res: `${ellipsis}bef ${markedQuery} wo${ellipsis}`},
        {text: `Wo bef ${query} wo aft`, limit: 6 + total + 6, res: `${ellipsis}bef ${markedQuery}${ellipsis}`},
        {text: `${query} wo aft`, limit: total + 7, res: `${markedQuery} wo aft`},
        {text: `${query} wo aft`, limit: total + 7 - 2, res: `${markedQuery}${ellipsis}`},
        {text: `Wo bef ${query}`, limit: total + 7, res: `Wo bef ${markedQuery}`},
        {text: `Wo bef ${query}`, limit: total + 7 - 1, res: `${ellipsis}${markedQuery}`},
        {text: `- Before ${query} then after`, limit: 9 + total + 10, res: `- Before ${markedQuery} then${ellipsis}`},
        {text: `Before ${query} then after`, limit: 7 + total + 10, res: `Before ${markedQuery} then${ellipsis}`},
        {text: `Then before ${query} after`, limit: 12 + total + 5, res: `${ellipsis}before ${markedQuery} after`}
      ];

      for (let i = 0; i < examples.length; i++) {
        assert.equal(
          controller.emphasisQuery(examples[i].text, query, examples[i].limit),
          examples[i].res,
          `Example ${i} failed`
        );
      }
    });

    it('should be able to simply truncate a text without emphasising', function() {
      const query = 'Query keywords';
      const total = query.length;
      const ellipsis = '...';
      const examples = [
        {text: query, limit: 0, res: query},
        {text: `Before ${query} after`, limit: 1, res: `${ellipsis}${query}${ellipsis}`},
        {text: `Before ${query} after`, limit: 13 + total, res: `Before ${query} after`},
        {text: `Before ${query} after`, limit: 12 + total, res: `Before ${query}${ellipsis}`}
      ];

      for (let i = 0; i < examples.length; i++) {
        assert.equal(
          controller.emphasisQuery(examples[i].text, query, examples[i].limit, true),
          examples[i].res,
          `Example ${i} failed`
        );
      }
    });


  });

});

