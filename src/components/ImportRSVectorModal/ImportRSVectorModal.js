import styles from './ImportRSVectorModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, InputNumber, Input, Upload, Icon } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;

export default class ImportRSVectorModal extends Component {
  state = {
    visible: false,
    fileList: [],
    timephaseid:0,//时相
    radius:0,//缓冲
  };

  importRSVectorModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        importRSVectorModalShow: false
      }
    });
  }

  handleChangefileList = (info) => {
    let fileListTrail = info.fileList;
    fileListTrail = fileListTrail.slice(-1);
    this.setState({ fileListTrail });
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });
  }

  changeRadius=(v)=>{
    this.setState({
      radius:v
    });
  }

  changeTime=(v)=>{
    this.setState({
      timephaseid:v
    })
  }

  Viewss=()=>{
    // console.log(this.state.fileList,this.state.timephaseid,this.state.radius)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  render() {
    const { layerList } = this.props;
    let tubanImage = layerList.filter(function (v) {
      return v.bussinesstype === "人类活动数据"
    });
    const pp = tubanImage.map((v, i) => {
      return (
        <Option value={v.id} key={v.id} title={v.path}>{v.name}</Option>
      )
    });
    const props = {
      name: 'file',
      multiple: false,
      action: '//jsonplaceholder.typicode.com/posts/',
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
      onChange: this.handleChangefileList
    };
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="矢量导入"
          visible={this.state.visible}
          onCancel={this.importRSVectorModalClose}
          style={{ top: 200 }}
          footer={[<Button className={styles.bigbtn} onClick={this.Viewss}>加载预览</Button>, <Button className={styles.bigbtn}>导入数据库</Button>]}
          maxable={false}
          minable={false}
          width={500}>
          <div>
            <label>选择矢量文件：</label>
            <Upload multiple {...props}>
              <Button>
                <Icon type="upload"/>浏览
              </Button>
            </Upload>
            <br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择时相：</label>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.changeTime}
            >
              {pp}
            </Select>
            <br/><br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缓冲区：</label>
            <InputNumber min={0} defaultValue={0} onChange={this.changeRadius}/>&nbsp;m
          </div>

        </Modal>
      </LocaleProvider>
    );
  };
}

ImportRSVectorModal.propTypes = {
  visible: PropTypes.bool
};

