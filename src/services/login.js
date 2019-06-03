import { request, loginrequest, config } from '../utils';

const { apiUrl } = config;

//登录接口
export async function login(payload) {
  // console.log(payload);
  let url = apiUrl + "/user/login?account=" + payload.account + "&password=" + payload.password;
  let option = {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  };
  return loginrequest(url, option);
}

//注销
export async function logout() {
  let url = apiUrl + "/user/exit";
  let option = {
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": localStorage.getItem("sessionId")
    }
  };
  return request(url, option);
}

//修改密码
export async function modify(params) {
  // console.log(params);
  let url = apiUrl + "/user/modifyPassword?newPassword=" + params.newPassword + "&oldPassword=" + params.oldPassword;
  let option = {
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": localStorage.getItem("sessionId")
    }
  };
  return request(url, option);
}

//菜单权限
export async function powerMenu(params) {
  // console.log(params);
  let url = apiUrl + "/power/webGetPower?ismenu=2";
  let option = {
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": localStorage.getItem("sessionId")
    }
  };
  return request(url, option);
}


