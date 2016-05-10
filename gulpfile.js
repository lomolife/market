"use strict";
const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const less = require('gulp-less');
const webpack = require('gulp-webpack');
// less to css 包
const LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
// sourcemaps
const sourcemaps = require('gulp-sourcemaps');


gulp.task('lesstocss', () => {
    let files = ['common', 'check', 'good', 'index', 'new', 'message', 'search', 'sells'];
    for (var i = 0; i < files.length; i++) {
        gulp.src(`less/${files[i]}.less`)
            .pipe(sourcemaps.init())
            .pipe(less({
                plugins: [autoprefix, cleancss]
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('app/static/dist/css/'));
    }
});


gulp.task('es6toes5', () => {
    return gulp.src('es/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-runtime']
        }))
        .pipe(gulp.dest('app/static/dist/js/es5/'));
});

gulp.task('estojs', () => {
    var files = ['index', 'check', 'good', 'new', 'push', 'search', 'sells', 'person'];
    files.forEach( function(file, index) {
        var input = 'app/static/dist/js/es5/' + file + '.js';
        var output = file + '.js';
        gulp.src(input)
            .pipe(webpack({
                output: {
                    filename: output
                }
            }))
            .pipe(minify({
                compress: true
            }))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest('app/static/dist/js'));
    });    
    // return gulp.src('app/static/dist/js/es5/*.js').
    //     pipe(webpack({
    //         output: {
    //             filename: 'bundle.js'
    //         }
    //     }))
    //     .pipe(minify({
    //         compress: true
    //     }))
    //     .pipe(sourcemaps.init({loadMaps: true}))
    //     .pipe(sourcemaps.write("."))
    //     .pipe(gulp.dest('app/static/dist/js'));
});

gulp.task('default', ['lesstocss', 'es6toes5']);
