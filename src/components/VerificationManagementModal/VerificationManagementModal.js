/* global $ */
/* global Cesium */
import styles from './VerificationManagementModal.less';
import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Upload, Icon, Table } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class VerificationManagementModal extends Component {
  state = { visible: false, visible2: false, changeLayer: "", list: [], loading: false, detail: [], isclick: false };

  handleCancel = () => {
    const { dispatch,saveLayer,cesiumControl,layerhad, layerhad2 } = this.props;
    $("#verificationlayersbox").remove();
    // global.viewer.dataSources._dataSources.forEach((v) => {
    //   if ((v._name) === "核查管理图层") {
    //     global.viewer.dataSources.remove(v);
    //     //notification.close(item);
    //   }
    // });
    let savelayer=saveLayer;
    savelayer.splice(saveLayer.indexOf("核查管理"), 1);
    if(savelayer.length==0){
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
      if (global.viewer.dataSources._dataSources[i]._name =="核查管理图层"){
        global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
        i--;
      }
    }
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        validmanagentModalShow: false
      }
    });
    this.setState({
      isclick: false,
      visible2:false
    })
  }

  handleCancel2 = () => {
    this.setState({
      visible2: false
    })
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  Ok = () => {
    const { cesiumControl, dispatch } = this.props;
    if (this.state.changeLayer !== "") {
      this.setState({
        loading: true
      });
      // cesiumControl.verificationlayers(this.state.changeLayer)
      dispatch({
        type: "indexPage/allTuban",
        payload: {
          parameterObject: {
            layerId: this.state.changeLayer
          }
        },
        callback: (res) => {
          if (res) {
            if (res.code === 0) {
              this.setState({
                list: res.data,
                loading: false,
                isclick: true
              })
              let geo = {
                "type": "FeatureCollection", "features": [
                  // {
                  //   "type": "Feature", "geometry":
                  //   {
                  //     "type": "MultiPoint",
                  //     "coordinates": [[109.47886127411797, 51.408364140675076], [103.1903117443697, 40.39219493721872]],
                  //     "status": 0
                  //   }
                  // }
                ]
              }
              // console.log(res.data);
              res.data.map((v, i) => {
                //console.log(JSON.parse(v.geometry)[0]);
                let feature = JSON.parse(v.geometry)[0];
                feature['properties'].status = v.status;
                feature['properties'].list = v;
                feature['properties'].is = "核查管理";
                // console.log(feature)
                geo.features.push(feature);
              });
              //console.log(geo);
              cesiumControl.verificationlayers(geo);
              const handler3D = new Cesium.ScreenSpaceEventHandler(global.viewer.scene.canvas);
              const scene = global.viewer.scene;
              const ellipsoid = scene.globe.ellipsoid; //得到当前三维场景的椭球体
              handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
              handler3D.setInputAction(function (movement, state) {
                const pick = scene.pick(movement.position);
                //console.log(typeof pick);
                let cartesian = global.viewer.camera.pickEllipsoid(movement.position, ellipsoid);
                if (pick !== undefined) {
                  if (this.state.isclick) {
                    if (pick.id.properties !== undefined) {
                      if (pick.id.properties.hasProperty("is")) {
                        this.setState({
                          visible2: true,
                          detail: pick.id.properties.list._value
                        });
                      }
                    }
                  }
                  // pick.id.properties._list

                }
                //设置鼠标移动事件的处理函数，这里负责监听鼠标x,y坐标值变化
              }.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
          }
        }
      })
    } else {
      message.warn("请选择时相")
    }
  }

  onChangeLayer = (v) => {
    this.setState({
      changeLayer: v
    }, () => {

    })
  }

  detail2 = (data) => {
    return (
      <div className={styles.detailp}>
        <label><span style={{ color: "#00ffff" }}>保护地名称：</span>{data.protectedareaname}</label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>活动名称：</span><span
          style={{ width: "80px", display: "inline-block" }}>{data.activityname}</span></label>
        <label><span style={{ color: "#00ffff" }}>活动类型：</span><span
          style={{ width: "110px", display: "inline-block" }}>{data.activitytype}</span></label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>纬度：</span><span
          style={{ width: "110px", display: "inline-block" }}>{data.latitude}</span> <span style={{ color: "#00ffff" }}>经度：</span><span
          style={{ width: "110px", display: "inline-block" }}>{data.longitude}</span></label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>历史沿革(开工、建成、改扩建时间)：</span>{data.evolution}</label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>环评手续：</span><span
          style={{ width: "110px", display: "inline-block" }}>{data.process}</span></label> <label><span
        style={{ color: "#00ffff" }}>生态影响及破坏情况：</span><span
        style={{ width: "110px", display: "inline-block" }}>{data.impacts}</span></label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>备注：</span>{data.remark}</label>
        <br/>
        <label><span style={{ color: "#00ffff" }}>典型照片：</span></label>
      </div>
    )
  }


  render() {
    const columns = [
      {
        title: '序号',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '活动变化',
        dataIndex: 'activitytype',
        key: 'activitytype',
      }, {
        title: '位置',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: '经度',
        key: 'longitude',
        dataIndex: 'longitude',
        //   render: tags => (
        //     <span>
        //   {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
        // </span>
        //   ),
      }, {
        title: '纬度',
        key: 'latitude',
        dataIndex: 'latitude',
        //   render: (text, record) => (
        //     <span>
        //   <a href="javascript:;">Invite {record.name}</a>
        //   <Divider type="vertical" />
        //   <a href="javascript:;">Delete</a>
        // </span>
        //   ),
      },
      {
        title: '规模(hm²)',
        dataIndex: 'size',
        key: 'size',
      }, {
        title: '变化类型',
        dataIndex: 'changqk',
        key: 'changqk',
      }, {
        title: '有无变化',
        dataIndex: 'isChange',
        key: 'isChange',
      }, {
        title: '保护地名称',
        dataIndex: 'protectedareaname',
        key: 'protectedareaname',
      }, {
        title: '功能区别',
        dataIndex: 'functionalzone',
        key: 'functionalzone',
      },];
    const { layerListHumanActiviy } = this.props;
    let pp = "";
    if (layerListHumanActiviy.length > 0) {
      let tubanImage = layerListHumanActiviy.filter(function (v) {
        return v.type === 1
      });
      pp = tubanImage.map((v, i) => {
        if (v.layers.length > 0) {
          return (
            <Option value={v.id} key={v.layers[0].id} title={v.layers[0].filepath}>{v.layers[0].name}</Option>
          )
        }
      });
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="核查管理"
            visible={this.state.visible}
            footer={null}
            mask={true}
            maxable={true}
            minable={true}
            style={{ top: 200 }}
            onCancel={this.handleCancel}
            className={styles.list}
          >
            <div><label>活动变化：</label>
              <Select
                showSearch
                style={{ width: 250 }}
                onChange={this.onChangeLayer}
                placeholder="请选择"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {pp}
              </Select>
              <Button onClick={this.Ok}
                      className={styles.btn}>确定</Button>
            </div>
            <Table columns={columns} dataSource={this.state.list} loading={this.state.loading}
                   scroll={{ x: this.state.list.length > 0 ? 1000 : false }}
                   onRow={(record) => {
                     return {
                       onClick: () => {

                         // alert(du2)
                         // alert(du);
                         global.viewer.camera.flyTo({
                           destination: Cesium.Cartesian3.fromDegrees(record.longitude, record.latitude, 210),
                         });
                       },
                     };
                   }}
            />
          </Modal>
          <Modal
            visible={this.state.visible2}
            footer={null}
            mask={true}
            title={"详细信息"}
            maxable={false}
            minable={false}
            onCancel={this.handleCancel2}
            className={styles.list2}
          >
            <div>
              {this.detail2(this.state.detail)}
            </div>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

VerificationManagementModal.propTypes = {
  visible: PropTypes.bool
};

