/**
 * Created by Administrator on 2018/12/17.
 */
// 测量工具类
var MeasureHelper = (function () {
  var viewer = null,
    scene = null,
    handler = null,
    ellipsoid = Cesium.Ellipsoid.WGS84,
    tooltip = null;
  function _(cesiumWidget) {
    viewer = cesiumWidget
    scene = viewer.scene
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    tooltip = createTooltip(cesiumWidget.container)
  }
  var tempPoints = [];
  var tempEntities = [];
  function drawPoint(point) {
    var entity =
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
        label: {
          text: '',
          font: '11px Helvetica'
        },
        point: {
          pixelSize: 10,
          color: Cesium.Color.WHITE
        }
      });
    tempEntities.push(entity);
  }
  function drawLine(point1, point2, showDistance, mode) {
    var entity =
      viewer.entities.add({
        polyline: {
          positions: [Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat), Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat)],
          width: 10.0,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.GREEN.withAlpha(.5)
          })
        }
      });
    tempEntities.push(entity);
    if (showDistance) {
      var w = Math.abs(point1.lon - point2.lon)
      var h = Math.abs(point1.lat - point2.lat)
      var offsetV = w >= h ? 0.0005 : 0
      var offsetH = w < h ? 0.001 : 0
      var distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon)
      var label = {}
      entity =
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(((point1.lon + point2.lon) / 2),
            ((point1.lat + point2.lat) / 2)),
          label: ('drawLine' == mode ? {
            text: distance.toFixed(1) + 'm',
            font: '22px Helvetica',
            fillColor: Cesium.Color.WHITE
          } : '')
        });
      tempEntities.push(entity)
    }
  }
  function drawPoly(points) {
    var pArray = []
    for (var i = 0; i < points.length; i++) {
      pArray.push(points[i].lon)
      pArray.push(points[i].lat)
    }
    var entity = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(pArray)),
        material: Cesium.Color.GREEN.withAlpha(.5)
      }
    });
    tempEntities.push(entity)
  }
  //计算两点间距离
  function getFlatternDistance(lat1, lng1, lat2, lng2) {
    var EARTH_RADIUS = 6378137.0    //单位M
    var PI = Math.PI

    function getRad(d) {
      return d * PI / 180.0
    }

    var f = getRad((lat1 + lat2) / 2)
    var g = getRad((lat1 - lat2) / 2)
    var l = getRad((lng1 - lng2) / 2)

    var sg = Math.sin(g)
    var sl = Math.sin(l)
    var sf = Math.sin(f)

    var s, c, w, r, d, h1, h2
    var a = EARTH_RADIUS
    var fl = 1 / 298.257

    sg = sg * sg
    sl = sl * sl
    sf = sf * sf

    s = sg * (1 - sl) + (1 - sf) * sl
    c = (1 - sg) * (1 - sl) + sf * sl

    w = Math.atan(Math.sqrt(s / c))
    r = Math.sqrt(s * c) / w
    d = 2 * w * a
    h1 = (3 * r - 1) / 2 / c
    h2 = (3 * r + 1) / 2 / s

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  }
  //计算多边形面积
  var earthRadiusMeters = 6371000.0
  var radiansPerDegree = Math.PI / 180.0
  var degreesPerRadian = 180.0 / Math.PI
  function SphericalPolygonAreaMeters(points) {
    var totalAngle = 0;
    for (var i = 0; i < points.length; i++) {
      var j = (i + 1) % points.length
      var k = (i + 2) % points.length
      totalAngle += Angle(points[i], points[j], points[k])
    }
    var planarTotalAngle = (points.length - 2) * 180.0
    var sphericalExcess = totalAngle - planarTotalAngle
    if (sphericalExcess > 420.0) {
      totalAngle = points.length * 360.0 - totalAngle
      sphericalExcess = totalAngle - planarTotalAngle
    } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
      sphericalExcess = Math.abs(360.0 - sphericalExcess)
    }
    return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
  }
  /*角度*/
  function Angle(p1, p2, p3) {
    var bearing21 = Bearing(p2, p1)
    var bearing23 = Bearing(p2, p3)
    var angle = bearing21 - bearing23
    if (angle < 0) {
      angle += 360
    }
    return angle;
  }
  /*方向*/
  function Bearing(from, to) {
    var lat1 = from.lat * radiansPerDegree
    var lon1 = from.lon * radiansPerDegree
    var lat2 = to.lat * radiansPerDegree
    var lon2 = to.lon * radiansPerDegree
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2))
    if (angle < 0) {
      angle += Math.PI * 2.0
    }
    angle = angle * degreesPerRadian
    return angle
  }

  function createTooltip(frameDiv) {

    var tooltip = function (frameDiv) {

      var div = document.createElement('DIV');
      div.className = "twipsy right";

      var arrow = document.createElement('DIV');
      arrow.className = "twipsy-arrow";
      div.appendChild(arrow);

      var title = document.createElement('DIV');
      title.className = "twipsy-inner";
      div.appendChild(title);

      this._div = div;
      this._title = title;

      // add to frame div and display coordinates
      frameDiv.appendChild(div);
    }

    tooltip.prototype.setVisible = function (visible) {
      this._div.style.display = visible ? 'block' : 'none';
    }

    tooltip.prototype.showAt = function (position, message) {
      if (position && message) {
        this.setVisible(true);
        this._title.innerHTML = message;
        this._div.style.left = position.x + 10 + "px";
        this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
      }
    }

    return new tooltip(frameDiv);
  }

  _.prototype.setMode = function (mode, callback) {
    if (handler == null || (handler != null && handler.isDestroyed()))
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (movement) {
      var position = movement.endPosition;
      if (position != null) {
        var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
        if (cartesian) {
          // tooltip.showAt(new Cesium.Cartesian2(position.x, position.y + 50), "<p>点击添加标注 位置是: </p>" + getDisplayLatLngString(ellipsoid.cartesianToCartographic(cartesian)));
          tooltip.showAt(new Cesium.Cartesian2(position.x, position.y + 50), "<p>右键结束测量事件 </p>");
        } else {
          tooltip.showAt(new Cesium.Cartesian2(position.x, position.y + 50), "<p>右键结束测量事件</p>");
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    if (mode === 'drawPloy') {
      tempPoints = []
      handler.setInputAction(function (click) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)
        if (cartesian) {
          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
          var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
          tempPoints.push({ lon: longitudeString, lat: latitudeString });
          var tempLength = tempPoints.length;
          drawPoint(tempPoints[tempPoints.length - 1]);
          if (tempLength > 1) {
            drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true, mode)
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler.setInputAction(function (click) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
          var tempLength = tempPoints.length;
          if (tempLength < 3) {
            alert('请选择3个以上的点再执行闭合操作命令');
          } else {
            tooltip.setVisible(false);
            drawLine(tempPoints[0], tempPoints[tempPoints.length - 1], true, mode);
            drawPoly(tempPoints);

            var ent = viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(((tempPoints[0].lon +(tempPoints[tempPoints.length-1].lon+ tempPoints[tempPoints.length-2].lon)/2)/2 ),
                ((tempPoints[0].lat +(tempPoints[tempPoints.length-1].lat+tempPoints[tempPoints.length -2].lat)/2 )/2)),
              label: {
                text: SphericalPolygonAreaMeters(tempPoints) .toFixed(1) + '㎡',
                font: '22px Helvetica',
                fillColor: Cesium.Color.WHITE
              }
            })
            tempEntities.push(ent);
            tempPoints = [];
            if (handler != null && !handler.isDestroyed())
              handler.destroy();
            callback()
          }
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    } else if (mode === 'drawLine') {
      tempPoints = []
      handler.setInputAction(function (click) {
        tooltip.setVisible(false);
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
          var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
          tempPoints.push({ lon: longitudeString, lat: latitudeString });
          var tempLength = tempPoints.length;
          drawPoint(tempPoints[tempPoints.length - 1]);
          if (tempLength > 1) {
            drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true, mode);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler.setInputAction(function (click) {
        var tempLength = tempPoints.length;
        if (tempLength < 2) {
          alert('请至少画两个点进行测量');
        } else {
          tempPoints = []
          tooltip.setVisible(false);
          if (handler != null && !handler.isDestroyed())
            handler.destroy();
          callback()
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    } else if (mode === 'clean') {
      var primitives = viewer.entities;
      for (var i = 0; i < tempEntities.length; i++) {
        primitives.remove(tempEntities[i]);
      }
      tempEntities=[];
      tooltip.setVisible(false);
      if (handler != null && !handler.isDestroyed())
        handler.destroy();
    } else if (mode === 'destoryLine' || mode === 'destoryPloy') {
      tooltip.setVisible(false);
      if ((handler !== undefined) && (!handler.isDestroyed())) {
        tempPoints = [];
        handler.destroy();
      }
    }
  }

  return _
})()
