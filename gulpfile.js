const { src, dest, series, parallel, watch } = require("gulp");
const { deleteSync } = require("del");
const sass = require("gulp-sass")(require("sass"));
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const inject = require("gulp-inject");
const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");

function clean() {
  deleteSync(["dist"]);
  return Promise.resolve();
}

function styles() {
  return src("src/assets/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("style.css"))
    .pipe(dest("dist/assets"))
    .pipe(browserSync.stream());
}

function minifyStyles() {
  return src("dist/assets/style.css")
    .pipe(cleanCSS()) // Минификация CSS
    .pipe(rename("style.min.css"))
    .pipe(dest("dist/assets"));
}

function css() {
  return src("src/assets/style.css")
    .pipe(dest("dist/assets"))
    .pipe(browserSync.stream());
}

function typescript() {
  const tsProject = ts.createProject("tsconfig.json");
  return src("src/test.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { ie: 11 },
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        ],
        plugins: ["@babel/plugin-transform-modules-umd"],
      })
    )
    .pipe(uglify())
    .pipe(rename("test.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function javascript() {
  return src("src/index.js")
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { ie: 11 },
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        ],
        plugins: ["@babel/plugin-transform-modules-umd"],
      })
    )
    .pipe(uglify())
    .pipe(rename("index.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return src("src/assets/images/**/*")
    .pipe(dest("dist/images"))
    .pipe(browserSync.stream());
}

function html() {
  return src("src/index.html")
    .pipe(
      inject(
        src(["dist/js/index.min.js", "dist/assets/style.css"], { read: false }),
        {
          relative: true,
          transform: (filePath) => {
            if (filePath.endsWith(".js")) {
              return `<script type="module" src="${filePath}" defer></script>`;
            }
            if (filePath.endsWith(".css")) {
              return `<link rel="stylesheet" href="${filePath}">`;
            }
            return null;
          },
        }
      )
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    open: false,
  });
}

function watchFiles() {
  watch("src/assets/style.scss", styles);
  watch("src/assets/style.css", css);
  watch("src/**/*.ts", typescript);
  watch("src/**/*.js", javascript);
  watch("src/assets/images/**/*", images);
  watch("src/index.html", html);
}

const build = series(
  clean,
  parallel(styles, css, typescript, javascript, images),
  minifyStyles,
  html
);

const dev = series(build, parallel(serve, watchFiles));

exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = dev;
