# gulp-as-css-imports

Add CSS file with @import for all files in the stream.

Install:

```sh
npm install gulp-as-css-imports --save-dev
```


Example:

```js
var asCSSImports = require('gulp-as-css-imports');

gulp.task('some-task', function() {
    return gulp.src('src/**/*.css')
        .pipe(mode === 'prod' ? concat('app.css') : asCSSImports('app.css'))
        .pipe(gulp.dest('./build'));
});


gulp.task('some-task2', function() {
    // Insert Bootstrap import before your files imports.
    return gulp.src('src/**/*.css')
        .pipe(asCSSImports(
            'app.css',
            ['https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css']
        ))
        .pipe(gulp.dest('./build'));
});


gulp.task('some-task3', function() {
    // Insert Bootstrap import after your files imports.
    return gulp.src('src/**/*.css')
        .pipe(asCSSImports(
            'app.css',
            ['https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'],
            true
        ))
        .pipe(gulp.dest('./build'));
});
```
