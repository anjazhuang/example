/* global Cesium */
/* global $ */
import styles from './ServiceCheckModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, Icon, Input, Row, Col, message } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class ServiceCheckModal extends Component {
  state = { visible: false, list: [], lon: 0, lat: 0, name: "" };

  serviceCheckModalClose = () => {
    const { dispatch } = this.props;
    //console.log(global.viewer.dataSources._dataSources)
    for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
      if (global.viewer.dataSources._dataSources[i]._name == "设备监控人员活动点") {
        global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
        i--;
      }
    }
    global.viewer.scene.postRender.addEventListener(function () {
      document.getElementById("popup2").style.display = "none";
    })
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        serviceCheckModalShow: false
      }
    });
    clearInterval(this.props.fun);
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });

  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    this.setState({
      visible: nextProps.visible
    });
  }

  showMappoint = (lon, lat, online, name) => {
    if (online == 1) {
      if (lon !== null && lat !== null) {
        this.setState({
          lon: lon,
          lat: lat,
          name: name
        });
        var geo = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [lon - 0, lat - 0]
          },
          "properties": { "servicecheck": 1 }
        }
        for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
          if (global.viewer.dataSources._dataSources[i]._name == "设备监控人员活动点") {
            global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
            i--;
          }
        }
        global.viewer.scene.postRender.addEventListener(function () {
          document.getElementById("popup2").style.display = "none";
        })
        var promise = Cesium.GeoJsonDataSource.load(geo, { sourceUri: "设备监控人员活动点" });
        promise.then(function (dataSource) {
          global.viewer.dataSources.add(dataSource);
          let entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            entity.billboard = undefined;
            entity.point = new Cesium.PointGraphics({
              color: Cesium.Color.CHARTREUSE,
              pixelSize: 10
            });
          }
        });
        global.viewer.flyTo(promise, {
          offset: {
            heading: Cesium.Math.toRadians(0.0), //默认值
            pitch: Cesium.Math.toRadians(-90.0), // 默认值
            roll: 0.0 //默认值 }
          }
        });
        const handler3D = new Cesium.ScreenSpaceEventHandler(global.viewer.scene.canvas);
        const ellipsoid = global.viewer.scene.globe.ellipsoid;
        const getPos = (position) => {
          let location = new Cesium.Cartesian2(position.x, position.y);
          return location;
        };
        handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler3D.setInputAction(function (movement, state) {
          const pick = global.viewer.scene.pick(movement.position);
          //console.log(typeof pick);
          let cartesian = global.viewer.camera.pickEllipsoid(movement.position, ellipsoid);
          if (pick !== undefined) {
            global.viewer.scene.postRender.addEventListener(function () {
              if (pick.id !== undefined) {
                if (pick.id.properties !== undefined) {
                  if (pick.id.properties.hasProperty("servicecheck")) {
                    let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(global.viewer.scene, cartesian);//世界坐标转屏幕坐标（移动变化）
                    let pos = getPos(movement.position); //获得相关的鼠标屏幕坐标（移动不会影响变化）
                    if ((pos.x !== changedC.x) || (pos.y !== changedC.y)) {
                      pos = changedC;
                    }
                    document.getElementById("popup2").style.display = "block";
                    document.getElementById("popup2").style.left = pos.x - 35 + "px";
                    document.getElementById("popup2").style.top = pos.y - 13 + "px";
                    $("#popup2 #content2").html(name);
                  }
                }
              } else {
                document.getElementById("popup2").style.display = "none";
              }
            })
          } else {
            global.viewer.scene.postRender.addEventListener(function () {
              document.getElementById("popup2").style.display = "none";
            })
          }
          //设置鼠标移动事件的处理函数，这里负责监听鼠标x,y坐标值变化
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      } else {
        message.warn("没有返回相关的经纬度，无法跳转！")
      }
    } else {
      message.warn("离线设备无法定位")
    }
  }

  renderHtml = (d) => {
    return (
      d.map((v, i) => {
        return (
          <Row onClick={() => {
            this.showMappoint(v.lastlongitude, v.lastlatitude, v.online, v.name)
          }}>
            <Col span={4}><Icon type="tablet" theme="outlined"/></Col>
            <Col span={16}>
              <p><span className={styles.name}>执行者：</span>{v.name}</p>
              <p><span className={styles.name}>任务组：</span>{v.teamname}</p>
            </Col>
            <Col span={4}>
              <span className={styles.name + " " + styles.name1}>{v.online === 1 ? "在线" : "离线"}</span>
            </Col>
          </Row>
        )
      })
    )
  }

  render() {
    this.props.watchService.map((v, i) => {
      if (this.state.name !== "") {
        if (v.name == this.state.name) {
          if (v.online !== 1) {
            for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
              if (global.viewer.dataSources._dataSources[i]._name == "设备监控人员活动点") {
                global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
                i--;
              }
            }
            this.setState({
              name: ""
            })
          } else {
            if (v.lastlongitude !== this.state.lon || v.lastlatitude !== this.state.lat) {
              var geo = {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [v.lastlongitude - 0, v.lastlatitude - 0]
                },
                "properties": { "servicecheck": 1 }
              }
              for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
                if (global.viewer.dataSources._dataSources[i]._name == "设备监控人员活动点") {
                  global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
                  i--;
                }
              }
              global.viewer.scene.postRender.addEventListener(function () {
                document.getElementById("popup2").style.display = "none";
              })
              var promise = Cesium.GeoJsonDataSource.load(geo, { sourceUri: "设备监控人员活动点" });
              promise.then(function (dataSource) {
                global.viewer.dataSources.add(dataSource);
                let entities = dataSource.entities.values;
                for (let i = 0; i < entities.length; i++) {
                  let entity = entities[i];
                  entity.billboard = undefined;
                  entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.CHARTREUSE,
                    pixelSize: 10
                  });
                }
              });
            }
          }
        }
      }
    });
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="设备监控"
          visible={this.state.visible}
          onCancel={this.serviceCheckModalClose}
          footer={null}
          maxable={false}
          minable={false}
          className={styles.list}
        >
          <div>
            {/*<Row>*/}
            {/*<Col span={4}><Icon type="tablet" theme="outlined" /></Col>*/}
            {/*<Col span={16}>*/}
            {/*<p className={styles.name}>ID:415563526956</p>*/}
            {/*<p><span className={styles.name}>执行者：</span>张三</p>*/}
            {/*<p><span className={styles.name}>用户组：</span>巡护1组</p>*/}
            {/*</Col>*/}
            {/*<Col span={4}>*/}
            {/*<span className={styles.name+" "+styles.name1}>在线</span>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*<Row>*/}
            {/*<Col span={4}><Icon type="tablet" theme="outlined" /></Col>*/}
            {/*<Col span={16}>*/}
            {/*<p className={styles.name}>ID:422323212</p>*/}
            {/*<p><span className={styles.name}>执行者：</span>李四</p>*/}
            {/*<p><span className={styles.name}>用户组：</span>巡护2组</p>*/}
            {/*</Col>*/}
            {/*<Col span={4}>*/}
            {/*<span className={styles.name+" "+styles.name1}>离线</span>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {this.renderHtml(this.props.watchService)}
          </div>
        </Modal>
      </LocaleProvider>
    );
  };
}

ServiceCheckModal.propTypes = {
  visible: PropTypes.bool
};

