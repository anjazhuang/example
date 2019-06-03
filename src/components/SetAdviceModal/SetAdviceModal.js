/* global Cesium */
import styles from './SetAdviceModal.less';
import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Form, Upload, Input, Spin, Icon, Table } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
let yy = [];

@Form.create()
export default class SetAdviceModal extends Component {
  state = {
    visible: false,
    humanact: [],
    protectedarea: "",//保护地名称
    timephaseid: "",//时相
    loading: false,//表格加载
    list: [],//表格列表
    type: '',//管理员级别
    checkopinion: "",//复核意见
    firstcheckopinion: "",//初核意见
    checkstatus: 0,//复核状态
    id: 0,//保存id,
    page: 1,
    unit: ""
  };

  setadviceModalClose = () => {
    const { dispatch, cesiumControl, layerhad, layerhad2, saveLayer } = this.props;
    let savelayer = saveLayer;
    savelayer.splice(saveLayer.indexOf("处置意见"), 1);
    if (savelayer.length == 0) {
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    global.viewer.dataSources._dataSources.forEach((v) => {
      if ((v._name) === "处置意见图层") {
        global.viewer.dataSources.remove(v);
        //notification.close(item);
      }
    });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        setAdviceModalShow: false,
        layermanagerhidden: false,
        layerMap2: false
      }
    });
    this.setState({
      list: [],
      protectedarea: "",//保护地名称
      timephaseid: "",//时相
      type: '',//管理员级别
      checkopinion: "",//复核意见
      firstcheckopinion: "",//初核意见
      checkstatus: 0,//复核状态
      id: 0,//保存id
    })
    cesiumControl.showLayer(layerhad, layerhad2);
    cesiumControl.removwConstractSetAdvice();
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
      // humanact: nextProps.layerListHumanActiviy
    });
  }

  onChangeprotect = (d) => {
    this.setState({
      protectedarea: d
    }, () => {
      if (this.props.layerListHumanActiviy.length > 0) {
        if (localStorage.getItem('rolegradeid') == 1) {
          let tubanImage = this.props.layerListHumanActiviy.filter(function (v) {
            return v.type === 1 && v.protectedareaid == d
          });
          this.setState({
            humanact: tubanImage
          })
        } else {
          let tubanImage = this.props.layerListHumanActiviy.filter(function (v) {
            return v.type === 1 && v.protectedareaid == localStorage.getItem('protectedareaid')
          });
          this.setState({
            humanact: tubanImage
          })
        }

      }
    });
  }

  onChangetime = (v) => {
    this.setState({
      timephaseid: v
    });
  }


  Uploaddata = () => {
    // console.log(this.state.timephaseid, this.state.protectedarea);
    const { cesiumControl, dispatch, tubanShape3 } = this.props;
    if (this.state.timephaseid !== "") {
      this.setState({
        loading: true
      })
      // cesiumControl.verificationlayers(this.state.changeLayer)
      dispatch({
        type: "indexPage/allTuban",
        payload: {
          parameterObject: {
            layerId: this.state.timephaseid,
            protectedareaid: this.state.protectedarea
          }
        },
        callback: (res) => {
          if (res) {
            if (res.code === 0) {
              if (localStorage.getItem('rolegradeid') == 2) {
                //保护地管理员
                this.setState({
                  list: res.data,
                  loading: false,
                  type: "2",
                  unit: res.data.length > 0 ? res.data[0].scaleUnit : ""
                });
              }
              else if (localStorage.getItem('rolegradeid') == 1) {
                //省级管理员
                let data = res.data;
                //   .filter((v, i) => {
                //   return v.firstcheckopinion !== null//初核意见不为空
                // });
                this.setState({
                  list: data,
                  loading: false,
                  type: "1",
                  unit: res.data.length > 0 ? res.data[0].scaleUnit : ""
                });
              }
              let geo = {
                "type": "FeatureCollection", "features": []
              }
              res.data.map((v, i) => {
                //console.log(JSON.parse(v.geometry)[0]);
                let feature = JSON.parse(v.geometry)[0];
                feature['properties'].status = v.status;
                // console.log(feature)
                geo.features.push(feature);
              });
              //console.log(geo);
              cesiumControl.setAdvicemap(geo);
            }
          }
        }
      });
      dispatch({
        type: "indexPage/allImage",
        payload: {
          id: this.state.timephaseid
        },
        callback: (res) => {
          if (res) {
            if (res.code === 0) {
              //console.log(res);
              if (Object.keys(res.data).length > 0) {
                cesiumControl.imageConstratSetAdvice(res.data.qimage + "?f=pjson", res.data.himage + "?f=pjson");
              } else {
                cesiumControl.removwConstractSetAdvice();
                message.warn("该活动图层无相关影像")
              }
            }
            else {
              message.error("该活动图层影像返回出现异常")
            }
          }
        }
      });

    } else {
      message.warn("请选择时相")
    }
  }

  Save = () => {
    let payload;
    let list2 = this.state.list;
    let uploadata = list2.filter((item, key) => {
      return item.ischange === true
    });
    let uploadata2 = [];
    console.log(uploadata);
    const { cesiumControl, dispatch } = this.props;
    this.setState({
      loading: true
    })
    if (localStorage.getItem('rolegradeid') == 1) {
      uploadata2 = [];
      uploadata.forEach((v) => {
        payload = {
          checkopinion: v.checkopinion,
          checkstatus: v.checkstatus,
          id: v.id,
          firstcheckopinion: v.firstcheckopinion,
        }
        uploadata2.push(payload)
      });
      dispatch({
        type: "indexPage/SaveCheckOpinion",
        payload: uploadata2,
        callback: (res) => {
          if (res) {
            // console.log(res)
            if (res.code === 0) {
              message.success("提交成功");
              list2.forEach((v) => {
                if (v.ischange) {
                  v.ischange = false
                }
              })
              this.setState({
                loading: false,
                list: list2,
              });
            } else {
              message.error(res.msg);
              this.setState({
                loading: false
              })
            }
          }
        }
      })
    } else {
      uploadata2 = [];
      uploadata.forEach((v) => {
        payload = {
          checkopinion: v.checkopinion,
          checkstatus: v.checkstatus,
          id: v.id,
          firstcheckopinion: v.firstcheckopinion,
        }
        uploadata2.push(payload)
      });
      dispatch({
        type: "indexPage/SaveFirstCheckOpinion",
        payload: uploadata2,
        callback: (res) => {
          if (res) {
            // console.log(res)
            if (res.code === 0) {
              message.success("提交成功");
              list2.forEach((v) => {
                if (v.ischange) {
                  v.ischange = false
                }
              })
              this.setState({
                loading: false,
                list: list2,
              });
            } else {
              message.error(res.msg);
              this.setState({
                loading: false
              })
            }
          }
        }
      })
    }

  }

  changeOption = (i, e) => {
    console.log(e)
    console.log(i);
    let list = this.state.list;
    for (let index = 0; index < list.length; index++) {
      if (list[index].id == i) {
        list[index].checkopinion = e.target.value;
        list[index].ischange = true
      }
    }
    this.setState({
      checkopinion: e.target.value,
      id: i,
      list: list
    })
  }

  changeOption2 = (i, e) => {
    // alert(e.target.id.replace("a",""))
    console.log(e)
    console.log(i);
    let list = this.state.list;
    for (let index = 0; index < list.length; index++) {
      if (list[index].id == i) {
        list[index].firstcheckopinion = e.target.value;
        list[index].ischange = true
      }
    }
    // let newtt = this.state.list.filter((item, key) => {
    //   return item.id === i
    // })[0];
    // console.log(newtt.firstcheckopinion = e.target.value);
    // console.log(newtt.ischange = true);
    // console.log(newtt);
    // yy.push(newtt);
    this.setState({
      firstcheckopinion: e.target.value,
      id: i,
      list: list
    })
  }

  changestatus = (v, i) => {
    // console.log(i)
    let list = this.state.list;
    for (let index = 0; index < list.length; index++) {
      if (list[index].id == i.key) {
        list[index].checkstatus = v;
        list[index].ischange = true
      }
    }
    this.setState({
      checkstatus: v,
      id: i.key,
      list: list
    })
  }

  layerChose = (data) => {
    return data.map((v, i) => {
      if (v.layers.length > 0) {
        return (
          <Option value={v.id} key={v.layers[0].id} title={v.layers[0].filepath}>{v.layers[0].name}</Option>
        )
      }
    });
  }

  render() {
    const { layerListHumanActiviy, protectAreaid } = this.props;
    console.log(this.state.unit);
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const type = (v) => {
      switch (v) {
        case 0:
          return '同意'
          break;
        case 1:
          return '不同意'
          break;
        case 2:
          return '其他'
          break;
      }
    }
    const columns = [{
      title: '序号',
      render: (text, record, index) => `${(this.state.page - 1) * 10 + index + 1}`,
      align: "center"
    }, {
      title: '位置',
      dataIndex: 'address',
      key: 'address',
      align: "center",
      className: "site"
    }, {
      title: '人类活动类型',
      key: 'activitytype',
      align: "center"
    },
      {
        title: '规模(' + this.state.unit + ')',
        dataIndex: 'scale',
        key: 'scale',
        align: "center"
      }
      // , {
      //   title: '变化类型',
      //   dataIndex: 'type',
      //   key: 'type',
      //   align: "center"
      // }
      ,
      {
        title: '变化情况',
        dataIndex: 'changeqk',
        key: 'changeqk',
        align: "center"
      }, {
        title: '功能区划',
        dataIndex: 'functionalzone',
        key: 'functionalzone',
        align: "center"
      }, {
        title: '初核意见',
        dataIndex: 'firstcheckopinion',
        key: 'firstcheckopinion',
        align: "center",
        render: (val, record) => {
          if (record.checkstatus !== null && this.state.type == "2") {
            return (
              <span>{val}</span>
            )
          } else {
            return (
              <Form>
                <Form.Item>
                  {getFieldDecorator('a' + record.id, {
                    // rules: [{ required: true, message: 'Please input your username!' }],
                    initialValue: record.firstcheckopinion,
                  })(
                    <Input style={{ width: 200 }} id={record.id} onChange={
                      this.changeOption2.bind(this, record.id)}/>
                  )}
                </Form.Item>
              </Form>

            )
          }
        }
      }, {
        title: '初核时间',
        dataIndex: 'firstchecktime',
        key: 'firstchecktime',
        align: "center",
        render: val => <span>{val !== null ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ""}</span>
      }, {
        title: '复核状态',
        dataIndex: 'checkstatus',
        key: 'checkstatus',
        align: "center",
        render: (val, record) => {
          if (this.state.type == "1") {
            return (
              <Form>
                <Form.Item>
                  {getFieldDecorator('b' + record.id, {
                    // rules: [{ required: true, message: 'Please input your username!' }],
                    initialValue: val,
                  })(
                    <Select
                      showSearch
                      style={{ width: 92 }}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      defaultValue={val}
                      onChange={this.changestatus}
                    >
                      <Option value={0} key={record.id}>不同意</Option>
                      <Option value={1} key={record.id}>同意</Option>
                      <Option value={2} key={record.id}>其他</Option>
                    </Select>
                  )}
                </Form.Item>
              </Form>

            )
          } else {
            return (
              <span>{type(val)}</span>
            )
          }
        }
      }, {
        title: '复核意见',
        dataIndex: 'checkopinion',
        key: 'checkopinion',
        align: "center",
        render: (text, record) => {
          if (this.state.type == "1") {
            return (
              <Form>
                <Form.Item>
                  {getFieldDecorator('c' + record.id, {
                    // rules: [{ required: true, message: 'Please input your username!' }],
                    initialValue: text,
                  })(
                    <Input style={{ width: 200 }} disabled={this.state.type == "2" ? true : false}
                           onChange={this.changeOption.bind(this, record.id)}/>
                  )}
                </Form.Item>
              </Form>
            )
          } else {
            return (
              <span>{text}</span>
            )
          }
        }
      }, {
        title: '复核时间',
        dataIndex: 'checktime',
        key: 'checktime',
        align: "center",
        render: val => <span>{val !== null ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ""}</span>
      }];

    let pp = "", pp2 = "";
    if (layerListHumanActiviy.length > 0) {
      let tubanImage = layerListHumanActiviy.filter(function (v) {
        return v.type === 1 && v.protectedareaid == localStorage.getItem('protectedareaid')
      });
      pp = tubanImage.map((v, i) => {
        if (v.layers.length > 0) {
          return (
            <Option value={v.id} key={v.layers[0].id} title={v.layers[0].filepath}>{v.layers[0].name}</Option>
          )
        }
      });
    }

    pp2 = protectAreaid.map((v, i) => {
      return (
        <Option value={v.id}>{v.name}</Option>
      )
    })
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="处置意见"
          visible={this.state.visible}
          onCancel={this.setadviceModalClose}
          footer={null}
          maxable={true}
          minable={true}
          className={styles.list}
        >
          <div>
            {/*<Row>*/}
            {/*<div className={styles.loading} hidden={!this.state.loading}>*/}
            {/*<Spin spinning={this.state.loading} delay={500}*/}
            {/*indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}/>*/}
            {/*</div>*/}
            <div className={styles.tabbox}>
              <span hidden={localStorage.getItem('rolegradeid') == 1 ? false : true}>
              <label>保护地名称：</label>
                {/*<Col span={7}>*/}
                <Select
                  showSearch
                  style={{ width: 200, marginRight: "20px" }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onChangeprotect}
                  value={this.state.protectedarea}
                >
                <Option value="">请选择</Option>
                  {pp2}
              </Select>
              </span>
              {/*</Col>*/}
              {/*<Col span={3} style={{ paddingLeft: 10,paddingTop:"5px"}}>*/}
              <label>活动变化：</label>
              {/*</Col>*/}
              {/*<Col span={8}>*/}
              <Select
                showSearch
                style={{ width: 220 }}
                placeholder="请选择"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.onChangetime}
                value={this.state.timephaseid}
              >
                {localStorage.getItem('rolegradeid') == 1 ? this.layerChose(this.state.humanact) : pp}
              </Select>
              {/*</Col>*/}
              {/*<Col span={1}/>*/}
              <Button className={styles.btn} onClick={this.Uploaddata}>完成</Button>
              <Button onClick={this.Save} className={styles.btn}
                      hidden={this.state.list.length > 0 ? false : true}
              >保存</Button>
              {/*</Row>*/}
            </div>
            <Table columns={columns} dataSource={this.state.list} loading={this.state.loading}
                   scroll={{ x: this.state.list.length > 0 ? 1130 : false }}
                   onChange={(page) => {
                     this.setState({
                       page: page.current
                     })
                   }}
                   onRow={(record) => {
                     return {
                       onClick: () => {
                         global.viewer.camera.flyTo({
                           destination: Cesium.Cartesian3.fromDegrees(record.longitude, record.latitude, 210),
                         });

                       },
                     };
                   }}
            />
          </div>
        </Modal>
      </LocaleProvider>
    )
      ;
  };
}
SetAdviceModal.propTypes = {
  visible: PropTypes.bool
};


