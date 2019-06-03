import styles from './ReportListModal.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Input, Icon, Table, message } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

import { config } from '../../utils';

const { apiUrl, seeUrl } = config;

const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const Search = Input.Search;

const type2 = (v) => {
  switch (v) {
    case 'remoteSense':
      return '遥感监测报告'
      break;
    case 'field':
      return '实地核查报告'
      break;
    case 'account':
      return '台账'
      break;
    case 'other':
      return '其他'
      break;
  }
}

export default class reportListModal extends Component {
  state = {
    visible: false,
    visible2: false,
    searchList: [],
    searchValue: "",
    loading: false,
    iframe: "",
    jcnf: "",
    jcpc: ""
  };

  reportListModalClose = () => {
    const { dispatch } = this.props;
    // this.setState({
    //   visible: false,
    // });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        reportListModalShow: false
      }
    });
  }

  reportListModalClose2 = () => {
    this.setState({
      visible2: false,
    });
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    this.setState({
      visible: nextProps.visible
    });
  }

  changeTitle = (e) => {
    this.setState({
      searchValue: e
    })
  }

  changeNF = (e) => {
    this.setState({
      jcnf: e.target.value
    })
  }

  changePC = (e) => {
    this.setState({
      jcpc: e.target.value
    })
  }
  renderHtml = (p) => {
    return (
      p.map((v, i) => {
        return (
          <Option value={v.title}>{v.title}</Option>
        )
      })
    )
  }

  View = (v) => {
    this.setState({
      visible2: true,
      iframe: v
    })
  }

  downLoad = (d) => {
    alert(d)
    window.open(d);
  }

  Oksearch = () => {
    const { dispatch } = this.props;
    let year = /^\d{4}$/;
    if (localStorage.getItem('rolegradeid') == 2) {
      if (this.state.jcnf !== "") {
        if (year.test(this.state.jcnf)) {
          this.setState({
            loading: true
          });
          dispatch({
            type: 'indexPage/reportList',
            payload: {
              // title: this.state.searchValue !== "" ? this.state.searchValue : ""
              protectedareaid: localStorage.getItem('protectedareaid'),
              jcnf: this.state.jcnf,
              jcpc: this.state.jcpc
            },
            callback: (res) => {
              if (res) {
                if (res.code == 0) {
                  // console.log(res.data);
                  this.setState({
                    searchList: res.data,
                    loading: false
                  })
                }
              }
            }
          })
        } else {
          message.warn("请输入正确格式的年份")
        }
      } else {
        this.setState({
          loading: true
        });
        dispatch({
          type: 'indexPage/reportList',
          payload: {
            // title: this.state.searchValue !== "" ? this.state.searchValue : ""
            protectedareaid: localStorage.getItem('protectedareaid'),
            jcnf: this.state.jcnf,
            jcpc: this.state.jcpc
          },
          callback: (res) => {
            if (res) {
              if (res.code == 0) {
                // console.log(res.data);
                this.setState({
                  searchList: res.data,
                  loading: false
                })
              }
            }
          }
        })
      }
    }else {
      if (this.state.jcnf !== "") {
        if (year.test(this.state.jcnf)) {
          this.setState({
            loading: true
          });
          dispatch({
            type: 'indexPage/reportList',
            payload: {
              // title: this.state.searchValue !== "" ? this.state.searchValue : ""
              protectedareaid: this.state.searchValue,
              jcnf: this.state.jcnf,
              jcpc: this.state.jcpc
            },
            callback: (res) => {
              if (res) {
                if (res.code == 0) {
                  // console.log(res.data);
                  this.setState({
                    searchList: res.data,
                    loading: false
                  })
                }
              }
            }
          })
        } else {
          message.warn("请输入正确格式的年份")
        }
      } else {
        this.setState({
          loading: true
        });
        dispatch({
          type: 'indexPage/reportList',
          payload: {
            // title: this.state.searchValue !== "" ? this.state.searchValue : ""
            protectedareaid: this.state.searchValue,
            jcnf: this.state.jcnf,
            jcpc: this.state.jcpc
          },
          callback: (res) => {
            if (res) {
              if (res.code == 0) {
                // console.log(res.data);
                this.setState({
                  searchList: res.data,
                  loading: false
                })
              }
            }
          }
        })
      }
    }

  }

  Reset=()=>{
    this.setState({
      jcnf:"",
      jcpc:"",
      searchValue:""
    })
  }

  render() {
    const { protectAreaid } = this.props;
    const columns = [{
      title: '序号',
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: val => <span>{type2(val)}</span>
    }, {
      title: '报告名称',
      key: 'title',
      dataIndex: 'title',
    },
      {
        title: '监测年份',
        key: 'jcnf',
        dataIndex: 'jcnf',
      }, {
        title: '监测批次',
        key: 'jcpc',
        dataIndex: 'jcpc',
      }, {
        title: '创建时间',
        key: 'createtime',
        dataIndex: 'createtime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
          <a className={styles.btn2} onClick={() => {
            this.View(seeUrl + apiUrl + "/" + record.url)
          }}>预览</a>&nbsp;&nbsp;<a className={styles.btn2} href={apiUrl + "/" + record.url}>下载</a>
        </span>
        ),
      }];

    let pp = "";
    if (localStorage.getItem('rolegradeid') == 1) {
      pp = protectAreaid.map((v, i) => {
        return (
          <Option value={v.id}>{v.name}</Option>
        )
      })
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="报告列表"
            visible={this.state.visible}
            footer={null}
            mask={true}
            maxable={false}
            minable={false}
            style={{ top: 200 }}
            onCancel={this.reportListModalClose}
            className={styles.list}
          >
            <div>
              <span hidden={localStorage.getItem('rolegradeid') == 1 ? false : true}>
              <label>保护地名称：</label>
              <Select
                showSearch
                style={{ width: 220 }}
                placeholder="输入关键字"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.changeTitle}
                value={this.state.searchValue}
              >
                {pp}
              </Select>
              </span>
              <label>&nbsp;&nbsp;监测年份：</label>
              <Input
                placeholder="请输入"
                style={{ width: 80 }}
                onChange={this.changeNF}
                value={this.state.jcnf}
              /> <label>&nbsp;&nbsp;监测批次：</label>
              <Input
                placeholder="请输入"
                style={{ width: 150 }}
                onChange={this.changePC}
                value={this.state.jcpc}
              /><Button onClick={this.Oksearch} className={styles.btn}>搜索</Button>
              <Button onClick={this.Reset} className={styles.btn}>重置</Button>
            </div>
            <Table columns={columns} dataSource={this.state.searchList} loading={this.state.loading}/>
          </Modal>
          <Modal
            title="报告预览"
            visible={this.state.visible2}
            footer={null}
            mask={true}
            maxable={true}
            minable={true}
            onCancel={this.reportListModalClose2}
            style={{ top: 100 }}
            className={styles.list2}
          >
            {/*<Button className={styles.btn}>下载</Button>*/}
            <a href={this.state.iframe.split("?url=")[1]} className={styles.download}>下载</a>
            <iframe src={this.state.iframe} className={styles.iframe}></iframe>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

reportListModal.propTypes = {
  visible: PropTypes.bool
};

