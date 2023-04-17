import axios from "axios";
import { Toast } from "zarm";
import { baseURL } from "@/config";

const instance = axios.create({
  baseURL,
  timeout: 30 * 1000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Authorization: `${localStorage.getItem("token")}`,
  },
});
instance.defaults.headers.post["Content-Type"] = "application/json";

const CancelToken = axios.CancelToken;
const sources = [];
// Requests debouncing
const removeSource = (config) => {
  for (let source in sources) {
    if (sources[source].umet === config.url + "&" + config.method) {
      sources[source].cancel("取消请求");
      sources.splice(source, 1);
    }
  }
};

instance.interceptors.request.use(
  (config) => {
    removeSource(config);
    config.cancelToken = new CancelToken((c) => {
      // Collects requests
      sources.push({ umet: config.url + "&" + config.method, cancel: c });
    });
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    if (typeof res.data !== "object") {
      Toast.show("服务端异常！");
      return Promise.reject(res);
    }

    return res.data;
  },
  (err) => {
    const { response, message = "请求出错" } = err;
    if (response.status == 401) {
      window.location.href = "/login";
    }
    Toast.show(response.data?.msg || message);
    return Promise.reject(response);
  }
);

export default instance;
