import gulp from 'gulp';
import pug from 'gulp-pug';
import babel from 'gulp-babel';
// import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';


// Rutas
const paths = {
  pug: {
    src: 'src/pug/pages/**/*.pug', // Sólo páginas
    watch: 'src/pug/**/*.pug', // Vigilar todo Pug
    dest: 'dist/',
  },
  js: {
    src: 'src/js/**/*.js', // Todos los archivos JS
    dest: 'dist/js/',
  },
  assets: {
    src: 'src/assets/**/*', // Archivos estáticos
    dest: 'dist/assets/',
  },
};

// Servidor de desarrollo
const server = browserSync.create();

// Tarea: Compilar Pug a HTML
export const compilePug = () => {
  return gulp
    .src(paths.pug.src)
    .pipe(
      pug({
        pretty: true, // HTML legible
      })
    )
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(server.stream());
};

// Tarea: Procesar JavaScript con Babel
export const processJs = () => {
  return gulp
    .src(paths.js.src)
    // .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/preset-env'], // Soporte para ES6+
      })
    )
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(server.stream());
};

// Tarea: Copiar archivos estáticos
export const copyAssets = () => {
  return gulp.src(paths.assets.src).pipe(gulp.dest(paths.assets.dest));
};

// Tarea: Limpiar la carpeta `dist`
export const clean = () => deleteAsync(['dist']);

// Tarea: Servidor con recarga en tiempo real
export const serve = (done) => {
  server.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  });
  done();
};

// Tarea: Vigilar cambios
export const watchFiles = () => {
  gulp.watch(paths.pug.watch, compilePug); // Vigila cambios en Pug
  gulp.watch(paths.js.src, processJs); // Vigila cambios en JS
  gulp.watch(paths.assets.src, copyAssets); // Vigila cambios en assets
};

// Tarea predeterminada
export const dev = gulp.series(
  clean,
  gulp.parallel(compilePug, processJs, copyAssets),
  serve,
  watchFiles
);

export default dev;
