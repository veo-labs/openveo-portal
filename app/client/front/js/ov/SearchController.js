'use strict';

(function(app) {

  /**
   * Defines the home page controller.
   */
  function SearchController($scope, $location, $q, $timeout, searchService, filters, $analytics, $mdMedia) {
    var self = this;
    var reloadOnPageChange = false;
    var canceller = $q.defer();
    var isLargeScreen;

    $scope.videos = [];
    $scope.filters = filters.data || [];
    $scope.pagination = {size: 0, page: 0, pages: 0, limit: 12};
    $scope.showAdvancedSearch = false;
    $scope.isLoading = true;

    /**
     * Executes, safely, the given function in AngularJS process.
     *
     * @param {Function} functionToExecute The function to execute as part of
     * the angular digest process.
     */
    function safeApply(functionToExecute) {

      // Execute each apply on a different loop
      $timeout(function() {

        // Make sure we're not on a digestion cycle
        var phase = $scope.$root.$$phase;

        if (phase === '$apply' || phase === '$digest')
          functionToExecute();
        else
          $scope.$apply(functionToExecute);
      }, 1);
    }

    /**
     * Converts timestamp into Date.
     *
     * If timestamp is actually a Date object, the Date object is returned without any conversion.
     *
     * @param {Number} timestamp Timestamp to transform into Date
     * @return {Date} The Date correponding to the given timestamp
     */
    function timestampToDate(timestamp) {
      return timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
    }

    /**
     * Unserializes a value depending on the filter type.
     *
     * @param {Object} filter The filter corresponding to the specified value
     * @param {String} filter.type The filter type
     * @param {(String|Number|Boolean)} value The filter value
     * @return {*} The unserialized value respecting the filter type
     */
    function unserializeFilterValue(filter, value) {
      if (filter.type === 'dateTime') return timestampToDate(value);
      if (filter.type === 'boolean') return Number(value) ? true : false;
      return value;
    }

    /**
     * Serialiazes a value depending on a filter type.
     *
     * @param {Object} filter The filter corresponding to the specified value
     * @param {String} filter.type The filter type
     * @param {(String|Number|Boolean)} value The filter value
     * @return {String} The serialized filter value
     */
    function serializeFilterValue(filter, value) {
      if (filter.type === 'dateTime') return value && value.getTime();
      if (filter.type === 'boolean') return Number(value);
      return value;
    }

    /**
     * Serializes form values.
     *
     * @param {Object} formValues The key / value pairs of form value to serialize
     * @return {Object} The list of serialized form values
     */
    function serializeFormValues(formValues) {
      var values = {};

      // Sort
      values.sortBy = formValues.sortBy ? 'views' : 'date';
      values.sortOrder = formValues.sortOrder ? 'asc' : 'desc';

      // Date start and date end
      if (formValues.dateStart) values.dateStart = formValues.dateStart.getTime();
      if (formValues.dateEnd) {

        // Set end date to same date at 1 millisecond before midnight
        var dateEnd = new Date(formValues.dateEnd);
        dateEnd.setHours(0);
        dateEnd.setMinutes(0);
        dateEnd.setSeconds(0);
        dateEnd.setMilliseconds(0);
        dateEnd.setDate(dateEnd.getDate() + 1);
        values.dateEnd = dateEnd.getTime() - 1;

      }

      // Query
      if (formValues.query) values.query = formValues.query;

      // Points of interest
      values.searchInPois = Number(formValues.searchInPois);

      // Filters
      for (var id in formValues) {
        for (var i = 0; i < $scope.filters.length; i++) {
          var filter = $scope.filters[i];
          if (filter.id === id)
            values[id] = serializeFilterValue(filter, formValues[id]);
        }
      }

      return values;
    }

    /**
     * Prepares form values to be used as query parameters.
     *
     * @param {Object} formValues The key / value pairs of form value
     * @return {Object} The list of form values formatted for query parameters
     */
    function formValuesToQueryParameters(formValues) {
      return serializeFormValues(formValues);
    }

    /**
     * Builds search form model from given query parameters.
     *
     * @param {Object} parameters The key / value pairs of query parameters
     * @return {Object} The interpreted form values
     */
    function queryParametersToForm(parameters) {
      var values = {};

      // Date start and date end
      if (parameters.dateStart) values.dateStart = timestampToDate(parameters.dateStart);
      if (parameters.dateEnd) values.dateEnd = timestampToDate(parameters.dateEnd);

      // Query
      if (parameters.query) values.query = parameters.query;

      // Sort
      values.sortBy = parameters.sortBy === 'views';
      values.sortOrder = parameters.sortOrder === 'asc';

      // Filters
      $scope.filters.forEach(function(filter) {
        for (var id in parameters) {
          if (id === filter.id)
            values[id] = unserializeFilterValue(filter, parameters[id]);
        }

        if (values[filter.id] === undefined && filter.default)
          values[filter.id] = unserializeFilterValue(filter, filter.default);
      });

      // Points of interest
      if (parameters.searchInPois === undefined)
        values.searchInPois = Boolean(openVeoPortalSettings.search.pois);
      else
        values.searchInPois = Boolean(Number(parameters.searchInPois));

      return values;
    }

    /**
     * Decodes all HTML entities and removes all HTML elements from specified text.
     *
     * @param {String} text The text to sanitize
     * @return {String} The sanitized text
     */
    function removeHtmlFromText(text) {

      // Use he library to decode text as it might contain HTML entities
      text = he.decode(text);

      // Remove any HTML tag (<\/?[^>]*>), carriage return (\n|\r\n) and non-breaking space (\u00a0) from the text
      // HTML tags and entities are removed while new lines and non-breaking spaces are replaced by spaces
      return text.replace(/(<\/?[^>]*>)|(\n)|(\r\n)|(\u00a0)/gi, function(
        match,
        tag,
        newLine,
        newLine2,
        nonBreakingSpace
      ) {
        if (tag) return '';
        if (newLine || newLine2 || nonBreakingSpace) return ' ';
      }).replace(/ +/gi, ' ').trim();
    }

    /**
     * Truncates videos texts (title and descriptions) depending on the viewport size.
     *
     * If a query has been made using keywords it emphasis the query in the properties of the videos where it has been
     * found. The text containing the emphased keywords is also truncated around it.
     * If query is not found in the description the description is set to the leading paragraph.
     *
     * @param {Array} videos The list of videos with for each video: title, pois, rawLeadParagraph and rawDescription
     * @return {Array} The reference to the list of videos (not a copy)
     */
    function truncateVideosTexts(videos) {
      isLargeScreen = $mdMedia('gt-md');

      var titleLimit = 90;
      var descriptionLimit = 45;
      var descriptionSpreadLimit = 90;
      var descriptionLargeScreenLimit = 50;
      var descriptionSpreadLargeScreenLimit = 200;
      var poiLimit = 15;
      var poiLargeScreenLimit = 40;
      var query = $scope.search && $scope.search.query;

      videos.forEach(function(video) {
        var title;
        var description;
        var limit = isLargeScreen ? descriptionLargeScreenLimit : descriptionLimit;
        var poisLimit = isLargeScreen ? poiLargeScreenLimit : poiLimit;

        if (video.title && query)
          title = self.emphasisQuery(video.title, query, titleLimit);
        if (video.title && !title)
          title = self.emphasisQuery(video.title, removeHtmlFromText(video.title).split(' ')[0], titleLimit, true);

        // No point of interest found, authorize description to spread
        if (!video.pois.length) {
          limit = isLargeScreen ? descriptionSpreadLargeScreenLimit : descriptionSpreadLimit;
        } else {
          video.pois.forEach(function(poi) {
            poi.name = self.emphasisQuery(poi.rawName, query, poisLimit);
            poi.description = self.emphasisQuery(poi.rawDescription, query, poisLimit);
          });
        }

        // Lead paragraph and description
        if (video.rawDescription && query) {
          description = self.emphasisQuery(video.rawDescription, query, limit);
        }
        if (video.rawLeadParagraph && !description) {
          var sanitizedLead = removeHtmlFromText(video.rawLeadParagraph).split(' ')[0];
          description = self.emphasisQuery(video.rawLeadParagraph, sanitizedLead, limit, true);
        }

        video.title = title;
        video.description = description;
      });

      return videos;
    }

    /**
     * Emphasises the query in the given text and truncates around it.
     *
     * All HTML tags in text are ignored, new lines are considered spaces and HTML entities are resolved.
     * Query is searched in the text in case insensitive manner.
     *
     * Truncated result is prefixed and / or suffixed by ellipsis.
     *
     * @param {String} text The text to emphasis and truncate
     * @param {String} query The word or group of words to look for
     * @param {(Number|undefined)} limit The maximum number of expected characters. Note that the ellipsis characters
     * count.
     * @param {Boolean} noEmphasis true to truncate text without emphasing query
     * @param {(Number|undefined)} maxWordsBefore The number of words to keep before the emphasised text, if not set the
     * maximum is kept. Don't use it, it's only for internal use
     * @param {(Number|undefined)} maxWordsAfter The number of words to keep after the emphasised text, if not set the
     * maximum is kept. Don't use it, it's only for internal use
     * @return {(String|null)} The emphasised / truncated text or null if query has not been found in the text
     */
    self.emphasisQuery = function(text, query, limit, noEmphasis, maxWordsBefore, maxWordsAfter) {
      if (!text || !query) return null;

      var sanitizedText = removeHtmlFromText(text);
      var totalWords = sanitizedText.split(' ').length;
      var beforeWordsAroundRegExp;
      var afterWordsAroundRegExp;
      var beforeWordRegExp = '(?:[^ ]* +)';
      var afterWordRegExp = '(?: +[^ ]*)';

      if (!maxWordsBefore && maxWordsBefore !== 0)
        maxWordsBefore = totalWords;

      if (!maxWordsAfter && maxWordsAfter !== 0)
        maxWordsAfter = totalWords;

      if (maxWordsBefore === 0)
        beforeWordsAroundRegExp = '(?: +)';
      else {
        maxWordsBefore = Math.min(maxWordsBefore, totalWords);
        beforeWordsAroundRegExp = '(?:' + beforeWordRegExp + '{1,' + maxWordsBefore + '})';
      }

      if (maxWordsAfter === 0)
        afterWordsAroundRegExp = '(?: +)';
      else {
        maxWordsAfter = Math.min(maxWordsAfter, totalWords);
        afterWordsAroundRegExp = '(?:' + afterWordRegExp + '{1,' + maxWordsAfter + '})';
      }

      // Escape all regExp reserved words from the query
      var queryRegExp = query.replace(/(\?|\||\/|\(|\)|\{|\}|\[|\]|\\)/ig, '\\$1');

      // Look for query in text and truncate
      var truncateRegExp = new RegExp(
        '(' + beforeWordsAroundRegExp + '|^)([^ ]*)(' + queryRegExp + 's?)([^ ]*)(' + afterWordsAroundRegExp + '|$)',
        'i'
      );
      var chunks = sanitizedText.match(truncateRegExp);

      if (!chunks) return null;

      var match = chunks[3];
      var wordsBefore = chunks[1];
      var wordsAfter = chunks[5];
      var extraCharactersBefore = chunks[2];
      var extraCharactersAfter = chunks[4];
      var prefix = chunks.index > 0 ? '...' : '';
      var suffix = '';

      if (
        (
          chunks.index +
          wordsBefore.length +
          extraCharactersBefore.length +
          match.length +
          extraCharactersAfter.length +
          wordsAfter.length
        ) < sanitizedText.length
      ) {
        suffix = '...';
      }

      var emphasisedKeywords = noEmphasis ? match : '<strong>' + match + '</strong>';
      var totalCharacters = prefix.length +
        wordsBefore.trimStart().length +
        extraCharactersBefore.length +
        match.length +
        extraCharactersAfter.length +
        wordsAfter.trimEnd().length +
        suffix.length;
      var result = prefix +
        wordsBefore.trimStart() +
        extraCharactersBefore +
        emphasisedKeywords +
        extraCharactersAfter +
        wordsAfter.trimEnd() +
        suffix;

      if (limit && limit > totalCharacters) {

        // The number of characters is under the limit but a word that was removed before or after can still fit under
        // the limit

        var hypotheticalTotalCharacters = totalCharacters;
        var beforeTextAvailable = (chunks.index > 0) ? sanitizedText.substring(0, chunks.index).trim() : '';
        var afterTextAvailable = sanitizedText.substring(
          chunks.index +
          wordsBefore.length +
          extraCharactersBefore.length +
          match.length +
          extraCharactersAfter.length +
          wordsAfter.length,
          sanitizedText.length
        ).trim();
        var beforeWordsAvailable = beforeTextAvailable ? beforeTextAvailable.split(' ') : [];
        var afterWordsAvailable = afterTextAvailable ? afterTextAvailable.split(' ') : [];
        var beforeWordsActual = wordsBefore.trim() ? wordsBefore.trim().split(' ') : [];
        var afterWordsActual = wordsAfter.trim() ? wordsAfter.trim().split(' ') : [];
        var doesBeforeFit = true;

        if (
          beforeWordsAvailable.length &&
          (!afterWordsAvailable.length || beforeWordsActual.length <= afterWordsActual.length)
        ) {

          // Some words are available before text

          if (beforeWordsAvailable.length === 1) {

            // Only one word available before
            // Remove prefix from the maths

            hypotheticalTotalCharacters = totalCharacters - prefix.length;
          }

          hypotheticalTotalCharacters = hypotheticalTotalCharacters +
            beforeWordsAvailable[beforeWordsAvailable.length - 1].length +
            1;

          if (hypotheticalTotalCharacters <= limit) {

            // Using one more word before fits

            return self.emphasisQuery(text, query, limit, noEmphasis, ++maxWordsBefore, maxWordsAfter);

          }

          doesBeforeFit = false;
        }

        if (
          afterWordsAvailable.length &&
          (!doesBeforeFit || !beforeWordsAvailable.length || afterWordsActual.length <= beforeWordsActual.length)
        ) {

          // Some words are available after text

          if (afterWordsAvailable.length === 1) {

            // Only one word available after
            // Remove suffix from the maths

            hypotheticalTotalCharacters = totalCharacters - suffix.length;
          }

          hypotheticalTotalCharacters = hypotheticalTotalCharacters + afterWordsAvailable[0].length + 1;

          if (hypotheticalTotalCharacters <= limit) {

            // Using one more word after fits

            return self.emphasisQuery(text, query, limit, noEmphasis, maxWordsBefore, ++maxWordsAfter);

          }
        }
      }

      if (
        limit &&
        limit < totalCharacters &&
        (
          (
            match.length +
            extraCharactersBefore.length +
            extraCharactersAfter.length +
            prefix.length +
            suffix.length
          ) < totalCharacters
        ) &&
        (maxWordsBefore || maxWordsAfter > 0)
      ) {
        return self.emphasisQuery(text, query, limit, noEmphasis, --maxWordsBefore, --maxWordsAfter);
      }

      return result;
    };

    /**
     * Prepares videos returned by the server to be used by the view.
     *
     * @param {Array} rawVideos The list of videos as returned by the server
     * @return {Array} The list of videos with, for each video, its thumbnail, date and views, its title and
     * description with emphased keywords, its chapters and tags which match the query
     */
    self.formatVideos = function(rawVideos) {
      var videos = [];
      var query = $scope.search.query;
      var filterPois = function(poi) {
        poi.rawName = poi.name;
        poi.rawDescription = poi.description;

        var name = self.emphasisQuery(poi.name, query);
        var description = self.emphasisQuery(poi.description, query);
        return name || description ? true : false;
      };

      rawVideos.forEach(function(rawVideo) {
        var tags = (rawVideo.tags || []).filter(filterPois);
        var chapters = (rawVideo.chapters || []).filter(filterPois);
        var pois = tags.concat(chapters).sort(function(poi1, poi2) {
          if (poi1.value === poi2.value) return 0;
          return poi1.value < poi2.value ? -1 : 1;
        });

        videos.push({
          id: rawVideo.id,
          title: rawVideo.title,
          rawLeadParagraph: rawVideo.leadParagraph,
          rawDescription: rawVideo.description,
          thumbnail: rawVideo.thumbnail,
          date: rawVideo.date,
          views: rawVideo.views,
          pois: pois
        });
      });

      return truncateVideosTexts(videos);
    };

    /**
     * Makes a search call to the server.
     */
    $scope.fetch = function() {
      $scope.isLoading = true;
      if (canceller) canceller.resolve();
      canceller = $q.defer();

      return searchService.search(
        formValuesToQueryParameters($scope.search),
        $scope.pagination,
        canceller
      ).then(function(result) {
        if (result.data.error) {
          $scope.isLoading = false;
          $scope.showToast('error');
          return;
        }
        $scope.videos = self.formatVideos(result.data.entities);
        $scope.pagination = result.data.pagination;
        $scope.isLoading = false;
        reloadOnPageChange = true;

        var searchQuery = ($scope.search.query) ? $scope.search.query : '';
        var searchCategories = ($scope.search.categories) ? $scope.search.categories : '';

        $analytics.trackSiteSearch(searchQuery, searchCategories, $scope.pagination.size);
      });
    };

    // Listen to advanced search form submit
    $scope.searchSubmit = function() {
      $scope.showAdvancedSearch = false;
      $location.search(formValuesToQueryParameters($scope.search));
    };

    // Listen to advanced search form reset
    $scope.resetSearch = function() {
      $scope.search = queryParametersToForm({query: $scope.search.query});
    };

    // Listen to changes on the number of pages of results
    $scope.$watch('pagination.pages', function(current, old) {
      var input = [];
      for (var i = 1; i <= current; i++) input.push(i);
      $scope.pages = input;
    });

    // Listen to changes on the current page
    $scope.$watch('pagination.page', function(current, old) {
      $scope.pagination.page = current;
      if (reloadOnPageChange) $scope.fetch();
      else reloadOnPageChange = true;
    });

    // Listen to changes on location
    $scope.$on('$routeUpdate', function(event, route) {
      $scope.search = queryParametersToForm($location.search());

      if (!$scope.context || !$scope.context.keepContext) {
        reloadOnPageChange = false;
        $scope.pagination.page = 0;
        $scope.fetch();
      } else {
        $scope.context.keepContext = false;
      }
    });

    // Listen to window resize event to truncate videos texts
    window.addEventListener('resize', function() {
      if (isLargeScreen === $mdMedia('gt-md')) return;
      isLargeScreen = $mdMedia('gt-md');
      safeApply(function() {
        truncateVideosTexts($scope.videos);
      });
    });

    // Build model from query parameters
    $scope.search = queryParametersToForm($location.search());

    // Perform a search using current model
    $scope.fetch();

  }

  app.controller('SearchController', SearchController);
  SearchController.$inject = [
    '$scope',
    '$location',
    '$q',
    '$timeout',
    'searchService',
    'filters',
    '$analytics',
    '$mdMedia'
  ];

})(angular.module('ov.portal'));
