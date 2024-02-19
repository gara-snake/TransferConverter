// TSVファイルを読み込む
import * as fs from 'fs'

const tsvFile = "output.tsv"; // TSVファイルのパス
const tsvData = fs.readFileSync(tsvFile, "utf8");

// JSONファイルに書き込む
const jsonFile = "enc.json"; // JSONファイルのパス
const jsonStream = fs.createWriteStream(jsonFile, { flags: "w" });

// TSVデータを配列に分割する
const tsvArray = tsvData.split("\n").map(line => line.split("\t"));

// TSVデータをJSONオブジェクトに変換する関数
function convert(tsvArray: string[][]): any {
	let jsonObject: any = {};
	for (const pair of tsvArray) {
		const [key, value] = pair;
		// キーを"__"で分割して階層構造を復元する
		const path = key.split(".");
		// JSONオブジェクトに値を設定する
		setValue(jsonObject, path, value);
	}
	return jsonObject;
}

// JSONオブジェクトに値を設定する関数
function setValue(obj: any, path: string[], value: any): void {
	// パスが空の場合は終了
	if (path.length === 0) return;
	// パスが1つの場合はそのキーに値を設定
	if (path.length === 1) {
		obj[path[0]] = value;
		return;
	}
	// パスが2つ以上の場合はそのキーにオブジェクトを作成して再帰呼び出し
	const key = path[0];
	if (!obj[key]) obj[key] = {};
	setValue(obj[key], path.slice(1), value);
}

// TSVデータをJSONオブジェクトに変換する
const jsonObject = convert(tsvArray);

// JSONオブジェクトを文字列に変換する
const jsonString = JSON.stringify(jsonObject, null, 2);

// JSONファイルに書き込む
jsonStream.write(jsonString);
jsonStream.end();
