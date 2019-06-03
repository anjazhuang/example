import { routerRedux } from 'dva/router';
// import { login,logout } from '../services/login';
import { message } from 'antd';
import {
  addImages,
  addVector,
  getAreaLayer,
  getProtectarea,
  getHumanActLayer,
  getStigmataLayer,
  getIdImageLayer,
  drawLayer,
  selfTasks,
  searchAddv,
  getVerificationTasks,
  shapeLayer
} from '../services/layer';
import {
  taskUp,
  taskAddTeam,
  queryTask,
  uploadPic,
  allTuban,
  uploadPicTrail,
  submitTask,
  serviceCheck,
  saveCheckOpinion,
  saveFirstCheckOpinion,
  allImage
} from '../services/task';
import { Selfinspection, Selfinspectiondetail } from '../services/inspection';
import { humanAct, Table0, dataCompare } from '../services/sysdata';
import { reportList, reportAdd } from '../services/reportadmin';
import { Staticanalysis } from '../services/static';
import { powerMenu } from '../services/login';
import { menuContent } from '../components/Header/MenuContent';
// import "../../assets/cesium/Build/CesiumUnminified/Cesium.js";
// import "../../assets/cesium/Build/CesiumUnminified/viewerCesiumNavigationMixin.js";
// import "../../assets/DrawHelper/DrawHelper.js";
// import "../../assets/MeasureHelper/MeasureHelper.js";

export default {
  namespace: 'indexPage',
  state: {
    menuSelect: {
      'menu-base-data_show_online_image': false,//显示在线影像
      'menu-base-data_show_protect_image': false,//显示保护地影像
      'menu-base-data_show_base_info': false,//显示基础信息
      'menu-base-data_show_protect_info': false,//显示保护地信息
      'menu-base-data_show_small_data': false,//显示小班数据
      'menu-base-data_show_human_action': false,//显示人类活动
      'menu-base-data_show_humanAct_change': false,//显示人类活动变化
      'menu-base-data_show_fieldAudit': false,//显示实地核查数据
      'menu-base-data_independent_inspection': false,//显示自主巡查数据
      'menu-base-data_show-draw-layer': false,//显示绘制图斑
    },
    layerList: [],
    layerListImage: [],//影像图层
    layerListArea: [],//基础地理信息
    layerListProtectedArea: [],//保护地信息
    layerListHumanActiviy: [],//人类活动变化
    layerListStigmata: [],//小班数据
    layerListSDHC: [],//实地核查
    layerListZZHC: [],//自主核查
    layerListHZTB: [],//绘制图斑
    matchLayer: [],//初始化矢量图层
    matchLayer2: [],//初始化影像图层
    protectAreaid: [],//初始化保护地(目前暂时40个)
    tb_bh: [],//图斑编号数组
    taskTeam: [],//任务组编号
    queryTask: [],//查询任务数组
    tubanShape: [],//图层管理图斑属性
    tubanShape2: [],//创建任务图斑属性
    tubanShape3: [],//处置意见图斑属性
    tubanDraw: [],//图斑绘制选择是否
    tubanOneShape: [],//单个图斑属性
    taskTuban: [],//已创建任务图斑数组
    selfCheck: [],//自主巡护列表
    selfCheckdetail: [],//自主巡护列表详情
    constractHumanact: [],//系统数据对比时相
    watchService: [],//设备监控数据列
    contrastImage: [],//影像对比数据
    tubanModalClose: false,//点击单个图斑弹窗属性表
    validmanagentModalShow: false,//核查管理
    addImageModalShow: false,//添加影像数据
    addVectorModalShow: false,//添加矢量文件
    addCoordinateModalShow: false,//输入单点坐标
    importRSTableModalShow: false,//遥感表格导入
    importRSVectorModalShow: false,//遥感矢量导入
    contrastRSDataModalShow: false,//遥感系统数据对比
    contrastImageModalShow: false,//遥感影像对比
    addTaskModalShow: false,//创建任务
    taskQueryModalShow: false,//任务查询
    serviceCheckModalShow: false,//设备监控
    dataUploadModalShow: false,//数据上传
    setAdviceModalShow: false,//处置意见
    statisticalAnalysisModalShow: false,//统计分析
    taskMapChose: false,//实地核查-地图选择开启
    taskMap: false,//实地核查图斑开启（和图层管理做区别）
    setadviceMap: false,//处置意见图斑开启（和图层管理做区别）
    layerMap: false,//图层管理点击单个图斑不和别的
    layerMap2: false,//处置意见点击单个图斑不和别的
    drawPointer: false,//画图功能
    addReportModalShow: false,//报告生成
    uploadReportModalShow: false,//报告上传
    reportListModalShow: false,//报告列表
    selfCheckModalShow: false,//自主巡查
    shapeid: 0,//属性表分类id
    measureToolShow: false,
    measureToolSelect: false,
    drawToolShow: false,
    drawToolSelect: false,
    rsdatacontract: [],//系统数据表格数据
    layerManagerSelectedKeys: [],
    layerManagerCheckedKeys: [],
    powerMenu: [],
    attributeListButtonEnable: false,//属性表按钮是否可用
//attributeListButtonEnable:false,//属性表按钮是否可用
    loadingGlobal: false,//全局加载条
    layermanagerhidden: false,//创建任务时图层管理显示隐藏逻辑
    layerhad: [],//创建任务时已有图层的记录
    layerhad2: [],//创建任务时已有图层的记录
    shapeType: "",//属性表类型
    shapeChoseid: "",//选择对应的属性表
    addvareaname: [],//行政区名字
    marker: false,
    polyline: false,
    polygon: false,
    handlerAction: "",
    dataCompare: [],//遥感验证-数据对比
    // count: 0,//遥感验证-相交记录
    // count2: 0,//遥感验证-人类活动变化未相交记录
    // count3: 0//遥感验证-验证点位为相交记录
    saveLayer:[],//保存菜单加载图斑
    saveLayer1:[],//保存遥感
    saveLayer2:[],//保存创建任务
    saveLayer3:[],//保存任务查询
    saveLayer4:[],//保存核查管理
    saveLayer5:[],//保存处置意见
    saveLayer6:[],//保存自主巡查
    fun:"",
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/indexpage') {
          if (!sessionStorage.getItem('login')) {
            const href = window.location.href.split("#/")[0];
            window.location.href = href
          } else {
            //判断是否已加载登录数据
            dispatch({
              type: 'getProtectarea'
            });
            dispatch({
              type: 'taskAddTeam', payload: {
                pageIndex: 1, pageSize: 5, parameterObject: {
                  enabled: 1,
                }
              }
            });
            dispatch({ type: 'getPower' });
            dispatch({
              type: 'SearchAddv2', payload: {
                addvnm: ""
              }
            });
          }
        }
      });
    }
  },

  effects: {
    * getPower({ payload }, { call, put, select }) {
      // progressName = "正在加载权限数据......";
      const { data } = yield call(powerMenu);
      const menuData = data.data;//读取菜单信息
      console.log(data);
      const userMenu = menuData.map(item => item.selector);
      // console.log(userMenu);
      menuContent.forEach((item) => { //一级循环
        // if ((userMenu.indexOf(item.selector) > -1)) {
        //   item.hidden = true;
        // }
        if (item.hasOwnProperty('children')) {
          item.children.forEach((item2) => { //二级循环
            if ((userMenu.indexOf(item2.selector) === -1)) {
              item2.hidden = true;
            }
            // if (item2.hasOwnProperty('children')) {
            //   item2.children.forEach((item3) => { //三级循环
            //     if ((userMenu.indexOf(item3.selector) === -1)) {
            //       item3.hidden = true;
            //     }
            //   })
            // }
          })
        } else {
          if ((userMenu.indexOf(item.selector) === -1)) {
            item.hidden = true;
          }
        }
      });
      // console.log(menuContent);
      // percent += 50;
      // sessionStorage.setItem("menuData", JSON.stringify(menuContent));
      yield put({ type: 'updateState', payload: { powerMenu: menuContent } });
      // yield put({ type: 'progressFinal' });
    }
    ,

    * getProtectarea({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getProtectarea, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
      if (data.code === 0) {
        let protectAreaid = [];
        data.data.map((v, i) => {
          protectAreaid.push({ id: v.id, name: v.name });
        });
        // sessionStorage.setItem("layerList", JSON.stringify(layerList));
        yield put({ type: 'updateState', payload: { protectAreaid } });
      } else {
        message.error(data.msg);
      }
    }
    ,

    * getAreaLayer({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getAreaLayer, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * getStigmataLayer({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getStigmataLayer, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * getImageLayer({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getIdImageLayer, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * getVerificationTasks({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getVerificationTasks, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * selfTasks({ payload, callback }, { select, call, put }) {
      const { data } = yield call(selfTasks, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * drawLayer({ payload, callback }, { select, call, put }) {
      const { data } = yield call(drawLayer, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,
    * getHumanActLayer({ payload, callback }, { select, call, put }) {
      const { data } = yield call(getHumanActLayer, payload);
      // console.log(data);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * getHumanAct({ payload, callback }, { select, call, put }) {
      // progressName = "正在加载图层数据......";
      const { data } = yield call(humanAct);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
      // console.log(data);
      if (data.code === 0) {
        const constractHumanact = data.data;
        // sessionStorage.setItem("layerList", JSON.stringify(layerList));
        yield put({ type: 'updateState', payload: { constractHumanact } });
      } else {
        message.error(data.msg);
      }
    }
    ,

    * taskUp({ payload, callback }, { call, put }) {
      // progressName = "正在加载图层数据......";
      const { data } = yield call(taskUp, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * reportList({ payload, callback }, { call, put }) {
      // progressName = "正在加载图层数据......";
      const { data } = yield call(reportList, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    },

    * reportAdd({ payload, callback }, { call, put }) {
      // progressName = "正在加载图层数据......";
      const { data } = yield call(reportAdd, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,
    * taskAddTeam({ payload }, { call, put }) {
      const { data } = yield call(taskAddTeam, payload);
      // console.log(data);
      if (data.code === 0) {
        const taskTeam = data.data;
        yield put({ type: 'updateState', payload: { taskTeam } });
      }
    }
    ,

    * queryTask({ payload, callback }, { call, put }) {
      const { data } = yield call(queryTask, payload);
      // console.log(data);
      // if (data.code === 0) {
      //   const queryTask = data.data;
      //   yield put({ type: 'updateState', payload: { queryTask } });
      // }
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * uploadPic({ payload }, { call, put }) {
      const { data } = yield call(uploadPic, payload);
      // console.log(data);
      if (data.code === 0) {
        message.success("提交照片成功")
      } else {
        message.error(data.msg)
      }
    }
    ,

    * uploadPicTrail({ payload }, { call, put }) {
      const { data } = yield call(uploadPicTrail, payload);
      // console.log(data);
      if (data.code === 0) {
        message.success("提交轨迹文件成功")
      } else {
        message.error(data.msg)
      }
    }
    ,

    * submitTask({ payload }, { call, put }) {
      // console.log(payload.data);
      // console.log(payload.data2);
      const { data } = yield call(submitTask, payload.para);
      // console.log(data);
      if (data.code === 0) {
        message.success("提交成功");
        if (data.insertid !== null) {
          yield put({ type: 'uploadPic', payload: { data: payload.data1, id: data.insertid } });
          yield put({ type: 'uploadPicTrail', payload: { data: payload.data2, id: data.insertid } });
        } else {
          yield put({ type: 'uploadPic', payload: { data: payload.data1, id: payload.id } });
          yield put({ type: 'uploadPicTrail', payload: { data: payload.data2, id: payload.id } });
        }
      } else {
        message.error(data.msg)
      }
    }
    ,

    * AddImage({ payload }, { call, put }) {
      const { data } = yield call(addImages, payload);
      // console.log(data);
      if (data.code === 0) {
        message.success("添加影像文件成功");
        yield put({ type: 'getLayer', payload: { pageIndex: 1, pageSize: 99999 } });
      } else {
        message.error(data.msg)
      }
    }
    ,

    * AddVector({ payload }, { call, put }) {
      const { data } = yield call(addVector, payload);
      // console.log(data);
      if (data.code === 0) {
        message.success("添加矢量文件成功");
        yield put({ type: 'getLayer', payload: { pageIndex: 1, pageSize: 99999 } });
      } else {
        message.error(data.msg)
      }
    }
    ,

    * SelfCheck({ payload }, { call, put }) {
      const { data } = yield call(Selfinspection, payload);
      // console.log(data);
      if (data.code === 0) {
        const selfCheck = data.data;
        yield put({ type: 'updateState', payload: { selfCheck } });
      } else {
        message.error(data.msg)
      }
    }
    ,

    * SelfCheckdetail({ payload, callback }, { call, put }) {
      const { data } = yield call(Selfinspectiondetail, payload);
      // console.log(data);
      if (data.code === 0) {
        //回调方法
        if (callback && typeof callback === 'function') {
          callback(data); // 返回结果
        }
        const selfCheckdetail = data.data[0];
        yield put({ type: 'updateState', payload: { selfCheckdetail } });
      } else {
        message.error(data.msg)
      }
    }
    ,

    * ConstRsdatatable({ payload, callback }, { call, put }) {
      const { data } = yield call(Table0, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * ServiceCheck({ payload, callback }, { call, put }) {
      const { data } = yield call(serviceCheck, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * Staticanalysis({ payload, callback }, { call, put }) {
      const { data } = yield call(Staticanalysis, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * SaveCheckOpinion({ payload, callback }, { call, put }) {
      const { data } = yield call(saveCheckOpinion, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * SaveFirstCheckOpinion({ payload, callback }, { call, put }) {
      const { data } = yield call(saveFirstCheckOpinion, payload)
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * SearchAddv({ payload, callback }, { call, put }) {
      const { data } = yield call(searchAddv, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    }
    ,

    * SearchAddv2({ payload, callback }, { call, put }) {
      const { data } = yield call(searchAddv, payload);
      if (data.code === 0) {
        const addvareaname = data.data;
        // sessionStorage.setItem("layerList", JSON.stringify(layerList));
        yield put({ type: 'updateState', payload: { addvareaname } });
      } else {
        message.error(data.msg);
      }
    },

    * allImage({ payload, callback }, { call, put }) {
      const { data } = yield call(allImage, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    },


    * allTuban({ payload, callback }, { call, put }) {
      // console.log(payload.geojson);
      const { data } = yield call(allTuban, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
      // let geojsonArray = [], dataTaskArray = [], dataArray = [];
      // const { data } = yield call(allTuban, payload.para);
      // if (data.code === 0) {
      //   let taskTuban = [];
      //   data.data.map((v, i) => {
      //     if (v.protectedarea == null) {
      //       dataTaskArray.push({ spot: v.spots, id: v.id });
      //     }
      //   });//数据库保护地为空的数据
      //   data.data.map((v, i) => {
      //     dataArray.push(v.spots);
      //   });//数据库全部的数据
      //   payload.geojson.features.map((v, i) => {
      //     geojsonArray.push({ spot: v.properties.TB_BH, id: null })
      //   });//geojson全部的数据
      //   for (let i = 0; i < geojsonArray.length; i++) {
      //     if (dataArray.indexOf(geojsonArray[i].spot) > -1) {
      //       geojsonArray.splice(i, 1);
      //       i -= 1
      //     }
      //   }
      //   yield put({ type: 'updateState', payload: { taskTuban: dataTaskArray.concat(geojsonArray) } });
      // }
    },

    * queryShape({ payload, callback }, { call, put }) {
      // console.log(payload.geojson);
      const { data } = yield call(shapeLayer, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
      // let geojsonArray = [], dataTaskArray = [], dataArray = [];
      // const { data } = yield call(allTuban, payload.para);
      // if (data.code === 0) {
      //   let taskTuban = [];
      //   data.data.map((v, i) => {
      //     if (v.protectedarea == null) {
      //       dataTaskArray.push({ spot: v.spots, id: v.id });
      //     }
      //   });//数据库保护地为空的数据
      //   data.data.map((v, i) => {
      //     dataArray.push(v.spots);
      //   });//数据库全部的数据
      //   payload.geojson.features.map((v, i) => {
      //     geojsonArray.push({ spot: v.properties.TB_BH, id: null })
      //   });//geojson全部的数据
      //   for (let i = 0; i < geojsonArray.length; i++) {
      //     if (dataArray.indexOf(geojsonArray[i].spot) > -1) {
      //       geojsonArray.splice(i, 1);
      //       i -= 1
      //     }
      //   }
      //   yield put({ type: 'updateState', payload: { taskTuban: dataTaskArray.concat(geojsonArray) } });
      // }
    },

    * dataCompare({ payload, callback }, { call, put }) {
      // console.log(payload.geojson);
      const { data } = yield call(dataCompare);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
      // let geojsonArray = [], dataTaskArray = [], dataArray = [];
      // const { data } = yield call(allTuban, payload.para);
      // if (data.code === 0) {
      //   let taskTuban = [];
      //   data.data.map((v, i) => {
      //     if (v.protectedarea == null) {
      //       dataTaskArray.push({ spot: v.spots, id: v.id });
      //     }
      //   });//数据库保护地为空的数据
      //   data.data.map((v, i) => {
      //     dataArray.push(v.spots);
      //   });//数据库全部的数据
      //   payload.geojson.features.map((v, i) => {
      //     geojsonArray.push({ spot: v.properties.TB_BH, id: null })
      //   });//geojson全部的数据
      //   for (let i = 0; i < geojsonArray.length; i++) {
      //     if (dataArray.indexOf(geojsonArray[i].spot) > -1) {
      //       geojsonArray.splice(i, 1);
      //       i -= 1
      //     }
      //   }
      //   yield put({ type: 'updateState', payload: { taskTuban: dataTaskArray.concat(geojsonArray) } });
      // }
    }

  },
  reducers: {
    updateState(state, action) {
      //console.log('state:' + JSON.stringify(state));
      //console.log('action.payload:' + JSON.stringify(action.payload));
      return { ...state, ...action.payload };
    }
  }
  ,

}
;
