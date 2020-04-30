import axios from 'axios'; //引入axios
import { Message, Modal } from 'view-design'
import { getToken, removeToken, removeStoreType } from '@/utils/auth'
import router from '../router/index.js'

// 创建axios实例
const service = axios.create({
  baseURL: "http://118.89.40.223:7793/",//"https://www.linkedsign.cn/gzgl/",//"http://118.89.40.223:7793/",//"https://www.linkedsign.cn/gzgl/", //process.env.BASE_API, // api 的 base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['access-token'] =  getToken() // 'test'让每个请求携带自定义token 请根据实际情况自行修改
    // config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.Code == "400") {
      Modal.confirm({
        title: res.Message,
        onOk: () => {
          removeToken();
          removeStoreType();
          router.push('/login');
        }
      })
      return Promise.reject('error')
    } else if (res.Code != "0") {
      Message.error({
          content: res.Message,
          duration: 15,
          closable: true
      });
      // Message.error(res.Message);
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message.error({
        content: res.Message,
        duration: 15,
        closable: true
    });
    // Message.error(error.Message)
    return Promise.reject(error)
  }
)

export default service