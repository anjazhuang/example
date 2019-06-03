/* global $ */
/* global Cesium */
import styles from './ContrastRSDataModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, InputNumber, Input, Upload, Spin, Icon, Table } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { message } from 'antd';

const Option = Select.Option;
const columns2 = [{
  title: "对比点位信息",
  children: [{
    title: '序号',
    render: (text, record, index) => `${index + 1}`,
    align: 'center',
    width: 50
  }, {
    title: '经度',
    dataIndex: 'f1_ZXJD',
    align: 'center',
    width: 80
  }, {
    title: '纬度',
    dataIndex: 'f1_ZXWD',
    align: 'center',
    width: 80
  }, {
    title: '人类活动类型',
    dataIndex: 'f1_YJLX',
    align: 'center',
    width: 90
  },
    //   {
    //   title: '规模',
    //   dataIndex: '',
    //   align: 'center',
    //   width: 70
    // },
    {
      title: '变化类型',
      dataIndex: 'f1_BHQK',
      align: 'center',
      width: 80
    }, {
      title: '功能区划',
      dataIndex: 'f1_GNFQ',
      align: 'center',
      width: 80,
      className: "borderLine"
    }]
}, {
  title: '验证点位信息',
  children: [
    //   {
    //   title: '序号',
    //   dataIndex: 'f2_id',
    //   align: 'center',
    //   defaultSortOrder: 'ascend',
    //   width: 30,
    // },
    {
      title: '中心经度',
      dataIndex: 'f2_ZXJD',
      align: 'center',
      width: 80
    }, {
      title: '中心纬度',
      dataIndex: 'f2_ZXWD',
      align: 'center',
      width: 80
    }, {
      title: '变化类型',
      dataIndex: 'f2_BHQK',
      align: 'center',
      width: 80
    }, {
      title: '人类活动类型',
      dataIndex: 'f2_BHQK',
      align: 'center',
      width: 90
    }, {
      title: '功能区划',
      dataIndex: 'f2_GNFQ',
      align: 'center',
      width: 80
    }]
}];

const columns3 = [{
  title: "对比点位信息",
  children: [{
    title: '序号',
    render: (text, record, index) => `${index + 1}`,
    align: 'center',
    width: 50
  }, {
    title: '经度',
    dataIndex: 'f1_ZXJD',
    align: 'center',
    width: 80
  }, {
    title: '纬度',
    dataIndex: 'f1_ZXWD',
    align: 'center',
    width: 80
  }, {
    title: '人类活动类型',
    dataIndex: 'f1_YJLX',
    align: 'center',
    width: 90
  },
    //   {
    //   title: '规模',
    //   dataIndex: '',
    //   align: 'center',
    //   width: 70
    // },
    {
      title: '变化类型',
      dataIndex: 'f1_BHQK',
      align: 'center',
      width: 80
    }, {
      title: '功能区划',
      dataIndex: 'f1_GNFQ',
      align: 'center',
      width: 80,
      className: "borderLine"
    }]
}, {
  title: '验证点位信息',
  children: [
    //   {
    //   title: '序号',
    //   dataIndex: 'f2_id',
    //   align: 'center',
    //   defaultSortOrder: 'ascend',
    //   width: 30,
    // },
    {
      title: '中心经度',
      dataIndex: 'f2_经度',
      align: 'center',
      width: 80
    }, {
      title: '中心纬度',
      dataIndex: 'f2_纬度',
      align: 'center',
      width: 80
    }, {
      title: '变化类型',
      dataIndex: 'f2_变化情况',
      align: 'center',
      width: 80
    }, {
      title: '人类活动类型',
      dataIndex: 'f2_活动类型',
      align: 'center',
      width: 90
    }, {
      title: '功能区划',
      dataIndex: 'f2_功能区',
      align: 'center',
      width: 80
    }]
}];

export default class ContrastRSDataModal extends Component {
  state = {
    visible: false,
    visible2: false,
    timephaseid: "",//时相
    timephaseid2: "",//对比时相
    radius: 0,//缓冲区
    lon: 0,//经度
    lat: 0,//纬度
    lonA: 0,//经度
    lonB: 0,//经度
    lonC: 0,//经度
    latA: 0,//纬度
    latB: 0,//纬度
    latC: 0,//纬度
    fileList: [],//上传文件
    // fileListVec: [],//上传矢量文件
    coorvis: false,//单点坐标
    coorvis1: false,//单点坐标(度分秒)
    coorvis2: true,//单点坐标(度分秒)
    tablevis: true,//表格
    vectorvis: true,//矢量
    datavis: true,//数据记录
    loading: false,//加载中
    type: 1,//选择类型,
    shiliang:false,
  };

  contrastRSDataModalClose = () => {
    const { dispatch, cesiumControl,saveLayer,layerhad, layerhad2 } = this.props;
    let savelayer=saveLayer;
    savelayer.splice(saveLayer.indexOf("遥感验证"), 1);
    if(savelayer.length==0){
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    $("#cesiumContainer button").remove();
    // $("#locationbtn").remove();
    $("#rsdataconstractbox").remove();
    let dataconstract = ["系统数据对比base", "系统数据对比verifty"];
    dataconstract.map((t, i) => {
      global.viewer.dataSources._dataSources.forEach((v) => {
        if (t === v._name) {
          global.viewer.dataSources.remove(v);
          //notification.close(item);
        }
      });
    })

    this.setState({
      visible2: false
    })

    // global.viewer.dataSources._dataSources.forEach((v) => {
    //   alert(v._name)
    //   if (dataconstract.indexOf(v._name) > -1) {
    //     global.viewer.dataSources.remove(v);
    //     //notification.close(item);
    //   }
    // });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        contrastRSDataModalShow: false,
        saveLayer:savelayer
      }
    });
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

  onChangeradius = (v) => {
    this.setState({
      radius: v
    });
  }

  onChangeType = (v) => {
    switch (v) {
      case "0":
        this.setState({
          type: 1,//单点导入
          coorvis: false,
          tablevis: true,//表格
          vectorvis: true,//矢量
          datavis: true,//数据记录
          fileList: [],
          shiliang:false
        });
        break;
      case "1":
        this.setState({
          type: 2,//表格导入
          coorvis: true,
          tablevis: false,//表格
          vectorvis: true,//矢量
          datavis: true,//数据记录
          fileList: [],
          shiliang:false
        });
        break;
      case "2":
        this.setState({
          type: 3,//矢量文件导入
          coorvis: true,
          tablevis: true,//表格
          vectorvis: false,//矢量
          datavis: true,//数据记录
          fileList: [],
          shiliang:true
        });
        break;
      case "3":
        this.setState({
          type: 4,//数据对比
          coorvis: true,
          tablevis: true,//表格
          vectorvis: true,//矢量
          datavis: false,//数据记录
          fileList: [],
          shiliang:false
        });
        break;
    }
  }

  onChangeTime = (v) => {
    this.setState({
      timephaseid: v
    });
  }
  onChangeTime2 = (v) => {
    this.setState({
      timephaseid2: v
    });
  }

  actionContract = () => {
    const { dispatch, cesiumControl, } = this.props;
    const { fileList } = this.state;
    const formData = new FormData();
    // console.log(fileList);
    if (this.state.type !== 0 && this.state.timephaseid2 !== "") {
      this.setState({
        loading: true
      });
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          shapeid: 2
        }
      });
      if (this.state.type === 1) {
        if (!this.state.coorvis1) {
          if (this.state.lat !== 0 && this.state.lon !== 0) {
            formData.append('layerId', this.state.timephaseid2);
            formData.append('radius', this.state.radius);
            formData.append('lng', this.state.lon);
            formData.append('lat', this.state.lat);
            dispatch({
              type: 'indexPage/ConstRsdatatable',
              payload: formData,
              callback: (res) => {
                if (res) {
                  // console.log(res);// 请求完成后返回的结果
                  if (res.code === 0) {
                    let count = 0;
                    let count2 = 0;
                    let count3 = 0;
                    res.data.table.map((v, i) => {
                      if (v.f1_id && v.f2_id) {
                        count++
                      } else if (v.f1_id) {
                        count2++
                      } else if (v.f2_id) {
                        count3++
                      }
                    });
                    // console.log(count, count2, count3)
                    message.success("对比成功");
                    dispatch({
                      type: 'indexPage/updateState',
                      payload: {
                        rsdatacontract: res.data.table
                      }
                    });
                    cesiumControl.Rsdataconstract(JSON.parse(res.data.base), JSON.parse(res.data.verify))
                    this.setState({
                      loading: false
                    });
                    $("#rsdataconstractbox").html("<p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(48, 255, 6);border-radius: 50%;margin-right: 3px'></span><span>重叠的活动变化与验证点 数量：" + count + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(244, 243, 168);border-radius: 50%;margin-right: 3px'></span><span>无重叠活动变化 数量：" + count2 + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;margin-right: 3px;background-color: rgb(6, 237, 255);border-radius: 50%'></span><span>无重叠验证点 数量：" + count3 + "</span></p>");
                    var div = document.createElement('button');
                    div.innerHTML = "对比结果表格";
                    div.id = 'rsdataTabbtn';
                    var div2 = document.createElement('button');
                    div2.innerHTML = "定位";
                    div2.id = 'locationbtn';
                    global.viewer.container.appendChild(div);
                    global.viewer.container.appendChild(div2);
                    div.addEventListener('click', ev => {
                      this.setState({
                        visible2: true
                      })
                    })
                    div2.addEventListener('click', ev => {
                      global.viewer.dataSources._dataSources.forEach((v) => {
                        // console.log(v._name);
                        // console.log(v);
                        if (v._name == "系统数据对比base") {
                          global.viewer.flyTo(v, {
                            offset: {
                              heading: Cesium.Math.toRadians(0.0), //默认值
                              pitch: Cesium.Math.toRadians(-90.0), // 默认值
                              roll: 0.0 //默认值 }
                            }
                          });
                        }
                      });
                    })
                  } else {
                    this.setState({
                      loading: false
                    });
                    message.error(res.msg)
                  }
                }
              }
            });
          } else {
            message.warn("经纬度没有填完整无法对比");
            this.setState({
              loading: false
            });
          }
        } else {
          if (this.state.lonA !== 0 && this.state.latA !== 0) {
            formData.append('layerId', this.state.timephaseid2);
            formData.append('radius', this.state.radius);
            formData.append('lng', this.state.lonA + "°" + this.state.lonB + "'" + this.state.lonC + "\"");
            formData.append('lat', this.state.latA + "°" + this.state.latB + "'" + this.state.latC + "\"");
            dispatch({
              type: 'indexPage/ConstRsdatatable',
              payload: formData,
              callback: (res) => {
                if (res) {
                  // console.log(res);// 请求完成后返回的结果
                  if (res.code === 0) {
                    let count = 0;
                    let count2 = 0;
                    let count3 = 0;
                    res.data.table.map((v, i) => {
                      if (v.f1_id && v.f2_id) {
                        count++
                      } else if (v.f1_id) {
                        count2++
                      } else if (v.f2_id) {
                        count3++
                      }
                    });
                    // console.log(count, count2, count3)
                    message.success("对比成功");
                    dispatch({
                      type: 'indexPage/updateState',
                      payload: {
                        rsdatacontract: res.data.table
                      }
                    });
                    cesiumControl.Rsdataconstract(JSON.parse(res.data.base), JSON.parse(res.data.verify))
                    this.setState({
                      loading: false
                    });
                    $("#rsdataconstractbox").html("<p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(48, 255, 6);border-radius: 50%;margin-right: 3px'></span><span>重叠的活动变化与验证点 数量：" + count + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(244, 243, 168);border-radius: 50%;margin-right: 3px'></span><span>无重叠活动变化 数量：" + count2 + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;margin-right: 3px;background-color: rgb(6, 237, 255);border-radius: 50%'></span><span>无重叠验证点 数量：" + count3 + "</span></p>");
                    var div = document.createElement('button');
                    div.innerHTML = "对比结果表格";
                    div.id = 'rsdataTabbtn';
                    var div2 = document.createElement('button');
                    div2.innerHTML = "定位";
                    div2.id = 'locationbtn';
                    global.viewer.container.appendChild(div);
                    global.viewer.container.appendChild(div2);
                    div.addEventListener('click', ev => {
                      this.setState({
                        visible2: true
                      })
                    })
                    div2.addEventListener('click', ev => {
                      global.viewer.dataSources._dataSources.forEach((v) => {
                        // console.log(v._name);
                        // console.log(v);
                        if (v._name == "系统数据对比base") {
                          global.viewer.flyTo(v, {
                            offset: {
                              heading: Cesium.Math.toRadians(0.0), //默认值
                              pitch: Cesium.Math.toRadians(-90.0), // 默认值
                              roll: 0.0 //默认值 }
                            }
                          });
                        }
                      });
                    })
                  } else {
                    this.setState({
                      loading: false
                    });
                    message.error(res.msg)
                  }
                }
              }
            });
          } else {
            message.warn("经纬度没有填完整无法对比");
            this.setState({
              loading: false
            });
          }
        }
      } else if (this.state.type === 2 || this.state.type === 3) {
        //console.log(fileList)
        if (fileList.length > 0) {
          fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
          });
          formData.append('layerId', this.state.timephaseid2);
          formData.append('radius', this.state.radius);
          dispatch({
            type: 'indexPage/ConstRsdatatable',
            // payload: {
            //   layerId: this.state.timephaseid2,
            //   file:formData,
            //   radius: this.state.radius
            // },
            payload: formData,
            callback: (res) => {
              if (res) {
                // console.log(res);// 请求完成后返回的结果
                if (res.code === 0) {
                  let count = 0;
                  let count2 = 0;
                  let count3 = 0;
                  res.data.table.map((v, i) => {
                    if (v.f1_id && v.f2_id) {
                      count++
                    } else if (v.f1_id) {
                      count2++
                    } else if (v.f2_id) {
                      count3++
                    }
                  });
                  // console.log(count, count2, count3)
                  message.success("对比成功");
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      rsdatacontract: res.data.table,
                    }
                  });
                  cesiumControl.Rsdataconstract(JSON.parse(res.data.base), JSON.parse(res.data.verify))
                  this.setState({
                    loading: false
                  });
                  $("#rsdataconstractbox").html("<p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(48, 255, 6);border-radius: 50%;margin-right: 3px'></span><span>重叠的活动变化与验证点 数量：" + count + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(244, 243, 168);border-radius: 50%;margin-right: 3px'></span><span>无重叠活动变化 数量：" + count2 + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;margin-right: 3px;background-color: rgb(6, 237, 255);border-radius: 50%'></span><span>无重叠验证点 数量：" + count3 + "</span></p>");
                  var div = document.createElement('button');
                  div.innerHTML = "对比结果表格";
                  div.id = 'rsdataTabbtn';
                  var div2 = document.createElement('button');
                  div2.innerHTML = "定位";
                  div2.id = 'locationbtn';
                  global.viewer.container.appendChild(div);
                  global.viewer.container.appendChild(div2);
                  div.addEventListener('click', ev => {
                    this.setState({
                      visible2: true
                    })
                  })
                  div2.addEventListener('click', ev => {
                    global.viewer.dataSources._dataSources.forEach((v) => {
                      if (v._name == "系统数据对比base") {
                        global.viewer.flyTo(v, {
                          offset: {
                            heading: Cesium.Math.toRadians(0.0), //默认值
                            pitch: Cesium.Math.toRadians(-90.0), // 默认值
                            roll: 0.0 //默认值 }
                          }
                        });
                      }
                      // console.log(v._name);
                      // console.log(v);
                    });
                  })
                } else {
                  this.setState({
                    loading: false
                  });
                  message.error(res.msg)
                }
              }
            }
          });
        } else {
          message.warn("没有选择相关文件，对比失败");
          this.setState({
            loading: false
          });
        }
      } else if (this.state.type === 4) {
        if (this.state.timephaseid !== "") {
          formData.append('layerId', this.state.timephaseid2);
          formData.append('importId', this.state.timephaseid);
          formData.append('radius', this.state.radius);
          dispatch({
            type: 'indexPage/ConstRsdatatable',
            // payload: {
            //   layerId: this.state.timephaseid2,
            //   file:formData,
            //   radius: this.state.radius
            // },
            payload: formData,
            callback: (res) => {
              if (res) {
                // console.log(res);// 请求完成后返回的结果
                if (res.code === 0) {
                  let count = 0;
                  let count2 = 0;
                  let count3 = 0;
                  res.data.table.map((v, i) => {
                    if (v.f1_id && v.f2_id) {
                      count++
                    } else if (v.f1_id) {
                      count2++
                    } else if (v.f2_id) {
                      count3++
                    }
                  });
                  message.success("对比成功");
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      rsdatacontract: res.data.table,
                    }
                  });
                  cesiumControl.Rsdataconstract(JSON.parse(res.data.base), JSON.parse(res.data.verify))
                  this.setState({
                    loading: false
                  });
                  $("#rsdataconstractbox").html("<p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(48, 255, 6);border-radius: 50%;margin-right: 3px'></span><span>重叠的活动变化与验证点 数量：" + count + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;background-color: rgb(244, 243, 168);border-radius: 50%;margin-right: 3px'></span><span>无重叠活动变化 数量：" + count2 + "</span></p><p><span style='width: 10px; height: 10px; display: inline-block;margin-right: 3px;background-color: rgb(6, 237, 255);border-radius: 50%'></span><span>无重叠验证点 数量：" + count3 + "</span></p>");
                  var div = document.createElement('button');
                  div.innerHTML = "对比结果表格";
                  div.id = 'rsdataTabbtn';
                  var div2 = document.createElement('button');
                  div2.innerHTML = "定位";
                  div2.id = 'locationbtn';
                  global.viewer.container.appendChild(div);
                  global.viewer.container.appendChild(div2);
                  div.addEventListener('click', ev => {
                    this.setState({
                      visible2: true
                    })
                  })
                  div2.addEventListener('click', ev => {
                    global.viewer.dataSources._dataSources.forEach((v) => {
                      if (v._name == "系统数据对比base") {
                        global.viewer.flyTo(v, {
                          offset: {
                            heading: Cesium.Math.toRadians(0.0), //默认值
                            pitch: Cesium.Math.toRadians(-90.0), // 默认值
                            roll: 0.0 //默认值 }
                          }
                        });
                      }
                      // console.log(v._name);
                      // console.log(v);
                    });
                  })
                } else {
                  this.setState({
                    loading: false
                  });
                  message.error(res.msg)
                }
              }
            }
          });
        } else {
          message.warn("选择数据里面的数据源未填");
          this.setState({
            loading: false
          });
        }

      }
    } else {
      message.warn("对比条件未填完整，无法对比")
    }
  }

  lonChange = (e) => {
    this.setState({
      lon: e.target.value
    })
  }

  latChange = (e) => {
    this.setState({
      lat: e.target.value
    })
  }

  lonChangeA = (e) => {
    this.setState({
      lonA: e.target.value
    })
  }

  lonChangeB = (e) => {
    this.setState({
      lonB: e.target.value
    })
  }

  lonChangeC = (e) => {
    this.setState({
      lonC: e.target.value
    })
  }


  latChangeA = (e) => {
    this.setState({
      latA: e.target.value
    })
  }

  latChangeB = (e) => {
    this.setState({
      latB: e.target.value
    })
  }

  latChangeC = (e) => {
    this.setState({
      latC: e.target.value
    })
  }
  handleChangefileList = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  }

  propertyTabClose = () => {
    const { dispatch } = this.props;
    this.setState({
      visible2: false
    })
  }

  changeDanwei = () => {
    this.setState({
      coorvis1: !this.state.coorvis1
    })
  }


  render() {
    const { constractHumanact, rsdatacontract, dataCompare } = this.props;
    let pp = constractHumanact.map((v, i) => {
      return (
        <Option value={v.id} key={v.id}>{v.text}</Option>
      )
    });

    let pp2 = dataCompare.map((v, i) => {
      return (
        <Option value={v.id}>{v.text}</Option>
      )
    });

    const props = {
      name: 'file',
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      multiple: false,
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        // message.warn("dd");
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        // console.log(file.name);
        let hz = file.name.substring(file.name.indexOf('.'), file.name.length);// 文件后缀

        if (hz == ".xlsx" || hz == ".xls") {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }));
          return false;
        }
        else {
          message.warn("只能上传表格文件")
        }
      },
      onChange: this.handleChangefileList
    };

    const props2 = {
      name: 'file',
      accept: 'application/zip',
      multiple: false,
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        // message.warn("dd");
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        //console.log(file.name);
        let hz = file.name.substring(file.name.indexOf('.'), file.name.length);// 文件后缀
        // alert(hz);
        if (hz == ".zip") {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }));
          return false;
        }
        else {
          message.warn("只能上传zip文件")
        }
        // var location = acceptType.indexOf(hz);
        // console.log(hz + " - " + acceptType + " - " + location);
        // if(location > -1) {
        //   return true;
        // } else {
        //   $this.attr('value','');
        //   alert('请选择图片格式的文件，如：' + acceptType);
        //   return;
        // }

      },
      onChange: this.handleChangefileList
    };

    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="遥感验证"
            visible={this.state.visible}
            onCancel={this.contrastRSDataModalClose}
            style={{ top: 200 }}
            footer={[<Button className={styles.bigbtn} onClick={this.actionContract}>对比</Button>]}
            maxable={false}
            minable={false}
            className={styles.list}
            width={600}>
            <div>
              <div className={styles.loading} hidden={!this.state.loading}>
                <Spin spinning={this.state.loading} delay={500}
                      indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}/>
              </div>
              <label>验证类型：</label>
              <Select
                showSearch
                style={{ width: 250 }}
                defaultValue={"0"}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.onChangeType}
              >
                {/*<Option value="">请选择</Option>*/}
                <Option value="0">单点导入</Option>
                <Option value="1">表格导入</Option>
                <Option value="2">矢量文件导入</Option>
                <Option value="3">数据记录</Option>
              </Select>
              <div className={styles.changeBox} hidden={this.state.coorvis}>
                <div hidden={this.state.coorvis1}>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经度：</label>
                  <Input style={{ width: 200, marginBottom: 10, borderColor: "#00ffff" }} onChange={this.lonChange}/>
                  <span className={styles.changetype} onClick={this.changeDanwei} title={"切换为度分秒"}><Icon
                    type="swap"/></span>
                  <br/>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纬度：</label>
                  <Input style={{ width: 200, borderColor: "#00ffff" }} onChange={this.latChange}/>
                </div>
                <div hidden={!this.state.coorvis1}>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经度：</label>
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.lonChangeA}/>&nbsp;&nbsp;度&nbsp;&nbsp;
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.lonChangeB}/>&nbsp;&nbsp;分&nbsp;&nbsp;
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.lonChangeC}/>&nbsp;&nbsp;秒
                  <span className={styles.changetype} onClick={this.changeDanwei} title={"切换为十进制"}><Icon
                    type="swap"/></span>
                  <br/>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纬度：</label>
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.latChangeA}/>&nbsp;&nbsp;度&nbsp;&nbsp;
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.latChangeB}/>&nbsp;&nbsp;分&nbsp;&nbsp;
                  <Input style={{ width: 50, marginBottom: 10, borderColor: "#00ffff" }}
                         onChange={this.latChangeC}/>&nbsp;&nbsp;秒
                </div>
              </div>

              <div className={styles.changeBox} hidden={this.state.tablevis}>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件：</label>
                <Upload  {...props} fileList={this.state.fileList}>
                  <Button>
                    <Icon type="upload"/>上传表格文件
                  </Button>
                </Upload>
              </div>
              <div className={styles.changeBox} hidden={this.state.vectorvis}>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件：</label>
                <Upload {...props2} fileList={this.state.fileList}>
                  <Button>
                    <Icon type="upload"/>上传矢量文件
                  </Button>
                </Upload>
              </div>
              <div className={styles.changeBox} hidden={this.state.datavis}>
                <label>选择数据：</label>
                <Select
                  showSearch
                  style={{ width: 250 }}
                  placeholder="请选择"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onChangeTime} value={this.state.timephaseid}
                >
                  <Option value="">请选择</Option>
                  {pp2}
                </Select>
              </div>
              <div style={{ "marginTop": "5px" }}><label>&nbsp;&nbsp;&nbsp;&nbsp;缓冲区：</label>
                <InputNumber min={0} defaultValue={0} onChange={this.onChangeradius}/>&nbsp;m
              </div>
              <hr style={{ border: "0.5px solid #13c2c2" }}/>
              <label>对比时相：</label>
              <Select
                showSearch
                style={{ width: 250 }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.onChangeTime2} value={this.state.timephaseid2}
              >
                <Option value="">请选择</Option>
                {pp}
              </Select>
            </div>
          </Modal>
          <Modal
            title="属性表"
            visible={this.state.visible2}
            footer={null}
            mask={true}
            maxable={false}
            minable={false}
            onCancel={this.propertyTabClose}
            className={styles.shapelist}
          >
            <Table columns={this.state.shiliang?columns3:columns2} bordered dataSource={rsdatacontract} scroll={{ x: 1500 }}/>
          </Modal>
        </div>
      </LocaleProvider>
    );
  }
  ;
}

ContrastRSDataModal.propTypes = {
  visible: PropTypes.bool
};

