import { request, config } from '../utils';

const { apiUrl } = config;

//统计分析接口
export async function Staticanalysis(params) {
  // let url = apiUrl + "/statis/select";
  // console.log(params);
  let url = apiUrl + "/statis/select?bhdmc=" + params.bhdmc + "&gnfq=" + params.gnfq + "&jcpc=" + params.jcpc + "&yjbm=" + params.yjbm + "&jcnf=" + params.jcnf +
    "&checkopinion=" + params.checkopinion + "&bhqk=" + params.bhqk;
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

