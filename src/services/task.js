import { request, config } from '../utils';

const { apiUrl } = config;


//创建任务上传接口
export async function taskUp(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/save";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  };
  // console.log(option);
  return request(url, option);
}

//获取创建组
export async function taskAddTeam(params) {
  let url = apiUrl + "/taskTeam/select";
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

//查询任务
export async function queryTask(params) {
  let url = apiUrl + "/verificationTasks/getVerificationTasks";
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

//上传实地核查照片
export async function uploadPic(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/uploadPicture?id=" + params.id;
  let option = {
    method: "post",
    body: params.data
  };
  return request(url, option);
}

//上传实地核查轨迹照片
export async function uploadPicTrail(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/uploadTrackFile?id=" + params.id;
  let option = {
    method: "post",
    body: params.data
  };
  return request(url, option);
}


//获取有任务的图斑
export async function allTuban(params) {
  let url = apiUrl + "/verificationTasks/selectSpotsData";
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

//获取有任务的图斑的影像
export async function allImage(params) {
  let url = apiUrl + "/humanActivity/selectImage?id="+params.id;
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


//上传
export async function submitTask(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/saveSpotsData";
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

//设备监控
export async function watchDevice(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/saveSpotsData";
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

//核查管理
export async function checkAdmin(params) {
  // console.log(params);
  let url = apiUrl + "/verificationTasks/saveSpotsData";
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

//设备监控接口
export async function serviceCheck(params) {
  let url = apiUrl + "/taskTeam/selectUT";
  let option = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  }
  return request(url, option);
}

//提交复核意见
export async function saveCheckOpinion(params) {
  let url = apiUrl + "/verificationTasks/saveCheckOpinion";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  }
  return request(url, option);
}


//保护地级别提交复核意见
export async function saveFirstCheckOpinion(params) {
  let url = apiUrl + "/verificationTasks/saveFistCheck";
  let option = {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: JSON.stringify(params)
  }
  return request(url, option);
}



