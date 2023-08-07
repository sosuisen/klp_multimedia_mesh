/**
 * 2023/08/07
 * PixiJS＋Live2Dサンプル
 * pixi-live2d-displayはpixi.js v7に対応していないため、pixi.js v6を使用すること。
 */
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

/**
 * 参考
 * https://github.com/guansss/pixi-live2d-display#demos
 * https://github.com/avgjs/pixi-live2d/blob/master/example/index.js
 */

/**
 * live2dcubismcore.min.jsとlib2d.jsをlive2d.htmlのscriptタグで読み込むこと。
 * この.jsファイルは次の場所で配布
 * https://github.com/guansss/pixi-live2d-display#cubism-core
 */

// Live2Dモデルの更新とPixiJSのTickerを同期させるため、
// window.PIXIにセットしてLive2Dプラグイン側から参照できるようにする。
window.PIXI = PIXI;

const app = new PIXI.Application({ width: 600, height: 700, backgroundColor: 0xffffff });

document.body.appendChild(app.view);

/**
 * Live2Dの操作方法はチュートリアルを参照のこと。以下は概略。
 * 
 * 1) Live2D Cubism Editor 4.2
 *  1-1) モデル作成（.cmo3ファイル）
 * 　モデリングモード（Model）へPSDファイル読み込み
 * 　レイヤごとにメッシュ自動生成、編集
 * 　デフォーマを追加、デフォーマを選択してパラメータパネルでキーを追加
 *   ファイル＞組み込み用ファイル書き出し＞moc3ファイル書き出し
 *    (SDK4.2, userdata3.json, cdi3.jsonファイルは不要)
 * 　.moc3ファイルと.model3.jsonファイル、テクスチャアトラスの格納されたアセットフォルダが生成される。
 * 
 *  1-2) アニメーション作成（.can3ファイル）
 * 　アニメーションモード（Animation）に切り替えて上記モデルをタイムラインに追加
 * 　各パラメータにタイムライン上でキーフレームを割り当ててシーンを設定
 * 　ファイル＞組み込み用ファイル書き出し＞モーションファイル書き出し
 *   .motion3.jsonファイルが生成される。
 * 
 *  2) Live2D Cubism Viewer 4.2
 *   生成された.moc3ファイルを開く
 * 　.model3.jsonファイルをウィンドウにドラッグ＆ドロップで追加（motionsフォルダが自動生成）
 * 　モーションを選択して「再生」で動作確認。プログラムから呼び出すときのグループ名を追加しておく。
 * 　ファイル＞書き出し＞モデル設定（.model3.json）
 * 　これでモーションの追加された.model3.jsonファイルを書き出すことができる。
 *  3) .model3.jsonファイル、.motion3.jsonファイル、.moc3ファイル、アセットフォルダをPixiJSプロジェクトに追加する。
 * 　　model3.json内のパスを必要に応じて修正。
 */
const model = await Live2DModel.from('assets/kyocotan.model3.json');
model.scale.set(0.2);
app.stage.addChild(model);

// model3.jsonに含まれる"Motions"で定義されたモーションを再生する。
// なお、グループ名が"Idle"のモーションは自動的にリピート再生される。

// その他のグループを再生する場合
// 例えば "Maegami" というグループがあるとして、
// その0番目のモーションを再生する場合
// model.motion('Maegami', 0);
// Live2DのSDKではIdle以外はリピート動作しないため注意。
