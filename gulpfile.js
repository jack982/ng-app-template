/*
 * We fetch the environment type
 * If it doesn't exist, we assign it as development
 */
var ENV = process.env.APP_ENV || 'development';

// If our environment is development, we load our local environment variables
if (ENV === 'development') {
    require('dotenv').load();
}

// Our dependecies and file paths
var gulp = require('gulp'),
    //jade = require('gulp-jade'),
    //less = require('gulp-less'),
    pkg  = require('./package.json'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    clean = require('gulp-clean'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    ngConfig = require('gulp-ng-config'),
    path = require('path'),
    fs = require('fs'),
    livereload = require('gulp-livereload'),
    config = require('./config.js'),
    paths = {
        bower : {
          path: 'bower_components', 
            config: 'bower_config.json'
        },
        public: {
            path: 'public/',
            script: './public/js/',
            lib: './public/assets/vendors/',
            index: './public/index.html'
        },
        app: {
            //jade: ['!app/shared/**', 'app/**/*.jade'],
            styles: 'app/assets/css/*.+(less|css)',
            staticFiles: [
                '!app/**/*.+(less|css|js|jade)',
                '!app/images/**/*',
                'app/**/*.*'
            ],
            components: {
                app: './app/app.module.js',
                js: './app/components/**/*.js',
                views: './app/components/**/*.html'
            },
            index: './app/index.html'
        },
        js: {
            vendors : [
                'app/assets/js/demo.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-ui-router/angular-ui-router.min.js'
            ],
            app: [
                'app/components/**/*.js'
            ]
        },
        dest: {
            js: {
                vendor: 'vendor.js',
                application: 'application.js'
            }
        }
    },
// We use this to create the json config file required by gulp-ng-config
    makeJson = function(env, filePath) {
        fs.writeFileSync(filePath,
            JSON.stringify(env));
    };


//
gulp.task('ng-config', ['clean'], function() {
    makeJson(config[ENV], './config.json');
    return gulp.src('./config.json')
        .pipe(
            ngConfig('config.module', {
                constants: config[ENV],
                createModule: true
            })
        )
        .pipe(gulp.dest('./app/components/shared'))
});


gulp.task('browser-sync' /*, ['build', 'watch']*/, function() {
    browserSync({
        server: {
            baseDir: 'public/',
            index: 'index.html'
        }
    });
});


/*
gulp.task('jade', function() {
    gulp.src(paths.app.jade)
        .pipe(jade())
        .pipe(gulp.dest(paths.public.path));
});
*/

/*
gulp.task('less', function() {
    gulp.src(paths.app.styles)
        .pipe(less({
            paths: [path.join(__dirname, './app')]
        }))
        .pipe(gulp.dest('./public'));
});
*/

gulp.task('uglify', function() {
/*    gulp.src( paths.js.vendors )
        .pipe( concat(paths.dest.js.vendor) )
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/vendors'));
        */
});


gulp.task('watch', function() {
    var server = livereload();
    
   gulp.watch( paths.js.app, ['browserify']);
   gulp.watch( paths.js.vendors, ['uglify']).on('change', function(file){
       server.changed(file.path);
   });
});


gulp.task('index', ['clean', 'bower', 'browserify', 'views'], function () {
    var target = gulp.src( paths.app.index );
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['public/assets/js/*.js',
                                'public/assets/vendors/**/*.min.js',
                                'public/app/application.js',
                                'public/assets/css/*.css'
                                
    ], {read: false});

    return target.pipe(inject(sources,   {
            ignorePath: 'public',
            addRootSlash: false
        }))
        .pipe(gulp.dest( 'public/' ));
});

gulp.task('assets', ['clean'], function() {
   return gulp.src('./app/assets/**')
       .pipe(gulp.dest( './public/assets' ));
});

gulp.task('clean', function() {
   return gulp.src( 'public', {read:false})
        .pipe(clean());
});

gulp.task('views', ['clean'], function() {
    return gulp.src(paths.app.components.views, { base: './' })
        .pipe(gulp.dest( paths.public.path ));
});

gulp.task('bower', ['clean'], function() {
   
     return bower({ 'directory': paths.bower.path })
        .pipe(gulp.dest( paths.public.lib ))
});


gulp.task('browserify', ['clean'], function() {
    return browserify(paths.app.components.app).bundle()
        .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
        .on('error', gutil.log.bind(gutil, 'Browserify ' +
            'Error: in browserify gulp task'))
        .pipe(source('application.js'))
       // .pipe(buffer())
       // .pipe(uglify())
        .pipe(gulp.dest('public/app/'));
});

/*
gulp.task('watch', ['build'], function() {
    //gulp.watch(paths.app.jade, ['jade']);
    //gulp.watch(paths.app.styles, ['less']);
    gulp.watch(paths.app.components.js, ['browserify']);
});
*/

gulp.task('build', ['ng-config', 'assets', 'uglify', 'index'  /*'jade', 'less','browserify' , 'bower'*/]);
//gulp.task('default', ['browser-sync', 'moveViews', 'watch', 'build']);
gulp.task('default', ['browser-sync', 'build']);
