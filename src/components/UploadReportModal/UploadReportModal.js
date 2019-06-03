import styles from './UploadReportModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal,LocaleProvider,DatePicker,Button,Select, Upload,Icon,Input  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class UploadReportModal extends Component {
  state = { visible: false };

  uploadreporteModalClose = () => {
    const {dispatch}=this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        uploadReportModalShow: false
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

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="报告上传"
          visible={this.state.visible}
          onCancel={this.uploadreporteModalClose}
          style={{ top: 200 }}
          footer={<Button className={styles.btn}>上传</Button>}
          maxable={false}
          minable={false}
          width={600}>
          <div>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加：</label>
            <Upload multiple>
              <Button>
                <Icon type="upload" /> 浏览
              </Button>
            </Upload>
            <br/>
            <label>保护地名称：</label>
            <Input style={{ width: 200 }} placeholder="单行输入"/>&nbsp;&nbsp;
            <label>人类活动变化时相：</label>
            <Input style={{ width: 150}}/>
            <br/><br/>
            <label>&nbsp;&nbsp;&nbsp;报告类型：</label>
            <Select
              showSearch
              style={{ width: 150 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="遥感监测报告">遥感监测报告</Option>
            </Select>
            <br/><br/>
            <label>&nbsp;&nbsp;&nbsp;报告名称：</label>
            <Input style={{ width: 350 }}/>
          </div>
        </Modal>
      </LocaleProvider>
    );
  };
}

UploadReportModal.propTypes = {
  visible: PropTypes.bool
};

