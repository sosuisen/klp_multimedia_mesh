import * as PIXI from 'pixi.js'
const app = new PIXI.Application({ width: 500, height: 600, backgroundColor: 0xffffff });

document.body.appendChild(app.view);

/**
 * ねこ本体
 */
const catTx = await PIXI.Assets.load('assets/cat_notail_ear.png');
const cat = PIXI.Sprite.from(catTx);
cat.eventMode = 'static';
const hitArea = new PIXI.Rectangle(100, 110, 150, 60);
cat.hitArea = hitArea;

// hitAreaを目で見えるようにするため、Graphicsを追加
const catG = new PIXI.Graphics();
catG.lineStyle(2, 0xc2c2ff);
catG.drawRect(hitArea.x, hitArea.y, hitArea.width, hitArea.height);
cat.addChild(catG);

cat.cursor = 'pointer';
app.stage.addChild(cat);


/**
 * しっぽ
 */
const pointNum = 4; // ロープの点の数
// 点を結ぶ線の長さを求める。
const ropeLength = 150 / (pointNum - 1);
const points = [];
// 点の数だけ追加
for (let i = 0; i < pointNum; i++) {
    points.push(new PIXI.Point(i * ropeLength, 0));
}
const tailTx = await PIXI.Assets.load('assets/tail.png');
const tail = new PIXI.SimpleRope(tailTx, points);
// SimpleRopeの基準点はXが左端でYが中央。
tail.position.set(302, 467);
app.stage.addChild(tail);

/**
 * 耳
 */
// 4頂点のみ。
// これ以上頂点数を増やすなら、アニメーションのほうも考え直す必要あり。
const verticesX = 2;
const verticesY = 2;
const earTx = await PIXI.Assets.load('assets/ear.png');
const ear = new PIXI.SimplePlane(earTx, verticesX, verticesY);
ear.position.set(90, 92);
app.stage.addChild(ear);
// オリジナルの頂点座標をコピー
// await PIXI.Assets.load('ear.png') と書いて
// 画像のロード完了済みになってないと
// 正しい値がとれないため注意。
const positionsOrg = [...ear.geometry.buffers[0].data];


/**
 * ねこじゃらし
 */
const jPointNum = 4;
const jRopeLength = 240 / (jPointNum - 1);
const jPoints = [];
for (let i = 0; i < jPointNum; i++) {
    jPoints.push(new PIXI.Point(jRopeLength * i, 0));
}
const jarashiTx = await PIXI.Assets.load('assets/jarashi.png');
const jarashi = new PIXI.SimpleRope(jarashiTx, jPoints);
jarashi.position.set(150, 100);
app.stage.addChild(jarashi);

/**
 * インタラクション
 */
let showPoints = false;
document.getElementById('togglePointsBtn').addEventListener('click', () => {
    showPoints = !showPoints;
});

let isMouseOnCat = false;
cat.on('pointerenter', (event) => {
    isMouseOnCat = true;
});
cat.on('pointerleave', (event) => {
    isMouseOnCat = false;
    // リセット
    ear.geometry.buffers[0].data = [...positionsOrg];
    ear.geometry.buffers[0].update();
});

/**
 * アニメーション
 */
let count = 0;
app.ticker.add(() => {
    count += 0.1;
    // しっぽ
    for (let i = 1; i < points.length; i++) {
        points[i].y = Math.sin(count) * i;
    }

    // ねこじゃらし
    for (let i = 0; i < jPoints.length-1; i++) {
        jPoints[i].y = Math.sin(count) * (jPoints.length - i) * 3
    }
    
    if (isMouseOnCat) {
        // 耳
        // 頂点座標は次のプロパティに格納
        const positions = ear.geometry.buffers[0].data;
        // positionsには各頂点につきx座標,y座標、の順で格納されています。
        // つまりpositions.length は頂点数(verticesX * verticesY)の2倍
        for (let i = 0; i < positions.length; i += 2) {
            // positions[i]はx座標
            // positions[i+1]はy座標

            // テクスチャの高さの半分より上の位置にある頂点を判定
            if (positionsOrg[i + 1] < ear.height / 2) {
                // 頂点のy座標を、最大で高さの半分まで下へ移動
                positions[i + 1] = positionsOrg[i + 1] + Math.abs(Math.cos(count / 4)) * ear.height / 2;
                // 頂点のx座標を最大20px左へ移動
                positions[i] = positionsOrg[i] - Math.abs(Math.cos(count / 4)) * 20;
            }
        }
        ear.geometry.buffers[0].update();
    }

    if (showPoints) {
        catG.visible = true;
        tailG.visible = true;
        earG.visible = true;
        renderGuide();
    }
    else {
        catG.visible = false;
        tailG.visible = false;
        earG.visible = false;
    }
});

/**
 * Meshとヒットエリアを表示する
 */
const tailG = new PIXI.Graphics();
tailG.x = tail.x;
tailG.y = tail.y;
app.stage.addChild(tailG);

const earG = new PIXI.Graphics();
earG.x = ear.x;
earG.y = ear.y;
app.stage.addChild(earG);

function renderGuide() {
    // しっぽのロープの表示
    tailG.clear();
    tailG.lineStyle(2, 0xffc2c2);

    tailG.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        tailG.lineTo(points[i].x, points[i].y);
    }

    for (let i = 0; i < points.length; i++) {
        tailG.beginFill(0xff0022);
        tailG.drawCircle(points[i].x, points[i].y, 10);
        tailG.endFill();
    }

    // 耳のメッシュ頂点の表示
    earG.clear();
    earG.lineStyle(2, 0xc2ffc2);

    const earPositions = ear.geometry.buffers[0].data;
    const earPoints = [];
    // 使いやすいようにPointの配列にしておく
    for (let i = 0; i < earPositions.length; i += 2) {
        earPoints.push(new PIXI.Point(earPositions[i], earPositions[i + 1]));
    }

    // インデックスバッファを取得
    const earIndex = ear.geometry.getIndex().data;

    for (let i = 0; i < earIndex.length; i++) {
        if (i % 3 === 0) {
            earG.moveTo(earPoints[earIndex[i]].x, earPoints[earIndex[i]].y);
        }
        else {
            earG.lineTo(earPoints[earIndex[i]].x, earPoints[earIndex[i]].y);
        }
        if (i % 3 === 2) {
            // 三角形を閉じる
            earG.lineTo(earPoints[earIndex[i - 2]].x, earPoints[earIndex[i - 2]].y);
        }
    }

    for (let i = 0; i < earPoints.length; i++) {
        earG.beginFill(0x00ff22);
        earG.drawCircle(earPoints[i].x, earPoints[i].y, 10);
        earG.endFill();
    }

}

