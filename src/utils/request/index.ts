import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Toast } from 'zarm';
import { baseURL } from '@/config';

interface RequestSource {
  umet: string;
  cancel: (reason?: string) => void;
}

const instance = axios.create({
  baseURL,
  timeout: 30 * 1000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

const sources: RequestSource[] = [];

const removeSource = (config: AxiosRequestConfig) => {
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (source.umet === config.url + '&' + config.method) {
      source.cancel('Cancel request');
      sources.splice(i, 1);
    }
  }
};

instance.interceptors.request.use(
  (config) => {
    removeSource(config);
    config.cancelToken = new axios.CancelToken((c) => {
      sources.push({ umet: config.url+ '&' + config.method, cancel: c });
    });
    if (config.headers) {
      config.headers.Authorization = localStorage.getItem('token') || '';
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse<any>) => {    
    if (typeof res.data !== 'object') {
      Toast.show('Server error');
      return Promise.reject(res);
    }
    return res.data;
  },
  (err) => {
    const { response, message = 'Something went wrong...' } = err;
    if (response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    Toast.show(response?.data?.msg || message);
    return Promise.reject(response);
  }
);

export default instance;
