import styles from './TubanModel.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, Table, Icon, Input } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';


//人类活动面积
const columns_human = [{
  title: '图斑编码',
  dataIndex: 'CODE',
  align: 'center',
  width: 210
}, {
  title: '活动类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
}, {
  title: '保护地级别',
  dataIndex: 'BHDJB',
  align: 'center',
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
  title: '规模(公顷)',
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
  title: '唯一编码',
  dataIndex: 'CODE',
  align: 'center',
  width: 210
}, {
  title: '一级类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
  align: 'center',
}, {
  title: '保护地级别',
  dataIndex: 'BHDJB',
  align: 'center',
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
  title: '规模(米)',
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
  title: '唯一编码',
  dataIndex: 'CODE',
  align: 'center',
  width: 210
}, {
  title: '变化类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '变化情况',
  dataIndex: 'BHQK',
  align: 'center',
}, {
  title: '前时相',
  dataIndex: 'QSX',
  align: 'center',
}, {
  title: '后时相',
  dataIndex: 'HSX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
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
  title: '变化面积(公顷)',
  dataIndex: 'MJ',
  align: 'center',
}]

//人类活动变化道路
const columns_act_road = [{
  title: '唯一编码',
  dataIndex: 'CODE',
  align: 'center',
  width: 210
}, {
  title: '变化类型',
  dataIndex: 'YJLX',
  align: 'center',
}, {
  title: '变化情况',
  dataIndex: 'BHQK',
  align: 'center',
}, {
  title: '前时相',
  dataIndex: 'QSX',
  align: 'center',
}, {
  title: '后时相',
  dataIndex: 'HSX',
  align: 'center',
}, {
  title: '保护地类型',
  dataIndex: 'BHDLX',
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
  title: '变化长度(米)',
  dataIndex: 'CD',
  align: 'center',
}]

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
export default class TubanModal extends Component {
  state = {
    visible: false,
  };

  tubanModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        tubanModalClose: false
      }
    });
  }

  componentDidMount() {
    const { visible } = this.props;
    this.setState({
      visible: visible
    });
  }


  renderHtml = (t) => {
    if (t.length > 0) {
      if (t[0].shapetype == "活动面积") {
        return (
          <Modal
            title="属性表"
            visible={this.state.visible}
            onCancel={this.tubanModalClose}
            style={{ top: 200 }}
            footer={null}
            maxable={false}
            minable={false}
            width={560}>
            <div className={styles.showttype}>
              <p><label>地理位置：</label>{t[0].SHENG}省{t[0].SHI}市{t[0].XIAN}{t[0].CUN}</p>
              <p><label>唯一编码：</label>{t[0].CODE}&nbsp;&nbsp;</p>
              <p><label>中心经度：</label><span className={styles.width}>{t[0].ZXJD}</span><label>中心纬度：</label>{t[0].ZXWD}
              </p>
              <p><label>一级类型：</label><span className={styles.width}>{t[0].YJLX}</span>
                <label>保护地类型：</label><span className={styles.width}>{type(t[0].BHDLX)}</span>
                <label>保护地级别：</label>{type3(t[0].BHDJB)}</p>
              <p><label>图斑编号：</label><span className={styles.width}>{t[0].TBBH}</span><label>监测批次：</label><span
                className={styles.width}>{t[0].JCPC}</span>
                <label>数据源：</label>{t[0].SJY}</p>
              <p><label>功能分区：</label><span className={styles.width}>{t[0].GNFQ}</span><label>建成时间：</label>{t[0].JCSJ}
              </p>
              <p><label>总面积(公顷)：</label><span className={styles.width}>{t[0].MJ}</span></p>
              <p><label>核心区面积(公顷)：</label><span className={styles.width}>{t[0].HXQMJ}</span></p>
              <p><label>缓冲区面积(公顷)：</label><span className={styles.width}>{t[0].HCQMJ}</span></p>
              <p><label>实验区面积(公顷)：</label>{t[0].SYQMJ}</p>
            </div>
          </Modal>
        )
      } else if (t[0].shapetype == "活动道路") {
        return (
          <Modal
            title="属性表"
            visible={this.state.visible}
            onCancel={this.tubanModalClose}
            style={{ top: 200 }}
            footer={null}
            maxable={false}
            minable={false}
            width={560}>
            <div className={styles.showttype}>
              {/*<p><label>唯一编码：</label>{t[0].CODE}&nbsp;&nbsp;</p>*/}
              {/*<p><label>一级类型：</label>{t[0].YJLX}&nbsp;&nbsp;*/}
              {/*<label>保护地类型：</label>{type(t[0].BHDLX)}&nbsp;&nbsp;*/}
              {/*<label>保护地级别：</label>{type3(t[0].BHDJB)}</p>*/}
              {/*<p><label>省份：</label>{t[0].SHENG}&nbsp;&nbsp;<label>市：</label>{t[0].SHI}&nbsp;&nbsp;*/}
              {/*<label>县：</label>{t[0].XIAN}&nbsp;&nbsp;<label>村：</label>{t[0].CUN}</p>*/}
              {/*<p><label>功能分区：</label>{t[0].GNFQ}&nbsp;&nbsp;<label>建成时间：</label>{t[0].JCSJ}</p>*/}
              {/*<p><label>中心经度：</label>{t[0].ZXJD}&nbsp;&nbsp;<label>中心纬度：</label>{t[0].ZXWD}</p>*/}
              {/*<p><label>总长度(米)：</label>{t[0].CD}&nbsp;&nbsp;<label>核心区长度(米)：</label>{t[0].HXQCD}&nbsp;&nbsp;<label>缓冲区长度(米)：</label>{t[0].HCQCD}&nbsp;&nbsp;*/}
              {/*<label>实验区长度(米)：</label>{t[0].SYQCD}</p>*/}
              {/*<p><label>图斑编号：</label>{t[0].TBBH}&nbsp;&nbsp;<label>监测批次：</label>{t[0].JCPC}&nbsp;&nbsp;*/}
              {/*<label>数据源：</label>{t[0].SJY}</p>*/}
              <p><label>地理位置：</label>{t[0].SHENG}省{t[0].SHI}市{t[0].XIAN}{t[0].CUN}</p>
              <p><label>唯一编码：</label>{t[0].CODE}&nbsp;&nbsp;</p>
              <p><label>中心经度：</label><span className={styles.width}>{t[0].ZXJD}</span><label>中心纬度：</label>{t[0].ZXWD}
              </p>
              <p><label>一级类型：</label><span className={styles.width}>{t[0].YJLX}</span>
                <label>保护地类型：</label><span className={styles.width}>{type(t[0].BHDLX)}</span>
                <label>保护地级别：</label>{type3(t[0].BHDJB)}</p>
              <p><label>图斑编号：</label><span className={styles.width}>{t[0].TBBH}</span><label>监测批次：</label><span
                className={styles.width}>{t[0].JCPC}</span>
                <label>数据源：</label>{t[0].SJY}</p>
              <p><label>功能分区：</label><span className={styles.width}>{t[0].GNFQ}</span><label>建成时间：</label>{t[0].JCSJ}
              </p>
              <p><label>总长度(米)：</label><span className={styles.width}>{t[0].CD}</span></p>
              <p><label>核心区长度(米)：</label><span className={styles.width}>{t[0].HXQCD}</span></p>
              <p><label>缓冲区长度(米)：</label><span className={styles.width}>{t[0].HCQCD}</span></p>
              <p><label>实验区长度(米)：</label>{t[0].SYQCD}</p>
            </div>
          </Modal>
          // {/*<Table columns={columns_human_road} dataSource={t}/>*/}
        );
      } else if (t[0].shapetype == "变化道路") {
        return (
          <Modal
            title="属性表"
            visible={this.state.visible}
            onCancel={this.tubanModalClose}
            style={{ top: 200 }}
            footer={null}
            maxable={false}
            minable={false}
            width={560}>
            <div className={styles.showttype}>
              <p><label>唯一编码：</label>{t[0].CODE}&nbsp;&nbsp;</p>
              <p><label>变化类型：</label><span className={styles.width2}>{t[0].YJLX}</span>
                <label>变化情况：</label><span className={styles.width2}>{type2(t[0].BHQK)}</span></p><p>
                <label>前时相：</label><span className={styles.width2}>{t[0].QSX}</span><label>后时相：</label>{t[0].HSX}</p>
              <p><label>保护地类型：</label><span className={styles.width2}>{type(t[0].BHDLX)}</span><label>保护地名称：</label>{t[0].BHDMC}</p>
              <p><label>功能分区：</label><span className={styles.width2}>{t[0].GNFQ}</span><label>变化长度(米)：</label>{t[0].CD}</p>
            </div>
          </Modal>
          // {/*<Table columns={columns_act_road} dataSource={t} scroll={{ x: 1600 }}/>*/}
        );
      } else if (t[0].shapetype == "变化面") {
        return (
          <Modal
            title="属性表"
            visible={this.state.visible}
            onCancel={this.tubanModalClose}
            style={{ top: 200 }}
            footer={null}
            maxable={false}
            minable={false}
            width={560}>
            <div className={styles.showttype}>
              <p><label>唯一编码：</label>{t[0].CODE}&nbsp;&nbsp;</p>
              <p><span className={styles.width2}><label>变化类型：</label>{t[0].YJLX}</span>
                <label>变化情况：</label><span className={styles.width2}>{type2(t[0].BHQK)}</span></p>
              <p>
              <span className={styles.width2}><label>前时相：</label>{t[0].QSX}</span><label>后时相：</label>{t[0].HSX}</p>
              <p><span className={styles.width2}><label>保护地类型：</label>{type(t[0].BHDLX)}</span><label>保护地名称：</label>{t[0].BHDMC}</p>
              <p><span className={styles.width2}><label>功能分区：</label>{t[0].GNFQ}</span><label>变化面积(公顷)：</label>{t[0].MJ}</p>
            </div>
            {/*// <Table columns={columns_act_mian} dataSource={t} scroll={{ x: 1600 }}/>*/}
          </Modal>
        );
      } else if (t[0].shapetype == "小班") {
        return (
          <Modal
            title="属性表"
            visible={this.state.visible}
            onCancel={this.tubanModalClose}
            style={{ top: 200 }}
            footer={null}
            maxable={false}
            minable={false}
            className={styles.shapelist2}>
            <Table columns={columns_sm} dataSource={t} scroll={{ x: 5000 }}/>
          </Modal>
        );
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tubanOneShape.length > 0) {
      this.setState({
        visible: nextProps.visible
      });
    }
  }

  render() {
    const { tubanOneShape } = this.props;
    console.log(tubanOneShape);
    return (
      <div>
        {this.renderHtml(tubanOneShape)}
      </div>
    );
  };
}

TubanModal.propTypes = {
  visible: PropTypes.bool
};

