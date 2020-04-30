import Cookies from 'js-cookie'

const TokenKey = 'GZ-token'
const StoreKey = 'GZ-storeType'
const LoginName = 'GZ-loginName'
const SearchVal = "GZ-keyword"
const IsHealthySite = 'GZ-physical'

//登录token
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 登录判断是否为体检门店
export function setPhysical(IsHealthy) {
  return Cookies.set(IsHealthySite, IsHealthy);
}

export function getPhysical() {
  return Cookies.get(IsHealthySite);
}

//门店登录标记 1总店 2分店 3单店
export function setStoreType(store) {
  return localStorage.setItem(StoreKey, store);
}

export function getStoreType() {
  return localStorage.getItem(StoreKey);
}

export function removeStoreType() {
  return localStorage.removeItem(StoreKey);
}

//登录名称
export function getLoginName() {
  return localStorage.getItem(LoginName);
}

export function setLoginName(val) {
  return localStorage.setItem(LoginName, val);
}

export function removeLoginName() {
  return localStorage.removeItem(LoginName);
}

//优选中心搜素缓存
export function getSearchVal() {
  return localStorage.getItem(SearchVal);
}

export function setSearchVal(val) {
  return localStorage.setItem(SearchVal, val);
}

export function removeSearchVal() {
  return localStorage.removeItem(SearchVal);
}