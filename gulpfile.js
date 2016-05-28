var gulp = require('gulp'),
  path = require('path'),
  del = require('del'),
  fs = require('fs'),
  args = require('yargs').argv,
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  gulpFilter = require('gulp-filter'),
  gulpIf = require('gulp-if'),
  plumber = require('gulp-plumber'),
  gutil = require('gulp-util'),
  merge = require('merge2'),
  sass = require('gulp-sass'),
  ts = require('gulp-typescript'),
  tslint = require('gulp-tslint'),
  notify = require('gulp-notify'),
  minify = require('gulp-minify'),
  linker = require('gulp-linker'),
  flatten = require('gulp-flatten'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  traceur = require('gulp-traceur'),
  runSequence = require('run-sequence');

var options = {
  version: '1.0.0',
  isProduction: args.prod,
  sourcePath: 'app',
  buildPath: 'build',
  cssFileName: 'styles.css',
  buildCssMinFileName: 'styles.min.css',
  jsFileName: 'scripts.js',
  jsMinFileName: 'scripts.min.js',
  buildThirdPartyCssFileName: 'vendor.css',
  buildThirdPartyJsFileName: 'vendor.js',
  tsConfigFileName: 'tsconfig.json'
};

options.indexHtmlFilePath = path.join(options.buildPath, 'index.html')
options.sourceCssFilePath = path.join(options.buildPath, options.cssFileName);
options.buildThirdPartyCssFilePath = path.join(options.buildPath, options.buildThirdPartyCssFileName);
options.buildThirdPartyJsFilePath = path.join(options.buildPath, options.buildThirdPartyJsFileName);

options.thirdPartyCssFiles = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

options.thirdPartyJsFiles = [
  'node_modules/angular/angular.min.js',
  "node_modules/angular-ui-router/release/angular-ui-router.min.js",
  "node_modules/angular-animate/angular-animate.min.js",
  "node_modules/angular-touch/angular-touch.min.js",
  "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"
];

// Clean up the project
gulp.task('clean', function () {
  return del([options.buildPath]);
});

// Compile sass to css
gulp.task('sassToCss', function (done) {
  var result = gulp.src('styles/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', notify.onError({
      message: '<%= error.message %>',
      title: 'Error running sassToCss'
    })))
    .pipe(sourcemaps.write())
    .pipe(rename(options.cssFileName))
    .pipe(gulp.dest(options.buildPath));

  if (options.isProduction) {
    result.pipe(minify())
      .pipe(rename(options.buildCssMinFileName))
      .pipe(gulp.dest(options.buildPath));
  }

  done();
});

// Copy third party components CSS files
gulp.task('copyThirdPartyCssFiles', function () {
  return gulp.src(options.thirdPartyCssFiles)
    .pipe(concat(options.buildThirdPartyCssFileName))
    .pipe(gulp.dest(options.buildPath));
});

// Copy third party components JS files
gulp.task('copyThirdPartyJsFiles', function () {
  return gulp
    .src(options.thirdPartyJsFiles)
    .pipe(concat(options.buildThirdPartyJsFileName))
    .pipe(gulp.dest(options.buildPath));
});

// Copy static content files to output folder: html files, images, etc
gulp.task('copyStaticContentFiles', function () {
  var htmlAndImg = gulp.src([
    options.sourcePath + '/**/*.html',
    options.sourcePath + '/**/img/*.*'
  ])
    .pipe(gulp.dest(options.buildPath));

  return merge(htmlAndImg);
});

// Compile TS files
gulp.task('compileTs', function () {
  var tsFiles = path.join(options.sourcePath, '**/*.ts');
  var streams = merge();
  var tsProject = ts.createProject(options.tsConfigFileName);
  var definitionsFilter = gulpFilter(['**/*.ts', '!**/*d.ts'], {
    restore: true
  });

  var tsResult = tsProject.src()
    .pipe(gulpIf(args.watch, plumber(function (error) {
      gutil.log(error.message);
      this.emit('end');
    })))
    .pipe(definitionsFilter)
    .pipe(tslint({
      configuration: JSON.parse(fs.readFileSync('tslint.json'))
    }))
    .pipe(tslint.report('prose'))
    .pipe(definitionsFilter.restore)
    .pipe(ts({
      declaration: true,
      noEmitOnError: true
    }))
    .on('error', notify.onError({
      message: '<%= error.message %>',
      title: 'Error running compileTs'
    }));

  if (options.isProduction) {
    var dtsResult = tsResult.dts
      .pipe(concat('scripts.d.ts'))
      .pipe(gulp.dest(options.buildPath));

    streams.add(dtsResult);
  }

  var jsResult = merge(tsResult.js);

  if (options.isProduction) {
    jsResult = jsResult.pipe(concat(options.jsFileName));
  } else {
    jsResult = jsResult.pipe(flatten());
  }

  jsResult = jsResult.pipe(gulp.dest(options.buildPath));
  streams.add(jsResult);

  return merge(streams);
});

// Minify application scripts
gulp.task('prepareScriptsForProd', function () {
  if (options.isProduction) {
    var buildJsFilePath = path.join(options.buildPath, options.jsFileName);
    return gulp.src([buildJsFilePath])
      .pipe(sourcemaps.init())
      .pipe(traceur({
        script: true
      }))
      .pipe(concat(options.jsMinFileName))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(options.buildPath));
  } else {
    gutil.log('Not run ', gutil.colors.gray('runs only when --prod flag is specified'));
  }
});

// Add CSS files to index.html page
gulp.task('linkCss', function () {
  var cssFile = path.join(options.buildPath, (options.isProduction ? options.buildCssMinFileName : options.cssFileName));

  return gulp.src(options.indexHtmlFilePath)
    .pipe(linker({
      scripts: [
        options.buildThirdPartyCssFilePath,
        cssFile,
      ],
      startTag: '<!--STYLES-->',
      endTag: '<!--STYLES END-->',
      fileTmpl: '<link rel="stylesheet" href="%s?v=' + options.version + '"/>',
      appRoot: options.buildPath + '/'
    }))
    .pipe(gulp.dest(options.buildPath));
});

// Add JS files to index.html page
gulp.task('linkScripts', function (done) {
  var jsMinFilePath = path.join(options.buildPath, options.jsMinFileName);

  return gulp.src(options.indexHtmlFilePath)
    .pipe(linker({
      scripts: [
        options.buildThirdPartyJsFilePath,
        options.isProduction ? jsMinFilePath : [
          options.buildPath + '/*Module.js',
          options.buildPath + '/*Directive.js',
          options.buildPath + '/*Controller.js',
          options.buildPath + '/*Template.js',
          options.buildPath + '/*ViewModel.js',
          options.buildPath + '/*.js'
        ]
      ],
      startTag: '<!--SCRIPTS-->',
      endTag: '<!--SCRIPTS END-->',
      fileTmpl: '<script type="text/javascript" src="%s?v=' + options.version + '"></script>',
      appRoot: options.buildPath + '/'
    }))
    .pipe(gulp.dest(options.buildPath));
});

gulp.task('watch', ['default'], function (done) {
  gulp.watch('app/styles/**/*.scss', { name: "css changes" }, ['sassToCss']);
  gulp.watch('app/**/*.html', { name: "html changes" }, function() {
    runSequence('copyStaticContentFiles', 'linkCss', 'linkScripts');
  });
  gulp.watch('app/**/*.ts', { name: "typescript changes", events: ['change'] }, ['compileTs']);
  gulp.watch('app/**/*.ts', { name: "typescript add/remove", events: ['add', 'unlink'] }, function () {
	  runSequence('compileTs', 'linkScripts');
  }
  );
});

gulp.task('default', function (done) {
  return runSequence(
    'clean',
    'copyStaticContentFiles',
    'sassToCss',
    'copyThirdPartyCssFiles',
    'linkCss',
    'compileTs',
    'copyThirdPartyJsFiles',
    'prepareScriptsForProd',
    'linkScripts',
    done
  );
});