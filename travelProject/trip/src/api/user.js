// import _axios from '@/plugins/axios'\
import request from '@/utils/request'

// ------------------------登录注册------------------------------

// 登录
export function login(formValidate) {
  return request({
    url: '/User/UserLogin',
    method: 'post',
    data: {
      ...formValidate
    }
  })
}

// 获取总部代码
export function parentCode(code) {
  return request({
    url: '/User/GetSiteParentCode?key=' + code,
    method: 'post'
  })
}

// 手机号码检查
export function userPhone(phone) {
  return request({
    url: '/User/UserPhoneCheck?phone=' + phone,
    method: 'post'
  })
}

// 获取验证码
export function getAuto(autoCode) {
  return request({
    url: '/SMS/SendCode?phone=' + autoCode,
    method: 'post'
  })
}

// 用户注册
export function postSubmit(formVal) {
  return request({
    url: '/User/UserRegister',
    method: 'post',
    data: {
      ...formVal
    }
  })
}

// 重置密码
export function forgetPsw(password) {
  return request({
    url: '/User/UserUpdatePwd',
    method: 'post',
    data: {
      ...password
    }
  })
}

// 获取失败信息
export function getFailInfo() {
  return request({
    url: '/Site/GetSiteAuditFail',
    method: 'post'
  })
}

// 获取门店注册信息
export function getRegisterInfo() {
  return request({
    url: '/Site/GetSiteRegister',
    method: 'post'
  })
}

// 修改门店信息
export function editRegisterInfo(formVal) {
  return request({
    url: '/Site/UpdateSiteRegister',
    method: 'post',
    data:{
      ...formVal
    }
  })
}

// 获取登录用户信息
export function getAdminUserInfo(postData) {
  return request({
    url: '/User/GetAdminUser',
    method: 'post',
    data: postData
  })
}

// 清除缓存
export function clearToken(postData) {
  return request({
    url: '/Site/ClearTokens',
    method: 'post',
    data: postData
  })
}
