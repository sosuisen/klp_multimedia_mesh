import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

// 参考：https://github.com/avgjs/pixi-live2d/blob/master/example/index.js

/**
 * live2dcubismcore.min.jsをプロジェクトルートに置くこと。
 */

// Live2Dモデルの更新とPixiJSのTickerを同期させるため、
// window.PIXIにセットしてLive2Dプラグイン側から参照できるようにする。
window.PIXI = PIXI;

const app = new PIXI.Application({ width: 600, height: 700, backgroundColor: 0xffffff });

document.body.appendChild(app.view);

/**
 * 1) Live2D Cubism Editorのモデリングモード（Model）で、
 * ファイル＞組み込み用ファイル書き出し＞moc3ファイル書き出し
 * 生成されたmodel3.jsonファイル、.moc3ファイル、テクスチャをPixiJSプロジェクトに追加する。
 * model3.json内のテクスチャのパスを必要に応じて修正。
 */
const model = await Live2DModel.from('kyocotan.model3.json');
model.scale.set(0.2);
app.stage.addChild(model);

// model3.jsonに含まれる"Motions"で定義されたモーションを再生する。
// なお、グループ名が"Idle"のモーションは自動的にリピート再生される。

// その他のグループを再生する場合
// 例えば "Maegami" というグループがあるとして、
// その0番目のモーションを再生する場合
// model.motion('Maegami', 0);
// Live2DのSDKではIdle以外はリピート動作しないため注意。
