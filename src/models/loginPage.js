import { routerRedux } from 'dva/router';
import { login, logout, modify } from '../services/login';
import { message } from 'antd'


export default {

  namespace: 'loginPage',

  state: {
    user: ""
  },

  subscriptions: {},

  effects: {
    * login({ payload, }, { put, call }) {
      let progresshidden = false;
      yield put({ type: 'updateLogined', payload: { progresshidden } });
      const { data } = yield call(login, payload);
      console.log(data);
      if (data.code === 0) {
        localStorage.clear();
        sessionStorage.setItem('login', true);
        localStorage.setItem('user', data.data.name);
        localStorage.setItem('sessionId', data.data.sessionid);
        localStorage.setItem('psd', data.data.password);
        localStorage.setItem('protectedareaid', data.data.protectedareaid);
        localStorage.setItem('rolegradeid', data.data.rolegradeid);

        let user = data.data;
        //global.user = {
        //  "sessionid": sessionid,
        //  "account": account,
        //  "logined": logined
        //};

        yield put({
          type: 'updateLogined',
          payload: { user }
        });
        // message.success('登录成功');
        yield put(routerRedux.push('/indexpage'));
        //yield put({type: 'app/init'});;
      } else {
        message.error(data.msg);
      }
    },
    * logout({ payload, }, { call, put }) {
      const { data } = yield call(logout);
      // console.log(data);
      // if (data.code==0){
      //   localStorage.clear();
      //   let user ="";
      //   yield put({type: 'updateLogout', payload: { user }});
      //   message.info('退出系统成功');
      //   window.location.href="/";
      //   //yield put(routerRedux.push('/'));
      // } else {
      //   message.info('退出系统成功');
      //   window.location.href="/";
      //   throw (data)
      // }
      localStorage.clear();
      const href = window.location.href.split("#/")[0];
      window.location.href = href;
      sessionStorage.removeItem('login');
    },

    * modify({ payload, callback }, { call, put }) {
      const { data } = yield call(modify, payload);
      if (callback && typeof callback === 'function') {
        callback(data); // 返回结果
      }
    },
  },

  reducers: {
    updateLogined(state, action) {
      return { ...state, ...action.payload };
    },
    updateLogout(state, action) {
      return { ...state, ...action.payload };
    }
  },

};
