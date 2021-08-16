/*
src 参照元を指定
dest 出力先を指定
watch ファイル監視
series 直列処理
parallel 並列処理
*/

const { src, dest, watch, series, parallel } = require('gulp');

// プラグインを呼び出し
const sass = require('gulp-sass');

// プラグインの処理をまとめる
const cssSass = (done) => {
    return src('src/css/**/*.scss') //コンパイル元
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist/css'))     //コンパイル先
        done();
}

// タスクをまとめて実行
exports.default = series(cssSass);
