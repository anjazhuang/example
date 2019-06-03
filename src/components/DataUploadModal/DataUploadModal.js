import styles from './DataUploadModal.less';
import React, { Component } from 'react';
import fetch from 'dva/fetch';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, InputNumber, Upload, Input, Row, Col, Icon } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { config } from '../../utils';

const { apiUrl } = config;

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

const { TextArea } = Input;
let pp2;

export default class DataUploadModal extends Component {
  state = {
    visible: false,//弹窗关闭
    fileList: [],//图片上传文件
    fileListTrail: [],//轨迹文件上传
    uploading: false,
    timephaseid: 0,//时相id
    taskTuban: [],//已创建任务图斑
    geoJson: "",
    id: null,
    spots: "",//图斑
    protectplace: null,//保护地
    acticity: "",//活动名称
    actType: "",//活动类型
    site: "",//活动位置
    size: "",//规模
    area: "",//功能区
    history: "",//历史沿革
    process: "",//坏评手续
    status: "",//破坏情况
    remark: "",//备注
  };

  datauploadModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        dataUploadModalShow: false
      }
    });
  }

  handleUpload = () => {
    const { fileList, fileListTrail } = this.state;
    const { dispatch } = this.props;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file[]', file);
    });

    const formData2 = new FormData();
    formData2.append('file', fileListTrail[0].originFileObj);
    this.setState({
      uploading: true,
    });
    // console.log(fileListTrail[0]);
    dispatch({
      type: 'indexPage/submitTask', payload: {
        para: {
          id: this.state.id,
          activityname: this.state.acticity,//活动名称
          activitytype: this.state.actType,//活动类型
          address: this.state.site,//位置
          protectedarea: this.state.protectplace,//保护地
          timephaseid: this.state.timephaseid,//时相
          remark: this.state.remark,//备注
          spots: this.state.spots,//图斑
          procedure: this.state.process,//环评
          condition: this.state.status,//生态影响
          functionlazone: this.state.area,//功能区
          scale: this.state.size,//规模
          evolution: this.state.history,//历史沿革
          // pictureids:"1,2",
          // trackids:"1"
        }, data1: formData, data2: formData2, id: this.state.id
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
      visible: nextProps.visible,
      taskTuban: nextProps.taskTuban,
    });
  }

  timeidChose = (v, e) => {
    this.setState({
      timephaseid: e.props.value,
      geoJson: e.props.title
    }, () => {
      fetch(apiUrl + this.state.geoJson)
        .then((res) => res.json())
        .then((data) => {
          // console.log('data:', data);
          this.props.dispatch({
            type: 'indexPage/allTuban',
            payload: {
              para: {
                pageIndex: 1,
                pageSize: 99999,
                parameterObject: { timephaseid: this.state.timephaseid }
              }, geojson: data
            },
          });
        })
    });
  }

  timeidChose2 = (v,e) => {
    this.setState({
      spots: e.props.value,
      id: e.props.title
    });
  }

  handleChangefileListTrail = (info) => {
    let fileListTrail = info.fileList;
    fileListTrail = fileListTrail.slice(-1);
    this.setState({ fileListTrail });
  }

  protectarea = (e) => {
    this.setState({
      protectplace: e.target.value
    })
  }

  acticity = (e) => {
    this.setState({
      acticity: e.target.value
    })
  }

  actType = (v) => {
    this.setState({
      actType: v
    })
  }

  site0 = (e) => {
    this.setState({
      site: e.target.value
    })
  }

  size0 = (e) => {
    this.setState({
      size: e.target.value
    })
  }

  area0 = (e) => {
    this.setState({
      area: e.target.value
    })
  }

  history0 = (e) => {
    this.setState({
      history: e.target.value
    })
  }

  process0 = (e) => {
    this.setState({
      process: e.target.value
    })
  }
  status0 = (e) => {
    this.setState({
      status: e.target.value
    })
  }

  remark0 = (e) => {
    this.setState({
      remark: e.target.value
    })
  }


  render() {
    const { layerList, taskTuban } = this.props;
    // console.log(taskTuban);
    let pp2 = <Option value="00">无图斑</Option>;
    let tubanImage = layerList.filter(function (v) {
      return v.bussinesstype === "人类活动数据"
    });
    const pp = tubanImage.map((v, i) => {
      return (
        <Option value={v.id} key={v.id} title={v.path}>{v.name}</Option>
      )
    });
    if (taskTuban !== undefined) {
      pp2 = taskTuban.map((v, i) => {
        return (
          <Option title={v.id} key={v.id} value={v.spot}>{v.spot}</Option>
        )
      });
    }

    const props = {
      accept:"image/*",
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      className: 'upload-list-inline',
      onRemove: (file) => {
        // alert("dd");
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
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
    };
    const props2 = {
      // name: 'file',
      multiple: false,
      // action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        // alert("dd");
        this.setState(({ fileListTrail }) => {
          const index2 = fileListTrail.indexOf(file);
          const newFileList2 = fileListTrail.slice();
          newFileList2.splice(index2, 1);
          return {
            fileListTrail: newFileList2,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileListTrail }) => ({
          fileListTrail: [...fileListTrail, file],
        }));
        return false;
      },
      onChange: this.handleChangefileListTrail
    };
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="数据上传"
          visible={this.state.visible}
          onCancel={this.datauploadModalClose}
          footer={[<Button className={styles.bigbtn} onClick={this.handleUpload}>上传</Button>]}
          maxable={false}
          minable={false}
          className={styles.list}>
          <div>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择图斑</label>
            <Select defaultValue="" style={{ width: 228, marginLeft: 21 }} onChange={this.timeidChose}>
              <Option value="">选择时相</Option>
              {pp}
            </Select>
            <Select defaultValue="" style={{ width: 120, marginLeft: 10 }} onChange={this.timeidChose2}>
              <Option value="">选择图斑</Option>
              {pp2}
            </Select>
            <br/><br/>
            <Row>
              <Col span={3}>核查信息上传</Col>
              <Col span={18}>
                <label>保护地名称：</label><Input style={{ width: 200 }} onChange={this.protectarea}/>
                <br/><br/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;活动名称：</label><Input style={{ width: 100 }}
                                                                   onChange={this.acticity}/>&nbsp;&nbsp;
                <label>活动类型：</label>
                <Select defaultValue="农业用地" style={{ width: 120 }} onChange={this.actType}>
                  <Option value="农业用地">农业用地</Option>
                  <Option value="道路">道路</Option>
                </Select>
                <br/><br/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位置：</label><Input
                style={{ width: 80 }} onChange={this.site0}/> <label>&nbsp;&nbsp;&nbsp;&nbsp;规模：</label><Input
                style={{ width: 80 }} onChange={this.size0}/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;功能区：</label><Input style={{ width: 80 }} onChange={this.area0}/>
                <br/><br/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;历史沿革：</label><Input style={{ width: 200 }} onChange={this.history0}/>
                <br/><br/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;环评手续：</label><Input
                style={{ width: 80 }} onChange={this.process0}/><label>&nbsp;&nbsp;&nbsp;&nbsp;
                生态影响及破坏情况：</label><TextArea rows={1} style={{
                width: 180,
                verticalAlign: "top"
              }} onChange={this.status0}/>
                <br/><br/>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注：</label><TextArea rows={1}
                                                                                                              style={{
                                                                                                                width: 180,
                                                                                                                verticalAlign: "top"
                                                                                                              }}
                                                                                                              onChange={this.remark0}/>
              </Col>
            </Row>
            <br/>
            <label>核查轨迹上传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <Upload {...props2} fileList={this.state.fileListTrail}>
              <Button>
                <Icon type="upload"/> 浏览
              </Button>
            </Upload>
            <br/>
            <label>核查照片上传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <Upload multiple {...props}>
              <Button>
                <Icon type="upload"/> 浏览
              </Button>
            </Upload>
          </div>
        </Modal>
      </LocaleProvider>
    );
  };
}

DataUploadModal.propTypes = {
  visible: PropTypes.bool
};

