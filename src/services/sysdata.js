import { request, config } from '../utils';

const { apiUrl } = config;

//系统对比-时相选择
export async function humanAct() {
  let url = apiUrl + "/humanActivity/layerOption?type=1";
  let option = {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    // body: JSON.stringify(params)
  };
  return request(url, option);
}


//系统对比-表格文件+矢量文件+坐标
export async function Table0(params) {
  let url = apiUrl + "/layerCompare/compare";
  // "layerId="+params.layerId+"&radius="+params.radius;
  // let url = "http://172.16.5.47:3080/haserver/layerCompare/compare";
  let option = {
    method: "POST",
    headers: {
      'Authorization': localStorage.getItem('sessionId')
    },
    body: params
  };
  return request(url, option);
}

//数据对比获取接口
export async function dataCompare(params) {
  let url = apiUrl + "/importPoints/option";
  // "layerId="+params.layerId+"&radius="+params.radius;
  // let url = "http://172.16.5.47:3080/haserver/layerCompare/compare";
  let option = {
    method: "get",
    headers: {
      'Authorization': localStorage.getItem('sessionId')
    },
    // body: params
  };
  return request(url, option);
}

