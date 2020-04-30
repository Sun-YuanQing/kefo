import request from '@/utils/request'

//订单列表
export function getOrderList(postData) {
    return request({
      url: '/TraveOrder/GetTraveOrderBySiteId',
      method: 'post',
      data: postData
    })
}

//订单详情
export function getOrderDetail(id) {
  return request({
    url: '/TraveOrder/GetTraveOrderDetailById?traveOrderId='+id,
    method: 'post'
  })
}

//改价
export function changePrice(TraveOrderId,ActualAmount,ExpressAmount) {
  return request({
    url: '/TraveOrder/SetTraveOrderChangeAmount',
    method: 'post',
    data: { TraveOrderId,ActualAmount,ExpressAmount }
  })
}

//订单审核
export function setTraveOrderAudit(postData) {
  return request({
    url: '/TraveOrder/SetTraveOrderAudit',
    method: 'post',
    data: postData
  })
}

//确定入住
export function setTraveOrderDone(id) {
  return request({
    url: 'TraveOrder/SetTraveOrderDone?traveOrderId=' + id,
    method: 'post',
  })
}

//其他产品订单确定
export function setTraveOrderSure(postData) {
  return request({
    url: 'TraveOrder/SetTraveOrderSure',
    method: 'post',
    data: postData
  })
}

//其他产品添加物流信息
export function SetTraveOrderBindExpress(postData) {
  return request({
    url: 'TraveOrder/SetTraveOrderBindExpress',
    method: 'post',
    data: postData
  })
}