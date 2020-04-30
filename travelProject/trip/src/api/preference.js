import request from '@/utils/request'

//产品列表
export function getSelectionCenter(postData) {
    return request({
      url: '/TravelProduct/GetSelectionCenter',
      method: 'post',
      data: postData
    })
}

//添加到商品库、上线
export function addBranchProduct(postData) {
  return request({
    url: '/TravelProduct/AddBranchProduct',
    method: 'post',
    data: postData
  })
}

//今日新增
export function getDayCount() {
  return request({
    url: '/TravelProduct/GetDayCount',
    method: 'post',
  })
}