"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// JSONファイルを読み込む
var fs = require("fs");
var jsonFile = "string.json"; // JSONファイルのパス
var jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
// TSVファイルに書き込む
var tsvFile = "output.tsv"; // TSVファイルのパス
var tsvStream = fs.createWriteStream(tsvFile, { flags: "w" });
// JSONオブジェクトを再帰的に探索してキーと値のペアを生成する関数
function traverse(obj, path) {
    if (path === void 0) { path = []; }
    var pairs = [];
    if (typeof obj === "object" && obj !== null) {
        // オブジェクトの場合は各プロパティに対して再帰呼び出し
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            pairs = pairs.concat(traverse(obj[key], path.concat(key)));
        }
    }
    else {
        // それ以外の場合は現在のパスと値のペアを返す
        pairs.push([path.join("."), obj]);
    }
    return pairs;
}
// JSONオブジェクトを探索してTSV形式の文字列を生成する
var tsvData = "";
for (var _i = 0, _a = traverse(jsonData); _i < _a.length; _i++) {
    var pair = _a[_i];
    var key = pair[0], value = pair[1];
    tsvData += "".concat(key, "\t").concat(value, "\n");
}
// TSVファイルに書き込む
tsvStream.write(tsvData);
tsvStream.end();
