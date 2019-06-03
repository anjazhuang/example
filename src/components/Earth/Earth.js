/* global Cesium */
/* global $ */
/* global DrawHelper */
/* global MeasureHelper */
import React, { Component } from 'react';
import { message, Modal, Icon } from 'antd';
import styles from './earth.less';
import PropTypes from 'prop-types';
import { config } from '../../utils';
import { DegreeConvertBack, randomColor } from './func'
import { ZoomIn, ZoomOut, Ruler, Measure, Rsetting } from './ToolbarFun';

// import "cesium/Source/Widgets/widgets.css";
// import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
// import Earthapi from  '../../assets/earthApiClass/earthApi'
// import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
// import "../../assets/cesium/Build/CesiumUnminified/Cesium.js"
// buildModuleUrl.setBaseUrl('./cesium/');


const { apiUrl } = config;

class Earth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskMapChose: false,
      taskMap: false,
      drawPointer: false,
      layerMap: false,
      shapeList: [],
      layerMap2: false,
      photosSee: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    // alert(nextProps.earthData.taskMap);
    this.setState({
      taskMapChose: nextProps.earthData.taskMapChose,
      taskMap: nextProps.earthData.taskMap,
      drawPointer: nextProps.earthData.drawPointer,
      layerMap: nextProps.earthData.layerMap,
      tb_bh: nextProps.earthData.tb_bh,
      shapeList: nextProps.earthData.tubanShape,
      layerMap2: nextProps.earthData.layerMap2,
    }, () => {
      // alert(this.state.taskMapChose)
    });
  }

  componentDidMount() {
    let layerZIndex = 1;
    let cesiumControl = this.props.cesiumControl;
    global.viewer = new Cesium.Viewer('cesiumContainer', {
      // 是否显示重置视角控件
      homeButton: false,
      // 是否显示全屏控件
      fullscreenButton: true,
      // 是否显示动画控件
      animation: false,
      // 是否显示图层选择控件
      baseLayerPicker: false,
      // 是否显示地名查找控件
      geocoder: false,
      // 是否显示时间线控件
      timeline: false,
      // 是否显示投影方式控件
      sceneModePicker: false,
      // 是否显示帮助信息控件
      navigationHelpButton: false,
      // 是否显示点击要素之后显示的信息
      infoBox: true,
      // 是否显示选中地图元素标识控件
      selectionIndicator: true,
      //谷歌图源
      imageryProvider: new Cesium.UrlTemplateImageryProvider({ url: "http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}" })
      //   // 天地图图源
      //   imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      //     url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles',
      //     layer: 'tdtBasicLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     show: false,
      //     maximumLevel: 16,
      //     minimumLevel: 0
      //   })
    });
    const viewer = global.viewer;
    var drawHelper = new DrawHelper(viewer);
    // 天地图中文注释

    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=b4742d0281c36a64049c2dd705498551',
      layer: 'tdtAnnoLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
      show: false,
      maximumLevel: 16,
      minimumLevel: 0
    }));
    // 地图加载完毕后默认显示位置与高度
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(111.85, 36, 2100000),
    });
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    let hightentity = [];
    let hightentity2 = [];
    let tb_bh = this.props.tb_bh;
    let tubanShape = this.props.earthData.tubanShape;
    let tubanOneShape = this.props.earthData.tubanOneShape;
    let shapeList = this.state.shapeList;
    const handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    const handler3D2 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    const scene = viewer.scene;
    const ellipsoid = scene.globe.ellipsoid; //得到当前三维场景的椭球体
    let id = "";
    handler3D2.setInputAction(function (movement, state) { //设置鼠标移动事件的处理函数，这里负责监听鼠标x,y坐标值变化
      // alert(this.state.taskMapChose);
      const pick = scene.pick(movement.position); //获得窗口坐标的相应实体
      let cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid); //将鼠标的屏幕坐标（movement.position）转成世界坐标
      //弹窗位置随着鼠标移动而移动
      let color = "";
      if (!this.state.drawPointer) {
        //判断是否开启了画图功能，如果开启，左击地图事件取消
        if (pick !== undefined) {
          // console.log(pick);
          if (this.state.taskMap) {
            //判断是否是选择了实地核查的图斑
            if (this.state.taskMapChose) {
              // alert(pick.id.properties.TB_BH._value);
              this.state.tb_bh.push({ tb_bh: pick.id.properties.CODE._value, id: pick.id.properties.CODE._value });
              spots(this.state.tb_bh);
              for (let i = 0; i < hightentity2.length; i++) {
                if (hightentity2[i].id == pick.id._id) {
                  //console.log(hightentity2[i]);
                  if (pick.id._polygon !== undefined) {
                    // console.log(hightentity[i].id._polygon._material._color._value)
                    hightentity2[i].polygon.material = pick.id._polygon._material._color._value.withAlpha(1);
                    color = pick.id._polygon._material._color._value
                  } else if (pick.id._polyline !== undefined) {
                    hightentity2[i].polyline.material = pick.id._polyline._material._color._value.withAlpha(1);
                    color = pick.id._polyline._material._color._value
                  }
                } else {
                  if (hightentity2[i].polygon !== undefined) {
                    hightentity2[i].polygon.material = hightentity2[i]._polygon._material._color._value.withAlpha(0.5)
                  } else if (hightentity2[i].polyline !== undefined) {
                    hightentity2[i].polyline.material = hightentity2[i]._polyline._material._color._value.withAlpha(0.5)
                  }
                }
              }
            } else {
              message.warn("未开启地图选择功能")
            }
          } else {
            if (this.state.layerMap) {
              if (pick.id.properties !== undefined) {
                if (pick.id.properties.hasProperty("CODE")) {
                  this.props.dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      tubanModalClose: true,
                      tubanOneShape: this.props.earthData.tubanShape.filter((item, key) => {
                        return item.key === pick.id.properties.CODE._value
                      })
                    }
                  });
                  for (let i = 0; i < hightentity.length; i++) {
                    if (hightentity[i].id == pick.id._id) {
                      //console.log(hightentity[i]);
                      if (pick.id._polygon !== undefined) {
                        // console.log(hightentity[i].id._polygon._material._color._value)
                        hightentity[i].polygon.material = pick.id._polygon._material._color._value.withAlpha(1);
                        color = pick.id._polygon._material._color._value
                      } else if (pick.id._polyline !== undefined) {
                        hightentity[i].polyline.material = pick.id._polyline._material._color._value.withAlpha(1);
                        color = pick.id._polyline._material._color._value
                      }
                    } else {
                      if (hightentity[i].polygon !== undefined) {
                        hightentity[i].polygon.material = hightentity[i]._polygon._material._color._value.withAlpha(0.5)
                      } else if (hightentity[i].polyline !== undefined) {
                        hightentity[i].polyline.material = hightentity[i]._polyline._material._color._value.withAlpha(0.5)
                      }
                    }
                  }
                } else if (pick.id.properties.hasProperty("XIAO_BAN")) {
                  this.props.dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      tubanModalClose: true,
                      tubanOneShape: this.props.earthData.tubanShape.filter((item, key) => {
                        return item.key == pick.id.ID
                      })
                    }
                  });
                  for (let i = 0; i < hightentity.length; i++) {
                    if (hightentity[i].ID == pick.id.ID) {
                      //console.log(hightentity[i]);
                      if (pick.id._polygon !== undefined) {
                        // console.log(hightentity[i].id._polygon._material._color._value)
                        hightentity[i].polygon.material = pick.id._polygon._material._color._value.withAlpha(1);
                        color = pick.id._polygon._material._color._value
                      } else if (pick.id._polyline !== undefined) {
                        hightentity[i].polyline.material = pick.id._polyline._material._color._value.withAlpha(1);
                        color = pick.id._polyline._material._color._value
                      }
                    } else {
                      if (hightentity[i].polygon !== undefined) {
                        hightentity[i].polygon.material = hightentity[i]._polygon._material._color._value.withAlpha(0.5)
                      } else if (hightentity[i].polyline !== undefined) {
                        hightentity[i].polyline.material = hightentity[i]._polyline._material._color._value.withAlpha(0.5)
                      }
                    }
                  }
                  // if (id !== pick.id._id) {
                  //   pick.id.polygon.material = pick.id._polygon._material._color._value.withAlpha(0.5);
                  //   id == pick.id._id
                  // } else {
                  //   pick.id.polygon.material = pick.id._polygon._material._color._value.withAlpha(1);
                  // }

                }
              }
            } else if (this.state.layerMap2) {
              if (pick.id.properties !== undefined) {
                if (pick.id.properties.hasProperty("CODE")) {
                  this.props.dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      tubanModalClose: true,
                      tubanOneShape: this.props.earthData.tubanShape3.filter((item, key) => {
                        return item.key === pick.id.properties.CODE._value
                      })
                    }
                  });
                  // for (let i = 0; i < hightentity.length; i++) {
                  //   if (hightentity[i].id == pick.id._id) {
                  //     console.log(hightentity[i]);
                  //     if (pick.id._polygon !== undefined) {
                  //       // console.log(hightentity[i].id._polygon._material._color._value)
                  //       hightentity[i].polygon.material = pick.id._polygon._material._color._value.withAlpha(1);
                  //       color = pick.id._polygon._material._color._value
                  //     } else if (pick.id._polyline !== undefined) {
                  //       hightentity[i].polyline.material = pick.id._polyline._material._color._value.withAlpha(1);
                  //       color = pick.id._polyline._material._color._value
                  //     }
                  //   } else {
                  //     if (hightentity[i].polygon !== undefined) {
                  //       hightentity[i].polygon.material = hightentity[i]._polygon._material._color._value.withAlpha(0.5)
                  //     } else if (hightentity[i].polyline !== undefined) {
                  //       hightentity[i].polyline.material = hightentity[i]._polyline._material._color._value.withAlpha(0.5)
                  //     }
                  //   }
                  // }
                }
              }
            }
          }
        } else {
          this.props.dispatch({
            type: 'indexPage/updateState',
            payload: {
              tubanModalClose: false
            }
          });
          for (let i = 0; i < hightentity.length; i++) {
            if (hightentity[i].polygon !== undefined) {
              hightentity[i].polygon.material = hightentity[i]._polygon._material._color._value.withAlpha(0.5)
            } else if (hightentity[i].polyline !== undefined) {
              hightentity[i].polyline.material = hightentity[i]._polyline._material._color._value.withAlpha(0.5)
            }
          }
          for (let i = 0; i < hightentity2.length; i++) {
            if (hightentity2[i].polygon !== undefined) {
              hightentity2[i].polygon.material = hightentity2[i]._polygon._material._color._value.withAlpha(0.5)
            } else if (hightentity2[i].polyline !== undefined) {
              hightentity2[i].polyline.material = hightentity2[i]._polyline._material._color._value.withAlpha(0.5)
            }
          }
        }
      } else {

      }
    }.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);

    let _divID_coordinates = "_coordinates";
    let coordinatesDiv = document.createElement("div");
    coordinatesDiv.id = _divID_coordinates;
    coordinatesDiv.className = "map3D-coordinates";
    coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
    //document.getElementById(this.mapDivId).appendChild(coordinatesDiv);
    viewer.container.appendChild(coordinatesDiv);
    // $(".cesium-viewer").append(coordinatesDiv);
    handler3D.setInputAction(function (movement) {
      let pick = new Cesium.Cartesian2(movement.endPosition.x, movement.endPosition.y);
      if (pick) {
        let cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
        if (cartesian) {
          //世界坐标转地理坐标（弧度）
          let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
          if (cartographic) {
            let pgeo = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            let height = viewer.scene.globe.getHeight(cartographic);
            let heightString;
            Math.ceil(viewer.camera.positionCartographic.height) > 1000 ? heightString = Math.ceil(viewer.camera.positionCartographic.height) / 1000 + ' 千米' : heightString = Math.ceil(viewer.camera.positionCartographic.height) + ' 米';
            let terrainHeight = viewer.scene.globe.getHeight(pgeo).toFixed(2) + ' 米';
            let he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
            let he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
            //地理坐标（弧度）转经纬度坐标
            let point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
            if (!height) {
              height = 0;
            }
            if (!he) {
              he = 0;
            }
            if (!he2) {
              he2 = 0;
            }
            if (!point) {
              point = [0, 0];
            }
            let level = 4;
            let tilesToRender = viewer.scene.globe._surface.tileProvider._tilesToRenderByTextureCount;
            for (var i = 0; i < tilesToRender.length; i++) {
              if (tilesToRender[i]) {
                for (var d = 0; d < tilesToRender[i].length; d++) {
                  level = tilesToRender[i][d]._level;
                }
              }
            }
            // var terrainProvider = Cesium.createWorldTerrain();
            // var positions = [
            //   Cesium.Cartographic.fromDegrees(point[0].toFixed(6), point[1].toFixed(6)),
            //   Cesium.Cartographic.fromDegrees(parseFloat(point[0].toFixed(6))+1, parseFloat(point[1].toFixed(6))+1)
            // ];
            // var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
            // Cesium.when(promise, function(updatedPositions) {
            //   var terrainHeight = updatedPositions[0].height
            //   console.log(terrainHeight );
            // });
            coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;font-family:微软雅黑;color:#fff;'>经度：" + point[0].toFixed(6) + "\xB0&nbsp;&nbsp;纬度：" + point[1].toFixed(6) + "\xB0&nbsp;&nbsp;";
            // "海拔：" + (he - he2).toFixed(2) + "&nbsp;&nbsp;</span>";
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    // var ray, position1, cartographic1, lon, lat, height;
    // handler.setInputAction(function (event) {
    //   ray = viewer.scene.camera.getPickRay(event.endPosition);
    //   position1 = viewer.scene.globe.pick(ray, viewer.scene);
    //   cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
    //   var feature = scene.pick(event.endPosition);
    //   if (feature == undefined) {
    //     lon = Cesium.Math.toDegrees(cartographic1.longitude);
    //     lat = Cesium.Math.toDegrees(cartographic1.latitude);
    //     height = cartographic1.height;
    //     coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;font-family:微软雅黑;color:#fff;'>经度：" + lon.toFixed(6) + "\xB0&nbsp;&nbsp;纬度：" + lat.toFixed(6) + "\xB0&nbsp;&nbsp;海拔：" + (height).toFixed(2) + "&nbsp;&nbsp;</span>";
    //   }
    //   else if (feature instanceof Cesium.Cesium3DTileFeature) {
    //     var cartesian = viewer.scene.pickPosition(event.endPosition);
    //     if (Cesium.defined(cartesian)) {
    //       var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    //       lon = Cesium.Math.toDegrees(cartographic.longitude);
    //       lat = Cesium.Math.toDegrees(cartographic.latitude);
    //       height = cartographic.height;//模型高度
    //     }
    //   }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    const spots = (data) => {
      this.props.dispatch({
        type: 'indexPage/updateState',
        payload: {
          tb_bh: data.cy('tb_bh')
        }
      });
    }

    const match = (d) => {
      if (d == undefined) {
        return ""
      }
    }

    var splitLeft;
    let layerChose = [], imageProvide0 = [], imageProvide = [], imageProvide2 = [], layerhad = [];

    let shape;
    var layer = [], selfentity = [], selfentity2 = [], layerSetadvice = [];
    var div, divSetadvice;

    const measureHelper = new MeasureHelper(viewer);
    cesiumControl = {
      //放大
      zoomIn: () => {
        ZoomIn();
      },
      //缩小
      zoomOut: () => {
        ZoomOut();
      },
      //比例尺
      ruler: () => {
        Ruler();
      },
      //重置
      rsetting: () => {
        Rsetting();
      },
      //测量(直线)
      measure: (type) => {
        //Measure(scene);
        // handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        measureHelper.setMode(type, function () {

        })
      },
      //图层管理
      showLayer: (menuSelect, e) => {
        const { dispatch } = this.props;
        this.props.dispatch({
            type: "indexPage/updateState",
            payload: {
              layerhad: menuSelect,
              layerhad2: e,
            }
          }
        )
        let layerGeoJson;

        let shapetype;
        let layerData = this.props.earthData.matchLayer.concat(this.props.earthData.matchLayer2);
        layerZIndex += 1;
        let layerGeoJsonPath;
        let a = [];
        if (e) {
          if (e.checked) {
            if (e.checkedNodes.length > 0) {
              e.checkedNodes.map((v, i) => {
                if (v.key.indexOf(":") > -1) {
                  a.push(v.props.name);
                }
              });
              layerChose = a//哪些被选中
            }
            // else {
            //   layerChose.push(e.node.props.name);
            // }
          } else {
            let b = [];
            if (e.hasOwnProperty("checkedNodes")) {
              if (e.checkedNodes.length > 0) {
                e.checkedNodes.map((v, i) => {
                  if (v.key.indexOf(":") > -1) {
                    // if(layerChose.indexOf(v.props.name)===-1){}
                    //   layerChose.splice(layerChose.indexOf(e.node.props.name), 1);
                    //   imageProvide2.splice(layerChose.indexOf(e.node.props.name), 1)
                    b.push(v.props.name)
                  }
                });
                for (let i = 0; i < layerChose.length; i++) {
                  if (b.indexOf(layerChose[i]) == -1) {
                    layerChose.splice(i, 1);
                    i--
                    // imageProvide2.splice(imageProvide2.indexOf(v), 1)
                  }
                }//删掉未选择的

                for (let i = 0; i < shapeList.length; i++) {
                  if (b.indexOf(shapeList[i].TTYPE) == -1) {
                    shapeList.splice(i, 1);
                    i--
                    // imageProvide2.splice(imageProvide2.indexOf(v), 1)
                  }
                }
                // for (let i = 0; i < tubanShape.length; i++) {
                //   if (b.indexOf(tubanShape[i].TTYPE) == -1) {
                //     tubanShape.tubanShape.splice(i, 1);
                //     i--
                //     // imageProvide2.splice(imageProvide2.indexOf(v), 1)
                //   }
                // }//删掉未选择的
                //
                // dispatch({
                //   type: 'indexPage/updateState',
                //   payload: {
                //     tubanShape: tubanShape,
                //   }
                // })
                for (let i = 0; i < imageProvide2.length; i++) {
                  if (b.indexOf(imageProvide2[i]) == -1) {
                    imageProvide2.splice(i, 1);
                    i--
                    // imageProvide2.splice(imageProvide2.indexOf(v), 1)
                  }
                }


                // layerChose.map((v, i) => {
                //   if (b.indexOf(v) == -1) {
                //     layerChose.splice(layerChose.indexOf(v), 1);
                //     i--
                //     // imageProvide2.splice(imageProvide2.indexOf(v), 1)
                //   }
                // })
                // imageProvide2.map((v, i) => {
                //   if (b.indexOf(v) == -1) {
                //     // layerChose.splice(i, 1);
                //     imageProvide2.splice(i, 1)
                //   }
                // })
              } else {
                layerChose = [];
                imageProvide2 = [];
                shapeList = [];
              }
            }
            // if (e.node.props["children"]) {
            //   e.node.props["children"].map((v, i) => {
            //     layerChose.splice(v.name, 1);
            //     imageProvide2.splice(v.name, 1)
            //   })
            // } else {
            //   layerChose.splice(layerChose.indexOf(e.node.props.name), 1);
            //   imageProvide2.splice(layerChose.indexOf(e.node.props.name), 1)
            // }
          }
          // console.log(layerChose);

          if (imageProvide.length > 0) {
            for (let i = 0; i < imageProvide.length; i++) {
              if (imageProvide2.indexOf(imageProvide[i].name) === -1) {
                viewer.imageryLayers.remove(imageProvide[i].key);
                imageProvide.splice(i, 1);
                i--
              }
            }
          }

          let geolayer = [];
          let haslayers = [];
          global.viewer.dataSources._dataSources.forEach((v) => {
            if (v._name !== undefined) {
              haslayers.push(v._name);
            }
          });
          if (menuSelect.length > 0) {

            menuSelect.forEach((item, key) => {
              global.viewer.dataSources._dataSources.forEach((v) => {
                if (layerChose.indexOf(v._name) === -1) {
                  global.viewer.dataSources.remove(v);
                }
              });
              if (item.indexOf("filepath:") > -1) {
                layerGeoJsonPath = apiUrl + item.split("filepath:")[1];
                layerGeoJson = item.split('/')[item.split('/').length - 1];
                if (haslayers.length > 0) {
                  if (haslayers.indexOf(layerGeoJson) === -1) {
                    var promise = Cesium.GeoJsonDataSource.load(layerGeoJsonPath, {
                      // stroke: Cesium.Color.BLACK,
                      fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(randomColor()), 0.5),
                    });

                    promise.then(function (dataSource) {
                      viewer.dataSources.add(dataSource);
                      let entities = dataSource.entities.values;
                      for (let i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        hightentity.push(entities[i])
                        // entity.polygon.zIndex = layerZIndex;
                        // entity.polygon.id = 1;
                        // console.log(entity);
                        entity.nameID = i;   //给每条线添加一个编号，方便之后对线修改样式
                        // entity.polygon.width = 10;  //添加默认样式
                        // (entity.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                        //   glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                        //   color: Cesium.Color.ORANGERED.withAlpha(.9)
                        // }), 10);
                        // console.log(entity);
                        if (entity.properties.hasProperty("QSX")) {
                          //活动变化
                          if (entity.properties.hasProperty("CD")) {
                            //道路
                            shape = {
                              "shapetype": "变化道路",
                              "TTYPE": layerGeoJson,
                              key: entity.properties.CODE._value,
                              "XIAN": entity.properties.XIAN._value,
                              "CODE": entity.properties.CODE._value,
                              "YJLX": entity.properties.YJLX._value,
                              "BHQK": entity.properties.BHQK._value,
                              "QSX": entity.properties.QSX._value,
                              "HSX": entity.properties.HSX._value,
                              "BHDLX": entity.properties.BHDLX._value,
                              "BHDMC": entity.properties.BHDMC._value,
                              "XIANG": entity.properties.XIANG._value,
                              "ZXJD": entity.properties.ZXJD._value,
                              "ZXWD": entity.properties.ZXWD._value,
                              "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                              "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
                            };
                            shapeList.push(shape);
                          } else {
                            shape = {
                              "shapetype": "变化面",
                              "TTYPE": layerGeoJson,
                              key: entity.properties.CODE._value,
                              "CODE": entity.properties.CODE._value,
                              "XIAN": entity.properties.XIAN._value,
                              "YJLX": entity.properties.YJLX._value,
                              "BHQK": entity.properties.BHQK._value,
                              "QSX": entity.properties.QSX._value,
                              "HSX": entity.properties.HSX._value,
                              "BHDLX": entity.properties.BHDLX._value,
                              "BHDMC": entity.properties.BHDMC._value,
                              "ZXJD": entity.properties.ZXJD._value,
                              "ZXWD": entity.properties.ZXWD._value,
                              "XIANG": entity.properties.XIANG._value,
                              "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                              "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
                            };
                            shapeList.push(shape);
                          }
                        } else {
                          //活动
                          if (entity.properties.hasProperty("XIAO_BAN")) {
                            entity.ID = "xiaoban" + layerGeoJson + i
                            //小班
                            shape = {
                              "shapetype": "小班",
                              key: "xiaoban" + layerGeoJson + i,
                              "TTYPE": layerGeoJson,
                              "SHENG": entity.properties.SHENG._value,
                              "SHI": entity.properties.SHI._value,
                              "XIAN": entity.properties.XIAN._value,
                              "XIANG": entity.properties.XIANG._value,
                              "CUN": entity.properties.CUN._value,
                              "LIN_YE_JU": entity.properties.LIN_YE_JU._value,
                              "LIN_CHANG": entity.properties.LIN_CHANG._value,
                              "LIN_BAN": entity.properties.LIN_BAN._value,
                              "XIAO_BAN": entity.properties.XIAO_BAN._value,
                              "LIU_YU": entity.properties.LIU_YU._value,
                              "G_CHENG_LB": entity.properties.G_CHENG_LB._value,
                              "LD_QS": entity.properties.LD_QS._value,
                              "LM_S_YOU_Q": entity.properties.LM_S_YOU_Q._value,
                              "DI_LEI": entity.properties.DI_LEI._value,
                              "LIN_ZHONG": entity.properties.LIN_ZHONG._value,
                              "MIAN_JI": entity.properties.MIAN_JI._value,
                              "DI_MAO": entity.properties.DI_MAO._value,
                              "HAI_BA": entity.properties.HAI_BA._value,
                              "PO_DU": entity.properties.PO_DU._value,
                              "PO_XIANG": entity.properties.PO_XIANG._value,
                              "PO_WEI": entity.properties.PO_WEI._value,
                              "TU_RANG_LX": entity.properties.TU_RANG_LX._value,
                              "TU_CENG_HD": entity.properties.TU_CENG_HD._value,
                              "QI_YUAN": entity.properties.QI_YUAN._value,
                              "SEN_LIN_LB": entity.properties.SEN_LIN_LB._value,
                              "SHI_QUAN_D": entity.properties.SHI_QUAN_D._value,
                              "GJGYL_BHDJ": entity.properties.GJGYL_BHDJ._value,
                              "DFGYL_BHDJ": entity.properties.DFGYL_BHDJ._value,
                              "YOU_SHI_SZ": entity.properties.YOU_SHI_SZ._value,
                              "ZHU_Y_SZCS": entity.properties.ZHU_Y_SZCS._value,
                              "PINGJUN_NL": entity.properties.PINGJUN_NL._value,
                              "LING_ZU": entity.properties.LING_ZU._value,
                              "PINGJUN_XJ": entity.properties.PINGJUN_XJ._value,
                              "PINGJUN_GA": entity.properties.PINGJUN_GA._value,
                              "YU_BI_DU": entity.properties.YU_BI_DU._value,
                              "XIANGHUO_LMGQXJ": entity.properties.HUO_LMGQXJ._value,
                              "GENG_XIN_D": entity.properties.GENG_XIN_D._value,
                              "JING_JL_ZS": entity.properties.JING_JL_ZS._value,
                              "GUAN_MU_ZL": entity.properties.GUAN_MU_ZL._value,
                              "GUAN_MU_GD": entity.properties.GUAN_MU_GD._value,
                              "KE_JI_DU": entity.properties.KE_JI_DU._value,
                              "MEI_GQ_ZS": entity.properties.MEI_GQ_ZS._value,
                              "TD_TH_LX": entity.properties.TD_TH_LX._value,
                              "DISPE": entity.properties.DISPE._value,
                              "DISASTER_C": entity.properties.DISASTER_C._value,
                              "ZL_DJ": entity.properties.ZL_DJ._value,
                              "LD_KD": entity.properties.LD_KD._value,
                              "BH_DJ": entity.properties.BH_DJ._value,
                              "LYFQ": entity.properties.LYFQ._value,
                              "QYKZ": entity.properties.QYKZ._value,
                              "XJ_FQ": entity.properties.XJ_FQ._value,
                              "GENG_X_RQ": entity.properties.GENG_X_RQ._value,
                              "X_COOR": entity.properties.X_COOR._value,
                              "Y_COOR": entity.properties.Y_COOR._value,
                              "Q_LD_QS": entity.properties.Q_LD_QS._value,
                              "Q_DI_LEI": entity.properties.Q_DI_LEI._value,
                              "Q_L_Z": entity.properties.Q_L_Z._value,
                              "Q_SEN_LB": entity.properties.Q_SEN_LB._value,
                              "Q_SQ_D": entity.properties.Q_SQ_D._value,
                              "Q_GC_LB": entity.properties.Q_GC_LB._value,
                              "Q_BH_DJ": entity.properties.Q_BH_DJ._value,
                              "GH_SQDJ": entity.properties.GH_SQDJ._value,
                              "GH_DL": entity.properties.GH_DL._value,
                              "GH_BHDJ": entity.properties.GH_BHDJ._value,
                              "BHYY": entity.properties.BHYY._value,
                              "BHND": entity.properties.BHND._value,
                              "GLLX": entity.properties.GLLX._value,
                              "REMARKS": entity.properties.DFGYL_BHDJ._value,
                              "ZY_MIAN_JI": entity.properties.ZY_MIAN_JI._value,
                              "SHAPE_Leng": entity.properties.SHAPE_Leng._value,
                              "SHAPE_Area": entity.properties.SHAPE_Area._value
                            };
                            shapeList.push(shape);
                          }
                          else {
                            if (entity.properties.hasProperty("CD")) {
                              //道路
                              shape = {
                                "shapetype": "活动道路",
                                key: entity.properties.CODE._value,
                                "TTYPE": layerGeoJson,
                                "CODE": entity.properties.CODE._value,
                                "YJLX": entity.properties.YJLX._value,
                                "BHDLX": entity.properties.BHDLX._value,
                                "BHDJB": entity.properties.BHDJB._value,
                                "SHENG": entity.properties.SHENG._value,
                                "SHI": entity.properties.SHI._value,
                                "XIAN": entity.properties.XIAN._value,
                                "CUN": entity.properties.CUN._value,
                                "GNFQ": entity.properties.GNFQ._value,
                                "JCSJ": entity.properties.JCSJ._value,
                                "ZXJD": entity.properties.ZXJD._value,
                                "ZXWD": entity.properties.ZXWD._value,
                                "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
                                "HXQCD": entity.properties.hasProperty("HXQCD") ? entity.properties.HXQCD._value : "",
                                "HCQCD": entity.properties.hasProperty("HCQCD") ? entity.properties.HCQCD._value : "",
                                "SYQCD": entity.properties.hasProperty("SYQCD") ? entity.properties.SYQCD._value : "",
                                "TBBH": entity.properties.hasProperty("TBBH") ? entity.properties.TBBH._value : "",
                                "JCPC": entity.properties.hasProperty("JCPC") ? entity.properties.JCPC._value : "",
                                "SJY": entity.properties.hasProperty("SJY") ? entity.properties.SJY._value : "",
                              };
                              shapeList.push(shape);
                            } else {
                              shape = {
                                "shapetype": "活动面积",
                                "TTYPE": layerGeoJson,
                                key: entity.properties.CODE._value,
                                "CODE": entity.properties.CODE._value,
                                "YJLX": entity.properties.YJLX._value,
                                "BHDLX": entity.properties.BHDLX._value,
                                "BHDJB": entity.properties.BHDJB._value,
                                "SHENG": entity.properties.SHENG._value,
                                "SHI": entity.properties.SHI._value,
                                "XIAN": entity.properties.XIAN._value,
                                "CUN": entity.properties.CUN._value,
                                "GNFQ": entity.properties.GNFQ._value,
                                "JCSJ": entity.properties.JCSJ._value,
                                "ZXJD": entity.properties.ZXJD._value,
                                "ZXWD": entity.properties.ZXWD._value,
                                "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
                                "HXQMJ": entity.properties.hasProperty("HXQMJ") ? entity.properties.HXQMJ._value : "",
                                "HCQMJ": entity.properties.hasProperty("HCQMJ") ? entity.properties.HCQMJ._value : "",
                                "SYQMJ": entity.properties.hasProperty("SYQMJ") ? entity.properties.SYQMJ._value : "",
                                "TBBH": entity.properties.hasProperty("TBBH") ? entity.properties.TBBH._value : "",
                                "JCPC": entity.properties.hasProperty("JCPC") ? entity.properties.JCPC._value : "",
                                "SJY": entity.properties.hasProperty("SJY") ? entity.properties.SJY._value : "",
                              };
                              shapeList.push(shape);
                            }
                          }
                        }
                      }
                      setTimeout(() => {
                        dispatch({
                          type: 'indexPage/updateState',
                          payload: {
                            tubanShape: shapeList
                          }
                        })
                      }, 100);
                      // var temp = new Array();
                      // window.Hightlightline = function (nameid) {
                      //   var exists = temp.indexOf(nameid);
                      //   if (exists <= -1) {
                      //     window.Highlight(nameid,50, 50);
                      //     temp.push(nameid);  // 添加线nameID到数组，
                      //   }
                      //   else  //已经是高亮状态了 再次点击修改为原始状态
                      //   {
                      //     window.Highlight(nameid,0, 0);
                      //     temp.splice(exists, 1);  //删除对应的nameID
                      //   }
                      // }
                      // window.Highlight = function (nameid,width1, width2) {
                      //   for (var o = 0; o < entities.length; o++) {
                      //     var m = entities[o];
                      //     if (nameid == o) {
                      //       m.polygon.width = width1;
                      //       (m.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                      //         glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                      //         color: Cesium.Color.ORANGERED.withAlpha(.9)
                      //       }), width2)
                      //     }
                      //   }
                      // }
                    });
                    // viewer.flyTo(promise, {
                    //   offset: {
                    //     heading: Cesium.Math.toRadians(0.0), //默认值
                    //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
                    //     roll: 0.0 //默认值 }
                    //   }
                    // });
                  } else {

                  }
                } else {
                  var promise = Cesium.GeoJsonDataSource.load(layerGeoJsonPath, {
                    // stroke: Cesium.Color.BLACK,
                    fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(randomColor()), 0.5),
                  });

                  promise.then(function (dataSource) {
                    viewer.dataSources.add(dataSource);
                    let entities = dataSource.entities.values;
                    console.log(entities)
                    for (let i = 0; i < entities.length; i++) {
                      let entity = entities[i];
                      hightentity.push(entities[i])
                      // entity.polygon.zIndex = layerZIndex;
                      // entity.polygon.id = 1;
                      // console.log(entity.properties.QSX._value);
                      entity.nameID = i;   //给每条线添加一个编号，方便之后对线修改样式
                      // entity.polygon.width = 10;  //添加默认样式
                      // (entity.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                      //   glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                      //   color: Cesium.Color.ORANGERED.withAlpha(.9)
                      // }), 10)
                      if (entity.properties.hasProperty("QSX")) {
                        //活动变化
                        if (entity.properties.hasProperty("CD")) {
                          //道路
                          shape = {
                            "shapetype": "变化道路",
                            "TTYPE": layerGeoJson,
                            key: entity.properties.CODE._value,
                            "CODE": entity.properties.CODE._value,
                            "YJLX": entity.properties.YJLX._value,
                            "BHQK": entity.properties.BHQK._value,
                            "QSX": entity.properties.QSX._value,
                            "XIAN": entity.properties.XIAN._value,
                            "HSX": entity.properties.HSX._value,
                            "BHDLX": entity.properties.BHDLX._value,
                            "BHDMC": entity.properties.BHDMC._value,
                            "XIANG": entity.properties.XIANG._value,
                            "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                            "ZXJD": entity.properties.ZXJD._value,
                            "ZXWD": entity.properties.ZXWD._value,
                            "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
                          };
                          shapeList.push(shape);
                        } else {
                          shape = {
                            "shapetype": "变化面",
                            "TTYPE": layerGeoJson,
                            key: entity.properties.CODE._value,
                            "CODE": entity.properties.CODE._value,
                            "YJLX": entity.properties.YJLX._value,
                            "BHQK": entity.properties.BHQK._value,
                            "QSX": entity.properties.QSX._value,
                            "HSX": entity.properties.HSX._value,
                            "BHDLX": entity.properties.BHDLX._value,
                            "XIAN": entity.properties.XIAN._value,
                            "BHDMC": entity.properties.BHDMC._value,
                            "XIANG": entity.properties.XIANG._value,
                            "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                            "ZXJD": entity.properties.ZXJD._value,
                            "ZXWD": entity.properties.ZXWD._value,
                            "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
                          };
                          shapeList.push(shape);
                        }
                      } else {
                        //活动
                        if (entity.properties.hasProperty("XIAO_BAN")) {
                          //小班
                          entity.ID = "xiaoban" + layerGeoJson + i
                          shape = {
                            "shapetype": "小班",
                            key: "xiaoban" + layerGeoJson + i,
                            "TTYPE": layerGeoJson,
                            "SHENG": entity.properties.SHENG._value,
                            "SHI": entity.properties.SHI._value,
                            "XIAN": entity.properties.XIAN._value,
                            "XIANG": entity.properties.XIANG._value,
                            "CUN": entity.properties.CUN._value,
                            "LIN_YE_JU": entity.properties.LIN_YE_JU._value,
                            "LIN_CHANG": entity.properties.LIN_CHANG._value,
                            "LIN_BAN": entity.properties.LIN_BAN._value,
                            "XIAO_BAN": entity.properties.XIAO_BAN._value,
                            "LIU_YU": entity.properties.LIU_YU._value,
                            "G_CHENG_LB": entity.properties.G_CHENG_LB._value,
                            "LD_QS": entity.properties.LD_QS._value,
                            "LM_S_YOU_Q": entity.properties.LM_S_YOU_Q._value,
                            "DI_LEI": entity.properties.DI_LEI._value,
                            "LIN_ZHONG": entity.properties.LIN_ZHONG._value,
                            "MIAN_JI": entity.properties.MIAN_JI._value,
                            "DI_MAO": entity.properties.DI_MAO._value,
                            "HAI_BA": entity.properties.HAI_BA._value,
                            "PO_DU": entity.properties.PO_DU._value,
                            "PO_XIANG": entity.properties.PO_XIANG._value,
                            "PO_WEI": entity.properties.PO_WEI._value,
                            "TU_RANG_LX": entity.properties.TU_RANG_LX._value,
                            "TU_CENG_HD": entity.properties.TU_CENG_HD._value,
                            "QI_YUAN": entity.properties.QI_YUAN._value,
                            "SEN_LIN_LB": entity.properties.SEN_LIN_LB._value,
                            "SHI_QUAN_D": entity.properties.SHI_QUAN_D._value,
                            "GJGYL_BHDJ": entity.properties.GJGYL_BHDJ._value,
                            "DFGYL_BHDJ": entity.properties.DFGYL_BHDJ._value,
                            "YOU_SHI_SZ": entity.properties.YOU_SHI_SZ._value,
                            "ZHU_Y_SZCS": entity.properties.ZHU_Y_SZCS._value,
                            "PINGJUN_NL": entity.properties.PINGJUN_NL._value,
                            "LING_ZU": entity.properties.LING_ZU._value,
                            "PINGJUN_XJ": entity.properties.PINGJUN_XJ._value,
                            "PINGJUN_GA": entity.properties.PINGJUN_GA._value,
                            "YU_BI_DU": entity.properties.YU_BI_DU._value,
                            "XIANGHUO_LMGQXJ": entity.properties.HUO_LMGQXJ._value,
                            "GENG_XIN_D": entity.properties.GENG_XIN_D._value,
                            "JING_JL_ZS": entity.properties.JING_JL_ZS._value,
                            "GUAN_MU_ZL": entity.properties.GUAN_MU_ZL._value,
                            "GUAN_MU_GD": entity.properties.GUAN_MU_GD._value,
                            "KE_JI_DU": entity.properties.KE_JI_DU._value,
                            "MEI_GQ_ZS": entity.properties.MEI_GQ_ZS._value,
                            "TD_TH_LX": entity.properties.TD_TH_LX._value,
                            "DISPE": entity.properties.DISPE._value,
                            "DISASTER_C": entity.properties.DISASTER_C._value,
                            "ZL_DJ": entity.properties.ZL_DJ._value,
                            "LD_KD": entity.properties.LD_KD._value,
                            "BH_DJ": entity.properties.BH_DJ._value,
                            "LYFQ": entity.properties.LYFQ._value,
                            "QYKZ": entity.properties.QYKZ._value,
                            "XJ_FQ": entity.properties.XJ_FQ._value,
                            "GENG_X_RQ": entity.properties.GENG_X_RQ._value,
                            "X_COOR": entity.properties.X_COOR._value,
                            "Y_COOR": entity.properties.Y_COOR._value,
                            "Q_LD_QS": entity.properties.Q_LD_QS._value,
                            "Q_DI_LEI": entity.properties.Q_DI_LEI._value,
                            "Q_L_Z": entity.properties.Q_L_Z._value,
                            "Q_SEN_LB": entity.properties.Q_SEN_LB._value,
                            "Q_SQ_D": entity.properties.Q_SQ_D._value,
                            "Q_GC_LB": entity.properties.Q_GC_LB._value,
                            "Q_BH_DJ": entity.properties.Q_BH_DJ._value,
                            "GH_SQDJ": entity.properties.GH_SQDJ._value,
                            "GH_DL": entity.properties.GH_DL._value,
                            "GH_BHDJ": entity.properties.GH_BHDJ._value,
                            "BHYY": entity.properties.BHYY._value,
                            "BHND": entity.properties.BHND._value,
                            "GLLX": entity.properties.GLLX._value,
                            "REMARKS": entity.properties.DFGYL_BHDJ._value,
                            "ZY_MIAN_JI": entity.properties.ZY_MIAN_JI._value,
                            "SHAPE_Leng": entity.properties.SHAPE_Leng._value,
                            "SHAPE_Area": entity.properties.SHAPE_Area._value
                          };
                          shapeList.push(shape);
                        }
                        else {
                          if (entity.properties.hasProperty("CD")) {
                            //道路
                            shape = {
                              "shapetype": "活动道路",
                              key: entity.properties.CODE._value,
                              "TTYPE": layerGeoJson,
                              "CODE": entity.properties.CODE._value,
                              "YJLX": entity.properties.YJLX._value,
                              "BHDLX": entity.properties.BHDLX._value,
                              "BHDJB": entity.properties.BHDJB._value,
                              "SHENG": entity.properties.SHENG._value,
                              "SHI": entity.properties.SHI._value,
                              "XIAN": entity.properties.XIAN._value,
                              "CUN": entity.properties.CUN._value,
                              "GNFQ": entity.properties.GNFQ._value,
                              "JCSJ": entity.properties.JCSJ._value,
                              "ZXJD": entity.properties.ZXJD._value,
                              "ZXWD": entity.properties.ZXWD._value,
                              "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
                              "HXQCD": entity.properties.hasProperty("HXQCD") ? entity.properties.HXQCD._value : "",
                              "HCQCD": entity.properties.hasProperty("HCQCD") ? entity.properties.HCQCD._value : "",
                              "SYQCD": entity.properties.hasProperty("SYQCD") ? entity.properties.SYQCD._value : "",
                              "TBBH": entity.properties.hasProperty("TBBH") ? entity.properties.TBBH._value : "",
                              "JCPC": entity.properties.hasProperty("JCPC") ? entity.properties.JCPC._value : "",
                              "SJY": entity.properties.hasProperty("SJY") ? entity.properties.SJY._value : "",
                            };
                            shapeList.push(shape);
                          } else {
                            shape = {
                              "shapetype": "活动面积",
                              "TTYPE": layerGeoJson,
                              key: entity.properties.CODE._value,
                              "CODE": entity.properties.CODE._value,
                              "YJLX": entity.properties.YJLX._value,
                              "BHDLX": entity.properties.BHDLX._value,
                              "BHDJB": entity.properties.BHDJB._value,
                              "SHENG": entity.properties.SHENG._value,
                              "SHI": entity.properties.SHI._value,
                              "XIAN": entity.properties.XIAN._value,
                              "CUN": entity.properties.CUN._value,
                              "GNFQ": entity.properties.GNFQ._value,
                              "JCSJ": entity.properties.JCSJ._value,
                              "ZXJD": entity.properties.ZXJD._value,
                              "ZXWD": entity.properties.ZXWD._value,
                              "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
                              "HXQMJ": entity.properties.hasProperty("HXQMJ") ? entity.properties.HXQMJ._value : "",
                              "HCQMJ": entity.properties.hasProperty("HCQMJ") ? entity.properties.HCQMJ._value : "",
                              "SYQMJ": entity.properties.hasProperty("SYQMJ") ? entity.properties.SYQMJ._value : "",
                              "TBBH": entity.properties.hasProperty("TBBH") ? entity.properties.TBBH._value : "",
                              "JCPC": entity.properties.hasProperty("JCPC") ? entity.properties.JCPC._value : "",
                              "SJY": entity.properties.hasProperty("SJY") ? entity.properties.SJY._value : "",
                            };
                            shapeList.push(shape);
                          }
                        }
                      }
                    }
                    setTimeout(() => {
                      dispatch({
                        type: 'indexPage/updateState',
                        payload: {
                          tubanShape: shapeList
                        }
                      })
                    }, 100);
                    // var temp = new Array();
                    // window.Hightlightline = function (nameid) {
                    //   var exists = temp.indexOf(nameid);
                    //   if (exists <= -1) {
                    //     window.Highlight(nameid,50, 50);
                    //     temp.push(nameid);  // 添加线nameID到数组，
                    //   }
                    //   else  //已经是高亮状态了 再次点击修改为原始状态
                    //   {
                    //     window.Highlight(nameid,10, 10);
                    //     temp.splice(exists, 1);  //删除对应的nameID
                    //   }
                    // }
                    // window.Highlight = function (nameid,width1, width2) {
                    //   for (var o = 0; o < entities.length; o++) {
                    //     var m = entities[o];
                    //     if (nameid == o) {
                    //       m.polygon.width = width1;
                    //       (m.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                    //         glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                    //         color: Cesium.Color.ORANGERED.withAlpha(.9)
                    //       }), width2)
                    //     }
                    //   }
                    // }
                  });
                  // viewer.flyTo(promise, {
                  //   offset: {
                  //     heading: Cesium.Math.toRadians(0.0), //默认值
                  //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
                  //     roll: 0.0 //默认值 }
                  //   }
                  // });
                }
              }
              else if (item.indexOf("url:") > -1) {
                // alert(item.split("url:")[0], imageProvide2.length);
                let layers = [];
                $.ajax({
                  url: item.split("url:")[1] + "?f=pjson", success: function (results) {
                    //console.log(JSON.parse(results));
                    $.each(JSON.parse(results).layers, function (i, v) {
                      layers.push(v.id)
                    })
                    //console.log(layers);
                  }
                });
                if (imageProvide2.length > 0) {
                  if (imageProvide2.indexOf(item.split("url:")[0]) == -1) {
                    imageProvide2.push(item.split("url:")[0]);
                    const protectimg = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: item.split("url:")[1],
                      layers: layers,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }));
                    imageProvide.push({ name: item.split("url:")[0], key: protectimg });
                  } else {

                  }
                } else {
                  imageProvide2.push(item.split("url:")[0]);
                  const protectimg = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                    url: item.split("url:")[1],
                    layers: layers,
                    proxy: new Cesium.DefaultProxy('/proxy/')
                  }));
                  imageProvide.push({ name: item.split("url:")[0], key: protectimg });
                }
                // console.log(protectimg);
                // alert(e.checkedNodes.length);
                // if (e.checkedNodes.length == 1) {
                //   viewer.camera.flyTo({
                //     // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                //     destination: Cesium.Rectangle.fromDegrees(e.node.props.minlon, e.node.props.minlat, e.node.props.maxlon, e.node.props.maxlat)
                //   });
                // } else {
                //   if (e.checkedNodes[e.checkedNodes.length - 1].props["minlon"]) {
                //     if (e.checkedNodes[e.checkedNodes.length - 1].props.minlon !== undefined) {
                //       viewer.camera.flyTo({
                //         // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                //         destination: Cesium.Rectangle.fromDegrees(e.checkedNodes[e.checkedNodes.length - 1].props.minlon, e.checkedNodes[e.checkedNodes.length - 1].props.minlat, e.checkedNodes[e.checkedNodes.length - 1].props.maxlon, e.checkedNodes[e.checkedNodes.length - 1].props.maxlat)
                //       });
                //     }
                //   }
                // }
              } else if (item.indexOf("geo:") > -1) {
                if (haslayers.length > 0) {
                  if (haslayers.indexOf(item.split("geo:")[0]) === -1) {
                    var geo = {
                      "type": "FeatureCollection",
                      "features": [{
                        "type": "Feature",
                        "geometry": {
                          "type": "MultiLineString",
                          "coordinates": [[[111.20420000, 36.63880000], [111.20440000, 36.63890000], [111.20460000, 36.63900000], [111.20490000, 36.63930000]]]
                        },
                        "properties": { "prop0": "value0", "prop1": 0.0 }
                      }]
                    };
                    // console.log(eval('(' + item.split("geo:")[1] + ')'))
                    var promise = Cesium.GeoJsonDataSource.load(eval('(' + item.split("geo:")[1] + ')'), { sourceUri: item.split("geo:")[0] });
                    promise.then(function (dataSource) {
                      viewer.dataSources.add(dataSource);
                      let entities = dataSource.entities.values;
                      for (let i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        entity.polygon.zIndex = layerZIndex;
                      }
                    });
                  }
                } else {
                  var geo = {
                    "type": "FeatureCollection",
                    "features": [{
                      "type": "Feature",
                      "geometry": {
                        "type": "MultiLineString",
                        "coordinates": [[[111.20420000, 36.63880000], [111.20440000, 36.63890000], [111.20460000, 36.63900000], [111.20490000, 36.63930000]]]
                      },
                      "properties": { "prop0": "value0", "prop1": 0.0 }
                    }]
                  };
                  // console.log(eval('(' + item.split("geo:")[1] + ')'))
                  var promise = Cesium.GeoJsonDataSource.load(eval('(' + item.split("geo:")[1] + ')'), { sourceUri: item.split("geo:")[0] });
                  promise.then(function (dataSource) {
                    viewer.dataSources.add(dataSource);
                    let entities = dataSource.entities.values;
                    for (let i = 0; i < entities.length; i++) {
                      let entity = entities[i];
                      entity.polygon.zIndex = layerZIndex;
                    }
                  });
                }

                // viewer.flyTo(promise, {
                //   offset: {
                //     heading: Cesium.Math.toRadians(0.0), //默认值
                //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
                //     roll: 0.0 //默认值 }
                //   }
                // });
              }
              else if (item.indexOf("draw:") > -1) {
                // console.log(JSON.parse(item.split("draw:")[1]))
                if (haslayers.length > 0) {
                  if (haslayers.indexOf(item.split("draw:")[0]) == -1) {
                    var t = {
                      "type": "FeatureCollection",
                      "features": JSON.parse(item.split("draw:")[1])
                    };
                    var promise = Cesium.GeoJsonDataSource.load(t, { sourceUri: item.split("draw:")[0] });
                    promise.then(function (dataSource) {
                      viewer.dataSources.add(dataSource);
                      let entities = dataSource.entities.values;
                      for (let i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        entity.polygon.zIndex = layerZIndex;
                      }
                    });
                    // viewer.flyTo(promise, {
                    //   offset: {
                    //     heading: Cesium.Math.toRadians(0.0), //默认值
                    //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
                    //     roll: 0.0 //默认值 }
                    //   }
                    // });
                  } else {
                    return false
                  }
                } else {
                  var t = {
                    "type": "FeatureCollection",
                    "features": JSON.parse(item.split("draw:")[1])
                  };
                  var promise = Cesium.GeoJsonDataSource.load(t, { sourceUri: item.split("draw:")[0] });
                  promise.then(function (dataSource) {
                    viewer.dataSources.add(dataSource);
                    let entities = dataSource.entities.values;
                    for (let i = 0; i < entities.length; i++) {
                      let entity = entities[i];
                      entity.polygon.zIndex = layerZIndex;
                    }
                  });
                  // viewer.flyTo(promise, {
                  //   offset: {
                  //     heading: Cesium.Math.toRadians(0.0), //默认值
                  //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
                  //     roll: 0.0 //默认值 }
                  //   }
                  // });
                }

              }
            });
          } else {
            dispatch({
              type: 'indexPage/updateState',
              payload: {
                tubanShape: []
              }
            })
            // global.viewer.dataSources._dataSources.forEach((v) => {
            //   global.viewer.dataSources.remove(v);
            // });//根据指定图层删除方式
            for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
              if (global.viewer.dataSources._dataSources[i]._name !== "创建任务图层" && global.viewer.dataSources._dataSources[i]._name !== "处置意见图层" && global.viewer.dataSources._dataSources[i]._name !== "核查管理图层" && global.viewer.dataSources._dataSources[i]._name !== "处置意见图层") {
                global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
                i--;
              }
            }
            // global.viewer.dataSources.removeAll();//全部删除
          }
        } else {

        }
      },

      taskLayer: (menuSelect) => {
        const { dispatch } = this.props;
        let tubanShape2 = [], shape2;
        // global.viewer.dataSources._dataSources.forEach((v) => {
        //   layerhad.push(v._name)
        // });

        global.viewer.dataSources._dataSources.forEach((v) => {
          if ((v._name) === "创建任务图层") {
            global.viewer.dataSources.remove(v);
            //notification.close(item);
          }
        });
        let layerGeoJsonPath = apiUrl + menuSelect;
        // layerGeoJson = menuSelect.split('/')[menuSelect.split('/').length - 1];
        // var color;
        // if (!v.color) {
        //   v.color = randomColor();
        // }
        // alert(layerGeoJsonPath);/layer/custom/
        var promise = Cesium.GeoJsonDataSource.load(layerGeoJsonPath, {
          // stroke: Cesium.Color.BLACK,
          sourceUri: "创建任务图层",
          fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(randomColor()), 0.5),
        });

        promise.then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          // viewer.dataSources.raiseToTop(dataSource);
          let entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            // entity.polygon.zIndex = layerZIndex;
            hightentity2.push(entities[i])
            // entity.polygon.id = 1;
            // console.log(entity);
            if (entity.properties.hasProperty("CD")) {
              //道路
              shape2 = {
                "shapetype": "活动道路",
                key: entity.properties.CODE._value,
                "CODE": entity.properties.CODE._value,
                "YJLX": entity.properties.YJLX._value,
                "BHQK": entity.properties.BHQK._value,
                "QSX": entity.properties.QSX._value,
                "HSX": entity.properties.HSX._value,
                "BHDLX": entity.properties.BHDLX._value,
                "BHDMC": entity.properties.BHDMC._value,
                "XIANG": entity.properties.XIANG._value,
                "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
              };
              tubanShape2.push(shape2);
            } else {
              shape2 = {
                "shapetype": "活动面积",
                key: entity.properties.CODE._value,
                "CODE": entity.properties.CODE._value,
                "YJLX": entity.properties.YJLX._value,
                "BHQK": entity.properties.BHQK._value,
                "QSX": entity.properties.QSX._value,
                "HSX": entity.properties.HSX._value,
                "BHDLX": entity.properties.BHDLX._value,
                "BHDMC": entity.properties.BHDMC._value,
                "XIANG": entity.properties.XIANG._value,
                "GNFQ": entity.properties.hasProperty("GNFQ") ? entity.properties.GNFQ._value : "",
                "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
              };
              tubanShape2.push(shape2);
            }
          }
          setTimeout(() => {
            dispatch({
              type: 'indexPage/updateState',
              payload: {
                tubanShape2: tubanShape2
              }
            })
          }, 100);
        });
        viewer.flyTo(promise, {
          offset: {
            heading: Cesium.Math.toRadians(0.0), //默认值
            pitch: Cesium.Math.toRadians(-90.0), // 默认值
            roll: 0.0 //默认值 }
          }
        });
      },

      //创建任务绘制
      drawEvent:
        (type) => {
          drawHelper.registerDrawEvent(type, function () {
            //console.log(type);
            // if (type == "marker") {
            //   this.props.dispatch({
            //     type: 'indexPage/updateState',
            //     payload: {
            //       marker: false
            //     }
            //   })
            // } else if (type == "polyline") {
            //   this.props.dispatch({
            //     type: 'indexPage/updateState',
            //     payload: {
            //       polyline: false
            //     }
            //   })
            // } else if (type == "polygon") {
            //   this.props.dispatch({
            //     type: 'indexPage/updateState',
            //     payload: {
            //       polygon: false
            //     }
            //   })
            // }
          })
        },

      //创建任务绘制后导出的相关坐标
      exportDraw:
        () => {
          return drawHelper.exportLayer()
        },

      //撤销绘制动作
      stopDraw:
        () => {
          drawHelper.stopDrawing()
        },

      //根据经纬度画点
      createCircle:
        (latCompare, lngCompare, latDraw, lngDraw, radiuDraw) => {
          // console.log(latCompare, lngCompare, latDraw, lngDraw, radiuDraw)

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

          var distance = getFlatternDistance(latCompare, lngCompare, latDraw, lngDraw)


          if (distance < radiuDraw) {
            var circleInstance = new Cesium.GeometryInstance({
              geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(lngDraw, latDraw),
                radius: radiuDraw,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
              }),
              attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
              }
              // id: 'circle'
            });
            var primitive = new Cesium.Primitive({
              geometryInstances: circleInstance,
              appearance: new Cesium.PerInstanceColorAppearance({
                translucent: false,
                closed: true
              })
            });
            viewer.scene.primitives.add(primitive);
          }
        },

      //影像对比
      imageConstrat:
        (a, b) => {
          if (layer.length > 0) {
            for (var i in layer) {
              viewer.imageryLayers.remove(layer[i])
            }
            viewer.container.removeChild(div);
            div = document.createElement('DIV');
            div.id = 'slider';
            viewer.container.appendChild(div);
            // splitLeft = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //   layer: "tdtVecBasicLayer",
            //   style: "default",
            //   format: "image/jpeg",
            //   tileMatrixSetID: "GoogleMapsCompatible",
            //   show: false
            // }));
            // splitLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;

            // var water = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/water/{z}/{x}/{reverseY}.png'
            // }))
            // layer.push(water);
            //
            // water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            // var road = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/road/{z}/{x}/{reverseY}.png'
            // }))
            let layers = [], layers2 = [], x, x2;
            // $.when()
            $.ajax({
              url: a, success: function (results) {
                //console.log(JSON.parse(results));
                x = JSON.parse(results);
                $.each(JSON.parse(results).layers, function (i, v) {
                  layers.push(v.id)
                });
                $.ajax({
                  url: b, success: function (results) {
                    //console.log(JSON.parse(results));
                    x2 = JSON.parse(results);
                    $.each(JSON.parse(results).layers, function (i, v) {
                      layers2.push(v.id)
                    });
                    //console.log(layers2, layers);
                    var water = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: a,
                      layers: layers,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layer.push(water);
                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(water._rectangle.west, water._rectangle.south, water._rectangle.east, water._rectangle.north)
                    // });

                    water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    var road = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: b,
                      layers: layers2,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layer.push(road);
                    road.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(road._rectangle.west, road._rectangle.south, road._rectangle.east, road._rectangle.north)
                    // });
                    viewer.camera.flyTo({
                      // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                      destination: Cesium.Rectangle.fromDegrees(x.initialExtent.xmin, x.initialExtent.ymin, x.initialExtent.xmax, x.initialExtent.ymax)
                    });
                    var slider = document.getElementById('slider');
                    viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

                    var handler = new Cesium.ScreenSpaceEventHandler(slider);

                    var moveActive = false;

                    //拉动竖线方法
                    function move(movement) {
                      if (!moveActive) {
                        return;
                      }

                      var relativeOffset = movement.endPosition.x;
                      var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                      slider.style.left = 100.0 * splitPosition + '%';
                      viewer.scene.imagerySplitPosition = splitPosition;
                    }

                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.PINCH_START);

                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.LEFT_UP);
                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.PINCH_END);
                  }
                });
              }
            });
          } else {
            div = document.createElement('DIV');
            div.id = 'slider';
            viewer.container.appendChild(div);
            // splitLeft = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //   layer: "tdtVecBasicLayer",
            //   style: "default",
            //   format: "image/jpeg",
            //   tileMatrixSetID: "GoogleMapsCompatible",
            //   show: false
            // }));
            // splitLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;

            // var water = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/water/{z}/{x}/{reverseY}.png'
            // }))
            // layer.push(water);
            //
            // water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            // var road = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/road/{z}/{x}/{reverseY}.png'
            // }))
            let layers = [], layers2 = [], x, x2;
            // $.when()
            $.ajax({
              url: a, success: function (results) {
                //console.log(JSON.parse(results));
                x = JSON.parse(results);
                $.each(JSON.parse(results).layers, function (i, v) {
                  layers.push(v.id)
                });
                $.ajax({
                  url: b, success: function (results) {
                    //console.log(JSON.parse(results));
                    x2 = JSON.parse(results);
                    $.each(JSON.parse(results).layers, function (i, v) {
                      layers2.push(v.id)
                    });
                    //console.log(layers2, layers);
                    var water = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: a,
                      layers: layers,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layer.push(water);
                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(water._rectangle.west, water._rectangle.south, water._rectangle.east, water._rectangle.north)
                    // });

                    water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    var road = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: b,
                      layers: layers2,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layer.push(road);
                    road.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(road._rectangle.west, road._rectangle.south, road._rectangle.east, road._rectangle.north)
                    // });
                    viewer.camera.flyTo({
                      // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                      destination: Cesium.Rectangle.fromDegrees(x.initialExtent.xmin, x.initialExtent.ymin, x.initialExtent.xmax, x.initialExtent.ymax)
                    });
                    var slider = document.getElementById('slider');
                    viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

                    var handler = new Cesium.ScreenSpaceEventHandler(slider);

                    var moveActive = false;

                    //拉动竖线方法
                    function move(movement) {
                      if (!moveActive) {
                        return;
                      }

                      var relativeOffset = movement.endPosition.x;
                      var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                      slider.style.left = 100.0 * splitPosition + '%';
                      viewer.scene.imagerySplitPosition = splitPosition;
                    }

                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.PINCH_START);

                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.LEFT_UP);
                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.PINCH_END);
                  }
                });
              }
            });
          }

        },

      //去除影像对比
      removwConstract:
        () => {
          //删除图层方法
          // $("#slider").remove();
          if (layer.length > 0) {
            for (var i in layer) {
              viewer.imageryLayers.remove(layer[i]);
              // layer.splice(i, 1);
            }
            layer = [];
            viewer.container.removeChild(div)
          } else {
            return false
          }
        },

      //处置意见影像对比
      imageConstratSetAdvice:
        (a, b) => {
          if (layerSetadvice.length > 0) {
            for (var i in layerSetadvice) {
              viewer.imageryLayers.remove(layerSetadvice[i])
            }
            viewer.container.removeChild(divSetadvice);
            divSetadvice = document.createElement('DIV');
            divSetadvice.id = 'sliderSetadvice';
            viewer.container.appendChild(divSetadvice);
            // splitLeft = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //   layer: "tdtVecBasicLayer",
            //   style: "default",
            //   format: "image/jpeg",
            //   tileMatrixSetID: "GoogleMapsCompatible",
            //   show: false
            // }));
            // splitLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;

            // var water = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/water/{z}/{x}/{reverseY}.png'
            // }))
            // layer.push(water);
            //
            // water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            // var road = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/road/{z}/{x}/{reverseY}.png'
            // }))
            let layers = [], layers2 = [], x, x2;
            // $.when()
            $.ajax({
              url: a, success: function (results) {
                //console.log(JSON.parse(results));
                x = JSON.parse(results);
                $.each(JSON.parse(results).layers, function (i, v) {
                  layers.push(v.id)
                });
                $.ajax({
                  url: b, success: function (results) {
                    //console.log(JSON.parse(results));
                    x2 = JSON.parse(results);
                    $.each(JSON.parse(results).layers, function (i, v) {
                      layers2.push(v.id)
                    });
                    //console.log(layers2, layers);
                    var water = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: a,
                      layers: layers,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layerSetadvice.push(water);
                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(water._rectangle.west, water._rectangle.south, water._rectangle.east, water._rectangle.north)
                    // });

                    water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    var road = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: b,
                      layers: layers2,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layerSetadvice.push(road);
                    road.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(road._rectangle.west, road._rectangle.south, road._rectangle.east, road._rectangle.north)
                    // });
                    viewer.camera.flyTo({
                      // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                      destination: Cesium.Rectangle.fromDegrees(x.initialExtent.xmin, x.initialExtent.ymin, x.initialExtent.xmax, x.initialExtent.ymax)
                    });
                    var sliderSetadvice = document.getElementById('sliderSetadvice');
                    viewer.scene.imagerySplitPosition = (sliderSetadvice.offsetLeft) / sliderSetadvice.parentElement.offsetWidth;

                    var handler = new Cesium.ScreenSpaceEventHandler(sliderSetadvice);

                    var moveActive = false;

                    //拉动竖线方法
                    function move(movement) {
                      if (!moveActive) {
                        return;
                      }

                      var relativeOffset = movement.endPosition.x;
                      var splitPosition = (sliderSetadvice.offsetLeft + relativeOffset) / sliderSetadvice.parentElement.offsetWidth;
                      sliderSetadvice.style.left = 100.0 * splitPosition + '%';
                      viewer.scene.imagerySplitPosition = splitPosition;
                    }

                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.PINCH_START);

                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.LEFT_UP);
                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.PINCH_END);
                  }
                });
              }
            });
          } else {
            divSetadvice = document.createElement('DIV');
            divSetadvice.id = 'sliderSetadvice';
            viewer.container.appendChild(divSetadvice);
            // splitLeft = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //   layer: "tdtVecBasicLayer",
            //   style: "default",
            //   format: "image/jpeg",
            //   tileMatrixSetID: "GoogleMapsCompatible",
            //   show: false
            // }));
            // splitLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;

            // var water = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/water/{z}/{x}/{reverseY}.png'
            // }))
            // layer.push(water);
            //
            // water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            // var road = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //   url: 'http://183.232.33.177:9080/webearth/tiles/road/{z}/{x}/{reverseY}.png'
            // }))
            let layers = [], layers2 = [], x, x2;
            // $.when()
            $.ajax({
              url: a, success: function (results) {
                //console.log(JSON.parse(results));
                x = JSON.parse(results);
                $.each(JSON.parse(results).layers, function (i, v) {
                  layers.push(v.id)
                });
                $.ajax({
                  url: b, success: function (results) {
                    //console.log(JSON.parse(results));
                    x2 = JSON.parse(results);
                    $.each(JSON.parse(results).layers, function (i, v) {
                      layers2.push(v.id)
                    });
                    //console.log(layers2, layers);
                    var water = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: a,
                      layers: layers,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layerSetadvice.push(water);
                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(water._rectangle.west, water._rectangle.south, water._rectangle.east, water._rectangle.north)
                    // });

                    water.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    var road = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                      url: b,
                      layers: layers2,
                      proxy: new Cesium.DefaultProxy('/proxy/')
                    }))
                    layerSetadvice.push(road);
                    road.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

                    // viewer.camera.flyTo({
                    //     destination: new Cesium.Rectangle(road._rectangle.west, road._rectangle.south, road._rectangle.east, road._rectangle.north)
                    // });
                    viewer.camera.flyTo({
                      // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                      destination: Cesium.Rectangle.fromDegrees(x.initialExtent.xmin, x.initialExtent.ymin, x.initialExtent.xmax, x.initialExtent.ymax)
                    });
                    var sliderSetadvice = document.getElementById('sliderSetadvice');
                    viewer.scene.imagerySplitPosition = (sliderSetadvice.offsetLeft) / sliderSetadvice.parentElement.offsetWidth;

                    var handler = new Cesium.ScreenSpaceEventHandler(sliderSetadvice);

                    var moveActive = false;

                    //拉动竖线方法
                    function move(movement) {
                      if (!moveActive) {
                        return;
                      }

                      var relativeOffset = movement.endPosition.x;
                      var splitPosition = (sliderSetadvice.offsetLeft + relativeOffset) / sliderSetadvice.parentElement.offsetWidth;
                      sliderSetadvice.style.left = 100.0 * splitPosition + '%';
                      viewer.scene.imagerySplitPosition = splitPosition;
                    }

                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                    handler.setInputAction(function () {
                      moveActive = true;
                    }, Cesium.ScreenSpaceEventType.PINCH_START);

                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.LEFT_UP);
                    handler.setInputAction(function () {
                      moveActive = false;
                    }, Cesium.ScreenSpaceEventType.PINCH_END);
                  }
                });
              }
            });
          }

        },

      //去除处置意见影像对比
      removwConstractSetAdvice:
        () => {
          //删除图层方法
          // $("#slider").remove();
          if (layerSetadvice.length > 0) {
            for (var i in layerSetadvice) {
              viewer.imageryLayers.remove(layerSetadvice[i]);
              // layer.splice(i, 1);
            }
            layerSetadvice = [];
            viewer.container.removeChild(divSetadvice)
          } else {
            return false
          }
        },

      //任务查询
      querytaskdetail:
        (url, spotlists, url2) => {
          // console.log(url);
          handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          const getPos = (position) => {
            let location = new Cesium.Cartesian2(position.x, position.y);
            return location;
          };
          handler3D.setInputAction(function (movement, state) {
            const pick = scene.pick(movement.position);
            //console.log(typeof pick);
            let url;
            let newurl = [], htmlurl = "";
            let cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
            if (pick !== undefined) {
              if (pick.id !== undefined) {
                if (pick.id._name === "image" || pick.id._name === "image_text") {
                  url = pick.id._url;
                  if (url.indexOf(",") > -1) {
                    newurl = url.split(",");
                    let width = 100 / newurl.length;
                    $.each(newurl, function (i, v) {
                      htmlurl += "<img src='" + apiUrl + v + "'  style='display: inline;width: " + width + "%'/>"
                    })
                  } else {
                    htmlurl = "<img src='" + apiUrl + pick.id._url + "' width='100' style='width: 100%'/>";
                  }
                }
              }
            }

            const clickFun = () => {
              if (pick !== undefined) {
                if (pick.id !== undefined) {
                  if (pick.id.properties == undefined) {
                    if (pick.id._name === "image") {
                      url = pick.id._url;
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("fanda").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      $("#popup #content").html(htmlurl);
                    } else if (pick.id._name === "image_text") {
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("fanda").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      $("#popup #content").html("<div style='color: #fff;font-size: 12px'><p style='color: #13c2c2;font-size: 13px'>文字描述：</p>" + (pick.id._text == "" ? "暂无文字描述" : pick.id._text) + "</div>" + htmlurl);
                    } else if (pick.id._name === "text") {
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      document.getElementById("fanda").style.display = "none";
                      $("#popup #content").html("文字描述：" + (pick.id._text == "" ? "暂无文字描述" : pick.id._text));
                    } else {
                      document.getElementById("popup").style.display = "none";
                    }
                  }
                } else {
                  document.getElementById("popup").style.display = "none";
                }
              }
              else {
                document.getElementById("popup").style.display = "none";
              }
            }
            // if (pick !== undefined) {
            //   console.log(pick.id.properties);
            //   viewer.scene.postRender.removeEventListener(clickFun);
            //   viewer.scene.postRender.addEventListener(clickFun);
            // } else {
            //   viewer.scene.postRender.removeEventListener(clickFun);
            //   document.getElementById("popup").style.display = "none";
            //   return false;
            // }
            viewer.scene.postRender.removeEventListener(clickFun);
            viewer.scene.postRender.addEventListener(clickFun);
            var pop_closer = document.getElementById('fanda');
            pop_closer.addEventListener('click', ev => {
              this.setState({
                photoSee: true
              });
              $("#dd").html(htmlurl)
            })
            //设置鼠标移动事件的处理函数，这里负责监听鼠标x,y坐标值变化
          }.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);


          const iconType = (image, text) => {
            if (image === "" || image === null) {
              return './images/icon/text.png'
            } else if (image !== "" || image !== null) {
              if (text !== "" || text !== null) {
                return './images/icon/image_text.png'
              } else {
                return './images/icon/image.png'
              }
            }
          }

          const nameType = (i, t) => {
            if (i === "" || i === null) {
              return 'text'
            } else if (i !== "" || i !== null) {
              if (t !== "" || t !== null) {
                return 'image_text'
              } else {
                return 'image'
              }
            }
          }

          if (spotlists.length > 0) {
            spotlists.forEach((item, key) => {
              // var cartesians1 = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude)
              // var cartesians2 = Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude) + 0.0001, item.latitude)
              // var cartesians3 = Cesium.Cartesian3.fromDegrees(item.longitude, parseFloat(item.latitude) + 0.00008)
              // var cartesians4 = Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude) + 0.0001, parseFloat(item.latitude) + 0.00008)
              var entity = viewer.entities.add({
                // name: nameType(item.file, item.content),
                // text: item.content,
                url: item.file,
                // rectangle: {
                //   coordinates: Cesium.Rectangle.fromCartesianArray([cartesians1, cartesians2, cartesians3, cartesians4], viewer.scene.globe.ellipsoid),
                //   material: iconType(item.file, item.content),
                //   // iconType(item.file, item.content),
                //   // rotation: new Cesium.CallbackProperty(getRotationValue, false),
                //   // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                //   classificationType: Cesium.ClassificationType.TERRAIN
                // }
                text: item.content == null ? "" : item.content,
                name: nameType(item.file, item.content),
                position: Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude), parseFloat(item.latitude)),
                billboard: {
                  image: iconType(item.file, item.content),
                  width: 40,
                  height: 40
                },
                label: {
                  // text: item.content,
                  font: '14pt monospace',
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.TOP,
                  pixelOffset: new Cesium.Cartesian2(0, 32)
                }
              });
              selfentity2.push(entity);
            });
          } else {
            message.warn("暂时无图文数据")
          }

          // var cartesians1 = Cesium.Cartesian3.fromDegrees(111.20420000, 36.63880000)
          // var cartesians2 = Cesium.Cartesian3.fromDegrees(111.20430000, 36.63880000)
          // var cartesians3 = Cesium.Cartesian3.fromDegrees(111.20420000, 36.63890000)
          // var cartesians4 = Cesium.Cartesian3.fromDegrees(111.20430000, 36.63890000)
          //
          // var cartesians11 = Cesium.Cartesian3.fromDegrees(111.20460000, 36.63900000)
          // var cartesians22 = Cesium.Cartesian3.fromDegrees(111.20470000, 36.63900000)
          // var cartesians33 = Cesium.Cartesian3.fromDegrees(111.20460000, 36.63910000)
          // var cartesians44 = Cesium.Cartesian3.fromDegrees(111.20470000, 36.63910000)
          //
          // var cartesians111 = Cesium.Cartesian3.fromDegrees(111.20490000, 36.63930000)
          // var cartesians222 = Cesium.Cartesian3.fromDegrees(111.20500000, 36.63930000)
          // var cartesians333 = Cesium.Cartesian3.fromDegrees(111.20490000, 36.63940000)
          // var cartesians444 = Cesium.Cartesian3.fromDegrees(111.20500000, 36.63940000)
          //
          // var entity = viewer.entities.add({
          //   name: 'image',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians1, cartesians2, cartesians3, cartesians4], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          // var entity2 = viewer.entities.add({
          //   name: 'image_text',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians11, cartesians22, cartesians33, cartesians44], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image_text.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          // var entity3 = viewer.entities.add({
          //   name: 'text',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians111, cartesians222, cartesians333, cartesians444], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          //  selfentity.push(entity,entity2,entity3)
          // viewer.zoomTo(entity);
          var geo = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "MultiLineString",
                "coordinates": [[[111.20420000, 36.63880000,], [111.20440000, 36.63890000], [111.20460000, 36.63900000], [111.20490000, 36.63930000]]]
              },
              "properties": { "prop0": "value0", "prop1": 0.0 }
            }]
          }
          // var geo2 = {
          //   "type": "FeatureCollection",
          //   "features": JSON.parse(url)
          // }
          if (url !== null) {
            var promise = Cesium.GeoJsonDataSource.load(url, { sourceUri: "任务查询图层" });
            promise.then(function (dataSource) {
              viewer.dataSources.add(dataSource);
            });
            var promise2 = Cesium.GeoJsonDataSource.load(url2, { sourceUri: "任务查询图层" });
            promise2.then(function (dataSource2) {
              viewer.dataSources.add(dataSource2);
            });
            viewer.flyTo(promise2, {
              offset: {
                heading: Cesium.Math.toRadians(0.0), //默认值
                pitch: Cesium.Math.toRadians(-90.0), // 默认值
                roll: 0.0 //默认值 }
              }
            });
          } else {
            // message.warn("无地图数据")
          }
        },

      //自主巡护
      selfCheckdetail:
        (url, spotlists) => {
          handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          const getPos = (position) => {
            let location = new Cesium.Cartesian2(position.x, position.y);
            return location;
          };
          handler3D.setInputAction(function (movement, state) {
            const pick = scene.pick(movement.position);
            //console.log(typeof pick);
            let url;
            let newurl = [], htmlurl = "";
            let cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
            if (pick !== undefined) {
              if (pick.id !== undefined) {
                if (pick.id._name === "image" || pick.id._name === "image_text") {
                  url = pick.id._url;
                  if (url.indexOf(",") > -1) {
                    newurl = url.split(",");
                    let width = 100 / newurl.length;
                    $.each(newurl, function (i, v) {
                      htmlurl += "<img src='" + apiUrl + v + "'  style='display: inline;width: " + width + "%'/>"
                    })
                  } else {
                    htmlurl = "<img src='" + apiUrl + pick.id._url + "' width='100' style='width: 100%'/>";
                  }
                }
              }
            }

            const clickFun = () => {
              if (pick !== undefined) {
                if (pick.id !== undefined) {
                  if (pick.id.properties == undefined) {
                    if (pick.id._name === "image") {
                      url = pick.id._url;
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("fanda").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      $("#popup #content").html(htmlurl);
                    } else if (pick.id._name === "image_text") {
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("fanda").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      $("#popup #content").html("<div style='color: #fff;font-size: 12px'><p style='color: #13c2c2;font-size: 13px'>文字描述：</p>" + (pick.id._text == "" ? "暂无文字描述" : pick.id._text) + "</div>" + htmlurl);
                    } else if (pick.id._name === "text") {
                      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                      let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                      if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                        pos = changedC;
                      }
                      document.getElementById("popup").style.display = "block";
                      document.getElementById("popup").style.left = pos.x - 110 + "px";
                      document.getElementById("popup").style.top = pos.y - 190 + "px";
                      document.getElementById("fanda").style.display = "none";
                      $("#popup #content").html("文字描述：" + (pick.id._text == "" ? "暂无文字描述" : pick.id._text));
                    } else {
                      document.getElementById("popup").style.display = "none";
                    }
                  }
                } else {
                  document.getElementById("popup").style.display = "none";
                }
              }
              else {
                document.getElementById("popup").style.display = "none";
              }
            }
            // if (pick !== undefined) {
            //   console.log(pick.id.properties);
            //   viewer.scene.postRender.removeEventListener(clickFun);
            //   viewer.scene.postRender.addEventListener(clickFun);
            // } else {
            //   viewer.scene.postRender.removeEventListener(clickFun);
            //   document.getElementById("popup").style.display = "none";
            //   return false;
            // }
            viewer.scene.postRender.removeEventListener(clickFun);
            viewer.scene.postRender.addEventListener(clickFun);
            var pop_closer = document.getElementById('fanda');
            pop_closer.addEventListener('click', ev => {
              this.setState({
                photoSee: true
              });
              $("#dd").html(htmlurl)
            })
            //设置鼠标移动事件的处理函数，这里负责监听鼠标x,y坐标值变化
          }.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);

          const iconType = (image, text) => {
            if (image === "" || image === null) {
              return './images/icon/text.png'
            } else if (image !== "" || image !== null) {
              if (text !== "" || text !== null) {
                return './images/icon/image_text.png'
              } else {
                return './images/icon/image.png'
              }
            }
          }

          const nameType = (i, t) => {
            if (i === "" || i === null) {
              return 'text'
            } else if (i !== "" || i !== null) {
              if (t !== "" || t !== null) {
                return 'image_text'
              } else {
                return 'image'
              }
            }
          }

          if (spotlists.length > 0) {
            spotlists.forEach((item, key) => {
              // var cartesians1 = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude)
              // var cartesians2 = Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude) + 0.0001, item.latitude)
              // var cartesians3 = Cesium.Cartesian3.fromDegrees(item.longitude, parseFloat(item.latitude) + 0.00008)
              // var cartesians4 = Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude) + 0.0001, parseFloat(item.latitude) + 0.00008)
              var entity = viewer.entities.add({
                // name: nameType(item.file, item.content),
                // text: item.content,
                url: item.file,
                // rectangle: {
                //   coordinates: Cesium.Rectangle.fromCartesianArray([cartesians1, cartesians2, cartesians3, cartesians4], viewer.scene.globe.ellipsoid),
                //   material: iconType(item.file, item.content),
                //   // iconType(item.file, item.content),
                //   // rotation: new Cesium.CallbackProperty(getRotationValue, false),
                //   // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                //   classificationType: Cesium.ClassificationType.TERRAIN
                // }
                text: item.content == null ? "" : item.content,
                name: nameType(item.file, item.content),
                position: Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude), parseFloat(item.latitude)),
                billboard: {
                  image: iconType(item.file, item.content),
                  width: 40,
                  height: 40
                },
                label: {
                  // text: item.content,
                  font: '14pt monospace',
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.TOP,
                  pixelOffset: new Cesium.Cartesian2(0, 32)
                }
              });
              selfentity.push(entity);
              viewer.zoomTo(entity)
            });
          } else {
            message.warn("暂时无图文数据")
          }

          // var cartesians1 = Cesium.Cartesian3.fromDegrees(111.20420000, 36.63880000)
          // var cartesians2 = Cesium.Cartesian3.fromDegrees(111.20430000, 36.63880000)
          // var cartesians3 = Cesium.Cartesian3.fromDegrees(111.20420000, 36.63890000)
          // var cartesians4 = Cesium.Cartesian3.fromDegrees(111.20430000, 36.63890000)
          //
          // var cartesians11 = Cesium.Cartesian3.fromDegrees(111.20460000, 36.63900000)
          // var cartesians22 = Cesium.Cartesian3.fromDegrees(111.20470000, 36.63900000)
          // var cartesians33 = Cesium.Cartesian3.fromDegrees(111.20460000, 36.63910000)
          // var cartesians44 = Cesium.Cartesian3.fromDegrees(111.20470000, 36.63910000)
          //
          // var cartesians111 = Cesium.Cartesian3.fromDegrees(111.20490000, 36.63930000)
          // var cartesians222 = Cesium.Cartesian3.fromDegrees(111.20500000, 36.63930000)
          // var cartesians333 = Cesium.Cartesian3.fromDegrees(111.20490000, 36.63940000)
          // var cartesians444 = Cesium.Cartesian3.fromDegrees(111.20500000, 36.63940000)
          //
          // var entity = viewer.entities.add({
          //   name: 'image',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians1, cartesians2, cartesians3, cartesians4], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          // var entity2 = viewer.entities.add({
          //   name: 'image_text',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians11, cartesians22, cartesians33, cartesians44], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image_text.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          // var entity3 = viewer.entities.add({
          //   name: 'text',
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromCartesianArray([cartesians111, cartesians222, cartesians333, cartesians444], viewer.scene.globe.ellipsoid),
          //     material: '../../../public/images/icon/image.png',
          //     // rotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          //     classificationType: Cesium.ClassificationType.TERRAIN
          //   }
          // });
          //
          //  selfentity.push(entity,entity2,entity3)
          // viewer.zoomTo(entity);
          var geo = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "MultiLineString",
                "coordinates": [[[111.20420000, 36.63880000,], [111.20440000, 36.63890000], [111.20460000, 36.63900000], [111.20490000, 36.63930000]]]
              },
              "properties": { "prop0": "value0", "prop1": 0.0 }
            }]
          }
          if (url !== null) {
            var promise = Cesium.GeoJsonDataSource.load(url, { sourceUri: "自主巡查图层" });
            promise.then(function (dataSource) {
              viewer.dataSources.add(dataSource);
              let entities = dataSource.entities.values;
              for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                entity.polygon.zIndex = layerZIndex;
              }

            });
            viewer.flyTo(promise, {
              offset: {
                heading: Cesium.Math.toRadians(0.0), //默认值
                pitch: Cesium.Math.toRadians(-90.0), // 默认值
                roll: 0.0 //默认值 }
              }
            });
          } else {
            // message.warn("无地图数据")
          }
        },

      //删除自主巡护相关
      removeSelfCheck:
        () => {
          for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
            if (global.viewer.dataSources._dataSources[i]._name == "自主巡查图层") {
              global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
              i--;
            }
          }
          if (selfentity.length > 0) {
            for (var i in selfentity) {
              viewer.entities.remove(selfentity[i]);
            }
            viewer.scene.postRender.addEventListener(function () {
              document.getElementById("popup").style.display = "none";
            })

          } else {
            return false
          }
        },

      //删除任务查询
      removeSelfCheck2:
        () => {

          if (selfentity2.length > 0) {
            for (var i in selfentity2) {
              viewer.entities.remove(selfentity2[i]);
            }
            viewer.scene.postRender.addEventListener(function () {
              document.getElementById("popup").style.display = "none";
            })

          } else {
            return false
          }
        },

      //删除数据对比相关
      removeDataconstract:
        () => {
          $("#rsdataconstractbox").remove();
          global.viewer.dataSources.removeAll()
        },

      //系统数据对比
      Rsdataconstract:
        (a, b) => {
          var div2 = document.createElement('DIV');
          div2.id = 'rsdataconstractbox';
          viewer.container.appendChild(div2);
          let dataconstract = ["系统数据对比base", "系统数据对比verifty"]
          // global.viewer.dataSources.removeAll();
          dataconstract.map((t, i) => {
            global.viewer.dataSources._dataSources.forEach((v) => {
              if (t === v._name) {
                global.viewer.dataSources.remove(v);
                //notification.close(item);
              }
            });
          })
          var promise = Cesium.GeoJsonDataSource.load(a, { sourceUri: "系统数据对比base" });
          promise.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            let colorHash = {};

            for (let i = 0; i < entities.length; i++) {
              // let entity = entities[i],
              //   name = entity.properties.CODE._value,
              //   color = colorHash[name];
              // if (!color) {
              //   color = Cesium.Color.fromRandom({
              //     alpha: 1
              //   });
              //   colorHash[name] = color;
              // }
              let entity = entities[i], color;
              // console.log(entity)
              if (entity.properties.intersect._value === true) {
                color = Cesium.Color.CHARTREUSE
              } else {
                color = Cesium.Color.BEIGE
              }
              entity.polygon.material = color;
              entity.polygon.outline = false; // polygon边线显示与否
              // entity.polygon.zIndex = layerZIndex;
            }
          });
          viewer.flyTo(promise, {
            offset: {
              heading: Cesium.Math.toRadians(0.0), //默认值
              pitch: Cesium.Math.toRadians(-90.0), // 默认值
              roll: 0.0 //默认值 }
            }
          });

          var promise2 = Cesium.GeoJsonDataSource.load(b, { sourceUri: "系统数据对比verifty" });
          promise2.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
              let entity = entities[i], color2;
              if (entity.properties.intersect._value === true) {
                color2 = Cesium.Color.CHARTREUSE
              } else {
                color2 = Cesium.Color.AQUA
              }
              entity.billboard = undefined;
              // entity.polygon.material = color2;
              // entity.polygon.outline = false;
              entity.point = new Cesium.PointGraphics({
                color: color2,
                pixelSize: 10
              });
            }
          });
          viewer.flyTo(promise2, {
            offset: {
              heading: Cesium.Math.toRadians(0.0), //默认值
              pitch: Cesium.Math.toRadians(-90.0), // 默认值
              roll: 0.0 //默认值 }
            }
          });
        },

      verificationlayers:
        (b) => {
          var div3 = document.createElement('DIV');
          div3.id = 'verificationlayersbox';
          viewer.container.appendChild(div3);
          $("#verificationlayersbox").html("<p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(48, 255, 6);border-radius: 3px;margin-right: 3px'></span><span>完成核查</span></p><p><span style='width: 10px; height: 10px; display: inline-block;margin-right: 3px;background-color: rgb(6, 237, 255);border-radius: 3px'></span><span>未完成核查</span></p>");
          global.viewer.dataSources._dataSources.forEach((v) => {
            if ((v._name) === "核查管理图层") {
              global.viewer.dataSources.remove(v);
              //notification.close(item);
            }
          });
          var promise = Cesium.GeoJsonDataSource.load(b, { sourceUri: "核查管理图层" });
          promise.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
              let entity = entities[i], color;
              if (entity.properties.status._value === 0) {
                color = Cesium.Color.AQUA //待核查
              } else {
                color = Cesium.Color.CHARTREUSE //完成核查
              }
              entity.polygon.material = color;
              entity.polygon.outline = false; // polygon边线显示与否
              entity.billboard = undefined;
              // entity.polygon.material = color2;
              // entity.polygon.outline = false;
              entity.point = new Cesium.PointGraphics({
                color: color,
                pixelSize: 10
              });
            }
          });
          viewer.flyTo(promise, {
            offset: {
              heading: Cesium.Math.toRadians(0.0), //默认值
              pitch: Cesium.Math.toRadians(-90.0), // 默认值
              roll: 0.0 //默认值 }
            }
          });

        },

      setAdvicemap: (u) => {
        let a, b = [];
        const { dispatch } = this.props;
        global.viewer.dataSources._dataSources.forEach((v) => {
          if ((v._name) === "处置意见图层") {
            global.viewer.dataSources.remove(v);
            //notification.close(item);
          }
        });
        // global.viewer.dataSources.removeAll();
        var promise = Cesium.GeoJsonDataSource.load(u, { sourceUri: "处置意见图层" });
        promise.then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          let entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i], color;
            if (entity.properties.hasProperty("CD")) {
              //道路
              shape = {
                "shapetype": "变化道路",
                key: entity.properties.CODE._value,
                "CODE": entity.properties.CODE._value,
                "YJLX": entity.properties.YJLX._value,
                "BHQK": entity.properties.BHQK._value,
                "QSX": entity.properties.QSX._value,
                "HSX": entity.properties.HSX._value,
                "BHDLX": entity.properties.BHDLX._value,
                "BHDMC": entity.properties.BHDMC._value,
                "XIANG": entity.properties.XIANG._value,
                "ZXJD": entity.properties.ZXJD._value,
                "ZXWD": entity.properties.ZXWD._value,
                "GNFQ": entity.properties.GNFQ._value,
                "CD": entity.properties.hasProperty("CD") ? entity.properties.CD._value : "",
              };
              b.push(shape);
            } else {
              shape = {
                "shapetype": "变化面",
                // "TTYPE": layerGeoJson,
                key: entity.properties.CODE._value,
                "CODE": entity.properties.CODE._value,
                "YJLX": entity.properties.YJLX._value,
                "BHQK": entity.properties.BHQK._value,
                "QSX": entity.properties.QSX._value,
                "HSX": entity.properties.HSX._value,
                "BHDLX": entity.properties.BHDLX._value,
                "BHDMC": entity.properties.BHDMC._value,
                "ZXJD": entity.properties.ZXJD._value,
                "ZXWD": entity.properties.ZXWD._value,
                "XIANG": entity.properties.XIANG._value,
                "GNFQ": entity.properties.GNFQ._value,
                "MJ": entity.properties.hasProperty("MJ") ? entity.properties.MJ._value : "",
              };
              b.push(shape);
            }
          }
          setTimeout(() => {
            dispatch({
              type: 'indexPage/updateState',
              payload: {
                tubanShape3: b
              }
            })
          }, 100);
        });
        // viewer.flyTo(promise, {
        //   offset: {
        //     heading: Cesium.Math.toRadians(0.0), //默认值
        //     pitch: Cesium.Math.toRadians(-90.0), // 默认值
        //     roll: 0.0 //默认值 }
        //   }
        // });
      },

      //对比影像删除基础图层影像数据
      removeImage: () => {
        if (imageProvide.length > 0) {
          for (let i = 0; i < imageProvide.length; i++) {
            viewer.imageryLayers.remove(imageProvide[i].key);
            imageProvide.splice(i, 1);
            i--
          }
        }
        imageProvide2 = [];
      }
    };

    // cesiumControl.initDrawHelper();

    // 参数回传父组件
    this
      .props
      .getCesiumControl(cesiumControl);
  }

  render() {
    return (
      <div id="cesiumContainer" className={styles.cesiumContent}>
        <div id="popup">
          <div id="fanda">
            {/*放大*/}
            <Icon type="fangda" theme="outlined" title={"放大图片"}/>
          </div>
          <div id="content">
          </div>
          <div id="arrow">
          </div>
        </div>
        <div id="popup2">
          <div id="content2">
          </div>
          <div id="arrow2">
          </div>
        </div>
        <Modal
          title="图片查看"
          visible={this.state.photoSee}
          footer={null}
          mask={true}
          maxable={false}
          minable={false}
          onCancel={() => {
            this.setState({
              photoSee: false
            })
          }}
          className={styles.photoSeeList}
        >
          <div id="dd" style={{ "width": "100%" }} className={styles.imgbox}></div>
        </Modal>
      </div>
    );
  }
}

export default Earth;
Earth.propTypes = {
  cesiumControl: PropTypes.object,
  getCesiumControl: PropTypes.func,
  dispatch: PropTypes.func,
};
