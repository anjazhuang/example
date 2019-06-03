import styles from './AddReportModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, Spin, Input, message, Icon } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY';

export default class AddReportModal extends Component {
  state = {
    visible: false,
    value: moment(new Date(), dateFormat),
    area: "",//保护地
    reportType: "",//报告类型
    year: "",//监测年份
    times: "",//监测频次
    title: "",//报告名称
    loading: false,//加载条
  };

  addReportModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        addReportModalShow: false
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

  handlePanelChange = (value, s) => {
    // console.log(value);
    this.setState({
      value,
      year: JSON.stringify(value._d).split("T")[0].split("-")[0].replace("\"", "")
    });
  }

  onChangeArea = (v) => {
    this.setState({
      area: v
    })
  }

  changetitle = (e) => {
    this.setState({
      title: e.target.value
    })
  }
  onChangeType = (v) => {
    this.setState({
      reportType: v
    })
  }


  onChangeTimes = (v) => {
    this.setState({
      times: v.target.value
    })
  }

  reportBuild = () => {
    const formData = new FormData();
    let year = /^\d{4}$/;
    if (this.state.title !== "" && this.state.times !== "" && this.state.area !== "" && this.state.reportType !== "" && this.state.year !== "") {
      if (!year.test(this.state.year)) {
        message.warn("请输入正确的年份")
      } else {
        this.setState({
          loading: true
        });
        formData.append('title', this.state.title);
        formData.append('jcpc', this.state.times);
        formData.append('protectedareaid', this.state.area);
        formData.append('type', this.state.reportType);
        formData.append('jcnf', this.state.year);
        this.props.dispatch({
          type: 'indexPage/reportAdd',
          // payload: {
          //   // title: this.state.searchValue !== "" ? this.state.searchValue : ""
          //   protectedareaid:this.state.area,
          //   jcpc:this.state.times,
          //   type:this.state.reportType,
          //   jcnf:this.state.year
          // },
          payload: formData,
          callback: (res) => {
            if (res) {
              if (res.code == 0) {
                message.success("报告生成！");
                this.setState({
                  loading: false
                });
              } else {
                message.error(res.msg);
                this.setState({
                  loading: false
                });
              }
            }
          }
        })
      }
    } else {
      if (this.state.title == "") {
        message.warn("请输入报告名称")
      } else if (this.state.area == "") {
        message.warn("请选择保护地")
      } else if (this.state.reportType == "") {
        message.warn("请选择报告类型")
      } else if (this.state.year == "") {
        message.warn("请输入监测年份")
      } else if (this.state.times == "") {
        message.warn("请输入监测批次")
      }
    }
    // console.log(this.state.year, this.state.area, this.state.times, this.state.reportType)
  }

  changeyear = (v, s) => {
    this.setState({
      year: v.target.value
    })
  }

  render() {
    let pp = "";
    pp = this.props.protectAreaid.map((v, i) => {
      return (
        <Option value={v.id}>{v.name}</Option>
      )
    })
    return (
      <div>
        <Modal
          title="报告生成"
          visible={this.state.visible}
          onCancel={this.addReportModalClose}
          style={{ top: 200 }}
          footer={[<Button className={styles.bigbtn} onClick={this.reportBuild}>报告生成</Button>]}
          maxable={false}
          minable={false}
          className={styles.list}>
          <div>
            <div className={styles.loading} hidden={!this.state.loading}>
              <Spin spinning={this.state.loading} delay={500}
                    indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}/>
            </div>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;报告名称：</label>
            <Input
              placeholder="请输入"
              style={{ width: 150 }}
              onChange={this.changetitle}
            /><br/><br/>
            <label>保护地名称：</label>
            <Select
              showSearch
              style={{ width: 150 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.onChangeArea}
            >
              {pp}
            </Select>&nbsp;&nbsp;&nbsp;&nbsp;
            <label>报告类型：</label>
            <Select
              showSearch
              style={{ width: 150 }}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.onChangeType}
            >
              <Option value="remoteSense">遥感监测报告</Option>
              <Option value="field">实地核查报告</Option>
              <Option value="account">台账</Option>
              <Option value="other">其他</Option>
            </Select>
            <br/><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label>监测年份：</label>
            <Input
              placeholder="请输入"
              style={{ width: 150 }}
              onChange={this.changeyear}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <label>监测批次：</label>
            {/*<Select*/}
            {/*showSearch*/}
            {/*style={{ width: 150 }}*/}
            {/*placeholder="请选择"*/}
            {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
            {/*onChange={this.onChangeTimes}*/}
            {/*>*/}
            {/*<Option value="4">4</Option>*/}
            {/*</Select>*/}
            <Input
              placeholder="请输入"
              style={{ width: 150 }}
              onChange={this.onChangeTimes}
            />
          </div>
        </Modal>

      </div>
    );
  };
}

AddReportModal.propTypes = {
  visible: PropTypes.bool
};

