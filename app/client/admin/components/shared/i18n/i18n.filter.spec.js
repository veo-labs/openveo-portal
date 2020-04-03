'use strict';

window.assert = chai.assert;

describe('opaTranslate', function() {
  let translations;
  let opaTranslate;
  let $sce;

  // Load modules
  beforeEach(function() {
    translations = {};
    module('opa', {
      opaTranslations: translations
    });
  });

  // Dependencies injections
  beforeEach(inject(function(_$filter_, _$sce_) {
    const $filter = _$filter_;
    $sce = _$sce_;
    opaTranslate = $filter('opaTranslate');
  }));

  it('should be able to translate a simple text', function() {
    translations.TRANSLATION_ID = 'Expected translation';
    assert.equal(
      $sce.getTrustedHtml(opaTranslate('TRANSLATION_ID')),
      translations.TRANSLATION_ID,
      'Wrong translation'
    );
  });

  it('should be able to translate a nested id', function() {
    translations.TRANSLATION_GROUP = {
      TRANSLATION_ID: 'Expected translation'
    };
    assert.equal(
      $sce.getTrustedHtml(opaTranslate('TRANSLATION_GROUP.TRANSLATION_ID')),
      translations.TRANSLATION_GROUP.TRANSLATION_ID,
      'Wrong translation'
    );
  });

  it('should return null if the translation id is not given', function() {
    assert.isNull(opaTranslate());
  });

  it('should return the translation id as is if the translation is not found', function() {
    const translationId = 'TRANSLATION_ID';
    assert.equal($sce.getTrustedHtml(opaTranslate(translationId)), translationId, 'Wrong translation');
  });

  it('should return the translation id as is if translation value is not a string or an object', function() {
    const wrongValues = [[], 42, true];

    wrongValues.forEach((wrongValue) => {
      translations.TRANSLATION_ID = wrongValue;
      assert.equal($sce.getTrustedHtml(opaTranslate('TRANSLATION_ID')), 'TRANSLATION_ID', 'Wrong translation');
    });
  });

  it('should throw an error if the translation id is not a string', function() {
    const wrongIds = [{}, [], 42, true];

    wrongIds.forEach((wrongId) => {
      assert.throws(() => {
        opaTranslate(wrongId);
      });
    });
  });

  it('should accept translation ids in lowercase', function() {
    translations.TRANSLATION_ID = 'Expected translation';
    assert.equal(
      $sce.getTrustedHtml(opaTranslate('translation_id')),
      translations.TRANSLATION_ID,
      'Wrong translation'
    );
  });

  it('should be able to handle pluralization', function() {
    translations.TRANSLATION_ID = {
      SINGLE: 'Single translation',
      PLURAL: 'Plural translation'
    };

    assert.equal(
      $sce.getTrustedHtml(opaTranslate('TRANSLATION_ID', 0)),
      translations.TRANSLATION_ID.SINGLE,
      'Wrong single translation'
    );

    assert.equal(
      $sce.getTrustedHtml(opaTranslate('TRANSLATION_ID', 42)),
      translations.TRANSLATION_ID.PLURAL,
      'Wrong plural translation'
    );
  });

  it('should return the translation id as is if the pluralization translation is not a string', function() {
    const wrongValues = [[], 42, true];

    wrongValues.forEach((wrongValue) => {
      translations.TRANSLATION_ID = {
        SINGLE: wrongValue,
        PLURAL: wrongValue
      };
      assert.equal($sce.getTrustedHtml(opaTranslate('TRANSLATION_ID'), 0), 'TRANSLATION_ID', 'Wrong translation');
      assert.equal($sce.getTrustedHtml(opaTranslate('TRANSLATION_ID'), 42), 'TRANSLATION_ID', 'Wrong translation');
    });
  });

  it('should be able to define placholders in translations', function() {
    const placeholder1Value = 'Placeholder value 1';
    const placeholder2Value = 'Placeholder value 2';
    translations.TRANSLATION_ID = 'Text with placeholders: %placeholder1% and %placeholder2%';
    const exepectedTranslation = translations.TRANSLATION_ID.replace('%placeholder1%', placeholder1Value)
      .replace('%placeholder2%', placeholder2Value);

    assert.equal(
      $sce.getTrustedHtml(
        opaTranslate('TRANSLATION_ID', 0, {
          '%placeholder1%': placeholder1Value,
          '%placeholder2%': placeholder2Value
        })
      ),
      exepectedTranslation,
      'Wrong translation'
    );
  });

});
