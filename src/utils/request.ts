import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const isProduction = import.meta.env.PROD;

const service: AxiosInstance = axios.create({
  baseURL: isProduction ? 'https://crmapi.51suyang.cn' : '',
  timeout: 5000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isProduction && config.url?.startsWith('/api')) {
      config.url = config.url.replace('/api', '');
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response;
    } else {
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
