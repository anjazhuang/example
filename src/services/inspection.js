import { request, config } from '../utils';

const { apiUrl } = config;

//自主巡查列表接口
export async function Selfinspection(params) {
  let url = apiUrl + "/selfTasks/getSelfTaskModel";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  };
  return request(url, option);
}

//自主巡查详情列表接口
export async function Selfinspectiondetail(params) {
  let url = apiUrl + "/selfTasks/getSelfTaskModel";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  };
  return request(url, option);
}

