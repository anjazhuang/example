/* global Cesium */
/* global DrawHelper */
import styles from './AddTaskModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, Table, Icon, Input, Tabs } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const columns_act_mian = [{
  title: '唯一编码',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '变化类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '变化情况',
  dataIndex: 'BHQK',
  align: 'center',
  render: val => <span>{type2(val)}</span>
}, {
  title: '前时相',
  dataIndex: 'QSX',
  align: 'center',
}, {
  title: '后时相',
  dataIndex: 'HSX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
  render: val => <span>{type(val)}</span>
}, {
  title: '保护地名称',
  dataIndex: 'BHDMC',
  align: 'center',
}, {
  title: '功能分区',
  dataIndex: 'GNFQ',
  align: 'center',
}, {
  title: '变化面积(公顷)',
  dataIndex: 'MJ',
  align: 'center',
}];

//人类活动变化道路
const columns_act_road = [{
  title: '唯一编码',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '变化类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '变化情况',
  dataIndex: 'BHQK',
  align: 'center',
  render: val => <span>{type2(val)}</span>
}, {
  title: '前时相',
  dataIndex: 'QSX',
  align: 'center',
}, {
  title: '后时相',
  dataIndex: 'HSX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
  render: val => <span>{type(val)}</span>
}, {
  title: '保护地名称',
  dataIndex: 'BHDMC',
  align: 'center',
}, {
  title: '功能分区',
  dataIndex: 'GNFQ',
  align: 'center',
}, {
  title: '变化长度(米)',
  dataIndex: 'CD',
  align: 'center',
}]

const type = (v) => {
  switch (v) {
    case '01':
      return '农业用地'
      break;
    case '02':
      return '居民点'
      break;
    case '03':
      return '工矿用地'
      break;
    case '04':
      return '采石场'
      break;
    case '05':
      return '能源设施'
      break;
    case '06':
      return '旅游设施'
      break;
    case '07':
      return '交通设施'
      break;
    case '08':
      return '养殖场'
      break;
    case '09':
      return '道路'
      break;
    case '10':
      return '其他人工设施'
      break;
  }
}

const type2 = (v) => {
  switch (v) {
    case '1':
      return '新增'
      break;
    case '2':
      return '扩大'
      break;
    case '3':
      return '减少'
      break;
  }
}
// rowSelection object indicates the need for row selection


export default class AddTaskModal extends Component {
  state = {
    visible: false,//创建任务弹窗
    visible2: false,//属性表弹窗
    tubanShape: [],//属性表选择的图斑数组
    timephaseid: 0,//时相id
    timephasename: "",//时相名称
    spots: [],//选择图斑序号
    spots2: [],//绘制图斑序号
    teamid: 0,//任务组
    name: "",//任务名称
    describe: "",//任务详情
    tabnum: "1",//创建任务面板切换
    marker: false,
    polyline: false,
    polygon: false,
    selectedRowKeys: [],//表格勾选
    protectareaid: "",//保护地id
    layer: []
  };

  addTaskModalClose = () => {
    const { dispatch, cesiumControl, layerhad, layerhad2 } = this.props;
    // console.log(layerhad, layerhad2)
    let layers = [];
    global.viewer.dataSources._dataSources.forEach((v) => {
      layers.push(v._name)
    });
    for(let i=0;i<global.viewer.dataSources._dataSources.length;i++){
      if (global.viewer.dataSources._dataSources[i]._name == "创建任务图层") {
        global.viewer.dataSources.remove(global.viewer.dataSources._dataSources[i]);
        i--;
      }
    }
    this.drawHelperEvent("cleanAll");
    let savelayer=this.props.saveLayer;
    savelayer.splice(this.props.saveLayer.indexOf("创建任务"), 1);
    if(savelayer.length==0){
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        addTaskModalShow: false,
        taskMap: false,
        layermanagerhidden: false,
        taskMapChose: false,
        tb_bh: [],
        drawPointer: false,
        taskMap:false,
        saveLayer:savelayer
      }
    });

    this.setState({
      tabnum: "1",
      name: "",
      describe: "",
      timephasename: "",
      teamid: 0
    });
  }

  addTaskModalClose2 = () => {
    this.setState({
      visible2: false
    });
  }


  componentDidMount() {
    const { visible, dispatch } = this.props;
    this.setState({
      visible: visible,
      id: 0
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.tubanShape2);
    let spot = [], spot2 = [];
    if (nextProps.tb_bh.length > 0) {
      nextProps.tb_bh.map((v, i) => {
        spot.push(
          {
            "spots": v.tb_bh
          }
        )
      });
      this.setState({
        spots: spot
      });
    }
    // if (nextProps.tubanDraw.length > 0) {
    //   nextProps.tubanDraw.map((v, i) => {
    //     spot2.push(
    //       {
    //         "spots": v
    //       }
    //     )
    //   });
    //   this.setState({
    //     spots2: spot2
    //   });
    // }
    this.setState({
      visible: nextProps.visible,
      tubanShape: nextProps.tubanShape2,
      // layer: nextProps.layerListHumanActiviy
    });
  }

  delete0 = (i) => {
    const { dispatch, tb_bh } = this.props;
    // let new_tb=[];
    tb_bh.splice(i, 1);
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        tb_bh: tb_bh
      }
    });
  }

  mapChose = () => {
    const { dispatch, taskMapChose } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        taskMapChose: !taskMapChose
      }
    });
  }

  handleChange = (value, e) => {
    // console.log(e);
    this.setState({
      timephaseid: e.key,
      timephasename: value
    })
    let yy = [];
    yy.push(value.toString());
    this.setState({
      id: value
    });
    this.props.dispatch({
      type: 'indexPage/updateState',
      payload: {
        taskMap: true,
        tb_bh: []
      }
    });
    const { cesiumControl } = this.props;
    cesiumControl.taskLayer(yy);
  }

  shapShow = () => {
    this.setState({
      visible2: true
    });
  }

  drawHelperEvent = (type) => {
    let drawHelper = new DrawHelper(global.viewer);
    const { cesiumControl, dispatch } = this.props;
    if (type === "marker") {
      this.setState({
        marker: true,
        polyline: false,
        polygon: false
      });
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawPointer: true
        }
      });
    } else if (type === "polyline") {
      this.setState({
        polyline: true,
        marker: false,
        polygon: false
      });
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawPointer: true
        }
      });
    } else if (type === "polygon") {
      this.setState({
        polygon: true,
        marker: false,
        polyline: false,
      });
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawPointer: true
        }
      });
    } else {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawPointer: false
        }
      });
    }

    cesiumControl.drawEvent(type);
    // drawHelper.registerDrawEvent(type, function () {
    //   console.log(type);
    //   // if (type == "marker") {
    //   //   this.props.dispatch({
    //   //     type: 'indexPage/updateState',
    //   //     payload: {
    //   //       marker: false
    //   //     }
    //   //   })
    //   // } else if (type == "polyline") {
    //   //   this.props.dispatch({
    //   //     type: 'indexPage/updateState',
    //   //     payload: {
    //   //       polyline: false
    //   //     }
    //   //   })
    //   // } else if (type == "polygon") {
    //   //   this.props.dispatch({
    //   //     type: 'indexPage/updateState',
    //   //     payload: {
    //   //       polygon: false
    //   //     }
    //   //   })
    //   // }
    // })
  }

  stopDraw = () => {
    const { cesiumControl } = this.props;
    cesiumControl.stopDraw();
    this.setState({
      polyline: false,
      marker: false,
      polygon: false
    })
  }

  exportDraw = () => {
    const { cesiumControl } = this.props;
    let tubandraw = [], tubandrqwlist = [];
    tubandraw = cesiumControl.exportDraw();
    // console.log(tubandraw);
    if (cesiumControl.exportDraw() !== undefined) {
      cesiumControl.exportDraw().map((v) => {
        if (v.coordinates.length > 0) {
          v.coordinates.forEach((v2) => {
            tubandrqwlist.push(v2.join(","))
          })
        }
      });
      // console.log(tubandrqwlist);
      this.props.dispatch({
        type: 'indexPage/updateState',
        payload: {
          tubanDraw: tubandrqwlist
        }
      });
    }
  }

  addTasksave = () => {
    //提交
    // console.log(this.state.tabnum);
    let layers = [];
    global.viewer.dataSources._dataSources.forEach((v) => {
      layers.push(v._name)
    });
    const { dispatch, cesiumControl } = this.props;
    if (this.state.tabnum == "1") {
      if (localStorage.getItem("rolegradeid") == 1) {
        //省级管理员
        if (this.state.timephaseid !== 0 && this.state.protectareaid !== "" && this.state.name !== "" && this.state.spots.length > 0 && this.state.describe !== "" && this.state.teamid !== 0) {
          dispatch({
            type: 'indexPage/taskUp',
            payload: {
              "name": this.state.name,
              "layerid": this.state.timephaseid,
              "content": this.state.describe,
              "teamid": this.state.teamid,
              "spotsdata": this.state.spots,
              "protectedareaid": "",
              "type": 1
            },
            callback: (res) => {
              if (res) {
                // console.log(res);
                if (res.code === 0) {
                  message.success("提交成功");
                  layers.map((v, i) => {
                    global.viewer.dataSources._dataSources.forEach((v) => {
                      if (v._name == "创建任务图层") {
                        global.viewer.dataSources.remove(v)
                      }
                    });
                  })
                  this.setState({
                    name: "",
                    timephaseid: 0,
                    describe: "",
                    teamid: 0,
                    spots: [],
                    timephasename: ""
                  })
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      addTaskModalShow: false,
                      tb_bh: [],
                      taskMapChose: false,
                      layermanagerhidden: false
                    }
                  })
                  // global.viewer.dataSources.removeAll();//全部删除
                } else {
                  message.error(res.msg);
                }
              }
            }
          });
        } else {
          if (this.state.protectareaid == "") {
            message.warn("请选择保护地！")
          } else if (this.state.name == "") {
            message.warn("请填写任务名称！")
          } else if (this.state.timephaseid == 0) {
            message.warn("请选择活动变化图层！")
          } else if (this.state.spots.length == 0) {
            message.warn("请选择图斑！")
          } else if (this.state.describe == "") {
            message.warn("请填写描述！")
          } else if (this.state.teamid == 0) {
            message.warn("请填选择任务组！")
          }

        }
      } else {
        //保护地管理员
        if (this.state.timephaseid !== 0 && this.state.name !== "" && this.state.spots.length > 0 && this.state.describe !== "" && this.state.teamid !== 0) {
          dispatch({
            type: 'indexPage/taskUp',
            payload: {
              "name": this.state.name,
              "layerid": this.state.timephaseid,
              "content": this.state.describe,
              "teamid": this.state.teamid,
              "spotsdata": this.state.spots,
              "protectedareaid": localStorage.getItem('protectedareaid'),
              "type": 1
            },
            callback: (res) => {
              if (res) {
                // console.log(res);
                if (res.code === 0) {
                  message.success("提交成功");
                  layers.map((v, i) => {
                    global.viewer.dataSources._dataSources.forEach((v) => {
                      if (v._name == "创建任务图层") {
                        global.viewer.dataSources.remove(v)
                      }
                    });
                  })
                  this.setState({
                    name: "",
                    timephaseid: 0,
                    describe: "",
                    teamid: 0,
                    spots: [],
                    timephasename: ""
                  })
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      addTaskModalShow: false,
                      tb_bh: [],
                      taskMapChose: false,
                      layermanagerhidden: false
                    }
                  })
                  // global.viewer.dataSources.removeAll();//全部删除
                } else {
                  message.error(res.msg);
                }
              }
            }
          });
        } else {
          if (this.state.name == "") {
            message.warn("请填写任务名称！")
          } else if (this.state.timephaseid == 0) {
            message.warn("请选择活动变化图层！")
          } else if (this.state.spots.length == 0) {
            message.warn("请选择图斑！")
          } else if (this.state.describe == "") {
            message.warn("请填写描述！")
          } else if (this.state.teamid == 0) {
            message.warn("请填选择任务组！")
          }

        }
      }

      // console.log(this.state.name+this.state.describe+this.state.teamid+this.state.timephaseid);
      // console.log(this.state.spots);
    } else if (this.state.tabnum == "2") {
      let tubandrqwlist = [], spot2 = [];
      if (cesiumControl.exportDraw() !== undefined) {
        //console.log(cesiumControl.exportDraw());
        let geo = [];
        cesiumControl.exportDraw().map((v, i) => {
          geo.push({
            "type": "Feature",
            "geometry": v
          })
        })
        if (this.state.name !== "" && this.state.describe !== "" && geo.length > 0 && this.state.teamid !== 0) {
          dispatch({
            type: 'indexPage/taskUp',
            payload: {
              "name": this.state.name,
              "layerid": 0,
              // "timephaseid": this.state.timephaseid,
              "content": this.state.describe,
              "teamid": this.state.teamid,
              // {
              //   "type": "Feature", "geometry":
              "spotsdata": [{
                "geometry": JSON.stringify(geo)
                // {
                //   "type": "Feature",
                //   "geometry": cesiumControl.exportDraw()
                // }
              }],
              "protectedareaid": localStorage.getItem("rolegradeid") == 1 ? this.state.protectareaid : localStorage.getItem('protectedareaid'),
              "type": 2
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  message.success("提交成功");
                  this.setState({
                    name: "",
                    describe: "",
                    teamid: 0
                  })
                  this.drawHelperEvent("cleanAll");
                  layers.map((v, i) => {
                    global.viewer.dataSources._dataSources.forEach((v) => {
                      if (v._name == "创建任务图层") {
                        global.viewer.dataSources.remove(v)
                      }
                    });
                  })
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      addTaskModalShow: false,
                      layermanagerhidden: false
                    }
                  })
                } else {
                  message.error(res.msg);
                }
              }
            }
          });
        } else {
          message.warn("请把发布条件填完整");
        }
      }
    }
  }

  handleChange2 = (v) => {
    this.setState({
      teamid: v
    })
  }

  changeName = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  changeDescribe = (e) => {
    this.setState({
      describe: e.target.value
    })
  }

  changetab = (v) => {
    let layers = [];
    global.viewer.dataSources._dataSources.forEach((v) => {
      layers.push(v._name)
    });
    layers.map((v, i) => {
      global.viewer.dataSources._dataSources.forEach((v) => {
        if (v._name == "创建任务图层") {
          global.viewer.dataSources.remove(v)
        }
      });
    })
    this.setState({
      tabnum: v,
      name: "",
      describe: "",
      timephasename: "",
      teamid: 0
    });
    this.props.dispatch({
      type: 'indexPage/updateState',
      payload: {
        tb_bh: []
      }
    });
  }

  changeprotect = (d) => {
    this.setState({
      protectareaid: d
    }, () => {
      if (this.props.layerListHumanActiviy.length > 0) {
        let tubanImage = this.props.layerListHumanActiviy.filter(function (v) {
          return v.type === 1 && v.protectedareaid == d
        });
        this.setState({
          layer: tubanImage
        })
      }
    })
  }

  layerChose = (data) => {
    return data.map((v, i) => {
      if (v.layers.length > 0) {
        return (
          <Option value={v.layers[0].filepath} key={v.layers[0].parentid}
                  title={v.layers[0].name}>{v.layers[0].name}</Option>
        )
      }
    });
  }

  render() {
    const { tb_bh, taskTeam, layerListHumanActiviy, taskMapChose, protectAreaid } = this.props;
    //console.log(taskTeam);
    let code = [];
    if (tb_bh.length > 0) {
      tb_bh.map((v, i) => {
        code.push(v.tb_bh)
      })
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(selectedRowKeys)
        let tt = [];
        if (selectedRows.length > 0) {
          selectedRows.map((v, i) => {
            // if(code.indexOf(v.CODE)==-1) {
            tt.push({ tb_bh: v.CODE, id: this.state.id });
            // }
            // console.log(tt);
            this.props.dispatch({
              type: 'indexPage/updateState',
              payload: {
                tb_bh: tt.cy('tb_bh')
              }
            });
          });
        } else {
          this.props.dispatch({
            type: 'indexPage/updateState',
            payload: {
              tb_bh: []
            }
          });
        }
        ;
        // this.setState({
        //   selectedRowKeys:selectedRowKeys,
        // })
      },
      getCheckboxProps: record => ({
        defaultChecked: (code.indexOf(record.CODE) > -1 ? true : false),
      }),
      selectedRowKeys: code,
    };
    const Tablehtml = (d) => {
      if (d.length > 0) {
        if (d[0].shapetype == "活动道路") {
          return (
            <Table rowSelection={rowSelection} columns={columns_act_road} dataSource={this.state.tubanShape}
                   scroll={{ x: 1312 }}/>
          )
        } else if (d[0].shapetype == "活动面积") {
          return (
            <Table rowSelection={rowSelection} columns={columns_act_mian} dataSource={this.state.tubanShape}
                   scroll={{ x: 1312 }}/>
          )
        }
      } else {
        return ""
      }
    }
    const pp = tb_bh.map((v, i) => {
      return (
        <p datatype={v.id}>{v.tb_bh}<Icon type="close" theme="outlined" style={{ cursor: "pointer" }}
                                          onClick={(e) => this.delete0(i)}/></p>
      )
    });
    let pp2 = "";

    let pp3 = "";
    let tubanImage = "";
    let pp4 = "";
    if (layerListHumanActiviy.length > 0) {
      tubanImage = layerListHumanActiviy.filter(function (v) {
        return v.type === 1 && v.protectedareaid == localStorage.getItem('protectedareaid')
      });
      pp3 = tubanImage.map((v, i) => {
        if (v.layers.length > 0) {
          return (
            <Option value={v.layers[0].filepath} key={v.layers[0].parentid}
                    title={v.layers[0].name}>{v.layers[0].name}</Option>
          )
        }
      });

    }

    if (localStorage.getItem('rolegradeid') == 1) {
      pp4 = protectAreaid.map((v, i) => {
        return (
          <Option value={v.id}>{v.name}</Option>
        )
      });
      pp2 = taskTeam.map((v, i) => {
        if (v.protectedareaid == null) {
          return (
            <Option value={v.id}>{v.name}</Option>
          )
        }
      });
    } else {
      pp4 = protectAreaid.map((v, i) => {
        if (v.id == localStorage.getItem('protectedareaid')) {
          return (
            <Option value={v.id}>{v.name}</Option>
          )
        }
      });
      pp2 = taskTeam.map((v, i) => {
        if (v.protectedareaid == localStorage.getItem('protectedareaid')) {
          return (
            <Option value={v.id}>{v.name}</Option>
          )
        }
      });
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="创建任务"
            visible={this.state.visible}
            onCancel={this.addTaskModalClose}
            footer={<Button className={styles.btn} onClick={this.addTasksave}>发布</Button>}
            style={{ left: document.body.clientWidth - 358 }}
            maxable={false}
            minable={false}
            width={358} className={styles.task}>
            <div>
              <Tabs defaultActiveKey="1" onChange={this.changetab}>
                <TabPane tab="选择图斑创建任务" key="1">
                  <div>
                    <div hidden={localStorage.getItem('rolegradeid') == 1 ? false : true}>
                      <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;保护地：</label>
                      <Select
                        showSearch
                        style={{ width: 210 }}
                        placeholder="请选择"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.changeprotect}
                      >
                        {/*<Option value="" hidden={true}>请选择</Option>*/}
                        {pp4}
                      </Select>
                    </div>
                    <br/>
                    <label className={styles.name}>任务名称：</label>
                    <Input style={{ width: 210 }} onChange={this.changeName} value={this.state.name}/>
                    <br/><br/>
                    <label className={styles.name}>活动变化：</label>
                    <Select
                      showSearch
                      style={{ width: 210 }}
                      onChange={this.handleChange}
                      value={this.state.timephasename}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <Option value="">请选择</Option>
                      {localStorage.getItem('rolegradeid') == 1 ? this.layerChose(this.state.layer) : pp3}
                    </Select>
                    <br/><br/>
                    <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图斑：</label>
                    <Button ghost onClick={this.mapChose}
                            className={!taskMapChose ? "" : styles.map}>地图选择</Button>&nbsp;
                    <Button ghost
                            onClick={this.shapShow}
                            className={!this.state.visible2 ? "" : styles.shape}>属性表选择</Button>
                    <br/><br/>
                    <div className={styles.choselist}>
                      {pp}
                    </div>
                    <div className={styles.num}>
                      图斑数量：{this.props.tb_bh.length}
                    </div>
                    <br/>
                    <label className={styles.name}>任务详情：</label>
                    <TextArea rows={4} className={styles.textarea} onChange={this.changeDescribe}
                              value={this.state.describe}/>
                    <br/><br/>
                    <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;任务组：</label>
                    <Select value={this.state.teamid} style={{ width: 120 }} onChange={this.handleChange2}>
                      <Option value={0}>请选择</Option>
                      {pp2}
                    </Select>
                  </div>
                </TabPane>
                <TabPane tab="绘制图斑创建任务" key="2">
                  <div>
                    <div hidden={localStorage.getItem('rolegradeid') == 1 ? false : true} style={{"marginBottom":"15px"}}>
                      <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;保护地：</label>
                      <Select
                        showSearch
                        style={{ width: 210 }}
                        placeholder="请选择"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.changeprotect}
                      >
                        {/*<Option value="" hidden={true}>请选择</Option>*/}
                        {pp4}
                      </Select>
                    </div>
                    <label className={styles.name}>矢量绘制：</label>
                    <Button ghost onClick={() => {
                      this.drawHelperEvent("marker")
                    }} className={this.state.marker ? styles.marker : ""}>点</Button>&nbsp;&nbsp;<Button
                    ghost onClick={this.drawHelperEvent.bind(this, "polyline")}
                    className={this.state.polyline ? styles.polyline : ""}>线</Button>&nbsp;&nbsp;<Button ghost
                                                                                                         onClick={this.drawHelperEvent.bind(this, "polygon")}
                                                                                                         className={this.state.polygon ? styles.polygon : ""}>面</Button>&nbsp;&nbsp;

                    <span style={{ color: "#fff" }} title={"删除绘制图斑"}><Icon type="delete" theme=" outlined"
                                                                           onClick={this.drawHelperEvent.bind(this, "cleanAll")}/></span>
                    <span style={{ color: "#fff", paddingLeft: 10 }} title={"撤销绘制动作"}><Icon type="rollback"
                                                                                            theme=" outlined"
                                                                                            onClick={this.stopDraw}/></span>
                    {/*<Button ghost onClick={this.exportDraw }>查看</Button>*/}
                    <br/><br/>
                    <label className={styles.name}>任务名称：</label>
                    <Input style={{ width: 200 }} onChange={this.changeName} value={this.state.name}/>
                    <br/><br/>
                    <label className={styles.name}>任务详情：</label>
                    <TextArea rows={4} className={styles.textarea} onChange={this.changeDescribe}
                              value={this.state.describe}/>
                    <br/> <br/>
                    <label className={styles.name}>&nbsp;&nbsp;&nbsp;&nbsp;任务组：</label>
                    <Select value={this.state.teamid} style={{ width: 120 }} onChange={this.handleChange2}>
                      <Option value={0}>请选择</Option>
                      {pp2}
                    </Select>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Modal>
          <Modal
            title="属性表选择"
            visible={this.state.visible2}
            onCancel={this.addTaskModalClose2}
            footer={null}
            maxable={false}
            minable={false}
            className={styles.taskProperty}>
            <div>
              {/*<Table rowSelection={rowSelection} columns={columns_act_mian} dataSource={this.state.tubanShape}*/}
              {/*scroll={{ x: 1600 }}/>*/}
              {/*{this.state.tubanShape.length>0?{this.state.tubanShape.length>0?"":""}:""}*/}
              {Tablehtml(this.state.tubanShape)}
            </div>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

AddTaskModal.propTypes = {
  visible: PropTypes.bool,
  cesiumControl: PropTypes.object,
};

