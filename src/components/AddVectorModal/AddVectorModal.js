import styles from './AddVectorModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, Upload, Icon, Input } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class AddVectorModal extends Component {
  state = {
    visible: false,
    fileList: [],
    vectorname: "",//矢量名称
    protectedplace: "",//保护地名称
    datatype: "",//数据类型
  };

  addVectorModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        addVectorModalShow: false
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

  handleChangefileList = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  }

  vectorName = (e) => {
    this.setState({
      vectorname: e.target.value
    })
  }

  protectplace = (v) => {
    this.setState({
      protectedplace: v
    })
  }

  dataType = (v) => {
    this.setState({
      datatype: v
    })
  }

  uploadData = () => {
    const { fileList } = this.state;
    // console.log(fileList[0].originFileObj);
    const { dispatch } = this.props;
    let formData = new FormData();
    // fileList.forEach((file, i) => {
    //     formData.append('file', file);
    // });
    formData.append('file', fileList[0].originFileObj);
    dispatch({
      type: 'indexPage/AddVector', payload: {
        para: {
          name: this.state.vectorname,
          bussinessType: this.state.datatype,
          protectedArea: this.state.protectedplace
        }, data: formData
      }
    });
    // console.log(this.state.fileList, this.state.vectorname, this.state.protectedplace, this.state.datatype)
  }

  render() {
    const props = {
      // name: 'file',
      multiple: false,
      action: "",
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
          title="添加矢量文件"
          visible={this.state.visible}
          onCancel={this.addVectorModalClose}
          style={{ top: 200 }}
          footer={<Button className={styles.btn} onClick={this.uploadData}>上传</Button>}
          maxable={false}
          minable={false}
          width={500}>
          <div>
            <label>选择矢量文件：</label>
            <Upload {...props} fileList={this.state.fileList}>
              <Button>
                <Icon type="upload"/> 浏览
              </Button>
            </Upload>
            <br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;矢量名称：</label>
            <Input style={{ width: 200 }} onChange={this.vectorName}/>
            <br/>
            <br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;保护地名称：</label>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.protectplace}
            >
              <Option value="五鹿山">五鹿山</Option>
            </Select>
            <br/><br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数据类型：</label>
            <Select
              showSearch
              style={{ width: 170 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.dataType}
            >
              <Option value="基础地理信息">基础地理信息</Option>
              <Option value="保护地信息">保护地信息</Option>
              <Option value="小班数据">小班数据</Option>
              <Option value="人类活动数据">人类活动数据</Option>
              <Option value="人类活动变化数据">人类活动变化数据</Option>
              <Option value="其他">其他</Option>
            </Select>
          </div>
        </Modal>
      </LocaleProvider>
    );
  };
}

AddVectorModal.propTypes = {
  visible: PropTypes.bool
};

