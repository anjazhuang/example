/* global $ */
import styles from './TaskQueryModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, DatePicker, Select, Upload, Icon, message, Input, Tabs } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

export default class TaskQueryModal extends Component {
  state = {
    visible: false,
    visible2: false,
    queryTask: [],
    time: new Date().Format("yyyy-MM-dd"),
    name: "",
    teamid: "",
    search: 0,
    detail2: []
  };

  queryTask = () => {
    const { dispatch } = this.props;
    this.setState({
      search: 1
    });
    dispatch({
      type: 'indexPage/queryTask',
      payload: {
        pageSize: 5,
        pageIndex: 1,
        parameterObject: {
          Name: this.state.name !== "" ? this.state.name + "|%" : "",
          CreateTime: this.state.time + " 00:00:00||" + this.state.time + " 23:59:59",
          CreatorId: "",
          TeamId: this.state.teamid !== "" ? this.state.teamid : ""
        }
      },
      callback: (res) => {
        if (res) {
          if (res.code === 0) {
            dispatch({
              type: 'indexPage/updateState',
              payload: {
                queryTask: res.data
              }
            });
          }
        }
      }
    });
  }

  State = (v) => {
    switch (v) {
      case 0:
        return "待执行中";
        break
      case 1:
        return "执行中";
        break
      case 2:
        return "已完成";
        break
    }
  }

  uu = (data, data2) => {
    return data.map((item, i) => {
      return (
        <p>
          <span>图斑号：</span><span>{item.spots}</span><br/>
          <span style={{ color: "#22ee22", cursor: "pointer", fontSize: 12, paddingLeft: "82%" }}
                onClick={(e) => this.TaskQueryModal2(1, item, data2)}>详情 ></span>
        </p>
      )
    });
  }

  detail2 = (data) => {
    return (
      <div className={styles.detailp}>
        <label><span style={{ color: "#00ffff" }}>保护地名称：</span></label>{data.protectedareaname}
        <br/>
        <label><span style={{ color: "#00ffff" }}>活动名称：</span></label><span
        style={{ width: "145px", display: "inline-block" }}>{data.activityname} </span><label><span
        style={{ color: "#00ffff" }}>活动类型：</span></label>{data.activitytype}
        <br/>
        <label><span style={{ color: "#00ffff" }}>经度：</span></label><span
        style={{ width: "130px", display: "inline-block" }}>{data.longitude} </span><label><span
        style={{ color: "#00ffff" }}>纬度：</span></label><span
        style={{ width: "130px", display: "inline-block" }}>{data.latitude}</span>
        <br/>
        <label><span style={{ color: "#00ffff" }}>规模：</span></label><span
        style={{ width: "80px", display: "inline-block" }}>{data.scale} </span><label><span
        style={{ color: "#00ffff" }}>功能区：</span></label>{data.functionalZone}
        <br/>
        <label><span style={{ color: "#00ffff" }}>历史沿革：</span></label>{data.evolution}
        <br/>
        <label><span style={{ color: "#00ffff" }}>环评手续：</span></label><span
        style={{ width: "145px", display: "inline-block" }}>{data.process}</span> <label><span
        style={{ color: "#00ffff" }}>生态影响及破坏情况：</span></label><span style={{ width: "145px" }}>{data.impacts}</span>
        <br/>
        <label><span style={{ color: "#00ffff" }}>备注：</span></label>{data.remark}
        <br/>
        <label><span style={{ color: "#00ffff" }}>典型照片：</span></label>
      </div>
    )
  }

  renderDetail = (data) => {
    // console.log(data)
    if (data.length > 0) {
      return data.map((item) => {
        if (item.spotsdata.length > 0) {
          return (
            <div className={styles.tasklist}>
              <p><strong>No.{item.id}&nbsp;&nbsp;
                任务名：{item.name}&nbsp;&nbsp;&nbsp;&nbsp;{this.State(item.status)}</strong></p>
              <p style={{ color: "#ccc" }}>{moment(item.createtime).format("YYYY-MM-DD HH:mm:ss")}</p>
              <p><span>发布者：{item.creatorname}</span></p><p><span>任务组：{item.teamname}</span></p>
              <div className={styles.tuban}>{this.uu(item.spotsdata, item.trackList)}</div>
            </div>
          );
        } else {
          return (
            <div className={styles.tasklist}>
              <p><strong>No.{item.id}&nbsp;&nbsp;任务名：{item.name}</strong></p>
              <p>{moment(item.createtime).format("YYYY-MM-DD HH:mm:ss")}</p>
              <p><span>发布者：{item.creatorname}</span><span>任务组：{item.teamname}</span></p>
            </div>
          )
        }
      });
    } else {
      // if(this.state.search===1){
      //   return <div className={styles.tasklist}>无数据返回</div>
      // } else {
      //   return ""
      // }
      return (<div className={styles.tasklist}>无数据返回</div>)
    }
  }

  timeChose = (v, s) => {
    this.setState({
      time: s
    })
  }

  TaskQueryModalClose = () => {
    const { dispatch,cesiumControl,saveLayer,layerhad, layerhad2} = this.props;
    let savelayer=saveLayer;
    savelayer.splice(saveLayer.indexOf("任务查询"), 1);
    if(savelayer.length==0){
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    // global.viewer.dataSources._dataSources.forEach((v) => {
    //   if ((v._name) === "任务查询图层") {
    //     global.viewer.dataSources.remove(v);
    //     //notification.close(item);
    //   }
    // });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        taskQueryModalShow: false
      }
    });
    this.setState({
      visible2: false
    });
    for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
      if (global.viewer.dataSources._dataSources[i]._name == "任务查询图层") {
        global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
        i--;
      }
    }
    cesiumControl.removeSelfCheck2();
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      queryTask: nextProps.queryTask
    });
  }

  TaskQueryModal2 = (v, d, d2) => {
    const { cesiumControl } = this.props;
    if (v === 0) {
      this.setState({
        visible2: false
      });
      for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
        if (global.viewer.dataSources._dataSources[i]._name == "任务查询图层") {
          global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
          i--;
        }
      }
      cesiumControl.removeSelfCheck2();
    } else {
      this.setState({
        detail2: d
      }, () => {
        this.setState({
          visible2: true
        });
        for (let i = 0; i < global.viewer.dataSources._dataSources.length; i++) {
          if (global.viewer.dataSources._dataSources[i]._name == "任务查询图层") {
            global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
            i--;
          }
        }
        cesiumControl.removeSelfCheck2();
        //轨迹
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
        };
        //图斑
        let geo2 = {
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
        let ii = {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "properties": { "style": null },
            "geometry": {
              "type": "MultiLineString",
              "coordinates": [[[116.71882420442678, 23.384753129875484], [116.71857732136563, 23.385324156739546], [116.71857119320504, 23.385362881515338], [116.71857119320504, 23.385362881515338], [116.7185597273185, 23.38540504711561], [116.7185597273185, 23.38540504711561], [116.71852934185411, 23.385485991138886], [116.71852934185411, 23.385485991138886], [116.71850739552751, 23.385569248290505], [116.71849415559463, 23.385653189778598], [116.71847784361181, 23.385710755367334], [116.71847784361181, 23.385710755367334], [116.71844829483209, 23.385771311792713], [116.71844829483209, 23.385771311792713], [116.71842717081248, 23.38582769707078], [116.71842717081248, 23.38582769707078], [116.71842405082688, 23.38588576235499], [116.71842405082688, 23.38588576235499], [116.71835171420369, 23.38610417815764], [116.71835171420369, 23.38610417815764], [116.71822031808854, 23.386160443671862], [116.71822031808854, 23.386160443671862], [116.71820367724028, 23.386057991639984], [116.71820367724028, 23.386057991639984], [116.71820414276478, 23.385985267632815], [116.71820414276478, 23.385985267632815], [116.71819960890016, 23.385986513419866], [116.71819960890016, 23.385986513419866], [116.71820401780325, 23.385941371288936], [116.71820401780325, 23.385941371288936], [116.71826213316724, 23.385822856592828], [116.71826213316724, 23.385822856592828], [116.71833126660222, 23.38574887610956], [116.71833126660222, 23.38574887610956], [116.71838428694637, 23.385274420938497], [116.71838428694637, 23.385274420938497], [116.71840041139701, 23.38519926472862], [116.71840041139701, 23.38519926472862], [116.71843534152454, 23.385116988033847], [116.71843534152454, 23.385116988033847], [116.71846226100095, 23.385033418397178], [116.71846226100095, 23.385033418397178], [116.71852397713839, 23.384921434757686], [116.71852397713839, 23.384921434757686], [116.71856262047608, 23.3848740874003], [116.71856262047608, 23.3848740874003], [116.71860029558282, 23.384849556874485], [116.71860029558282, 23.384849556874485], [116.7186637460742, 23.38477420045332], [116.7186637460742, 23.38477420045332], [116.71882286171206, 23.384716172037987], [116.71882286171206, 23.384716172037987], [116.718854532963, 23.384673910515108], [116.718854532963, 23.384673910515108], [116.71887469509193, 23.38467973425051], [116.71887469509193, 23.38467973425051]]]
            }
          }]
        }
        // console.log(res.data);
        let yy = [];
        d2.map((v, i) => {
          if (v.geometry !== null) {
            let feature = JSON.parse(v.geometry)[0].features[0];
            // console.log(feature)
            geo.features.push(feature);
          }
        });
        geo2.features.push(JSON.parse(d.geometry)[0]);
        d2.map((v, i) => {
          if (v.spotsList.length > 0) {
            v.spotsList.map((v2, i2) => {
              yy.push(v2)
            });
          }
        });
        if (geo.features.length == 0 && yy.length == 0) {
          message.warn("暂时无轨迹路径和图文数据")
        }
        if (geo.features.length == 0 && yy.length > 0) {
          message.warn("暂时无轨迹路径")
        }
        if (geo.features.length > 0 && yy.length == 0) {
          message.warn("暂时无轨迹路径")
        }
        // geo.features.push(JSON.parse(d.geometry)[0]);
        cesiumControl.querytaskdetail(geo, yy, geo2);
      });
    }
  }

  changetaskName = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  changeTeam = (v) => {
    this.setState({
      teamid: v
    });
  }

  render() {
    const { taskTeam, queryTask } = this.props;
    const pp = taskTeam.map((v, i) => {
      return (
        <Option value={v.id}>{v.name}</Option>
      )
    });
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="任务查询"
            visible={this.state.visible}
            onCancel={this.TaskQueryModalClose}
            style={{ left: document.body.clientWidth - 320 }}
            footer={null}
            maxable={false}
            minable={false}
            width={323} className={styles.list}>
            <div>
              <label className={styles.name}>任务名称：</label>
              <Input style={{ width: 200 }} placeholder="全部" onChange={this.changetaskName}/>
              <br/><br/>
              <label className={styles.name}>创建时间：</label>
              <DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} onChange={this.timeChose}/>
              <br/><br/>
              <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;任务组：</label>
              <Select defaultValue="全部" style={{ width: 120 }} onChange={this.changeTeam}>
                <Option value="">全部</Option>
                {pp}
              </Select>
              <br/>
              <div className={styles.search_btn}><Button onClick={this.TaskQueryModalClose}>取消</Button> <Button
                onClick={this.queryTask}>搜索</Button></div>
              <div className={styles.detailist}>
                {this.renderDetail(this.state.queryTask)}
              </div>
            </div>
          </Modal>
          <Modal
            title="核查信息"
            visible={this.state.visible2}
            onCancel={(e) => this.TaskQueryModal2(0, e)}
            style={{ top: 125 }}
            footer={null}
            maxable={false}
            minable={false}
            width={500} className={styles.list}>
            <div>
              {this.detail2(this.state.detail2)}
            </div>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

TaskQueryModal.propTypes = {
  visible: PropTypes.bool
};

