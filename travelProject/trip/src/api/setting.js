import request from '@/utils/request'

// ------------------------商家------------------------------
//商家信息
export function getAdminUser() {
  return request({
    url: '/User/GetTravelAdminUser',
    method: 'post',
  })
}

//修改商家信息
export function updateAdminUser(postData) {
  return request({
    url: '/User/UpdateSiteBase',
    method: 'post',
    data: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

//商家管理-归属配置-列表
export function getSiteBelong(PageIndex, PageSize) {
  return request({
    url: '/SiteBelong/GetSiteBelongBySiteId',
    method: 'post',
    data: {
      PageIndex,
      PageSize
    }
  })
}

//商家管理-归属配置-详情
export function getSiteBelongDetail(postData) {
  return request({
    url: '/SiteBelong/GetSiteBelongDetailById',
    method: 'post',
    data: postData
  })
}

//商家管理-归属配置-新增、修改
export function addSiteBelong(postData) {
  return request({
    url: '/SiteBelong/AddSiteBelong',
    method: 'post',
    data: postData
  })
}

//商家管理-归属配置-删除
export function deleteSiteBelong(id) {
  return request({
    url: '/SiteBelong/DelSiteBelongById?Id=' + id,
    method: 'post',
  })
}

// ------------------------供应商------------------------------
//供应商-列表
export function getSuppliers(postData) {
  return request({
    url: '/Supplier/GetSuppliers',
    method: 'post',
    data: postData
  })
}

//更改供应商状态
export function editSupplierStatus(Id, Status) {
  return request({
    url: '/Supplier/EditSupplierStatus',
    method: 'post',
    data: {
      Id,
      Status
    }
  })
}

//获取单个的供应商详情
export function getSupplierById(Id) {
  return request({
    url: '/Supplier/GetSupplierById',
    method: 'post',
    data: {
      Id
    }
  })
}

//新增、修改单个的供应商详情
export function editSupplier(postData) {
  return request({
    url: '/Supplier/EditSupplier',
    method: 'post',
    data: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

//获取供应商类型列表
export function getSupplierTypes() {
  return request({
    url: '/Lable/GetSupplierTypes',
    method: 'post',
  })
}

//新增、修改供应商类型
export function editSupplierType(postData) {
  return request({
    url: '/Lable/EditSupplierType',
    method: 'post',
    data: postData
  })
}

//删除供应商类型
export function deleteSupplierType(Id) {
  return request({
    url: '/Lable/DeleteSupplierType',
    method: 'post',
    data: {
      Id
    }
  })
}

// ------------------------产品------------------------------
//获取出游类别列表
export function getTravelTypes() {
  return request({
    url: '/Lable/GetTravelTypes',
    method: 'post',
  })
}

//新增、修改出游类别
export function editTravelType(postData) {
  return request({
    url: '/Lable/EditTravelType',
    method: 'post',
    data: postData
  })
}

//删除出游类别
export function deleteTravelType(Id) {
  return request({
    url: '/Lable/DeleteTravelTypeById',
    method: 'post',
    data: {
      Id
    }
  })
}

// 获取产品设置类目
export function getProductclases() {
  return request({
    url: '/TravelProductClass/GetFirstClassResult',
    method: 'post',
  })
}

// 获取添加产品列表
export function getAddProductList() {
  return request({
    url: '/TravelProductClass/GetSiteFirsrClassList',
    method: 'post'
  })
}

// 修改小程序列名（添加产品内）
export function saveUpdataName(productName) {
  return request({
    url: '/TravelProductClass/UpdateSiteFirstClass',
    method: 'post',
    data: productName
  })
}

// 删除一级分类（添加产品内）
export function deleteProductName(delName) {
  return request({
    url: '/TravelProductClass/DelSiteClass?Id=' + delName,
    method: 'post'
  })
}

// 新增一级分类
export function addProductName(addName) {
  return request({
    url: '/TravelProductClass/AddSiteFirstClass?Id=' + addName,
    method: 'post'
  })
}

// 新增、修改二级分类名称
export function addTwoProductName(addName) {
  return request({
    url: '/TravelProductClass/AddSiteSecondClass',
    method: 'post',
    data: addName
  })
}

// 拖动产品排序保存
export function saveProductNum(arr) {
  return request({
    url: '/TravelProductClass/SetSiteClassSort',
    method: 'post',
    data: arr
  })
}

//获取产品类别列表
export function getProductTypes() {
  return request({
    url: '/Lable/GetTravelProductTypes',
    method: 'post',
  })
}

//新增、修改产品类别
export function editProductType(postData) {
  return request({
    url: '/Lable/EditTravelProductType',
    method: 'post',
    data: postData
  })
}

//删除产品类别
export function deleteProductType(Id) {
  return request({
    url: '/Lable/DeleteTravelProductTypeById',
    method: 'post',
    data: {
      Id
    }
  })
}

// ------------------------游客------------------------------
//获取游客类型列表
export function getVisitorTypes() {
  return request({
    url: '/Lable/GetVisitorTypes',
    method: 'post',
  })
}

//新增、修改游客类型
export function editVisitorType(postData) {
  return request({
    url: '/Lable/EditVisitorType',
    method: 'post',
    data: postData
  })
}

//删除游客类型
export function deleteVisitorType(Id) {
  return request({
    url: '/Lable/DeleteVisitorTypeById',
    method: 'post',
    data: {
      Id
    }
  })
}

//门店归属快捷查询
export function storesBelonging(belongData) {
  return request({
    url: '/SiteBelong/SiteBelongSearchBySiteId',
    method: 'post',
    data: {
      ...belongData
    }
  })
}

// ------------------------酒店------------------------------
//获取酒店类型列表
export function getHotelItemTypes() {
  return request({
    url: '/Lable/GetHotelItemTypes',
    method: 'post',
  })
}