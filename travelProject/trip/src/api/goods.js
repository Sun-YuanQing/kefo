import request from '@/utils/request'

// ------------------------产品------------------------------

//门店商品库产品列表
export function getProductList(postData) {
  return request({
    url: '/TravelProduct/GetTravelProductsByType',
    method: 'post',
    data: postData
  })
}

//上线、下线
export function onlineProductById(postData) {
  return request({
    url: 'TravelProduct/OnlineProductById',
    method: 'post',
    data: postData
  })
}

//删除
export function deleteTravelProductById(ID) {
  return request({
    url: 'TravelProduct/DeleteTravelProductById',
    method: 'post',
    data: { ID }
  })
}

//批量上线产品
export function branchProductOnline(postData) {
  return request({
    url: '/TravelProduct/BranchProductOnline',
    method: 'post',
    data: postData
  })
}

//产品详情
export function getProductById(Id) {
    return request({
      url: '/TravelProduct/GetTravelProduct',
      method: 'post',
      data: { Id }
    })
}

//新增、修改产品
export function eitTravelProduct(postData) {
    return request({
      url: '/TravelProduct/EditTravelProduct',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: postData
    })
}

//根据出游类型获取产品
export function getTravelProductNameByType(postData) {
  return request({
    url: '/TravelProduct/GetTravelProductNameByType',
    method: 'post',
    data: postData
  })
}

//根据产品id获取类型价格
export function getTypePriceById(postData) {
  return request({
    url: '/TravelProduct/GetTypePriceById',
    method: 'post',
    data: postData
  })
}

//上传pdf
export function uploadGoodsPdf(postData) {
  return request({
    url: '/Common/UploadPdf',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: postData
  })
}

//删除pdf
export function deleteGoodsPdf(Id) {
  return request({
    url: '/Common/DeletePdf',
    method: 'post',
    data: { Id }
  })
}

//推荐
export function recommendProduct(postData) {
  return request({
    url: '/TravelProduct/RecommendProduct',
    method: 'post',
    data: postData
  })
}

//门店获取上传管理列表
export function getAuditProducts(postData) {
  return request({
    url: '/TravelProduct/GetAuditProductsByType',
    method: 'post',
    data: postData
  })
}

//获取当前的一级分类
export function getProjectType(Show,Audit) {
  return request({
    url: '/TravelProduct/GetProjectType',
    method: 'post',
    data: { Show,Audit }
  })
}

//1.获取总店待审核数量 2.获取门店待上线数量
export function getAuditCount(type) {
  return request({
    url: 'TravelProduct/GetAuditCount',
    method: 'post',
    data: { type }
  })
}