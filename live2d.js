import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

/**
 * live2dcubismcore.min.jsをプロジェクトルートに置くこと。
 */

// Live2Dモデルの更新とPixiJSのTickerを同期させるため、
// window.PIXIにセットしてLive2Dプラグイン側から参照できるようにする。
window.PIXI = PIXI;

const app = new PIXI.Application({ width: 500, height: 600, backgroundColor: 0xffffff });

document.body.appendChild(app.view);

/**
 * Live2D Cubism Editorから、ファイル＞組み込み用ファイル書き出し＞moc3ファイル書き出し
 * 生成されたmodel3.jsonファイル、.moc3ファイル、テクスチャをPixiJSプロジェクトに追加する。
 * model3.json内のテクスチャのパスを必要に応じて修正。
 */
const model = await Live2DModel.from('kyocotan_official_15_large.model3.json');
model.scale.set(0.1);
app.stage.addChild(model);

// ParamHairFrontが変数として存在している。
