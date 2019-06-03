import fetch from 'dva/fetch';
import { message, notification, Button } from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkLoginStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkStatus(response) {
  if (getAjaxStatus(response.status)) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const href = window.location.href.split("#/")[0];
const key = `open${Date.now()}`;
const btn = (
  <Button type="primary" size="small" onClick={() => {
    notification.close(key);
    window.location.href = href
  }}>
    确认
  </Button>
);

const getAjaxStatus = (statusCode) => {
  if (statusCode == 200) {
    return true;
  } else if (statusCode === 403) {
    notification.open({
      message: '提示',
      description: '没有接口权限',
      key,
      duration: 0,
    });
  } else if (statusCode === 401) {
    // message.error("登录已超时，请重新登录");
    notification.open({
      message: '提示',
      description: '登录已超时，请重新登录',
      btn,
      key,
      duration: 0,
    });
    // window.location.href = href;
  } else {
    notification.open({
      message: '提示',
      description: '登录已超时，请重新登录',
      btn,
      key,
      duration: 0,
    });
    // window.location.href = href;
  }
  return false;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

export function loginrequest(url, options) {
  return fetch(url, options)
    .then(checkLoginStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

Array.prototype.cy = function (key) {
  var arr = this;
  var n = [arr[0]];
  for (var i = 1; i < arr.length; i++) {
    if (key === undefined) {
      if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
    } else {
      inner: {
        var has = false;
        for (var j = 0; j < n.length; j++) {
          if (arr[i][key] == n[j][key]) {
            has = true;
            break inner;
          }
        }
      }
      if (!has) {
        n.push(arr[i]);
      }
    }
  }
  return n;
}

Date.prototype.Format = function (fmt) { //author: meizz
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}



