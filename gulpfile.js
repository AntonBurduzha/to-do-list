var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var bsReload = require('browser-sync').reload;
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('script', function() {
    return browserify('./src/scripts/script.js')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('browser-sync', function (){
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('html', function () {
    gulp.src('src/*.html')
      .pipe(gulp.dest('dist'))
});

gulp.task('sass-lint', function () {
    return gulp.src(['src/**/*.scss', '!src/styles/base.scss'])
      .pipe(sassLint({
          options: {
              formatter: 'stylish'
          }
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
});

gulp.task('sass',['sass-lint'], function () {
    gulp.src('src/styles/style.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(gulp.dest('./dist/css'))
      .pipe(gulp.dest('dist/css/'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function () {
    gulp.src('src/img/**/*')
      .pipe(gulp.dest('dist/img'));
});

gulp.task('autoprefixer', function () {
    return gulp.src('./dist/css/style.css')
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('vendor', function () {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('dist/css'));
    gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
      .pipe(gulp.dest('dist/js'));
    gulp.src('node_modules/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('dist/js'));
    gulp.src('node_modules/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('dist/fonts'));
});

gulp.task('js-lint', function () {
    return gulp.src(['src/scripts/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/*.html', ['html', bsReload]);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/scripts/**/*.js', ['script', bsReload]);
});


gulp.task('build', ['html', 'sass', 'script' , 'js-lint', 'vendor', 'images', 'autoprefixer']);