import styles from './ContrastImageModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Upload, Input, Row, Col, Icon } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class ContrastImageModal extends Component {
  state = {
    visible: false,
    image: "",
    image2: "",
    clickstate: false,//判断是否已经选择对比
    protect: ""
  };

  constrastImageModalClose = () => {
    const {
      dispatch, layerhad,
      layerhad2
    } = this.props;
    const { cesiumControl } = this.props;
    cesiumControl.removwConstract();
    cesiumControl.showLayer(layerhad, layerhad2)
    this.setState({
      clickstate: false,
      image: "",
      image2: "",
    });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        contrastImageModalShow: false,
        layermanagerhidden: false
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

  excute = () => {
    const { cesiumControl } = this.props;
    if (!this.state.clickstate) {
      if (this.state.image !== "" && this.state.image2 !== "") {
        this.setState({
          clickstate: true
        }, () => {
          cesiumControl.imageConstrat(this.state.image + "?f=pjson", this.state.image2 + "?f=pjson");
        })
      } else {
        message.warn("请完整选择对比影像")
      }
    } else {
      message.warn("当前为影像图对比")
    }
  }

  onchangeImage0 = (v) => {
    if (v !== this.state.image) {
      this.setState({
        image: v,
        clickstate: false
      })
    } else {
      message.warn("和之前选的一样")
    }
  }

  onchangeImage1 = (v) => {
    if (v !== this.state.image2) {
      this.setState({
        image2: v,
        clickstate: false
      })
    } else {
      message.warn("和之前选的一样")
    }
  }

  changeProtect = (v) => {
    this.setState({
      protect: v
    })
  }

  render() {
    const { contrastImage, protectAreaid } = this.props;
    let pp = "", pp2 = "";
    if (contrastImage.length > 0) {
      if (localStorage.getItem('protectedareaid') !== "null") {
        pp = contrastImage.map((v, i) => {
          return (
            <Option value={v.url}>{v.name}</Option>
          )
        });

      } else {
        let yy = contrastImage.filter((v, i) => {
          return v.protectedareaid == this.state.protect
        })
        pp = yy.map((v, i) => {
          return (
            <Option value={v.url}>{v.name}</Option>
          )
        });
      }
    }

    pp2 = protectAreaid.map((v, i) => {
      return (
        <Option value={v.id}>{v.name}</Option>
      )
    })
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="影像对比"
          visible={this.state.visible}
          onCancel={this.constrastImageModalClose}
          style={{ top: 200 }}
          footer={null}
          maxable={false}
          minable={false}
          width={800}
          className={styles.image}
        >
          <div>
            <Row style={{ marginBottom: "10px" }}
                 hidden={localStorage.getItem('protectedareaid') === "null" ? false : true}>
              <Col span={3}><label style={{ "vertical-align": "middle" }}>保护地名称：</label></Col>
              <Col span={9}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changeProtect}
                >
                  <Option value="">请选择</Option>
                  {pp2}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={3}><label className={styles.image}>第一幅影像：</label></Col>
              <Col span={8}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onchangeImage0} value={this.state.image}
                >
                  <Option value="">请选择</Option>
                  {pp}
                </Select>
              </Col>
              <Col span={3}><label className={styles.image}>第二幅影像：</label></Col>
              <Col span={7}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onchangeImage1} value={this.state.image2}
                >
                  <Option value="">请选择</Option>
                  {pp}
                </Select>
              </Col>
              <Col span={1}/><span className={styles.caretbox} onClick={this.excute}><Icon type="caret-up"
                                                                                           theme="outlined"
                                                                                           className={styles.caretup}/><Icon
              type="caret-down" theme="outlined" className={styles.caretdown}/></span>
            </Row>
          </div>
        </Modal>
      </LocaleProvider>
    );
  };
}

ContrastImageModal.propTypes = {
  visible: PropTypes.bool
};

