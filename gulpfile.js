var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('env_local', function() {
    return gulp.src(`./enviroments/local.env`)
        .pipe(rename('.env'))
        .pipe(gulp.dest('./'));
});
gulp.task('env_deploy', function() {
    return gulp.src(`./enviroments/deploy.env`)
        .pipe(rename('.env'))
        .pipe(gulp.dest('./'));
});