/* global Cesium */


//放大
const ZoomIn = () => {
  let height = Math.floor(global.viewer.camera.positionCartographic.height);
  if (height > 100) {
    let zoomInNum = height / 2;
    global.viewer.camera.zoomIn(zoomInNum);
  }
};

//缩小
const ZoomOut = () => {
  let height = Math.floor(global.viewer.camera.positionCartographic.height);
  if (height > 1) {
    let zoomInNum = height;
    global.viewer.camera.zoomOut(zoomInNum);
  }
  if (Math.ceil(global.viewer.camera.positionCartographic.height) >= 20000000) {
    global.viewer.camera.positionCartographic.height = 21000000;
  }
  // console.log(Math.ceil(viewer.camera.positionCartographic.height));
};

//比例尺
const Ruler = () => {
  if (!global.viewer.cesiumNavigation) {
    let zoominHeight = 5650000;
    let height = Math.floor(global.viewer.camera.positionCartographic.height);
    let heightDefalut = 21000000;
    if ((height === heightDefalut) && (height > heightDefalut - zoominHeight + 100)) {
      /*viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114, 23, heightDefalut - zoominHeight),
      });*/
      global.viewer.camera.zoomIn(zoominHeight);
    }
    let options = {};
    //options.defaultResetView = Cesium.Cartographic.fromDegrees(114, 23, 21000000);
    options.enableCompass = false;
    options.enableZoomControls = false;
    options.enableDistanceLegend = true;
    options.enableCompassOuterRing = false;
    global.viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
  } else {
    global.viewer.cesiumNavigation.destroy();
  }
};

//重置
const Rsetting = () => {
  // global.viewer.dataSources._dataSources.forEach((v) => {
  //   alert(v._name)
  // });
  // console.log(global.viewer.imageryLayers);
  global.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(111.85, 36, 2100000),
  });
};


let tempPoints = [];
let tempEntities = [];
let handler = null;
let isMeasure = false;

const Measure = (scene) => {
  isMeasure = !isMeasure;
  if (isMeasure) {
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (click) {
      let cartesian = global.viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
      if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        tempPoints.push({ lon: longitudeString, lat: latitudeString });
        let tempLength = tempPoints.length;
        drawPoint(tempPoints[tempPoints.length - 1]);
        if (tempLength > 1) {
          drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function (click) {
      clearDrawingBoard(false);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  } else {
    clearDrawingBoard(true);
  }
};

// --- 测量相关（开始） ---
//画点
const drawPoint = (point) => {
  let entity =
    global.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
      label: {
        text: '',
        font: '18px Helvetica'
      },
      point: {
        pixelSize: 8,
        color: Cesium.Color.CHARTREUSE
      }
    });
  tempEntities.push(entity);
};

//画线
const drawLine = (point1, point2, showDistance) => {
  let entity =
    global.viewer.entities.add({
      polyline: {
        positions: [Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat), Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat)],
        width: 10.0,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.CHARTREUSE.withAlpha(.5)
        })
      }
    });
  tempEntities.push(entity);
  if (showDistance) {
    let w = Math.abs(point1.lon - point2.lon);
    let h = Math.abs(point1.lat - point2.lat);
    let offsetV = w >= h ? 0.0005 : 0;
    let offsetH = w < h ? 0.001 : 0;
    let distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon);
    entity = global.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(((point1.lon + point2.lon) / 2) + offsetH,
        ((point1.lat + point2.lat) / 2) + offsetV),
      label: {
        text: distance.toFixed(1) + 'm',
        font: '18px Helvetica',
        fillColor: Cesium.Color.WHITE
      }
    });
    tempEntities.push(entity);
  }
};

//测量距离
const getFlatternDistance = (lat1, lng1, lat2, lng2) => {
  let EARTH_RADIUS = 6378137.0;    //单位M
  let PI = Math.PI;
  let f = getRad((lat1 + lat2) / 2);
  let g = getRad((lat1 - lat2) / 2);
  let l = getRad((lng1 - lng2) / 2);

  let sg = Math.sin(g);
  let sl = Math.sin(l);
  let sf = Math.sin(f);

  let s, c, w, r, d, h1, h2;
  let a = EARTH_RADIUS;
  let fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
};

//测量距离(引用)
const getRad = (d) => {
  return d * Math.PI / 180.0;
};

const clearEffects = (destroy) => {
  if (handler != null) {
    handler.destroy();
  }
}

const clearDrawingBoard = (destroy) => {
  let primitives = global.viewer.entities;
  for (let i = 0; i < tempEntities.length; i++) {
    primitives.remove(tempEntities[i]);
  }
  tempEntities = [];
  tempPoints = [];
  if (destroy) {
    clearEffects(destroy);
  }
};


// --- 测量相关 结束） ---

export {
  ZoomIn,
  ZoomOut,
  Ruler,
  Measure,
  Rsetting,
};
