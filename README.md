pandoc-seed-project
===================

Seed git repo for [pandoc](https://github.com/jgm/pandoc) based projects. Just clone and pandoc.

Inspired by projects like [ultimate-seed](https://github.com/pilwon/ultimate-seed) and [angular-seed](https://github.com/angular/angular-seed). This seed aims to include necessary tools/scripts to automate pandoc compilation.

With this seed, you should be able to:
1. Write documents in whatever input format [pandoc](https://github.com/jgm/pandoc) supports.
2. Use [gulp.js](https://github.com/gulpjs/gulp) to automatically compile documents.

Repeat as necessary.

Prerequisites
=============

* node.js and npm
* [pandoc](https://github.com/jgm/pandoc) (and the haskell-platform)
* some knowledge of streams:
    * http://nodejs.org/api/stream.html
    * https://github.com/substack/stream-handbook

Included
========

* [gulp](http://gulpjs.com/) - build system (task automation)
    * [gulp-spawn-shim](https://github.com/Dashed/gulp-spawn-shim) - shim node.js child_process.spawn() to gulp.js
    * [gulp-util](https://github.com/gulpjs/gulp-util) - utility belt for gulpfile.js
    * [gulp-plumber](https://github.com/floatdrop/gulp-plumber) - monkey-patch Stream.pipe
    * [gulp-watch](https://github.com/floatdrop/gulp-watch) - watch files
    * [gulp-rename](https://github.com/hparra/gulp-rename) - rename files
    * [gulp-livereload](https://github.com/vohof/gulp-livereload) - automatically [reload](http://livereload.com/) compiled documents (HTML only)
    * [gulp-ignore](https://github.com/robrich/gulp-ignore) - conditionally include/exclude files
* [tiny-lr](https://github.com/mklabs/tiny-lr) - tiny livereload

gulpfile.js
===========

The rules for how to compile pandoc documents are configured from within the gulpfile.js file.

Generally, gulp will take `**/*.md` files (configurable) from `src_docs` folder, compile via pandoc, and then place the resulting files into `dest_docs` folder in the same directory structure as it was placed in `src_docs`.

## Note

I'm currently using this setup for my personal pandoc project; mainly for my markdown documents. It can be set up generally as pandoc allows.

The gulpfile.js file I provided is set up for additional support of [MathJax](http://mathjax.org/) from [mathjax-lazyload](https://github.com/Dashed/mathjax-lazyload). It's supported for HTML generated pages with a lot of math (LaTeX) elements.

In the future, I'll provide variations of gulpfile.js.


This project replaces/deprecates [grunt-pandoc](https://github.com/Dashed/grunt-pandoc); a workflow I used to use.
