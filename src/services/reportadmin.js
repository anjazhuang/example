import { request, config} from '../utils';

const { apiUrl } = config;

//报告列表
export async function reportList(p) {
  let url = apiUrl+"/report/select?protectedareaid="+p.protectedareaid+"&jcnf="+p.jcnf+"&jcpc="+p.jcpc;
  // let url ="http://172.16.5.47:3080/haserver/report/select?title="+p.title;
  let option = {
    method: "get",
    headers: {
      'Authorization': localStorage.getItem('sessionId')
    },
  };
  return request(url, option);
}


//报告列表
export async function reportAdd(p) {
  let url = apiUrl+"/report/build";
  // let url ="http://172.16.5.47:3080/haserver/report/build";
  let option = {
    method: "post",
    headers: {
      // "Content-Type": "multipart/form-data",
      'Authorization': localStorage.getItem('sessionId')
    },
    body: p
  };
  return request(url, option);
}

