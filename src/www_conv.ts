// JSONファイルを読み込む
import * as fs from 'fs'

const jsonFile = "string.json"; // JSONファイルのパス
const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

// TSVファイルに書き込む
const tsvFile = "output.tsv"; // TSVファイルのパス
const tsvStream = fs.createWriteStream(tsvFile, { flags: "w" });

// JSONオブジェクトを再帰的に探索してキーと値のペアを生成する関数
function traverse(obj: any, path: string[] = []): [string, any][] {
	let pairs: [string, any][] = [];
	if (typeof obj === "object" && obj !== null) {
		// オブジェクトの場合は各プロパティに対して再帰呼び出し
		for (const key of Object.keys(obj)) {
			pairs = pairs.concat(traverse(obj[key], path.concat(key)));
		}
	} else {
		// それ以外の場合は現在のパスと値のペアを返す
		pairs.push([path.join("."), obj]);
	}
	return pairs;
}

// JSONオブジェクトを探索してTSV形式の文字列を生成する
let tsvData = "";
for (const pair of traverse(jsonData)) {
	const [key, value] = pair;
	tsvData += `${key}\t${value}\n`;
}

// TSVファイルに書き込む
tsvStream.write(tsvData);
tsvStream.end();