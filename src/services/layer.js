import { request, config } from '../utils';

const { apiUrl } = config;


//添加影像文件
export async function addImages(params) {
  let url = apiUrl + "/layer/saveImage";
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

//添加矢量文件
export async function addVector(params) {
  // console.log(params);
  let url = apiUrl + "/layer/uploadVector?sessionId=" + localStorage.getItem('sessionId') + "&name=" + params.para.name + "&bussinessType=" + params.para.bussinessType + "&protectedArea=" + params.para.protectedArea + "&type=vector";
  let option = {
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    method: "post",
    // contentType: false,
    // processData: false,
    body: params.data
  };
  return request(url, option);
}

//获取基础信息图层接口
export async function getAreaLayer(params) {
  // let url = apiUrl + "/area/select?status=1&desc=createtime";
  let url = apiUrl + "/area/select";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body:JSON.stringify(params)
  };
  return request(url, option);
}

//查询小班数据接口
export async function getStigmataLayer(params) {
  // let url = apiUrl + "/stigmata/select?status=1&desc=createtime";
  let url = apiUrl + "/stigmata/select";
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


//保护地信息
export async function getProtectarea(p) {
  // console.log(p);
  let url = apiUrl + "/protectArea/select?status=1&desc=createtime";
  // let url = apiUrl + "/protectArea/select";
  let option = {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    // body: JSON.stringify(p)
  }
  return request(url, option);
}

//根据id查找影像
export async function getIdImageLayer(p) {
  //console.log(p);
  let url = apiUrl + "/image/select";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(p)
  }
  return request(url, option);
}

//人类活动图层
export async function getHumanActLayer(p) {
  //console.log(p);
  // let url = apiUrl + "/humanActivity/select?status=1&desc=createtime";
  let url = apiUrl + "/humanActivity/select";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(p)
  }
  return request(url, option);
}

//搜索地市
export async function searchAddv(p) {
  let url = apiUrl + "/addv/location?name=" + p.addvnm;
  let option = {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    // body: JSON.stringify(p)
  }
  return request(url, option);
}

//实地核查
export async function getVerificationTasks(p) {
  let url = apiUrl + "/verificationTasks/getTrails";
  let option = {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    // body: JSON.stringify(p)
  }
  return request(url, option);
}

//自主核查
export async function selfTasks(p) {
  // let url = apiUrl + "/selfTasks/select?desc=createtime";
  let url = apiUrl + "/selfTasks/select";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(p)
  }
  return request(url, option);
}

//绘制图斑
export async function drawLayer(p) {
  // let url = apiUrl + "/drawLayer/select?desc=createtime";
  let url = apiUrl + "/drawLayer/select";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(p)
  }
  return request(url, option);
}


//查找属性表
export async function shapeLayer(p) {
  let url = apiUrl + "/humanActivity/selectInfo";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(p)
  }
  return request(url, option);
}

