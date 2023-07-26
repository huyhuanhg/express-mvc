const gulp = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const rename = require('gulp-rename')

gulp.task('sass', () => gulp.src('src/resources/scss/style.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename((path) => ({
      dirname: path.dirname + '',
      basename: 'main',
      extname: '.css'
    })))
    .pipe(gulp.dest('src/public/css'))
)

gulp.task('watch', () => gulp.watch('src/**/*.scss', gulp.series('sass')))
