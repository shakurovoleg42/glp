const { src, dest, series, parallel } = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();

function clean() {
  return del(["dist"]);
}

function html() {
  return src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
}

function scss() {
  return src("src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(dest("dist"));
}

function css() {
  return src("src/**/*.css").pipe(cleanCSS()).pipe(dest("dist"));
}

function typescript() {
  const tsProject = ts.createProject("tsconfig.json");
  return src("src/**/*.ts")
    .pipe(tsProject())
    .pipe(babel())
    .pipe(dest("dist/js"));
}

function javascript() {
  return src("src/**/*.js").pipe(babel()).pipe(dest("dist/js"));
}

function bundleJS() {
  return src(["dist/js/**/*.js"])
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"));
}

function images() {
  return src("src/assets/images/**/*").pipe(dest("dist/assets/images"));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    open: true,
  });
}

exports.build = series(
  clean,
  parallel(html, scss, css, typescript, javascript, images),
  bundleJS,
  serve
);

exports.default = exports.build;
