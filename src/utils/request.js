import axios from "axios";
import { Toast } from "zarm";

const ENV = import.meta.env.MODE;
// const baseURL = "http://127.0.0.1:7001";
const baseURL = "http://api.chennick.wang";
const testToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJtYXR0IiwiZXhwIjoxNjgwODU0Mjc3LCJpYXQiOjE2ODAyNDk0Nzd9.NIYsVaaMcqNQH66VvGVYyt_osKhdZSgfZMi_zFB90z4";

const instance = axios.create({
  baseURL: ENV == "development" ? "/" : baseURL,
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
    const { code } = res.data;
    if (code != 200) {
      res.data.msg && Toast.show(res.data.msg);
      if (code == 401) {
        window.location.href = "/login";
      }
      return Promise.reject(res.data);
    }

    return res.data;
  },
  (err) => {
    const { response, message = "请求出错" } = err;
    Toast.show(response.data?.msg || message);
    return Promise.reject(response);
  }
);

export default instance;
