import React, { Component } from 'react';
import { connect } from 'dva';
import Earth from '../../components/Earth/Earth';
import Header from '../../components/Header/Header';
import Toolbar from '../../components/Toolbar/Toolbar';
import Measure from '../../components/Toolbar/Measure';
import LayerManage from '../../components/layerManger/layerManger';
import AddImageModal from "../../components/AddImageModal/AddImageModal";
import AddCoordinateModal from "../../components/AddCoordinateModal/AddCoordinateModal";
import ImportRSTableModal from "../../components/ImportRSTableModal/ImportRSTableModal";
import ImportRSVectorModal from "../../components/ImportRSVectorModal/ImportRSVectorModal";
import ContrastRSDataModal from "../../components/ContrastRSDataModal/ContrastRSDataModal";
import ContrastImageModal from "../../components/ContrastImageModal/ContrastImageModal";
import AddTaskModal from "../../components/AddTaskModal/AddTaskModal";
import TaskQueryModal from "../../components/TaskQueryModal/TaskQueryModal";
import ServiceCheckModal from "../../components/ServiceCheckModal/ServiceCheckModal";
import DataUploadModal from "../../components/DataUploadModal/DataUploadModal";
import SetAdviceModal from "../../components/SetAdviceModal/SetAdviceModal";
import StatisticalAnalyModal from "../../components/StatisticalAnalyModal/StatisticalAnalyModal";
import AddReportModal from "../../components/AddReportModal/AddReportModal";
import UploadReportModal from "../../components/UploadReportModal/UploadReportModal";
import VerificationManagementModal from "../../components/VerificationManagementModal/VerificationManagementModal";
import AddVectorModal from "../../components/AddVectorModal/AddVectorModal";
import ReportListModal from "../../components/ReportListModal/ReportListModal";
import SelfCheckModal from "../../components/SelfCheckModal/SelfCheckModal";
import TubanModal from "../../components/TubanModal/TubanModel";


import styles from './IndexPage.less';
import { Carousel, Modal, DatePicker, Icon, Spin } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';


const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';


class IndexPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cesiumControl: {},
    }
  };

  showVerificationManagementModal = () => {
    this.setState({
      validmanagentModalShow: true
    })
    // alert(this.state.addCoordinateModalShow)
  }

  getCesiumControl = (obj) => {
    this.setState({
      cesiumControl: obj
    });
  };

  render() {
    const { dispatch, indexPage } = this.props;
    const {
      menuSelect, validmanagentModalShow, selfCheck, layerListImage,
      layerListArea,
      layerListProtectedArea,
      layerListHumanActiviy,
      layerListStigmata, shapeid, taskTuban, tubanDraw,fun,
      selfCheckModalShow, uploadReportModalShow, reportListModalShow,
      drawPointer, addReportModalShow, queryTask, tubanShape, taskMap,
      taskMapChose, layerList, taskTeam, tb_bh, taskQueryModalShow,
      statisticalAnalysisModalShow, setAdviceModalShow, serviceCheckModalShow,
      dataUploadModalShow, addImageModalShow, addVectorModalShow, saveLayer,
      addCoordinateModalShow, importRSTableModalShow, importRSVectorModalShow, shapeType, tubanShape2, layerMap2,
      contrastRSDataModalShow, contrastImageModalShow, addTaskModalShow, matchLayer, matchLayer2, selfCheckdetail, measureToolShow, measureToolSelect, drawToolShow, drawToolSelect,
      tubanModalClose, setadviceMap, tubanOneShape, tubanShape3, constractHumanact, rsdatacontract, layerMap, layerManagerSelectedKeys, layerManagerCheckedKeys, layerListSDHC,
      layerListZZHC, layerListHZTB, dataCompare, marker, polyline, polygon, protectAreaid, watchService, powerMenu, addvareaname, loadingGlobal, shapeChoseid, layermanagerhidden, contrastImage, layerhad, layerhad2, handlerAction,
    } = indexPage;
    console.log(saveLayer)
    const cesiumControl = this.state.cesiumControl;
    const headerProps = {
      dispatch,
      menuSelect,
      layerManagerCheckedKeys,
      powerMenu,
      cesiumControl,
      saveLayer
    };
    const layerProps = {
      cesiumControl,
      layermanagerhidden,
      dispatch,
      layerListImage,
      layerListArea,
      layerListProtectedArea,
      layerListHumanActiviy,
      layerListStigmata,
      menuSelect,
      layerManagerSelectedKeys, layerManagerCheckedKeys,
      layerMap,
      protectAreaid,
      layerListSDHC,
      layerListZZHC, layerListHZTB,
      tubanShape,
      loadingGlobal,
      saveLayer,
      layerhad, layerhad2
    };

    //影像对比
    const imageContrast = {
      cesiumControl,
      contrastImage,
      protectAreaid,
      layerhad,
      layerhad2,
    };
    //地球相关数据
    const earthData = {
      'layerList': layerList, //图层数据
      'taskMapChose': taskMapChose,//地图选择
      'taskMap': taskMap,
      'drawPointer': drawPointer,//是否是绘制图斑功能开启
      'matchLayer': matchLayer,//矢量图层初始化数据
      'matchLayer2': matchLayer2,//影像图层初始化数据
      'tubanShape': tubanShape,//单个图斑属性用表
      'selfCheckdetail': selfCheckdetail,//自主巡查
      'layerMap': layerMap,//单个点击图斑弹窗
      'tb_bh': tb_bh,
      'tubanShape3': tubanShape3,
      'layerMap2':layerMap2
      // 'count': count,
      // 'count2': count2,
      // 'count3': count3,
    };

    //创建任务数据
    const addtask = {
      tb_bh,
      taskTeam,
      layerListHumanActiviy,
      cesiumControl,
      tubanShape2,
      taskMapChose,
      tubanDraw,
      layerhad,
      layerhad2,
      protectAreaid,
      marker, polyline, polygon, loadingGlobal,saveLayer
    }

    const toolbarPro = {
      cesiumControl,
    }

    //查询任务数据
    const querytask = {
      taskTeam,
      queryTask,
      cesiumControl,saveLayer,
      layerhad, layerhad2
    }

    //数据上传
    const dataupload = {
      layerList,
      taskTuban,
    }

    //单点坐标
    const coordinate = {
      layerListHumanActiviy,
      cesiumControl,
      tubanShape
    }

    //核查管理
    const verification = {
      layerListHumanActiviy,
      cesiumControl,saveLayer,
      layerhad, layerhad2
    }

    //处置意见
    const setadvice = {
      layerListHumanActiviy,
      protectAreaid,
      cesiumControl,
      layerhad,
      layerhad2,
      setadviceMap,
      tubanShape3,
      layerMap2,saveLayer
    }

    //表格导入
    const importrstable = {
      layerList
    }

    //矢量导入
    const importrsvertor = {
      layerList
    }

    //系统数据对比
    const rsdatacontrast = {
      cesiumControl,
      layerListHumanActiviy,
      constractHumanact,
      rsdatacontract,
      dataCompare,saveLayer,
      layerhad, layerhad2
    }

    //自主巡护
    const selfcheck = {
      selfCheck,
      selfCheckdetail,
      cesiumControl,
      handlerAction,saveLayer,
      layerhad, layerhad2
    }

    //工具栏
    const toolbar = {
      cesiumControl,
      measureToolShow,
      measureToolSelect,
      drawToolShow,
      drawToolSelect,
      tubanShape,
      dispatch,
      //attributeListButtonEnable,
      shapeid,
      shapeType,
      shapeChoseid,
      addvareaname
    }

    //测量工具栏
    const measurebar = {
      cesiumControl,
      dispatch,
      measureToolShow,
      measureToolSelect,
      drawToolShow,
      drawToolSelect,
      handlerAction,
    }

    //单个图斑属性表
    const onetuban = {
      tubanOneShape
    }

    //设备监控
    const watch_Service = {
      watchService,
      fun
    }

    //统计分析
    const statics = {
      protectAreaid
    }

    //报告管理
    const reportlist = {
      protectAreaid
    }

    //报告生成
    const reportadd = {
      protectAreaid
    }
    return (
      <div className={styles.main}>
        {/*<div className={styles.example}>*/}
        {/*<Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}/>*/}
        {/*</div>*/}
        {/*<div className={styles.loading} hidden={!loadingGlobal}>*/}
        {/*<Spin spinning={loadingGlobal} delay={500} size="large" tip="正在加载..."*/}
        {/*indicator={<Icon type="loading" style={{ fontSize: 28 }} spin/>}/>*/}
        {/*</div>*/}
        <Header {...headerProps} showVerifimodal={this.showVerificationManagementModal}/>
        <Earth cesiumControl={this.state.cesiumControl} getCesiumControl={(this.getCesiumControl).bind(this)}
               dispatch={dispatch} earthData={earthData}/>
        <Toolbar {...toolbar}/>
        <Measure {...measurebar}/>
        <LayerManage  {...layerProps}/>
        <VerificationManagementModal visible={validmanagentModalShow} dispatch={dispatch} {...verification}/>
        <AddImageModal visible={addImageModalShow} dispatch={dispatch}/>
        {/*<AddVectorModal visible={addVectorModalShow} dispatch={dispatch}/>*/}
        {/*<AddCoordinateModal visible={addCoordinateModalShow} dispatch={dispatch} {...coordinate}/>*/}
        {/*<ImportRSTableModal visible={importRSTableModalShow} dispatch={dispatch} {...importrstable}/>*/}
        {/*<ImportRSVectorModal visible={importRSVectorModalShow} dispatch={dispatch} {...importrsvertor}/>*/}
        <ContrastRSDataModal visible={contrastRSDataModalShow} dispatch={dispatch} {...rsdatacontrast}/>
        <ContrastImageModal visible={contrastImageModalShow} dispatch={dispatch} {...imageContrast}/>
        <AddTaskModal visible={addTaskModalShow} dispatch={dispatch} {...addtask}/>
        <TaskQueryModal visible={taskQueryModalShow} dispatch={dispatch} {...querytask}/>
        <ServiceCheckModal visible={serviceCheckModalShow} dispatch={dispatch} {...watch_Service}/>
        {/*<DataUploadModal visible={dataUploadModalShow} dispatch={dispatch} {...dataupload}/>*/}
        <SetAdviceModal visible={setAdviceModalShow} dispatch={dispatch} {...setadvice}/>
        <StatisticalAnalyModal visible={statisticalAnalysisModalShow} dispatch={dispatch} {...statics}/>
        <AddReportModal visible={addReportModalShow} dispatch={dispatch} {...reportadd}/>
        {/*<UploadReportModal visible={uploadReportModalShow} dispatch={dispatch}/>*/}
        <ReportListModal visible={reportListModalShow} dispatch={dispatch} {...reportlist}/>
        <SelfCheckModal visible={selfCheckModalShow} dispatch={dispatch} {...selfcheck}/>
        <TubanModal visible={tubanModalClose} dispatch={dispatch} {...onetuban}/>
      </div>
    );
  }
}

IndexPage.propTypes = {};

// export default connect()(IndexPage);
export default connect(({ indexPage }) => ({
  indexPage
}))(IndexPage);
