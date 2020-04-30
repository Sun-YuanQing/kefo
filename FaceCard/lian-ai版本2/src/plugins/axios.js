"use strict";

import Vue from 'vue';
import axios from "axios";
import { getBaseUrl } from '@/utils/config';
// import { Message } from 'iview'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: getBaseUrl(),
  timeout: 60 * 1000, // Timeout
  // headers: {
  // }
  // withCredentials: true, // Check cross-site Access-Control
};



const _axios = axios.create(config);
_axios.interceptors.request.use(
  function(config) {
    // localStorage.token = 'asdfg'
    let pathname = window.location.pathname;
    let search = window.location.search.substring(1);
    let token = "";
    if(pathname == '/forget' || pathname == '/selectStore' || (pathname == '/createStore' && !search)){
      token = window.localStorage.getItem('loginToken')
    }else{
      token = window.localStorage.getItem('token')
    }
    config.headers['access-token'] = token;//window.localStorage.getItem('token')//
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Message.error("网络错误，稍后再试")
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (response.data.Code === '400') {
      // window.localStorage.clear();
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("loginToken");
      window.localStorage.removeItem("siteId");
      window.localStorage.removeItem("tokenList");
      window.localStorage.removeItem("currentUserNname");
      window.location.href = '/login'
    }
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
