var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');  
var browserSync = require('browser-sync').create();


var DIST = 'static/assets/dist/';
var DIST_JS = DIST + 'js/';
var DIST_CSS = DIST + 'css/';
var DIST_IMG = DIST + 'images/';
var DIST_FONTS = DIST + 'fonts/';

// var ejsmin = require('gulp-ejsmin');

// gulp.task('ejs', function () {
//     gulp.src('./views/*.ejs')
//         .pipe(ejsmin({removeComment: true}))
//         .pipe(gulp.dest("./dist"));
// });


gulp.task('default', ['images','fonts', 'css'], function(){
  console.log('done!')
})

gulp.task('browserSync', function() {
   browserSync.init({
      server: {
         baseDir: 'static/dist/'
      },
   })
})

gulp.task('images', function(){
  return gulp.src('static/assets/images/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest(DIST_IMG));
}); 


// gulp.task('js', function(){
//   return gulp.src(['static/assets/js/*.js'])
//     .pipe(concat('restorent.js'))
//     .pipe(gulp.dest(DIST_JS))
//     .pipe(rename('restorent.min.js'))
//     //.pipe(uglify())
//     .pipe(gulp.dest(DIST_JS));
// });



gulp.task('css', function(){
  return gulp.src(['static/assets/css/font-awesome.min.css','static/assets/css/popuo-box.css','static/assets/css/style-index.css','static/assets/css/font-awesome.css','static/assets/css/font-awesome.css','static/assets/css/wickedpicker.css','static/assets/css/style.css','static/assets/css/fonts.googleapis01.css','static/assets/css/fonts.googleapis.css','static/assets/css/fonts.googleapis2.css','static/assets/css/fonts.googleapis3.css'])
    .pipe(minifyCSS())
    .pipe(concat('restorent.css'))
    .pipe(gulp.dest(DIST_CSS));
});
gulp.task('fonts', function(){
  return gulp.src(['static/assets/fonts/*'])
    .pipe(gulp.dest(DIST_FONTS));
});

