// PHPファイルを読み込む
import * as fs from 'fs'

const phpFile = "sample.php"; // PHPファイルのパス
const phpData = fs.readFileSync(phpFile, "utf8");

// TSVファイルに書き込む
const tsvFile = "output.tsv"; // TSVファイルのパス
const tsvStream = fs.createWriteStream(tsvFile, { flags: "w" });

// PHPファイルを解析して連想配列を取得する関数
function parsePHP(phpData: string): any {
	// PHPの開始タグと終了タグを削除する
	phpData = phpData.replace(/<\?php|\?>/g, "");
	// PHPのコメントを削除する
	phpData = phpData.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
	// PHPの変数宣言を削除する
	phpData = phpData.replace(/\$[a-zA-Z0-9_]+ *= */g, "");
	// PHPの配列関数を削除する
	phpData = phpData.replace(/array\(/g, "[");
	phpData = phpData.replace(/\)/g, "]");
	// PHPの連想配列をJSONに変換する
	phpData = phpData.replace(/'/g, "\"");
	phpData = phpData.replace(/=>/g, ":");
	// JSONをパースしてオブジェクトに変換する
	return JSON.parse(phpData);
}

// 連想配列を再帰的に探索してキーと値のペアを生成する関数
function traverse(obj: any, path: string[] = []): [string, any][] {
	let pairs: [string, any][] = [];
	if (typeof obj === "object" && obj !== null) {
		// オブジェクトの場合は各プロパティに対して再帰呼び出し
		for (const key of Object.keys(obj)) {
			pairs = pairs.concat(traverse(obj[key], path.concat(key)));
		}
	} else {
		// それ以外の場合は現在のパスと値のペアを返す
		pairs.push([path.join("__"), obj]);
	}
	return pairs;
}

// PHPファイルを解析して連想配列を取得する
const phpObject = parsePHP(phpData);

// 連想配列を探索してTSV形式の文字列を生成する
let tsvData = "";
for (const pair of traverse(phpObject)) {
	const [key, value] = pair;
	tsvData += `${key}\t${value}\n`;
}

// TSVファイルに書き込む
tsvStream.write(tsvData);
tsvStream.end();
