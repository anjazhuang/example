import styles from './SelfCheckModal.less';
import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, DatePicker, Button, Select, Input, Icon, Table } from 'antd';
import { removeInputAction } from './../Earth/func';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
// import SeniorModal from '../cDragmodal/cDragModel'

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const Search = Input.Search;

export default class SelfCheckModal extends Component {
  state = {
    visible: false,
    visible2: false,//自定义弹窗
  };

  selfCheckModalClose = () => {
    const { dispatch, cesiumControl,saveLayer,layerhad, layerhad2 } = this.props;
    let savelayer=saveLayer;
    savelayer.splice(saveLayer.indexOf("自主巡查"), 1);
    if(savelayer.length==0){
      cesiumControl.showLayer(layerhad, layerhad2);
    }
    cesiumControl.removeSelfCheck();
    // this.setState({
    //   visible: false,
    // });
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        selfCheckModalShow: false
      }
    });
    this.setState({
      visible2: false
    })
  }

  selfCheckModalClose2 = () => {
    this.setState({
      visible2: false
    })
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
    const { selfCheck, dispatch, selfCheckdetail, cesiumControl, handlerAction } = this.props;
    // console.log(selfCheck);
    const columns = [{
      title: '序号',
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '类别',
      dataIndex: 'tasktype',
      key: 'type',
    }, {
      title: '唯一标识',
      key: 'taskname',
      dataIndex: 'taskname',
    }, {
      title: '时间',
      key: 'endtime',
      dataIndex: 'endtime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }];

    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="自主巡查"
            visible={this.state.visible}
            footer={null}
            mask={true}
            maxable={false}
            minable={false}
            width={500}
            style={{ top: 200 }}
            onCancel={this.selfCheckModalClose}
            classNmae={styles.list}
          >
            <Table columns={columns} dataSource={selfCheck}
                   onRow={(record) => {
                     return {
                       onClick: () => {
                         dispatch({
                           type: 'indexPage/SelfCheckdetail',
                           payload: {
                             "pageIndex": 1,
                             "pageSize": 9999,
                             "parameterObject": {
                               "id": record.id
                             }
                           },
                           callback: (res) => {
                             if (res) {
                               // console.log(res);// 请求完成后返回的结果
                               var geo = res.data[0].geometry;
                               if (res.code === 0) {
                                 /*console.log(handlerAction);
                                 cesiumControl.measure("destory");*/
                                 cesiumControl.removeSelfCheck();
                                 removeInputAction(handlerAction, cesiumControl);
                                 cesiumControl.selfCheckdetail(JSON.parse(geo)[0], res.data[0].selfTaskSpotsList);
                                 // res.data[0].selfTaskSpotsList.map((v, i) => {
                                 //
                                 // })
                                 this.setState({
                                   visible2: true
                                 })
                               }
                             }
                           }
                         });
                       },
                     };
                   }}/>
          </Modal>
          <Modal
            title={selfCheckdetail.taskname}
            visible={this.state.visible2}
            footer={null}
            mask={true}
            maxable={false}
            minable={false}
            className={styles.taskdetail}
            onCancel={this.selfCheckModalClose2}
          >
            <p className={styles.content}>任务详情：{selfCheckdetail.taskcontent}</p>
            <p className={styles.bottom}>任务人：张峰</p>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

SelfCheckModal.propTypes = {
  visible: PropTypes.bool
};

