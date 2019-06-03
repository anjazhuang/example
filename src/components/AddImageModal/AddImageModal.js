import styles from './AddImageModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Upload, Icon, Input } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

export default class AddImageModal extends Component {
  state = {
    visible: false,
    url:"",//地图url
    protectedarea:null,//保护地
    time:new Date().Format("yyyy-MM-dd"),//时间
    source:"",//来源
    name:""//名称
  };

  addImageModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        addImageModalShow: false
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

  uploadImage=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/AddImage',
      payload: {
        bussinesstype:"保护地影像",
        createtime:this.state.time,
        protectedarea:this.state.protectedarea,
        source:this.state.source,
        url:this.state.url,
        name:this.state.name
      }
    });
  }

  nameChange=(e)=>{
    this.setState({
      name:e.target.value
    })
  }

  urlChange=(e)=>{
    this.setState({
      url:e.target.value
    })
  }

  protectedChange=(v)=>{
    this.setState({
      protectedarea:v
    })
  }

  timeChange=(v,s)=>{
    this.setState({
      time:s
    })
  }

  sourceChange=(v)=>{
    this.setState({
      source:v
    })
  }
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="添加影像数据"
          visible={this.state.visible}
          onCancel={this.addImageModalClose}
          style={{ top: 200 }}
          footer={<Button className={styles.btn} onClick={this.uploadImage}>上传</Button>}
          maxable={false}
          minable={false}
          width={500}>
          <div>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称：</label>
            <Input style={{ width: 120 }} onChange={this.nameChange}/>
            <br/><br/>
            <label>&nbsp;地图服务URL：</label>
            <Input style={{ width: 252 }} onChange={this.urlChange}/>
            <br/><br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;保护地名称：</label>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.protectedChange}
            >
              <Option value="五鹿山">五鹿山</Option>
            </Select>
            <br/><br/>
            <label>影像拍摄日期：</label><DatePicker defaultValue={moment(new Date(), dateFormat)}
                                              format={dateFormat} onChange={this.timeChange}/><br/><br/>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;影像来源：</label>
            <Select
              showSearch
              style={{ width: 170 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.sourceChange}
            >
              <Option value="GF1">GF1</Option>
              <Option value="GF2">GF2</Option>
              <Option value="STOP">STOP</Option>
            </Select>
          </div>

        </Modal>
      </LocaleProvider>
    );
  };
}

AddImageModal.propTypes = {
  visible: PropTypes.bool
};

