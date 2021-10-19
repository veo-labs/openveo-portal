#!/usr/bin/env node

/**
 * Builds back office and front client files.
 *
 * It needs to be run from project root directory.
 *
 * Usage:
 *
 * # Build back office and front office clients for development
 * $ build
 *
 * # Build back office and front office clients for production
 * $ build -p
 *
 * # Build only back office client for development
 * $ build -b
 *
 * # Build only back office client for production
 * $ build -b -p
 *
 * # Build only front office client for development
 * $ build -f
 *
 * # Build only front office client for production
 * $ build -f -p
 */

'use strict';

const {exec} = require('child_process');
const {writeFile} = require('fs/promises');
const path = require('path');
const util = require('util');

const openVeoApi = require('@openveo/api');

const applicationConf = require('../conf.json');

/**
 * Logs given message to stdout with a prefix.
 *
 * @param {String} message the message to log
 */
function log(message) {
  console.log(`build > ${message}`);
}

/**
 * Parses command line arguments.
 *
 * @return {Object} args The list of parsed arguments
 */
function getArguments() {
  const args = {
    production: false,
    front: true,
    back: true
  };

  for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
      case '-p':
        args.production = true;
        break;
      case '-f':
        args.front = true;
        args.back = false;
        break;
      case '-b':
        args.front = false;
        args.back = true;
        break;
      default:
        console.log(`unexpected option ${process.argv[i]}`);
        break;
    }
  }

  return args;
}

/**
 * Compiles and concat JavaScript files.
 *
 * @param {String} workingDirectory Path of the directory from where to launch the compilation
 * @param {Array} filesPaths The list of files paths to compile and concat
 * @param {String} outputPath The file output path
 * @param {Boolean} [sourcesMapUri] The URI where to find main source map
 * @param {Boolean} [production] true to build for production, false otherwise
 * @return {Promise} Promise resolving when JavaScript files have been compiled
 */
async function compileJavaScriptFiles(workingDirectory, filesPaths, outputPath, sourcesMapUri, production) {
  const outputFileName = path.basename(outputPath);
  return new Promise((resolve, reject) => {
    const command = `npx uglifyjs \
-c \
-m \
${!production ? '--source-map "root=\'' + sourcesMapUri + '\',url=\'' + outputFileName + '.map\'"' : ''} \
-o ${outputPath} \
-- ${filesPaths.join(' ')}`;
    log(command);
    exec(command, {cwd: workingDirectory}, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

/**
 * Compiles SCSS files.
 *
 * @param {String} scssDirectoryPath The path where to find SCSS files
 * @param {String} mainScssFilePath The path of the main SCSS file to compile
 * @param {String} outputPath The destination directory path
 * @param {Boolean} [production] true to build for production, false otherwise
 * @return {Promise} Promise resolving when SCSS files have been compiled
 */
async function compileScssFiles(scssDirectoryPath, mainScssFilePath, outputPath, production) {
  return new Promise((resolve, reject) => {
    const command = `compass compile -c ./compass.rb \
--force \
--sass-dir ${scssDirectoryPath} \
--css-dir ${outputPath} \
${production ? '-e production -s compressed --no-sourcemap' : ''} \
-- ${mainScssFilePath}
`;
    log(command);
    exec(command, {cwd: process.cwd()}, (error, stdout, stderr) => {
      if (error) return reject(error);
      console.log(stdout);
      return resolve();
    });
  });
}

/**
 * Copies ordered sources to given directory.
 *
 * @param {String} baseSourcesPath The base path of all JavaScript and CSS / SCSS files
 * @param {String} jsDirectoryPath The path of the directory to copy JavaScript files to
 * @param {String} cssDirectoryPath The path of the directory to copy SCSS files to
 * @param {Object} orderedSources The ordered JavaScript and CSS / SCSS sources
 * @param {Object} orderedSources.js The ordered JavaScript sources
 * @param {Object} orderedSources.css The ordered CSS / SCSS sources
 * @return {Promise} Promise resolving when files have been copied
 */
async function copyOrderedSources(baseSourcesPath, jsDirectoryPath, cssDirectoryPath, orderedSources) {
  const copiedOrderedSources = {js: [], css: []};

  const copyFiles = async function(filesToCopy, filesCopied, outputPath) {
    for (let filePath of filesToCopy) {
      const relativeFilePath = filePath.replace(baseSourcesPath, '');
      const destinationPath = path.join(outputPath, relativeFilePath);

      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        filePath,
        destinationPath
      );
      filesCopied.push(destinationPath);
    }
  };

  await copyFiles(orderedSources.js, copiedOrderedSources.js, jsDirectoryPath);
  await copyFiles(orderedSources.css, copiedOrderedSources.css, cssDirectoryPath);

  return Promise.resolve(copiedOrderedSources);
}

/**
 * Generates HTML templates cache.
 *
 * @param {String} baseSourcesPath The base directory to look for HTML templates
 * @param {String} outputPath The path of the template cache file
 * @return {Promise} Promise resolving when template cache file has been generated
 */
async function generateTemplatesCache(baseSourcesPath, outputPath) {
  const templatesPaths = [];
  const sources = await util.promisify(openVeoApi.fileSystem.readdir.bind(openVeoApi.fileSystem))(baseSourcesPath);

  for (let source of sources) {
    if (source.isFile() && /\.html$/.test(source.path)) {
      templatesPaths.push(source.path);
    }
  }

  return util.promisify(openVeoApi.angularJs.parser.generateTemplatesCache.bind(openVeoApi.angularJs.parser))(
    templatesPaths,
    outputPath,
    'opa',
    'opa-'
  );
}

/**
 * Gets the list of JavaScript and SCSS sources ordered by dependence.
 *
 * @param {String} baseSourcesPath The base directory to look for sources
 * @return {Promise} Promise resolving with JavaScript and CSS / SCSS files ordered by dependence
 */
async function getOrderedSources(baseSourcesPath) {
  const filesPaths = [];
  const sources = await util.promisify(openVeoApi.fileSystem.readdir.bind(openVeoApi.fileSystem))(baseSourcesPath);

  for (let source of sources) {
    if (source.isFile() && !/(\.spec\.js|\/index\.scss|\.json|\.html)$/.test(source.path)) {
      filesPaths.push(source.path);
    }
  }

  return util.promisify(openVeoApi.angularJs.parser.orderSources.bind(openVeoApi.angularJs.parser))(filesPaths);
}

/**
 * Resolves given files paths with the given prefix.
 *
 * @param {Array} filesPaths The list of files paths to resolve
 * @return {Array} The list of resolved files paths
 */
function resolveFilesPaths(filesPaths, prefix) {
  return filesPaths.map((filePath) => {
    return path.join(prefix, filePath);
  });
}

/**
 * Builds back office client and front office client.
 */
async function main() {
  const args = getArguments();
  const rootPath = path.join(__dirname, '../');
  const assetsPath = path.join(rootPath, 'assets');
  const backAssetsPath = path.join(assetsPath, 'be');
  const baseSourcesPath = path.join(rootPath, 'app/client');
  const buildPath = path.join(rootPath, 'build');
  const backBuildPath = path.join(buildPath, 'admin');

  const frontBuildPath = path.join(buildPath, 'front');
  const frontCssPath = path.join(assetsPath, 'css');
  const frontSourcesPath = path.join(baseSourcesPath, 'front');
  const frontJsPath = path.join(frontSourcesPath, 'js');
  const frontScssPath = path.join(frontSourcesPath, 'compass/sass');
  const frontScssBuildPath = path.join(frontBuildPath, 'scss');
  const frontMainScssBuildPath = path.join(frontScssBuildPath, 'style.scss');
  const frontMainScssDistPath = path.join(frontCssPath, 'style.scss');
  const frontMainCssBuildPath = path.join(frontScssBuildPath, 'style.css');
  const frontMainCssDistPath = path.join(frontCssPath, 'style.css');
  const frontMainCssSourceMapBuildPath = path.join(frontScssBuildPath, 'style.css.map');
  const frontMainCssSourceMapDistPath = path.join(frontCssPath, 'style.css.map');
  const frontScssBaseDistPath = path.join(frontCssPath, 'base');
  const frontScssMixinsDistPath = path.join(frontCssPath, 'mixins');
  const frontScssModulesDistPath = path.join(frontCssPath, 'modules');

  const backSourcesPath = path.join(baseSourcesPath, 'admin');
  const backOrderedSourcesBuildPath = path.join(backBuildPath, 'ng-admin-files.json');
  const backJsBuildPath = path.join(backBuildPath, 'js');
  const backJsDistPath = path.join(backAssetsPath, 'js');
  const backCssDistPath = path.join(backAssetsPath, 'css');
  const backViewsDistPath = path.join(backAssetsPath, 'views');
  const backMainScssPath = path.join(backSourcesPath, 'index.scss');
  const backScssBuildPath = path.join(backBuildPath, 'scss');
  const backScssDistPath = path.join(backCssDistPath, 'scss');
  const backMainScssBuildPath = path.join(backBuildPath, 'index.scss');
  const backMainScssDistPath = path.join(backCssDistPath, 'index.scss');
  const backMainCssBuildPath = path.join(backBuildPath, 'index.css');
  const backMainCssDistPath = path.join(backCssDistPath, 'index.css');
  const backMainCssSourceMapBuildPath = path.join(backBuildPath, 'index.css.map');
  const backMainCssSourceMapDistPath = path.join(backCssDistPath, 'index.css.map');
  const backRootHtmlPath = path.join(backSourcesPath, 'index.html');
  const backRootHtmlBuildPath = path.join(backBuildPath, 'index.html');
  const backRootHtmlDistPath = path.join(backViewsDistPath, 'index.html');
  const backMainJsDistPath = path.join(backJsDistPath, 'openveo-portal-admin.js');
  const backJsSourcesDistPath = path.join(backJsDistPath, 'js');
  const backTemplatesCacheDistPath = path.join(backJsDistPath, 'openveo-portal-admin.templates.js');

  if (args.front) {
    log(`Copy front office SCSS files to ${frontScssBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      frontScssPath,
      frontScssBuildPath
    );

    log(`Compile front office main SCSS file ${frontMainScssBuildPath} to ${frontScssBuildPath}`);
    await compileScssFiles(frontScssBuildPath, frontMainScssBuildPath, frontScssBuildPath, args.production);

    log(`Copy front office main CSS file ${frontMainCssBuildPath} to ${frontMainCssDistPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      frontMainCssBuildPath,
      frontMainCssDistPath
    );

    if (!args.production) {
      log(`Copy front office main SCSS file ${frontMainScssBuildPath} to ${frontMainScssDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        frontMainScssBuildPath,
        frontMainScssDistPath
      );

      log(`Copy front office main CSS source map file ${frontMainCssSourceMapBuildPath} to \
        ${frontMainCssSourceMapDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        frontMainCssSourceMapBuildPath,
        frontMainCssSourceMapDistPath
      );

      log(`Copy front office SCSS base sources files to ${frontScssBaseDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        path.join(frontScssBuildPath, 'base'),
        frontScssBaseDistPath
      );

      log(`Copy front office SCSS mixins sources files to ${frontScssMixinsDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        path.join(frontScssBuildPath, 'mixins'),
        frontScssMixinsDistPath
      );

      log(`Copy front office SCSS mixins sources files to ${frontScssModulesDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        path.join(frontScssBuildPath, 'modules'),
        frontScssModulesDistPath
      );
    } else {
      const frontJsLibraryDistPath = path.join(assetsPath, applicationConf.scriptLibFiles.prod[0]);
      const frontJsDistPath = path.join(assetsPath, applicationConf.scriptFiles.prod[0]);

      log(`Compile front office library JavaScript files to ${frontJsLibraryDistPath}`);
      await compileJavaScriptFiles(
        rootPath,
        resolveFilesPaths(applicationConf.scriptLibFiles.dev, frontJsPath),
        frontJsLibraryDistPath,
        null,
        true
      );

      log(`Compile front office JavaScript files to ${frontJsDistPath}`);
      await compileJavaScriptFiles(
        rootPath,
        resolveFilesPaths(applicationConf.scriptFiles.dev, frontJsPath),
        frontJsDistPath,
        null,
        true
      );
    }
  }

  if (args.back) {
    const orderedSources = await getOrderedSources(backSourcesPath);

    log(`Save back office ordered JavaScript and CSS / SCSS files to ${backOrderedSourcesBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.mkdir.bind(openVeoApi.fileSystem))(backBuildPath);
    await writeFile(backOrderedSourcesBuildPath, JSON.stringify(orderedSources));

    log(`Copy back office ordered sources to ${backJsBuildPath} and ${backScssBuildPath}`);
    await copyOrderedSources(
      backSourcesPath,
      backJsBuildPath,
      backScssBuildPath,
      orderedSources
    );

    log(`Copy back office main SCSS file ${backMainScssPath} to ${backMainScssBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      backMainScssPath,
      backMainScssBuildPath
    );

    log(`Inject back office components SCSS and Roboto SCSS in ${backMainScssBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.replace.bind(openVeoApi.fileSystem))(
      backMainScssBuildPath,
      [
        {
          pattern: /\/\/ INJECT_SCSS/,
          replacement: orderedSources.css.map(function(cssSourcePath) {
            return '@import "./scss' + cssSourcePath.replace(backSourcesPath, '') + '";';
          }).join('\n')
        },
        {
          pattern: /\/\/ INJECT_FONT_SCSS/,
          replacement: '@import "../../node_modules/roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss";'
        }
      ]
    );

    log(`Copy back office main HTML file ${backRootHtmlPath} to ${backRootHtmlBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      backRootHtmlPath,
      backRootHtmlBuildPath
    );

    log(`Inject back office libraries scripts in ${backRootHtmlBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.replace.bind(openVeoApi.fileSystem))(
      backRootHtmlBuildPath,
      [
        {
          pattern: /\/\/ INJECT_LIBRARY_SCRIPTS/,
          replacement: applicationConf.be.libraries.map(function(library) {
            const htmlScripts = [];

            library.files.forEach((libraryFilePath) => {
              if (/.js$/.test(libraryFilePath)) {
                const libraryFileUri = path.join('/', library.mountPath, libraryFilePath);
                htmlScripts.push(`<script src="${libraryFileUri}"></script>`);
              }
            });

            return htmlScripts.join('\n');
          }).join('\n')
        }
      ]
    );

    log(`Compile back office SCSS file ${backMainScssBuildPath} to ${backScssBuildPath}`);
    await compileScssFiles(backBuildPath, backMainScssBuildPath, backBuildPath, args.production);

    log(`Replace back office Roboto SCSS font paths in ${backMainCssBuildPath}`);
    await util.promisify(openVeoApi.fileSystem.replace.bind(openVeoApi.fileSystem))(
      backMainCssBuildPath,
      [
        {pattern: /\.\.\/\.\.\/\.\.\/fonts\/roboto\//g, replacement: '/roboto-fontface/fonts/roboto/'}
      ]
    );

    log(`Compile back office JavaScript files to ${backJsDistPath} from ${backBuildPath}`);
    await compileJavaScriptFiles(
      backBuildPath,
      orderedSources.js.map(function(jsSourcePath) {
        return jsSourcePath.replace(backSourcesPath, 'js');
      }),
      backMainJsDistPath,
      '/be/js',
      args.production
    );

    log(`Copy back office root HTML file ${backRootHtmlBuildPath} to ${backRootHtmlDistPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      backRootHtmlBuildPath,
      backRootHtmlDistPath
    );

    log(`Copy back office CSS file ${backMainCssBuildPath} to ${backMainCssDistPath}`);
    await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
      backMainCssBuildPath,
      backMainCssDistPath
    );

    log(`Generate back office cache for HTML templates to ${backTemplatesCacheDistPath}`);
    await generateTemplatesCache(path.join(backSourcesPath, 'components'), backTemplatesCacheDistPath);

    if (!args.production) {
      log(`Copy back office CSS source map file ${backMainCssSourceMapBuildPath} to ${backMainCssSourceMapDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        backMainCssSourceMapBuildPath,
        backMainCssSourceMapDistPath
      );

      log(`Copy back office main SCSS source file ${backMainScssBuildPath} to ${backMainScssDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        backMainScssBuildPath,
        backMainScssDistPath
      );

      log(`Copy back office SCSS source files ${backScssBuildPath} to ${backScssDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        backScssBuildPath,
        backScssDistPath
      );

      log(`Copy back office JavaScript source files ${backJsBuildPath} to ${backJsSourcesDistPath}`);
      await util.promisify(openVeoApi.fileSystem.copy.bind(openVeoApi.fileSystem))(
        backJsBuildPath,
        backJsSourcesDistPath
      );
    }
  }
}

main();
