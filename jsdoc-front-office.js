'use strict';

const jsdocConfiguration = require('./jsdoc.js');

jsdocConfiguration.source.include = ['app/client/front/js', 'DOC-FRONT-OFFICE.md'];
module.exports = jsdocConfiguration;
