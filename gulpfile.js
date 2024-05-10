'use strict';

// NodeJs methode
const fs = require('fs');

//  dependencies
const gulp = require('gulp');
const gulpIf = require('gulp-if');

//  packages
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const nano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const intercept = require('gulp-intercept');
const exec = require('child_process').exec;
const gulpStylelint = require('@ronilaukkarinen/gulp-stylelint');
const clean = require('gulp-clean');
const cache = require('gulp-cached');
const dependents = require('gulp-dependents');
const print = require('gulp-print').default;

const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();

let phpPath = null;
let isSourceVendor = null;
let pluginBasePath = null;
const gulpOutputScripts = 'web/assets/';
const gulpOutputStyles = 'web/assets/styles/app';
const componentsFolder = 'plugins/craft-components';
const scriptComponentInput = 'scripts/main-components';

const resources = 'src';
const scriptFileExtension = 'ts';
const allStyleFiles = 'styles/**/*.scss';
const allScriptFiles = `scripts/**/*.${ scriptFileExtension }`;
const styleResources = `${ resources }/${ allStyleFiles }`;
const componentsResources = `${ componentsFolder }/resources`;
const componentsResourceNew = '/resources';
const vendorResources = 'vendor/yoo/craft-components/resources';

const minifyNanoConfig = {
  autoprefixer: false,
  zindex: false,
  postcssNormalizeWhitespace: false,
  discardComments: {
    removeAll: true
  }
};

const logError = (message) => {
  console.error(`\x1b[31m !!! ${ message } !!! \x1b[0m`);
};

const logInfo = (message) => {
  console.info(`\x1b[34m---------- \n${ message }\n---------- \x1b[0m`);
};

const getPhpPath = (cb) => {
  if (phpPath === null) {
    exec('which php', (err, stdout, stderr) => {
      phpPath = stdout.trim();
      if (cb != undefined) {
        cb(err === null ? phpPath : false);
      }
    });
  } else {
    cb(phpPath);
  }
};

const gulpBuildScripts = (entryFile, destination, output, failAfterError = false, production = true) => {
  gulp.src(entryFile)
    .pipe(webpackStream({
      mode: production ? 'production' : 'development',
      output: {
        filename: output
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
      },
      module: {
        rules: [{
          test: /\.tsx?$/,
          loader: 'ts-loader'
        }]
      }
    })).on('error', function (err) {
    if (!failAfterError) {
      this.emit('end'); // Don't stop the rest of the task
    }
  })
    .pipe(gulp.dest(destination))
    .pipe(browserSync.reload({stream: true}));
};

const gulpBuildStyles = (input, output, failAfterError = false, minify = false) => {
  return gulp.src(input)
    .pipe(cache('styles'))
    .pipe(dependents({
      '.scss': {
        prefixes: ['_'],
        basePaths: ['./'],
      }
    }))
    .pipe(gulpStylelint({
      reporters: [{
        formatter: 'string',
        console: true,
      }],
      failAfterError,
    }).on('error', sass.logError))
    .pipe(gulpIf(minify, sourcemaps.init()))
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(minify, rename({suffix: '.min'})))
    .pipe(gulpIf(minify, nano(minifyNanoConfig)))
    .pipe(gulpIf(minify, sourcemaps.write('./maps')))
    .pipe(gulp.dest(output))
    .pipe(browserSync.reload({stream: true}));
};

// ===== Local Tasks =====
gulp.task('styles-local-clean', () => cleanScssFiles(`${ gulpOutputStyles }/**`, 'css'));

gulp.task('styles-local', () => {
  return gulpBuildStyles(
    styleResources,
    gulpOutputStyles
  );
});

gulp.task('set-craft-components-path', (cb) => {
  getPhpPath((phpPath) => {
    exec(`${ phpPath } composer.phar show yoo/craft-components`, (err, stdout, stderr) => {
      if (err === null) {
        const regexSource = new RegExp('source.*: \\[(.*)\\] (.*).', 'gm');
        const resultSource = regexSource.exec(stdout);

        const regexDist = new RegExp('dist.*: \\[(.*)\\]', 'gm');
        const resultDist = regexDist.exec(stdout);

        const regexPath = new RegExp('path.*: (.*)', 'gm');
        const resultPath = regexPath.exec(stdout);

        isSourceVendor = resultSource[1] === 'git' && resultDist[1] === '';
        pluginBasePath = resultPath[1];
      } else {
        const regexError = new RegExp('.*Pacakage "yoo\\/craft-components" not found.*', 'gm');
        const resultError = regexError.exec(err);
        if (resultError) {
          logError('Composer Library "yoo/craft-components" is not installed');
        } else {
          logError('An unknown Error occurred, when trying to check if Composer Library "yoo/craft-components" is installed.');
        }
      }
      cb();
    });
  });
});

const cleanScssFiles = (destination, fileType = 'scss') => {
  return gulp.src(`${ destination }/*.${ fileType }`)
    .pipe(clean())
    .pipe(print(filepath => `Deleted File: ${ filepath }`));
};

const syncScssFiles = (source, destination) => {
  return gulp.src(`${ source }/*.scss`)
    .pipe(gulp.dest(`${ destination }`))
    .pipe(print(filepath => `Sync File: ${ filepath }`));
};

let syncSource = null;
let syncDestination = null;

gulp.task('styles-craft-components-sync', gulp.series('set-craft-components-path', (doneSync) => {
    syncSource = `${ pluginBasePath }/resources/styles/`;
    syncDestination = `${ resources }/styles/`;
    doneSync();
  },
  () => cleanScssFiles(`${ syncDestination }helpers`),
  () => cleanScssFiles(`${ syncDestination }abstract/mixins/craft-components`),
  () => cleanScssFiles(`${ syncDestination }abstract/functions/craft-components`),
  () => cleanScssFiles(`${ syncDestination }craft-components`),
  () => syncScssFiles(`${ syncSource }helpers`, `${ syncDestination }helpers`),
  () => syncScssFiles(`${ syncSource }abstract/mixins/craft-components`, `${ syncDestination }abstract/mixins/craft-components`),
  () => syncScssFiles(`${ syncSource }abstract/functions/craft-components`, `${ syncDestination }abstract/functions/craft-components`),
  () => syncScssFiles(`${ syncSource }craft-components`, `${ syncDestination }craft-components`),
));

gulp.task('scripts-local', (done) => {
  gulpBuildScripts(
    `${ resources }/scripts/main.${ scriptFileExtension }`,
    gulpOutputScripts,
    'scripts/main.js',
    false,
    false
  );
  done();
});

gulp.task('scripts-components', gulp.series('set-craft-components-path', (done) => {
  if (!isSourceVendor) {
    gulpBuildScripts(
      `${ pluginBasePath }/resources/scripts/main-components.${ scriptFileExtension }`,
      isSourceVendor ? gulpOutputScripts : `${ pluginBasePath }/resources/dist`,
      'scripts/main-components.min.js',
      true,
      true
    );
  }
  done();
}));

// ===== Dev Tasks =====
gulp.task('styles-dev-build', () => {
  return gulpBuildStyles(
    styleResources,
    gulpOutputStyles,
    true
  );
});

gulp.task('scripts-dev-build', (done) => {
  gulpBuildScripts(
    `${ resources }/scripts/main.${ scriptFileExtension }`,
    gulpOutputScripts,
    'scripts/main.js',
    false,
    false
  );
  done();
});

// ===== Production/Stage Tasks =====
gulp.task('styles-prod-build', () => {
  return gulpBuildStyles(
    styleResources,
    gulpOutputStyles,
    true,
    true
  );
});

gulp.task('scripts-prod-build', (done) => {
  gulpBuildScripts(
    `${ resources }/scripts/main.${ scriptFileExtension }`,
    gulpOutputScripts,
    'scripts/main.min.js',
    true
  );
  done();
});

// ===== Watch Tasks =====
gulp.task('serve', gulp.series(
  'styles-craft-components-sync',
  'styles-local-clean',
  'styles-local',
  'scripts-local',
  'scripts-components',
  'set-craft-components-path',
  () => {
    gulp.src('.env')
      .pipe(intercept((file) => {
        const fileContent = file.contents.toString();
        const localUrl = fileContent.match(/PRIMARY_SITE_URL="(.*)"/i);
        if (localUrl && localUrl.length > 1) {
          browserSync.init({
            proxy: localUrl[1],
            ghostMode: true,
            https: true,
            open: false,
            notify: false,
            browser: false
          });
        } else {
          logError('No valid PRIMARY_SITE_URL found in .env file. Did you run "ddev start"?');
        }
      }));

    if (isSourceVendor) {
      logInfo(
        'The component style files will be pulled from vendor.\n' +
        'Changes in the "plugins/craft-components" folder are ignored.\n' +
        'You can change this in composer.json for local development.'
      );
    }

    gulp.watch(
      styleResources,
      gulp.series('styles-local')
    );

    if (isSourceVendor) {
      gulp.watch(
        `${ resources }/${ allScriptFiles }`,
        gulp.series('scripts-local')
      );
    } else {
      gulp.watch(
        `${ resources }/${ allScriptFiles }`,
        gulp.series('scripts-local', 'scripts-components')
      );
    }

    if (!isSourceVendor) {
      gulp.watch(
        `${ pluginBasePath }/${ allScriptFiles }`,
        gulp.series('scripts-components')
      );
    }

    gulp.watch(
      isSourceVendor ? 'composer.lock' : `${ pluginBasePath }/resources/${ allStyleFiles }`,
      gulp.series('styles-craft-components-sync', 'styles-local')
    );

    gulp.watch([
      '**/*.twig',
      'translations/**/*.php',
      'plugins/**/*.php'
    ]).on('change', browserSync.reload);
  }
));

gulp.task('default', gulp.series('serve'));
gulp.task('dev-build', gulp.series('styles-craft-components-sync', 'styles-dev-build', 'scripts-dev-build'));
gulp.task('prod-build', gulp.series('styles-craft-components-sync', 'styles-prod-build', 'scripts-prod-build'));
