import styles from './StatisticalAnalyModal.less';
import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import {
  Modal,
  LocaleProvider,
  DatePicker,
  InputNumber,
  Button,
  Select,
  Table,
  Input,
  Row,
  Col,
  Icon,
  AutoComplete
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const type = (v) => {
  if (v !== undefined) {
    return v.toFixed(4)
  } else {
    return ""
  }
}
const type2 = (v) => {
  switch (v) {
    case 1:
      return '新增'
      break;
    case 2:
      return '规模扩大'
      break;
    case 3:
      return '减少'
      break;
  }
}
const columns = [{
  title: "遥感监测结果",
  className: "borderTopLine",
  children: [
    {
      title: '保护地名称',
      dataIndex: 'bhdmc',
      align: 'center',
    }, {
      title: '时相',
      dataIndex: 'qsx',
      align: 'center',
    }, {
      title: '监测批次',
      dataIndex: 'jcpc',
      align: 'center',
    }, {
      title: '位置',
      dataIndex: 'address',
      align: 'center',
    }, {
      title: '经度',
      dataIndex: 'zxjd',
      align: 'center',
    }, {
      title: '纬度',
      dataIndex: 'zxwd',
      align: 'center',
    }, {
      title: '人类活动类型',
      dataIndex: 'yjlx',
      align: 'center',
    }, {
      title: '变化情况',
      dataIndex: 'bhqk',
      align: 'center',
      render: val => <span>{type2(parseInt(val))}</span>
    }, {
      title: '面积(公顷)',
      dataIndex: 'mj',
      align: 'center',
      render: val => <span>{type(val)}</span>
    }, {
      title: '功能分区',
      dataIndex: 'gnfq',
      align: 'center',
      className: "borderLine"
    }]
},
  {
    title: "保护地初步核实情况",
    className: "borderTopLine",
    children: [{
      title: '活动类型',
      dataIndex: 'activityType',
      align: 'center',
    }, {
      title: '有无变化',
      dataIndex: 'changeqk',
      align: 'center',
    }, {
      title: '功能分区',
      dataIndex: 'functionalZone',
      align: 'center',
    }, {
      title: '面积(公顷)',
      dataIndex: 'changemj',
      align: 'center',
      render: val => <span>{type(val)}</span>
    }, {
      title: '纬度',
      dataIndex: 'latitude',
      align: 'center',
    }, {
      title: '经度',
      dataIndex: 'longitude',
      align: 'center',
    }, {
      title: '初核意见',
      dataIndex: 'firstCheckOption',
      align: 'center',
    }, {
      title: '初核时间',
      dataIndex: 'firstCheckTime',
      align: 'center',
      className: "borderLine"
    }]
  }, {
    title: "省级复核情况",
    className: "borderTopLine",
    children: [{
      title: '复核意见',
      dataIndex: 'checkOpinion',
      align: 'center',
    }, {
      title: '复核时间',
      dataIndex: 'checkTime',
      align: 'center',
      className: "borderLine",
    }]
  }, {
    title: "备注",
    className: "borderLine",
    dataIndex: 'remark',
    align: 'center',
    // children: [{
    //   title: '',
    //   dataIndex: 'remark',
    //   align: 'center',
    // }]
  }
];
export default class StatisticalAnalyModal extends Component {
  state = {
    visible: false,
    bhdmc: "",//保护地名称
    jcnf: "",//监测年份
    jcpc: "",//监测频次
    bhqk: "",//变化类型
    gnfq: "",//功能分区
    yjbm: "",//活动类型
    checkopinion: "",//意见
    list: [],//表格列表
    loading: false,//表格加载，
    sum: "",//统计结果跑msg: "{"cd":990.319041343,"amount":32,"mj":28.986042937546397}"
  };

  statisticalAnalysisModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        statisticalAnalysisModalShow: false
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

  excuteBtn = () => {
    const { dispatch } = this.props;
    const { bhdmc, jcnf, jcpc, bhqk, gnfq, yjbm, checkopinion } = this.state;
    // if (bhdmc !== "" && jcnf !== "" && jcpc !== "" && bhqk !== "" && gnfq !== "" && yjbm !== "" && checkopinion !== "") {
    let year = /^\d{4}$/;
    if (this.state.jcnf !== "") {
      if (!year.test(this.state.jcnf)) {
        message.warn("请输入正确年份格式")
      } else {
        this.setState({
          loading: true
        });
        dispatch({
          type: "indexPage/Staticanalysis",
          payload: {
            gnfq: this.state.gnfq,
            jcnf: this.state.jcnf,
            jcpc: this.state.jcpc,
            yjbm: this.state.yjbm,
            checkopinion: this.state.checkopinion,
            bhqk: this.state.bhqk,
            bhdmc: this.state.bhdmc
            // gnfq: "",
            // jcnf: "",
            // jcpc: "",
            // yjbm: "",
            // checkopinion: "",
            // bhqk: "",
            // bhdmc: ""
          },
          callback: (res) => {
            this.setState({
              loading: false
            });
            if (res) {
              if (res.code == 0) {
                // message.success("")
                // console.log(res.data);
                this.setState({
                  list: res.data,
                  sum: res.msg
                })
              } else {
                message.error(res.msg)
              }
            } else {
              message.error(res.msg)
            }
          }
        })
      }
    } else {
      this.setState({
        loading: true
      });
      dispatch({
        type: "indexPage/Staticanalysis",
        payload: {
          gnfq: this.state.gnfq,
          jcnf: this.state.jcnf,
          jcpc: this.state.jcpc,
          yjbm: this.state.yjbm,
          checkopinion: this.state.checkopinion,
          bhqk: this.state.bhqk,
          bhdmc: this.state.bhdmc
          // gnfq: "",
          // jcnf: "",
          // jcpc: "",
          // yjbm: "",
          // checkopinion: "",
          // bhqk: "",
          // bhdmc: ""
        },
        callback: (res) => {
          this.setState({
            loading: false
          });
          if (res) {
            if (res.code == 0) {
              // message.success("")
              // console.log(res.data);
              this.setState({
                list: res.data,
                sum: res.msg
              })
            } else {
              message.error(res.msg)
            }
          } else {
            message.error(res.msg)
          }
        }
      })
    }
    // } else {
    //   message.warn("查询条件未填完整，请检查")
    // }
  }

  changeBhdmc = (v) => {
    this.setState({
      bhdmc: v//保护地名称
    })
  }

  changeGnqf = (v) => {
    this.setState({
      gnfq: v,//功能分区
    })
  }

  changeJcnf = (v) => {
    if (v == undefined) {
      this.setState({
        jcnf: "",//监测年份
      })
    } else {
      this.setState({
        jcnf: v.target.value,//监测年份
      })
    }

  }

  changeJcpc = (v) => {
    if (v == undefined || v == 0) {
      this.setState({
        jcpc: ""
      })
    } else {
      this.setState({
        jcpc: v.target.value
      })
    }
  }

  changeYjbm = (v) => {
    this.setState({
      yjbm: v
    })
  }

  changeBhqk = (v) => {
    this.setState({
      bhqk: v,
    })
  }

  changeOption = (e) => {
    this.setState({
      checkopinion: e.target.value,
    })
  }

  render() {
    const { protectAreaid } = this.props;
    let pp2 = "";
    pp2 = protectAreaid.map((v, i) => {
      return (
        <Option value={v.name}>{v.name}</Option>
      )
    });
    let amount, cd, mj;
    if (this.state.sum !== "") {
      if(JSON.parse(this.state.sum)["amount"]){
        amount = JSON.parse(this.state.sum)["amount"];
      }
      if(JSON.parse(this.state.sum)["cd"]){
        cd = JSON.parse(this.state.sum)["cd"].toFixed(4)+"m";
      }
      if(JSON.parse(this.state.sum)["mj"]){
        mj = JSON.parse(this.state.sum)["mj"].toFixed(4)+"hm²";
      }
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal
          title="统计分析"
          visible={this.state.visible}
          onCancel={this.statisticalAnalysisModalClose}
          footer={null}
          maxable={true}
          minable={true}
          className={styles.list}>
          <div>
            {/*<label>&nbsp;&nbsp;&nbsp;&nbsp;条件设置：</label>*/}
            {/*<AutoComplete*/}
            {/*style={{ width: 200 }}*/}
            {/*dataSource={dataSource}*/}
            {/*placeholder="输入地名"*/}
            {/*filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}*/}
            {/*/>*/}
            <Row className={styles.row}>
              <Col span={8}>
                <label>保护地名称：</label>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changeBhdmc}
                  value={this.state.bhdmc}
                >
                  <Option value="">请选择</Option>
                  {pp2}
                </Select>
              </Col>
              <Col span={8}>
                <label>功能分区：</label>
                <Select
                  showSearch
                  style={{ width: 120 }}
                  defaultValue={""}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changeGnqf}
                >
                  <Option value="">全选</Option>
                  <Option value="核心区">核心区</Option>
                  <Option value="缓冲区">缓冲区</Option>
                  <Option value="实验区">实验区</Option>
                  <Option value="非保护地">非保护地</Option>
                </Select>
              </Col>
              {/*<Col span={8}>*/}
              {/*<label>行政区划：</label>*/}
              {/*<Input style={{ width: 140 }} />*/}
              {/*</Col>*/}
            </Row>
            <Row className={styles.row}>
              <Col span={8}>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;监测年份：</label>
                {/*<Select*/}
                {/*showSearch*/}
                {/*style={{ width: 120 }}*/}
                {/*defalutValue={"0"}*/}
                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                {/*onChange={this.changeJcnf}*/}
                {/*value={this.state.jcnf}*/}
                {/*><Option value="">请选择</Option>*/}
                {/*<Option value="1">2018</Option>*/}
                {/*<Option value="2">2017</Option>*/}
                {/*</Select>*/}
                <Input min={0} onChange={this.changeJcnf} style={{ width: 210 }}/>
              </Col>
              <Col span={8}>
                <label>监测批次：</label>
                {/*<Select*/}
                {/*showSearch*/}
                {/*style={{ width: 120 }}*/}
                {/*defaultValue={"0"}*/}
                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                {/*onChange={this.changeJcpc}*/}
                {/*><Option value="0">全选</Option>*/}
                {/*<Option value="1">1</Option>*/}
                {/*<Option value="2">2</Option>*/}
                {/*</Select>*/}
                <Input onChange={this.changeJcpc} style={{ width: 210 }}/>
              </Col>
              <Col span={8}>
                <label>活动类型：</label>
                <Select
                  showSearch
                  style={{ width: 120 }}
                  defaultValue={""}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changeYjbm}
                >
                  <Option value="">全选</Option>
                  {/*<Option value="NT">农业用地</Option>*/}
                  {/*<Option value="CS">采石场</Option>*/}
                  {/*<Option value="GK">工矿用地</Option>*/}
                  {/*<Option value="NY">能源设施</Option>*/}
                  {/*<Option value="JT">交通设施</Option>*/}
                  {/*<Option value="LY">旅游设施</Option>*/}
                  {/*<Option value="YZ">养殖场</Option>*/}
                  {/*<Option value="JM">居民点</Option>*/}
                  {/*<Option value="NT">农业用地</Option>*/}
                  {/*<Option value="QT">其他人工设施</Option>*/}
                  {/*<Option value="DL">道路</Option>*/}
                  <Option value="01">农业用地</Option>
                  <Option value="04">采石场</Option>
                  <Option value="03">工矿用地</Option>
                  <Option value="05">能源设施</Option>
                  <Option value="07">交通设施</Option>
                  <Option value="06">旅游设施</Option>
                  <Option value="08">养殖场</Option>
                  <Option value="02">居民点</Option>
                  <Option value="10">其他人工设施</Option>
                  <Option value="09">道路</Option>

                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;变化类型：</label>
                <Select
                  showSearch
                  style={{ width: 120 }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.changeBhqk}
                  defaultValue={""}
                >
                  <Option value="">全选</Option>
                  <Option value="1">新增</Option>
                  <Option value="2">规模扩大</Option>
                  <Option value="3">恢复</Option>
                </Select>
              </Col>
              <Col span={8}>
                <label style={{ paddingLeft: "7.5%" }}>初步核实意见：</label>
                <Input style={{ width: 140, borderColor: "#00ffff" }} onChange={this.changeOption}/>
              </Col>
              <Col span={8}>
                <label style={{ paddingLeft: "7%" }}>省级复核意见：</label>
                <Input style={{ width: 140, borderColor: "#00ffff" }} onChange={this.changeOption}/>
                <Button className={styles.btn} onClick={this.excuteBtn}>查询</Button>
              </Col>
            </Row>
            <div className={styles.tableTop}>
              <Table columns={columns} dataSource={this.state.list}
                     scroll={{ x: this.state.list.length > 0 ? 1700 : false }} loading={this.state.loading}/>
              <div hidden={this.state.list.length > 0 ? false: true}>统计结果：<p>
                <span>数量：{amount}&nbsp;&nbsp;&nbsp;</span><span>面积：{mj}&nbsp;&nbsp;&nbsp;</span><span>道路：{cd}</span></p>
              </div>
            </div>
          </div>
        </Modal>
      </LocaleProvider>
    );
  }
  ;
}

StatisticalAnalyModal
  .propTypes = {
  visible: PropTypes.bool
};

