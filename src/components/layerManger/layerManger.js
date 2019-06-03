/* global Cesium */
/* global $ */
import React, { Component } from 'react';
import styles from './layerManger.less';
import PropTypes from 'prop-types';
import { Input, Icon, Spin, Radio, Tree, message, Modal, Table, Select, Button } from 'antd';
import moment from 'moment';

const TreeNode = Tree.TreeNode;
const Option = Select.Option;

const columns = [{
  title: '保护地名称',
  dataIndex: 'name',
  align: 'center',
}, {
  title: '核心区面积',
  dataIndex: 'corearea',
  align: 'center',
}, {
  title: '创建时间',
  dataIndex: 'createtime',
  align: 'center',
}, {
  title: '创建人',
  dataIndex: 'createortime',
  align: 'center',
}, {
  title: '缓冲面积',
  dataIndex: 'cushionarea',
  align: 'center',
}, {
  title: '描述',
  dataIndex: 'description',
  align: 'center',
}, {
  title: '主管部门',
  dataIndex: 'department',
  align: 'center',
}, {
  title: '实验区面积',
  dataIndex: 'experimentalarea',
  align: 'center',
}, {
  title: '纬度',
  dataIndex: 'latitude',
  align: 'center',
}, {
  title: '经度',
  dataIndex: 'longitude',
  align: 'center',
}, {
  title: '现有面积',
  dataIndex: 'realarea',
  align: 'center',
}, {
  title: '备注',
  dataIndex: 'remark',
  align: 'center',
}, {
  title: '保护地简称',
  dataIndex: 'shortname',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
}, {
  title: '保护对象',
  dataIndex: 'target',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'type',
  align: 'center',
}];

//小班
const columns_sm = [{
  title: '创建人名称',
  dataIndex: 'creatorname',
  align: 'center',
}, {
  title: '创建时间',
  dataIndex: 'creatortime',
  align: 'center',
}, {
  title: '小班名称',
  dataIndex: 'name',
  align: 'center',
}, {
  title: '保护地编号',
  dataIndex: 'protectedareaid',
  align: 'center',
}, {
  title: '保护地名称',
  dataIndex: 'protectedareaname',
  align: 'center',
}, {
  title: '备注',
  dataIndex: 'remark',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
}, {
  title: '版本号',
  dataIndex: 'version',
  align: 'center',
}];

class LayerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftFixedshow: false,
      leftFixedhidden: true,
      expandedKeys: ["menu-base-data_show_base_info", "menu-base-data_show_fieldAudit", "menu-base-data_independent_inspection", "menu-base-data_show-draw-layer", "menu-base-data_show_humanAct_change", "menu-base-data_show_small_data", "menu-base-data_show_protect_info", "menu-base-data_show_human_action", "menu-base-data_show_protect_image",],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      disabled: false,
      visible: false,
      tableList: [],
      protectShape: [],
      simShape: [],
      type: "",
      protect: "",//搜索保护地,
      y1: "",//开始年份
      y2: "",//结束年份,
      searchboxvis: true
    }
  }

  componentDidMount() {

  }


  arrowShrink = () => {
    this.setState({
      leftFixedshow: true,
      leftFixedhidden: false
    })
  }

  arrowShrink2 = () => {
    this.setState({
      leftFixedshow: false,
      leftFixedhidden: true
    })
  }

  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      // autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys, e) => {
    // console.log(e);
    // console.log(layerManagerSelectedKeys);
    const { cesiumControl, dispatch, layerManagerSelectedKeys } = this.props;
    if (!e.checked) {
      dispatch({
        type: "indexPage/updateState",
        payload: {
          layerManagerSelectedKeys: "",
          shapeChoseid: ""
        }
      });
    }
    dispatch({
      type: "indexPage/updateState",
      payload: {
        layerManagerCheckedKeys: checkedKeys,
        layerMap: true,
      }
    });
    cesiumControl.showLayer(checkedKeys, e);
  }

  changep = (v) => {
    this.setState({
      protect: v
    })
  }

  changey1 = (v) => {
    this.setState({
      y1: v.target.value == "" ? "" : v.target.value
    })
  }

  changey2 = (v) => {
    this.setState({
      y2: v.target.value == "" ? "" : v.target.value
    })
  }

  //根据搜索条件筛选图层
  search = () => {
    const { dispatch } = this.props;
    let year = /^\d{4}$/;
    if (year.test(this.state.y1)&&year.test(this.state.y2)) {
      if (localStorage.getItem('rolegradeid') == 1) {
        Object.keys(this.props.menuSelect).map((v, i) => {
          if (this.props.menuSelect[v] == true) {
            switch (v) {
              case "menu-base-data_show_humanAct_change":
                this.props.dispatch({
                  type: "indexPage/getHumanActLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        this.props.dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHumanActiviy: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_protect_image': //显示保护地影像
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getImageLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createdate",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      // console.log(res);// 请求完成后返回的结果
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListImage: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_small_data'://显示小班数据
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getStigmataLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      // console.log(res);// 请求完成后返回的结果
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListStigmata: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_human_action':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getHumanActLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHumanActiviy: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_fieldAudit':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getVerificationTasks",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListSDHC: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_independent_inspection':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/selfTasks",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListZZHC: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show-draw-layer': //绘制图斑
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/drawLayer",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                      protectedareaid: this.state.protect
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHZTB: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
            }
          }
        })
      } else {
        Object.keys(this.props.menuSelect).map((v, i) => {
          if (this.props.menuSelect[v] == true) {
            switch (v) {
              case "menu-base-data_show_humanAct_change":
                this.props.dispatch({
                  type: "indexPage/getHumanActLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        this.props.dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHumanActiviy: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_protect_image': //显示保护地影像
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getImageLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createdate",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      // console.log(res);// 请求完成后返回的结果
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListImage: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_small_data'://显示小班数据
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getStigmataLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      // console.log(res);// 请求完成后返回的结果
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListStigmata: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_human_action':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getHumanActLayer",
                  payload: {
                    parameterObject: {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHumanActiviy: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show_fieldAudit':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/getVerificationTasks",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListSDHC: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_independent_inspection':
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/selfTasks",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListZZHC: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
              case 'menu-base-data_show-draw-layer': //绘制图斑
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    loadingGlobal: true
                  }
                });
                dispatch({
                  type: "indexPage/drawLayer",
                  payload: {
                    "pageIndex": 1,
                    "pageSize": 99,
                    "parameterObject": {
                      status: 1,
                      desc: "createtime",
                      year: (this.state.y1 == "" && this.state.y2 == "") ? "" : this.state.y1 + "||" + this.state.y2,
                    }
                  },
                  callback: (res) => {
                    if (res) {
                      if (res.code === 0) {
                        dispatch({
                          type: "indexPage/updateState",
                          payload: {
                            layerListHZTB: res.data,
                            loadingGlobal: false
                          }
                        })
                      }
                    }
                  }
                });
                break;
            }
          }
        })
      }
    } else {
      message.warn("请检查年份格式")
    }

  }
  onSelect = (selectedKeys, e) => {
    // console.log(e.node.props);
    //console.log(v._name);
    // console.log(v);
    if (e.node.props.checked) {
      const { dispatch, layerListProtectedArea } = this.props;
      const { eventKey } = e.node.props;
      //console.log(layerListProtectedArea);
      const keysArray = eventKey.split("/");
      if (eventKey.indexOf("filepath:") > -1) {
        const key = keysArray[keysArray.length - 1];
        if (e.node.props["shapetype"]) {
          dispatch({
            type: "indexPage/updateState",
            payload: {
              shapeChoseid: key,
              shapeid: 1
            }
          });
          if (e.node.props["shapetype"] == "保护地") {
            let protectShape = {
              TTYPE: e.node.props.name,
              corearea: e.node.props.corearea,
              createtime: e.node.props.createtime,
              creatorid: e.node.props.creatorid,
              creatorname: e.node.props.creatorname,
              creatortime: e.node.props.creatortime,
              cushionarea: e.node.props.cushionarea,
              department: e.node.props.department,
              description: e.node.props.description,
              experimentalarea: e.node.props.experimentalarea,
              latitude: e.node.props.latitude,
              level: e.node.props.level,
              longitude: e.node.props.longitude,
              promotiontime: e.node.props.promotiontime,
              realarea: e.node.props.realarea,
              remark: e.node.props.remark,
              shortname: e.node.props.shortname,
              status: e.node.props.status,
              target: e.node.props.target,
              type: e.node.props.type,
              shapetype: e.node.props.shapetype,
              buildtime: e.node.props.buildtime,
              area: e.node.props.area,
              protectname: e.node.props.protectname
            };
            let b = this.props.tubanShape;
            b.push(protectShape)
            dispatch({
              type: "indexPage/updateState",
              payload: {
                tubanShape: b
              }
            });
          }
          // else if (e.node.props["shapetype"] == "小班") {
          //   let simShape = {
          //     TTYPE: e.node.props.name,
          //     creatorid: e.node.props.creatorid,
          //     creatorname: e.node.props.creatorname,
          //     creatortime: e.node.props.creatortime,
          //     protectedareaid: e.node.props.protectedareaid,
          //     protectedareaname: e.node.props.protectedareaname,
          //     remark: e.node.props.remark,
          //     status: e.node.props.status,
          //     version: e.node.props.version,
          //     shapetype: e.node.props.shapetype
          //   };
          //   // let simShape = [{
          //   //   "creatorid": 1,
          //   //   "creatorname": 1,
          //   //   "creatortime": 1,
          //   //   "protectedareaid": 11,
          //   //   "protectedareaname": 1,
          //   //   "remark": 1,
          //   //   "status": 1,
          //   //   "version": 1
          //   // }];
          //   let b = this.props.tubanShape;
          //   b.push(simShape)
          //   dispatch({
          //     type: "indexPage/updateState",
          //     payload: {
          //       tubanShape: b
          //     }
          //   });
          // }
        } else {
          dispatch({
            type: "indexPage/updateState",
            payload: {
              shapeChoseid: ""
            }
          });
        }
        global.viewer.dataSources._dataSources.forEach((v) => {
          if (v._name === key) {
            global.viewer.flyTo(v, {
              offset: {
                heading: Cesium.Math.toRadians(0.0), //默认值
                pitch: Cesium.Math.toRadians(-90.0), // 默认值
                roll: 0.0 //默认值 }
              }
            });
          }
        });
      } else if (eventKey.indexOf("url:") > -1) {
        if (e.node.props.minlon) {
          let layers = [];
          $.ajax({
            url: e.node.props.pjson + "?f=pjson", success: function (results) {
              //console.log(JSON.parse(results));
              global.viewer.camera.flyTo({
                // destination: Cesium.Cartesian3.fromDegrees(e.node.props.lon, e.node.props.lat, 210000),
                // destination: Cesium.Rectangle.fromDegrees(e.node.props.minlon, e.node.props.minlat, e.node.props.maxlon, e.node.props.maxlat)
                destination: Cesium.Rectangle.fromDegrees(JSON.parse(results).initialExtent.xmin, JSON.parse(results).initialExtent.ymin, JSON.parse(results).initialExtent.xmax, JSON.parse(results).initialExtent.ymax)
              });
            }
          });

        }
      } else if (eventKey.indexOf("draw:") > -1) {
        global.viewer.dataSources._dataSources.forEach((v) => {
          if (v._name === e.node.props.name) {
            global.viewer.flyTo(v, {
              offset: {
                heading: Cesium.Math.toRadians(0.0), //默认值
                pitch: Cesium.Math.toRadians(-90.0), // 默认值
                roll: 0.0 //默认值 }
              }
            });
          }
        });
      }
      if (!e.node.props.selected) {
        dispatch({
          type: "indexPage/updateState",
          payload: {
            layerManagerSelectedKeys: selectedKeys,
            layerMap: true,
            shapeid: 1
          }
        });
      }
    }
  }

  renderHtml = (t, d) => {
    if (d == "1") {
      return (
        <Table columns={columns} dataSource={t} scroll={{ x: 1600 }}/>
      )
    } else {
      return (
        <Table columns={columns_sm} dataSource={t} scroll={{ x: 1600 }}/>
      )
    }
  }

  propertyTabClose = () => {
    this.setState({
      visible: false
    })
  }

  show = () => {
    this.setState({
      searchboxvis: !this.state.searchboxvis
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item !== undefined) {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item} selectable={item.select}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        } else {
          if (item.title === "矢量图层" || item.title === "影像图层") {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item} selectable={item.select} disableCheckbox={true}
                        disabled>
              </TreeNode>)
          } else {
            return <TreeNode {...item} disableCheckbox={!item.select} disabled={!item.select}/>;
          }
        }
      }

    });
  }

  Key = (v) => {
    switch (v) {
      case "基础地理信息":
        return "menu-base-data_show_base_info";
        break;
      case "保护地信息":
        return "menu-base-data_show_protect_info";
        break;
      case "人类活动":
        return "menu-base-data_show_human_action";
        break;
      case "保护地影像":
        return "menu-base-data_show_protect_image";
        break;
      case "小班数据":
        return "menu-base-data_show_small_data";
        break;
      case "人类活动变化":
        return "menu-base-data_show_humanAct_change";
        break;
      case "实地核查数据":
        return "menu-base-data_show_fieldAudit";
        break;
      case "自主核查数据":
        return "menu-base-data_independent_inspection";
        break;
      case "绘制图斑":
        return "menu-base-data_show-draw-layer";
        break;
    }
  }

  render() {
    const {
      layerListImage, layerListArea,
      layerListProtectedArea,
      layerListHumanActiviy,
      layerManagerSelectedKeys,
      layerManagerCheckedKeys,
      layerListStigmata, menuSelect, protectAreaid, layerListSDHC,
      layerListZZHC, layerListHZTB
    } = this.props;
    //console.log(this.props.layermanagerhidden);
    let pp = "";
    if (localStorage.getItem('rolegradeid') == 1) {
      pp = protectAreaid.map((v, i) => {
        return (
          <Option value={v.id}>{v.name}</Option>
        )
      })
    }

    const array0 = [{
      title: '影像图层',
      key: '0-0',
      select: false,
      children: []
    }, {
      title: '矢量图层',
      key: '0-1',
      select: false,
      children: []
    }];
    // console.log(layerListImage);
    //影像图层
    if (layerListImage.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "影像图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("保护地影像")]) {
            v.children.push({
              title: "保护地影像",
              key: this.Key("保护地影像"),
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListImage.filter((v3, i3) => {
                    return v3.protectedareaid === v2.id
                  })
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "img",
                      select: false,
                      children: (
                        yy.map((v4, i4) => {
                          return {
                            title: v4.name,
                            key: v4.name + "url:" + v4.url,
                            maxlon: v4.maxlongitude,
                            maxlat: v4.maxlatitude,
                            minlon: v4.minlongitude,
                            minlat: v4.minlatitude,
                            name: v4.name,
                            pjson: v4.url,
                            select: true,
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "img",
                  //     select: false,
                  //   }
                  // }
                })
              )
            })
          }
        }
      });
    } else {
      array0.forEach((v, i) => {
        if (v.title == "影像图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("保护地影像")]) {
            v.children.push({
              title: "保护地影像",
              key: this.Key("保护地影像")
            })
          }
        }
      });
    }

    //基础地理信息
    if (layerListArea.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("基础地理信息")]) {
            v.children.push({
              title: "基础地理信息",
              key: this.Key("基础地理信息"),
              select: false,
              children: (
                layerListArea.map((v2, i2) => {
                  // v2.layers.map((v3,i3)=>{
                  if (v2.layers.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name,
                      select: false,
                      children: (
                        v2.layers.map((v3, i3) => {
                          return {
                            title: v3.name,
                            key: "filepath:" + v3.filepath,
                            select: true,
                            name: v3.filepath.split('/')[v3.filepath.split('/').length - 1],
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name,
                  //     select: false,
                  //   }
                  // }
                  // })
                })
              )
            })
          }
        }
      });
    } else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("基础地理信息")]) {
            v.children.push({
              title: "基础地理信息",
              key: this.Key("基础地理信息"),
              select: false
            })
          }
        }
      });
    }

    //保护地信息
    if (layerListProtectedArea.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("保护地信息")]) {
            v.children.push({
              title: "保护地信息",
              key: this.Key("保护地信息"),
              select: false,
              children: (
                layerListProtectedArea.map((v2, i2) => {
                  if (v2.layers.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "protect",
                      select: false,
                      children: (
                        v2.layers.map((v3, i3) => {
                          return {
                            title: v3.name,
                            key: "filepath:" + v3.filepath,
                            select: true,
                            name: v3.filepath.split('/')[v3.filepath.split('/').length - 1],
                            id: v3.id,
                            area: v2.area,
                            shapetype: "保护地",
                            corearea: v2.corearea,
                            createtime: v2.createtime,
                            creatorid: v2.creatorid,
                            creatorname: v2.creatorname,
                            creatortime: v2.creatortime,
                            cushionarea: v2.cushionarea,
                            department: v2.department,
                            description: v2.description,
                            experimentalarea: v2.experimentalarea,
                            latitude: v2.latitude,
                            level: v2.level,
                            longitude: v2.longitude,
                            promotiontime: v2.promotiontime,
                            realarea: v2.realarea,
                            remark: v2.remark,
                            shortname: v2.shortname,
                            status: v2.status,
                            target: v2.target,
                            type: v2.type,
                            protectname: v2.name,
                            buildtime: v2.buildtime,
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "protect",
                  //     select: false,
                  //   }
                  // }
                })
              )
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("保护地信息")]) {
            v.children.push({
              title: "保护地信息",
              key: this.Key("保护地信息"),
              select: false
            })
          }
        }
      });
    }

    //人类活动
    if (layerListHumanActiviy.length > 0) {
      // console.log(layerListHumanActiviy);
      // console.log(protectAreaid);
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("人类活动")]) {
            v.children.push({
              title: "人类活动",
              key: this.Key("人类活动"),
              select: false,
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListHumanActiviy.filter((v3, i3) => {
                    if (v3.layers.length > 0) {
                      return v3.layers[0].protectedareaid === v2.id
                    }
                  })
                  // console.log(yy);
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "hum",
                      children: [{
                        title: "图斑",
                        key: v2.name + "图斑2",
                        select: false,
                        children: (
                          yy.filter((item, key) => {
                            return item.type === 2
                          }).filter((item, key) => {
                            return item.subtype === 1
                          }).map((v4, i4) => {
                            return {
                              title: v4.layers[0].name,
                              key: "filepath:" + v4.layers[0].filepath,
                              select: true,
                              name: v4.layers[0].filepath.split("/")[v4.layers[0].filepath.split('/').length - 1],
                              id: v4.layers[0].id,
                              shapetype: "人类活动",
                            }
                          })
                        )
                      }, {
                        title: "道路",
                        key: v2.name + "道路2",
                        select: false,
                        children: (
                          yy.filter((item, key) => {
                            return item.type === 2
                          }).filter((item, key) => {
                            return item.subtype === 2
                          }).map((v4, i4) => {
                            return {
                              title: v4.layers[0].name,
                              key: "filepath:" + v4.layers[0].filepath,
                              select: true,
                              name: v4.layers[0].filepath.split("/")[v4.layers[0].filepath.split('/').length - 1],
                              id: v4.layers[0].id,
                              shapetype: "人类活动",
                            }
                          })
                        )
                      }]
                      // children: (
                      //   yy.map((v4, i4) => {
                      //     return {
                      //       title: v4.name,
                      //       key: v4.filepath
                      //     }
                      //   })
                      // )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "hum",
                  //     select: false,
                  //   }
                  // }
                })
              )

            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("人类活动")]) {
            v.children.push({
              title: "人类活动",
              key: this.Key("人类活动"),
              select: false
            })
          }
        }
      });
    }

    //人类活动变化
    if (layerListHumanActiviy.length > 0) {
      // console.log(layerListHumanActiviy);
      // console.log(protectAreaid);
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("人类活动变化")]) {
            v.children.push({
              title: "人类活动变化",
              key: this.Key("人类活动变化"),
              select: false,
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListHumanActiviy.filter((v3, i3) => {
                    if (v3.layers.length > 0) {
                      return v3.layers[0].protectedareaid === v2.id
                    }
                  })
                  // console.log(yy);
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "humact",
                      children: [{
                        title: "图斑",
                        key: v2.name + "图斑1",
                        select: false,
                        children: (
                          yy.filter((item, key) => {
                            return item.type === 1
                          }).filter((item, key) => {
                            return item.subtype === 1
                          }).map((v4, i4) => {
                            return {
                              title: v4.layers[0].name,
                              key: "filepath:" + v4.layers[0].filepath,
                              select: true,
                              name: v4.layers[0].filepath.split("/")[v4.layers[0].filepath.split('/').length - 1],
                              id: v4.layers[0].id,
                              shapetype: "人类活动变化",
                            }
                          })
                        )
                      }, {
                        title: "道路",
                        key: v2.name + "道路1",
                        select: false,
                        children: (
                          yy.filter((item, key) => {
                            return item.type === 1
                          }).filter((item, key) => {
                            return item.subtype === 2
                          }).map((v4, i4) => {
                            return {
                              title: v4.layers[0].name,
                              key: "filepath:" + v4.layers[0].filepath,
                              select: true,
                              children: [],
                              name: v4.layers[0].filepath.split("/")[v4.layers[0].filepath.split('/').length - 1],
                              id: v4.layers[0].id,
                              shapetype: "人类活动变化",
                            }
                          })
                        )
                      }]
                      // children: (
                      //   yy.map((v4, i4) => {
                      //     return {
                      //       title: v4.name,
                      //       key: v4.filepath
                      //     }
                      //   })
                      // )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "humact",
                  //     select: false,
                  //   }
                  // }
                })
              )
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("人类活动变化")]) {
            v.children.push({
              title: "人类活动变化",
              key: this.Key("人类活动变化"),
              select: false
            })
          }
        }
      });
    }


    //小班
    if (layerListStigmata.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("小班数据")]) {
            v.children.push({
              title: "小班数据",
              key: this.Key("小班数据"),
              select: false,
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListStigmata.filter((v3, i3) => {
                    return v3.layers[0].protectedareaid === v2.id
                  })
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "sm",
                      select: false,
                      children: (
                        yy.map((v4, i4) => {
                          return {
                            title: v4.layers[0].name,
                            key: "filepath:" + v4.layers[0].filepath,
                            name: v4.layers[0].filepath.split("/")[v4.layers[0].filepath.split('/').length - 1],
                            select: true,
                            id: v4.layers[0].id,
                            creatorid: v4.creatorid,
                            creatorname: v4.creatorname,
                            creatortime: v4.creatortime,
                            protectedareaid: v4.protectedareaid,
                            protectedareaname: v4.protectedareaname,
                            remark: v4.remark,
                            status: v4.status,
                            version: v4.version,
                            shapetype: "小班",
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name,
                  //     select: false,
                  //   }
                  // }
                })
              )
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("小班数据")]) {
            v.children.push({
              title: "小班数据",
              key: this.Key("小班数据"),
              select: false
            })
          }
        }
      });
    }

    //自主核查
    if (layerListZZHC.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("自主核查数据")]) {
            v.children.push({
              title: "自主核查数据",
              key: this.Key("自主核查数据"),
              select: false,
              // children: (
              // protectAreaid.map((v2, i2) => {
              //   let yy = layerListZZHC.filter((v3, i3) => {
              //     return v3.layers[0].protectedareaid === v2.id
              //   })
              //   if (yy.length > 0) {
              //     return {
              //       title: v2.name,
              //       key: v2.name + "sm",
              //       select: false,
              //       children: (
              //         yy.map((v4, i4) => {
              //           return {
              //             title: v4.layers[0].name,
              //             key: v4.layers[0].filepath,
              //             select: true,
              //           }
              //         })
              //       )
              //     }
              //   } else {
              //     return {
              //       title: v2.name,
              //       key: v2.name,
              //       select: false,
              //     }
              //   }
              // })
              // )
              // children: (
              //   layerListZZHC.map((v4, i4) => {
              //     return {
              //       title: v4.taskname,
              //       key: v4.geometry,
              //       select: true,
              //     }
              //   })
              // )
              children: (
                layerListZZHC.map((v4, i4) => {
                  return {
                    title: v4.taskname,
                    key: v4.taskname + "geo:" + v4.geometry,
                    name: v4.taskname,
                    select: true,
                  }
                })
              ),
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("自主核查数据")]) {
            v.children.push({
              title: "自主核查数据",
              key: this.Key("自主核查数据"),
              select: false,
              // children: (
              // protectAreaid.map((v2, i2) => {
              //   let yy = layerListZZHC.filter((v3, i3) => {
              //     return v3.layers[0].protectedareaid === v2.id
              //   })
              //   if (yy.length > 0) {
              //     return {
              //       title: v2.name,
              //       key: v2.name + "sm",
              //       select: false,
              //       children: (
              //         yy.map((v4, i4) => {
              //           return {
              //             title: v4.layers[0].name,
              //             key: v4.layers[0].filepath,
              //             select: true,
              //           }
              //         })
              //       )
              //     }
              //   } else {
              //     return {
              //       title: v2.name,
              //       key: v2.name,
              //       select: false,
              //     }
              //   }
              // })
              // )
              // children: (
              //   layerListZZHC.map((v4, i4) => {
              //     return {
              //       title: v4.taskname,
              //       key: v4.geometry,
              //       select: true,
              //     }
              //   })
              // )
            })
          }
        }
      });
    }

    //实地核查
    if (layerListSDHC.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("实地核查数据")]) {
            v.children.push({
              title: "实地核查数据",
              key: this.Key("实地核查数据"),
              select: false,
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListSDHC.filter((v3, i3) => {
                    return v3.protectedAreaId === v2.id
                  })
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "SDHC",
                      select: false,
                      children: (
                        yy.map((v4, i4) => {
                          return {
                            title: v4.timestr,
                            key: v4.timestr,
                            select: true,
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "SDHC",
                  //     select: false,
                  //   }
                  // }
                })
              )
              // children: (
              //   layerListSDHC.map((v4, i4) => {
              //     return {
              //       title: v4.name,
              //       key: v4.trackList,
              //       select: true,
              //     }
              //   })
              // )
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("实地核查数据")]) {
            v.children.push({
              title: "实地核查数据",
              key: this.Key("实地核查数据"),
              select: false,
              // children: (
              //   layerListSDHC.map((v4, i4) => {
              //     return {
              //       title: v4.name,
              //       key: v4.trackList,
              //       select: true,
              //     }
              //   })
              // )
            })
          }
        }
      });
    }

    //绘制图斑
    if (layerListHZTB.length > 0) {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("绘制图斑")]) {
            v.children.push({
              title: "绘制图斑",
              key: this.Key("绘制图斑"),
              select: false,
              children: (
                protectAreaid.map((v2, i2) => {
                  let yy = layerListHZTB.filter((v3, i3) => {
                    return v3.protectedareaid === v2.id
                  })
                  if (yy.length > 0) {
                    return {
                      title: v2.name,
                      key: v2.name + "tbhz",
                      select: false,
                      children: (
                        yy.map((v4, i4) => {
                          return {
                            title: v4.name,
                            key: v4.name + "draw:" + v4.geometry,
                            select: true,
                            name: v4.name
                          }
                        })
                      )
                    }
                  }
                  // else {
                  //   return {
                  //     title: v2.name,
                  //     key: v2.name + "tbhz",
                  //     select: false,
                  //   }
                  // }
                })
              )
              // children: []
            })
          }
        }
      });
    }
    else {
      array0.forEach((v, i) => {
        if (v.title == "矢量图层") {
          // v.children.push(tt);
          if (menuSelect[this.Key("绘制图斑")]) {
            v.children.push({
              title: "绘制图斑",
              key: this.Key("绘制图斑"),
              select: false
              // children: []
            })
          }
        }
      });
    }

    return (
      <div>
        <div
          className={this.props.saveLayer.length === 0 ? styles.leftFixedbox : styles.leftFixedbox + " " + styles.addtaskhidden}
          hidden={this.state.leftFixedshow}>
          <div className={styles.header}>
            <Icon type="menu-unfold" theme="outlined" style={{ paddingRight: 4, verticalAlign: "middle" }}/>图层管理<Icon
            type="search" onClick={this.show} className={styles.searchbtn} hidden={!this.state.searchboxvis}/><Icon
            type="up" onClick={this.show} className={styles.searchbtn} hidden={this.state.searchboxvis}/>
          </div>
          <div className={styles.treebox}>
            <div className={styles.loading} hidden={!this.props.loadingGlobal}>
              <Spin spinning={this.props.loadingGlobal} delay={500} size="small"
                    indicator={<Icon type="loading" style={{ fontSize: 28 }} spin/>}/>
            </div>
            <div className={styles.searchbox} hidden={this.state.searchboxvis}>
              <div hidden={localStorage.getItem('rolegradeid') == 1 ? false : true}>
                <label style={{ fontSize: 12 }}>&nbsp;&nbsp;保护地名称：</label>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="输入关键字"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changep}
                >
                  <Option value="">全部</Option>
                  {pp}
                </Select>
              </div>
              <div style={{ color: "#fff", marginTop: 10, marginLeft: 19 }}><label
                style={{ fontSize: 12 }}>监测年份：</label>
                <Input
                  placeholder="" value={this.state.y1}
                  style={{ width: 60 }} onChange={this.changey1}
                /> - <Input
                  placeholder="" value={this.state.y2}
                  style={{ width: 60 }} onChange={this.changey2}
                />
                <Button className={styles.btn} onClick={this.search}>确定</Button>
              </div>
            </div>
            <Tree
              selectable={true}
              checkable
              onExpand={this.onExpand}
              defaultExpandAll={true}
              autoExpandParent={true}
              onCheck={this.onCheck}
              checkedKeys={layerManagerCheckedKeys}
              onSelect={this.onSelect}
              selectedKeys={layerManagerSelectedKeys}
            >
              {this.renderTreeNodes(array0)}
            </Tree>
          </div>
          <span className={styles.caretLeft} onClick={this.arrowShrink}><Icon type="caret-left"
                                                                              theme="outlined"/></span>
        </div>
        <div className={styles.leftFixedboxhidden} hidden={this.state.leftFixedhidden}>
          {/*<Icon type="menu-unfold" theme="outlined"/>*/}
          <Icon type="caret-right"
                theme="outlined" title="展开图层管理" onClick={this.arrowShrink2} style={{
            color: "#13c2c2",
            // paddingLeft: "50px",
            cursor: "pointer",
            verticalAlign: "middle"
          }}/>
        </div>
        <div hidden={this.props.saveLayer.length === 0 ? true : false} className={styles.leftFixedboxhidden}>
          {/*<Icon type="menu-unfold" theme="outlined"/>*/}
          <Icon type="caret-right"
                theme="outlined" style={{
            color: "#ccc",
            verticalAlign: "middle"
            // paddingLeft: "50px"
          }}/>
        </div>
        <Modal
          title="属性表"
          visible={this.state.visible}
          footer={null}
          mask={true}
          maxable={false}
          minable={false}
          onCancel={this.propertyTabClose}
          className={styles.shapelist}
        >
          {this.renderHtml(this.state.tableList, this.state.type)}
        </Modal>
      </div>
    );
  }
}

export default LayerManage;
LayerManage.propTypes = {
  cesiumControl: PropTypes.object,
};
