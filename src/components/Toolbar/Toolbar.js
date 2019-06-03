/* global Cesium */
/* global viewer */
/* global $ */
import React, { Component } from 'react';
import styles from './Toolbar.less';
import { message } from 'antd';
import { Input, Icon, Table, Tooltip, Modal, Select, Col, Tabs } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'braft-editor/dist/output.css'

const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
//保护地表
const columns = [{
  title: '保护地名称',
  dataIndex: 'name',
  align: 'center',
}, {
  title: '核心区面积',
  dataIndex: 'corearea',
  align: 'center',
}, {
  title: '创建时间',
  dataIndex: 'createtime',
  align: 'center',
}, {
  title: '创建人',
  dataIndex: 'createortime',
  align: 'center',
}, {
  title: '缓冲面积',
  dataIndex: 'cushionarea',
  align: 'center',
}, {
  title: '主管部门',
  dataIndex: 'department',
  align: 'center',
}, {
  title: '实验区面积(公顷)',
  dataIndex: 'experimentalarea',
  align: 'center',
}, {
  title: '纬度',
  dataIndex: 'latitude',
  align: 'center',
}, {
  title: '经度',
  dataIndex: 'longitude',
  align: 'center',
}, {
  title: '现有面积(公顷)',
  dataIndex: 'realarea',
  align: 'center',
}, {
  title: '备注',
  dataIndex: 'remark',
  align: 'center',
}, {
  title: '保护地简称',
  dataIndex: 'shortname',
  align: 'center',
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
}, {
  title: '保护对象',
  dataIndex: 'target',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'type',
  align: 'center',
  render: val => <span>{type(val)}</span>
}];

//小班
const columns_sm = [{
  title: '省',
  dataIndex: 'SHENG',
  align: 'center',

}, {
  title: '市',
  dataIndex: 'SHI',
  align: 'center',
}, {
  title: '县',
  dataIndex: 'XIAN',
  align: 'center',
}, {
  title: '乡',
  dataIndex: 'XIANG',
  align: 'center',
}, {
  title: '村',
  dataIndex: 'CUN',
  align: 'center',
}, {
  title: 'LIN_YE_JU',
  dataIndex: 'LIN_YE_JU',
  align: 'center',
  width: 100
}, {
  title: 'LIN_CHANG',
  dataIndex: 'LIN_CHANG',
  align: 'center',
}, {
  title: 'LIN_BAN',
  dataIndex: 'LIN_BAN',
  align: 'center',
}, {
  title: 'XIAO_BAN',
  dataIndex: 'XIAO_BAN',
  align: 'center',
}, {
  title: 'LIU_YU',
  dataIndex: 'LIU_YU',
  align: 'center',
}, {
  title: 'G_CHENG_LB',
  dataIndex: 'G_CHENG_LB',
  align: 'center',
}, {
  title: 'LD_QS',
  dataIndex: 'LD_QS',
  align: 'center',
}, {
  title: 'LM_S_YOU_Q',
  dataIndex: 'LM_S_YOU_Q',
  align: 'center',
}, {
  title: 'DI_LEI',
  dataIndex: 'DI_LEI',
  align: 'center',
}, {
  title: 'LIN_ZHONG',
  dataIndex: 'LIN_ZHONG',
  align: 'center',
}, {
  title: 'MIAN_JI',
  dataIndex: 'MIAN_JI',
  align: 'center',
}, {
  title: 'DI_MAO',
  dataIndex: 'DI_MAO',
  align: 'center',
}, {
  title: 'HAI_BA',
  dataIndex: 'HAI_BA',
  align: 'center',
}, {
  title: 'PO_DU',
  dataIndex: 'PO_DU',
  align: 'center',
}, {
  title: 'PO_XIANG',
  dataIndex: 'PO_XIANG',
  align: 'center',
}, {
  title: 'PO_WEI',
  dataIndex: 'PO_WEI',
  align: 'center',
}, {
  title: 'TU_RANG_LX',
  dataIndex: 'TU_RANG_LX',
  align: 'center',
}, {
  title: 'TU_CENG_HD',
  dataIndex: 'TU_CENG_HD',
  align: 'center',
}, {
  title: 'QI_YUAN',
  dataIndex: 'QI_YUAN',
  align: 'center',
}, {
  title: 'SEN_LIN_LB',
  dataIndex: 'SEN_LIN_LB',
  align: 'center',
}, {
  title: 'SHI_QUAN_D',
  dataIndex: 'SHI_QUAN_D',
  align: 'center',
}, {
  title: 'GJGYL_BHDJ',
  dataIndex: 'GJGYL_BHDJ',
  align: 'center',
}, {
  title: 'DFGYL_BHDJ',
  dataIndex: 'DFGYL_BHDJ',
  align: 'center',
}, {
  title: 'YOU_SHI_SZ',
  dataIndex: 'YOU_SHI_SZ',
  align: 'center',
}, {
  title: 'ZHU_Y_SZCS',
  dataIndex: 'ZHU_Y_SZCS',
  align: 'center',
}, {
  title: 'LING_ZU',
  dataIndex: 'LING_ZU',
  align: 'center',
}, {
  title: 'PINGJUN_XJ',
  dataIndex: 'PINGJUN_XJ',
  align: 'center',
}, {
  title: 'PINGJUN_GA',
  dataIndex: 'PINGJUN_GA',
  align: 'center',
}, {
  title: 'XIANGHUO_LMGQXJ',
  dataIndex: 'XIANGHUO_LMGQXJ',
  align: 'center',
}, {
  title: 'GENG_XIN_D',
  dataIndex: 'GENG_XIN_D',
  align: 'center',
}, {
  title: 'JING_JL_ZS',
  dataIndex: 'JING_JL_ZS',
  align: 'center',
}, {
  title: 'GUAN_MU_Z',
  dataIndex: 'GUAN_MU_Z',
  align: 'center',
}, {
  title: 'GUAN_MU_GD',
  dataIndex: 'GUAN_MU_GD',
  align: 'center',
}, {
  title: 'KE_JI_DU',
  dataIndex: 'KE_JI_DU',
  align: 'center',
}, {
  title: 'MEI_GQ_ZS',
  dataIndex: 'MEI_GQ_ZS',
  align: 'center',
}, {
  title: 'TD_TH_LX',
  dataIndex: 'TD_TH_LX',
  align: 'center',
}, {
  title: 'DISPE',
  dataIndex: 'DISPE',
  align: 'center',
}, {
  title: 'DISASTER_C',
  dataIndex: 'DISASTER_C',
  align: 'center',
}, {
  title: 'ZL_DJ',
  dataIndex: 'ZL_DJ',
  align: 'center',
}, {
  title: 'LD_KD',
  dataIndex: 'LD_KD',
  align: 'center',
}, {
  title: 'BH_DJ',
  dataIndex: 'BH_DJ',
  align: 'center',
}, {
  title: 'LYFQ',
  dataIndex: 'LYFQ',
  align: 'center',
}, {
  title: 'QYKZ',
  dataIndex: 'QYKZ',
  align: 'center',
}, {
  title: 'XJ_FQ',
  dataIndex: 'XJ_FQ',
  align: 'center',
}, {
  title: 'GENG_X_RQ',
  dataIndex: 'GENG_X_RQ',
  align: 'center',
}, {
  title: 'X_COOR',
  dataIndex: 'X_COOR',
  align: 'center',
}, {
  title: 'Y_COOR',
  dataIndex: 'Y_COOR',
  align: 'center',
}, {
  title: 'Q_LD_QS',
  dataIndex: 'Q_LD_QS',
  align: 'center',
}, {
  title: 'Q_DI_LEI',
  dataIndex: 'Q_DI_LEI',
  align: 'center',
}, {
  title: 'Q_L_Z',
  dataIndex: 'Q_L_Z',
  align: 'center',
}, {
  title: 'Q_SEN_LB',
  dataIndex: 'Q_SEN_LB',
  align: 'center',
}, {
  title: 'Q_SQ_D',
  dataIndex: 'Q_SQ_D',
  align: 'center',
}, {
  title: 'Q_GC_LB',
  dataIndex: 'Q_GC_LB',
  align: 'center',
}, {
  title: 'Q_BH_DJ',
  dataIndex: 'Q_BH_DJ',
  align: 'center',
}, {
  title: 'GH_SQDJ',
  dataIndex: 'GH_SQDJ',
  align: 'center',
}, {
  title: 'GH_DL',
  dataIndex: 'GH_DL',
  align: 'center',
}, {
  title: 'GH_BHDJ',
  dataIndex: 'GH_BHDJ',
  align: 'center',
}, {
  title: 'BHYY',
  dataIndex: 'BHYY',
  align: 'center',
}, {
  title: 'BHND',
  dataIndex: 'BHND',
  align: 'center',
}, {
  title: 'GLLX',
  dataIndex: 'GLLX',
  align: 'center',
}, {
  title: 'REMARKS',
  dataIndex: 'REMARKS',
  align: 'center',
}, {
  title: 'ZY_MIAN_JI',
  dataIndex: 'ZY_MIAN_JI',
  align: 'center',
}, {
  title: 'SHAPE_Leng',
  dataIndex: 'SHAPE_Leng',
  align: 'center',
}, {
  title: 'SHAPE_Area',
  dataIndex: 'SHAPE_Area',
  align: 'center',
}];

//人类活动面积
const columns_human = [{
  title: '图斑编号',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '一级类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
  render: val => <span>{type(val)}</span>
}, {
  title: '保护地级别',
  dataIndex: 'BHDJB',
  align: 'center',
  render: val => <span>{type3(val)}</span>
}, {
  title: '省份',
  dataIndex: 'SHENG',
  align: 'center',
}, {
  title: '市',
  dataIndex: 'SHI',
  align: 'center',
}, {
  title: '县',
  dataIndex: 'XIAN',
  align: 'center',
}, {
  title: '村',
  dataIndex: 'CUN',
  align: 'center',
}, {
  title: '功能分区',
  dataIndex: 'GNFQ',
  align: 'center',
}, {
  title: '建成时间',
  dataIndex: 'JCSJ',
  align: 'center',
}, {
  title: '中心经度',
  dataIndex: 'ZXJD',
  align: 'center',
}, {
  title: '中心纬度',
  dataIndex: 'ZXWD',
  align: 'center',
}, {
  title: '总面积(公顷)',
  dataIndex: 'MJ',
  align: 'center',
}, {
  title: '核心区面积(公顷)',
  dataIndex: 'HXQMJ',
  align: 'center',
}, {
  title: '缓冲区面积(公顷)',
  dataIndex: 'HCQMJ',
  align: 'center',
}, {
  title: '实验区面积(公顷)',
  dataIndex: 'SYQMJ',
  align: 'center',
}, {
  title: '图斑编号',
  dataIndex: 'TBBH',
  align: 'center',
}, {
  title: '监测批次',
  dataIndex: 'JCPC',
  align: 'center',
}, {
  title: '数据源',
  dataIndex: 'SJY',
  align: 'center',
}];

//人类活动道路
const columns_human_road = [{
  title: '图斑编号',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '一级类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
  render: val => <span>{type(val)}</span>
}, {
  title: '保护地级别',
  dataIndex: 'BHDJB',
  align: 'center',
  render: val => <span>{type3(val)}</span>
}, {
  title: '省份',
  dataIndex: 'SHENG',
  align: 'center',
}, {
  title: '市',
  dataIndex: 'SHI',
  align: 'center',
}, {
  title: '县',
  dataIndex: 'XIAN',
  align: 'center',
}, {
  title: '村',
  dataIndex: 'CUN',
  align: 'center',
}, {
  title: '功能分区',
  dataIndex: 'GNFQ',
  align: 'center',
}, {
  title: '建成时间',
  dataIndex: 'JCSJ',
  align: 'center',
}, {
  title: '中心经度',
  dataIndex: 'ZXJD',
  align: 'center',
}, {
  title: '中心纬度',
  dataIndex: 'ZXWD',
  align: 'center',
}, {
  title: '总长度(米)',
  dataIndex: 'CD',
  align: 'center',
}, {
  title: '核心区长度(米)',
  dataIndex: 'HXQCD',
  align: 'center',
}, {
  title: '缓冲区长度(米)',
  dataIndex: 'HCQCD',
  align: 'center',
}, {
  title: '实验区长度(米)',
  dataIndex: 'SYQCD',
  align: 'center',
}, {
  title: '图斑编号',
  dataIndex: 'TBBH',
  align: 'center',
}, {
  title: '监测批次',
  dataIndex: 'JCPC',
  align: 'center',
}, {
  title: '数据源',
  dataIndex: 'SJY',
  align: 'center',
}];

//人类活动变化面积
const columns_act_mian = [{
  title: '图斑编号',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '活动类型',
  dataIndex: 'YJLX',
  align: 'center',
},
  {
    title: '规模（公顷）',
    dataIndex: 'MJ',
    align: 'center',
    render: val => <span>{val.toFixed(4)}</span>
  }, {
    title: '变化情况',
    dataIndex: 'BHQK',
    align: 'center',
    render: val => <span>{type2(val)}</span>
  }, {
    title: '前时相',
    dataIndex: 'QSX',
    align: 'center',
  }, {
    title: '后时相',
    dataIndex: 'HSX',
    align: 'center',
  }, {
    title: '保护地名称',
    dataIndex: 'BHDMC',
    align: 'center',
  }, {
    title: '功能分区',
    dataIndex: 'GNFQ',
    align: 'center',
  }, {
    title: '行政划分',
    dataIndex: 'XIAN',
    align: 'center',
  }]

//人类活动变化道路
const columns_act_road = [{
  title: '图斑编号',
  dataIndex: 'CODE',
  align: 'center',
}, {
  title: '活动类型',
  dataIndex: 'YJLX',
  align: 'center',
},
  {
    title: '规模（米）',
    dataIndex: 'CD',
    align: 'center',
    render: val => <span>{val.toFixed(0)}</span>
  }, {
    title: '变化情况',
    dataIndex: 'BHQK',
    align: 'center',
    render: val => <span>{type2(val)}</span>
  }, {
    title: '前时相',
    dataIndex: 'QSX',
    align: 'center',
  }, {
    title: '后时相',
    dataIndex: 'HSX',
    align: 'center',
  }, {
    title: '保护地名称',
    dataIndex: 'BHDMC',
    align: 'center',
  }, {
    title: '功能分区',
    dataIndex: 'GNFQ',
    align: 'center',
  }, {
    title: '行政区划',
    dataIndex: 'XIAN',
    align: 'center',
  }]

let city = [];
const type = (v) => {
  switch (v) {
    case '01':
      return '农业用地'
      break;
    case '02':
      return '居民点'
      break;
    case '03':
      return '工矿用地'
      break;
    case '04':
      return '采石场'
      break;
    case '05':
      return '能源设施'
      break;
    case '06':
      return '旅游设施'
      break;
    case '07':
      return '交通设施'
      break;
    case '08':
      return '养殖场'
      break;
    case '09':
      return '道路'
      break;
    case '10':
      return '其他人工设施'
      break;
  }
}
const type2 = (v) => {
  switch (v) {
    case '1':
      return '新增'
      break;
    case '2':
      return '扩大'
      break;
    case '3':
      return '减少'
      break;
  }
}
const type3 = (v) => {
  switch (v) {
    case 'G':
      return '国家级'
      break;
    case 'S':
      return '省级'
      break;
    case 'C':
      return '市级'
      break;
    case 'X':
      return '县级'
      break;
  }
}
const ChangeToDu = () => {
  var d = document.getElementById("input_dfm1").value;
  var f = document.getElementById("input_dfm2").value;
  var m = document.getElementById("input_dfm3").value;

  var f = parseFloat(f) + parseFloat(m / 60);
  var du = parseFloat(f / 60) + parseFloat(d);
}

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//属性表弹窗
      shapeVisible: false,
      addvname: "",//搜索地区名称
    }
  }

  zoomIn = () => {
    const { cesiumControl } = this.props;
    cesiumControl.zoomIn();
  }

  zoomOut = () => {
    const { cesiumControl } = this.props;
    cesiumControl.zoomOut();
    // console.dir(global.viewer);
    // console.dir(global.viewer.dataSources);
    // window.viewer = global.viewer;

  }

  ruler = () => {
    const { cesiumControl } = this.props;
    cesiumControl.ruler();
  }

  rsetting = () => {
    const { cesiumControl } = this.props;
    cesiumControl.rsetting();
  }

  removeLocation = () => {
    if (city.length > 0) {
      city.map((v, i) => {
          viewer.entities.removeById(v);
        }
      )
    }
  }

  measure = () => {
    const { cesiumControl, dispatch, measureToolShow, measureToolSelect } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        measureToolShow: !measureToolShow,
        drawToolShow: false,
        addTaskModalShow: false,
      }
    });
    /*if (!measureToolSelect) {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          measureToolSelect:!measureToolSelect,
          drawToolShow: false,
          addTaskModalShow: false,
        }
      });
    } else {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          measureToolShow: !measureToolShow,
          measureToolSelect:!measureToolSelect,
          drawToolShow: false,
          addTaskModalShow: false,
        }
      });
    }*/
  }

  measureShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        measureToolShow: true,
      }
    });
  }

  measureHide = () => {
    const { dispatch, measureToolSelect } = this.props;
    if (!measureToolSelect) {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          measureToolShow: false,
        }
      });
    }
  }

  draw = () => {
    const { cesiumControl, dispatch, drawToolShow, drawToolSelect } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        drawToolShow: !drawToolShow,
        measureToolShow: false,
        addTaskModalShow: false,
      }
    });
    /*if (!drawToolSelect) {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawToolSelect:!drawToolSelect,
          drawToolShow: false,
          addTaskModalShow: false,
        }
      });
    } else {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawToolShow: !drawToolShow,
          drawToolSelect:!drawToolSelect,
          measureShow: false,
          addTaskModalShow: false,
        }
      });
    }*/
  }

  drawShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        drawToolShow: true,
      }
    });
  }

  drawHide = () => {
    const { dispatch, drawToolSelect } = this.props;
    if (!drawToolSelect) {
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          drawToolShow: false,
        }
      });
    }
  }

  componentDidMount() {

  }

  propertyTab = () => {
    const { tubanShape, shapeType } = this.props;
    //console.log(tubanShape);
    //console.log(shapeType);
    if (tubanShape.length > 0) {
      this.setState({
        visible: true
      });
    }
  }

  propertyTabClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        tubanModalClose: false,
        // shapeChoseid: ""
      }
    });
    this.setState({
      visible: false
    })
  }

  renderHtml = (d, t) => {
    if (d == 1) {
      if (t.length > 0) {
        let newarray = t.filter((v, i) => {
          return v.TTYPE == this.props.shapeChoseid
        })
        if (newarray.length > 0) {
          // this.setState({
          //   shapeVisible:true
          // });
          if (newarray[0].shapetype == "活动面积") {
            let y = 0;
            newarray.map((v, i) => {
              y += parseFloat(v.MJ);
            })
            return (
              <Modal
                title="属性表"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist}
              >
                <Table columns={columns_human} dataSource={newarray} scroll={{ x: 1600 }} onRow={(record) => {
                  return {
                    onClick: () => {
                      // alert(record.ZXWD.split("N")[0].split("°")[0])
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]);
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]);
                      let f2 = parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du2 = parseFloat(f2 / 60) + parseFloat(record.ZXWD.split("N")[0].split("°")[0]);
                      let f = parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du = parseFloat(f / 60) + parseFloat(record.ZXJD.split("E")[0].split("°")[0]);
                      // alert(du2)
                      // alert(du);
                      global.viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(du, du2, 210),
                      });
                    },
                  };
                }}/>
                <p>图斑的数量：{newarray.length}&nbsp;&nbsp;&nbsp;&nbsp;图斑的总面积：{y.toFixed(4)}公顷</p>
              </Modal>
            );
          } else if (newarray[0].shapetype == "活动道路") {
            let y = 0;
            newarray.map((v, i) => {
              y += parseFloat(v.CD);
            })
            return (
              <Modal
                title="属性表"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist}
              >
                <Table columns={columns_human_road} dataSource={newarray} scroll={{ x: 1600 }} onRow={(record) => {
                  return {
                    onClick: () => {
                      // alert(record.ZXWD.split("N")[0].split("°")[0])
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]);
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]);
                      let f2 = parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du2 = parseFloat(f2 / 60) + parseFloat(record.ZXWD.split("N")[0].split("°")[0]);
                      let f = parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du = parseFloat(f / 60) + parseFloat(record.ZXJD.split("E")[0].split("°")[0]);
                      // alert(du2)
                      // alert(du);
                      global.viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(du, du2, 210),
                      });
                    },
                  };
                }}/>
                <p>道路的数量：{newarray.length}&nbsp;&nbsp;&nbsp;&nbsp;道路总长度：{y.toFixed(0)}米</p>
              </Modal>
            );
          } else if (newarray[0].shapetype == "变化道路") {
            let y = 0;
            newarray.map((v, i) => {
              y += parseFloat(v.CD);
            })
            return (
              <Modal
                title="属性表"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist}
              >
                <Table columns={columns_act_road} dataSource={newarray} scroll={{ x: 1600 }} onRow={(record) => {
                  return {
                    onClick: () => {
                      // alert(record.ZXWD.split("N")[0].split("°")[0])
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]);
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]);
                      let f2 = parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du2 = parseFloat(f2 / 60) + parseFloat(record.ZXWD.split("N")[0].split("°")[0]);
                      let f = parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du = parseFloat(f / 60) + parseFloat(record.ZXJD.split("E")[0].split("°")[0]);
                      // alert(du2)
                      // alert(du);
                      global.viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(du, du2, 210),
                      });
                    }, d
                  }
                }}/>
                <p>道路的数量：{newarray.length}&nbsp;&nbsp;&nbsp;&nbsp;道路总长度：{y.toFixed(0)}米</p>
              </Modal>
            );
          } else if (newarray[0].shapetype == "变化面") {
            let y = 0;
            newarray.map((v, i) => {
              y += parseFloat(v.MJ);
            })
            return (
              <Modal
                title="属性表"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist}
              >

                <Table columns={columns_act_mian} dataSource={newarray} scroll={{ x: 1600 }} onRow={(record) => {
                  return {
                    onClick: () => {
                      // alert(record.ZXWD.split("N")[0].split("°")[0])
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]);
                      // alert(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]);
                      let f2 = parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXWD.split("N")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du2 = parseFloat(f2 / 60) + parseFloat(record.ZXWD.split("N")[0].split("°")[0]);
                      let f = parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[0]) + parseFloat(parseFloat(record.ZXJD.split("E")[0].split("°")[1].split("\'")[1].split("\"")[0]) / 60);
                      let du = parseFloat(f / 60) + parseFloat(record.ZXJD.split("E")[0].split("°")[0]);
                      // alert(du2)
                      // alert(du);
                      global.viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(du, du2, 210),
                      });
                    },
                  };
                }}/>
                <p>图斑的数量：{newarray.length}&nbsp;&nbsp;&nbsp;&nbsp;图斑的总面积：{y.toFixed(4)}公顷</p>
              </Modal>
            );
          } else if (newarray[0].shapetype == "小班") {
            return (
              <Modal
                title="属性表"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist2}
              >
                <Table columns={columns_sm} dataSource={newarray} scroll={{ x: 5000 }}/>
              </Modal>
            );
          } else if (newarray[0].shapetype == "保护地") {
            // console.log(newarray[0].description)
            return (
              <Modal
                title="保护地信息"
                visible={this.state.visible}
                footer={null}
                mask={true}
                maxable={false}
                minable={false}
                onCancel={this.propertyTabClose}
                className={styles.shapelist3}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane tab="保护地情况" key="1">
                    {/*<Table columns={columns} dataSource={[newarray[0]]} />*/}
                    <div className={styles.protectarea}>
                      <p><label>保护地名称：</label><span>{newarray[0].protectname}</span></p>
                      <p><label>保护级别：</label><span>{type3(newarray[0].level)}</span></p>
                      <p><label>保护地类型：</label><span>{type(newarray[0].type)}</span></p>
                      <p><label>始建时间：</label><span>{moment(newarray[0].buildtime).format("YYYY-MM-DD HH:mm:ss")}</span>
                      </p>
                      <p><label>晋升时间：</label><span>{newarray[0].promotiontime}</span></p>
                      <p><label>主管部门：</label><span>{newarray[0].department}</span></p>
                      <p><label>保护地面积（批复面积、公顷）：</label><span>{newarray[0].area}</span></p>
                      <p><label>核心区：</label><span>{newarray[0].corearea}</span></p>
                      <p><label>缓冲区：</label><span>{newarray[0].cushionarea}</span></p>
                      <p><label>实验区：</label><span>{newarray[0].experimentalarea}</span></p>
                      <p><label>现有面积：</label><span>{newarray[0].realarea}</span></p>
                    </div>
                  </TabPane>
                  <TabPane tab="保护地介绍" key="2">
                    <div style={{ "color": "#fff" }} className="braft-output-content" dangerouslySetInnerHTML={{ __html: newarray[0].description }}></div>
                  </TabPane>
                </Tabs>
              </Modal>
            );
          }
        }
      }
    }

  }

  changeAddv = (v) => {
    this.setState({
      addvname: v
    })
  }
  excute = () => {
    const { dispatch } = this.props;
    if (this.state.addvname !== "") {
      dispatch({
        type: "indexPage/SearchAddv",
        payload: {
          addvnm: this.state.addvname
        },
        callback: (res) => {
          if (res) {
            // console.log(res)
            if (res.code == 0) {
              if (res.data.length > 0) {
                if (res.data[0].longitude !== "" && res.data[0].latitude !== "") {
                  city.push(res.data[0].name)
                  global.viewer.entities.add({
                    id: res.data[0].name,
                    position: Cesium.Cartesian3.fromDegrees(res.data[0].longitude - 0, res.data[0].latitude - 0),
                    billboard: {
                      image: './images/icon/blue-icon.png',
                      width: 40,
                      height: 40
                    },
                    label: {
                      text: res.data[0].name,
                      font: '14pt monospace',
                      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                      fillColor: Cesium.Color.LIGHTCYAN,
                      outlineWidth: 2,
                      outlineColor: Cesium.Color.WHITE,
                      verticalOrigin: Cesium.VerticalOrigin.CENTER,
                      pixelOffset: new Cesium.Cartesian2(0, 32)
                    }
                  });
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(res.data[0].longitude - 0, res.data[0].latitude - 0, 210000),
                  });
                } else {
                  message.warn("暂无相应的经纬度")
                }
              } else {
                message.warn("目前只提供中文搜索山西省行政单位经纬度，请重新输入")
              }
            } else {
              message.error(res.msg)
            }
          } else {
            message.error("无相关数据返回")
          }
        }
      })
    }

  }

  render() {
    const { tubanShape, shapeid, rsdatacontract, addvareaname } = this.props;
    console.log(tubanShape);
    let pp = "";
    if (addvareaname.length > 0) {
      pp = addvareaname.map((v, i) => {
        return (
          <Option value={v.name}>{v.name}</Option>
        )
      });
    }
    return (
      <div className={styles.toolbox}>
        地名搜索：
        {/*<Search*/}
        {/*placeholder="输入省市县及保护地名称"*/}
        {/*onSearch={value => this.excute(value)}*/}
        {/*style={{ width: 200 }} allowClear*/}
        {/*/>*/}
        <Select
          showSearch
          style={{ width: 260 }}
          placeholder={"下拉选择输入省市县及保护地名称"}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={this.changeAddv}
          // value={this.state.addvname}

        >
          <Option value="" style={{ "color": "#333" }}>请选择</Option>
          {pp}
        </Select>
        <Icon type="search" className={styles.removeloa} onClick={this.excute}/>
        <Icon type="close-circle" className={styles.removeloa} onClick={this.removeLocation}/>
        <span className={styles.boxbar}>
        {/*<Icon type="fullscreen-exit" theme=" outlined"/>*/}
          <Tooltip placement="bottom" title={"重置"}>
               <Icon type="home" theme="outlined" onClick={this.rsetting}/>
            </Tooltip>
            <Tooltip placement="bottom" title={"放大"}>
        <Icon type="fangda" theme="outlined" onClick={this.zoomIn}/>
           </Tooltip>
 <Tooltip placement="bottom" title={"缩小"}>
             <Icon type="suoxiao" theme="outlined" onClick={this.zoomOut}/>         </Tooltip>
          {/*<Tooltip placement="bottom" title={"缩放至图层"}>
        <Icon type="menu-fold" theme="outlined"/>
           </Tooltip>*/}
          <Tooltip placement="bottom" title={"地图比例尺"}>
        <Icon type="weibiaoti1-copy" theme="outlined" onClick={this.ruler}/>
          </Tooltip>
            <Tooltip placement="bottom" title={"测量"}>
        {/*<Icon type="menu-unfold" theme="outlined" onClick={this.measure} onMouseOver={this.measureShow} onMouseLeave={this.measureHide}/>*/}
              <Icon type="celiang1" theme="outlined" onClick={this.measure}/>
            </Tooltip>
         <Tooltip placement="bottom" title={"矢量绘制"}>
       {/* <Icon type="edit" theme="outlined" onClick={this.draw}  onMouseOver={this.drawShow} onMouseLeave={this.drawHide}/>*/}
           <Icon type="huizhituxing" theme="outlined" onClick={this.draw}/>
         </Tooltip>
          {/*   <Tooltip placement="bottom" title={"识别"}>
        <Icon type="scan" theme="outlined"/>
            </Tooltip>
            <Tooltip placement="bottom" title={"选择"}>
        <Icon type="left-square" theme="outlined"/>
            </Tooltip>*/}
          {/*<Tooltip placement="bottom" title={"导出"}>*/}
          {/*<Icon type="export" theme="outlined"/>*/}
          {/*</Tooltip>*/}
          <Tooltip placement="bottom" title={"属性表"}>
 <Icon type="profile" theme="outlined" onClick={this.propertyTab}
       hidden={this.props.shapeChoseid !== "" ? false : true}/>
           </Tooltip>
           <Tooltip placement="bottom" title={"属性表"}>
 <Icon type="profile" theme="outlined" className={styles.buttonDisabled}
       hidden={this.props.shapeChoseid !== "" ? true : false}/>
           </Tooltip>
        </span>
        {/*<div className={styles.tips}*/}
        {/*style={{ left: this.state.x, top: this.state.y, display: this.state.show }}>{this.state.tooltitle}</div>*/}
        {/*<div className={styles.arrow}*/}
        {/*style={{ left: this.state.x2, top: this.state.y2, display: this.state.show }}></div>*/}
        {/*<Modal*/}
        {/*title="属性表"*/}
        {/*visible={this.state.visible}*/}
        {/*footer={null}*/}
        {/*mask={true}*/}
        {/*maxable={false}*/}
        {/*minable={false}*/}
        {/*onCancel={this.propertyTabClose}*/}
        {/*className={styles.shapelist}*/}
        {/*>*/}
        {/*{this.renderHtml(shapeid, tubanShape, rsdatacontract)}*/}
        {/*</Modal>*/}
        {this.renderHtml(shapeid, tubanShape)}

      </div>
    );
  }
}

export default Toolbar;
Toolbar.propTypes = {};
