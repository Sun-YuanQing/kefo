import request from '@/utils/request'
// ---------------------------------------------秒杀------------------------------------------
//秒杀列表
export function getSeckillList(postData) {
    return request({
      url: '/Seckill/GetSeckillBySiteId',
      method: 'post',
      data: postData
    })
}

//秒杀列表上下架
export function setSeckillUpOrDown(SecId,Action) {
  return request({
    url: '/Seckill/SetSeckillUpOrDown',
    method: 'post',
    data: { SecId,Action }
  })
}

//新增、修改秒杀
export function editSeckill(postData) {
  return request({
    url: '/Seckill/AddSiteSeckill',
    method: 'post',
    data: postData
  })
}

//秒杀详情
export function getSeckillDetail(id) {
  return request({
    url: '/Seckill/GetSeckBySeckId?secId='+id,
    method: 'post',
  })
}

// ---------------------------------------------拼团------------------------------------------
//拼团列表
export function getGroupBuyingList(postData) {
  return request({
    url: '/Assem/GetAssemBySiteId',
    method: 'post',
    data: postData
  })
}

//拼团列表上下架
export function setGroupBuyingUpOrDown(AssemId,Action) {
return request({
  url: '/Assem/SetAssemUpOrDown',
  method: 'post',
  data: { AssemId,Action }
})
}

//新增、修改拼团
export function editGroupBuying(postData) {
return request({
  url: '/Assem/AddSiteAssem',
  method: 'post',
  data: postData
})
}

//拼团详情
export function getGroupBuyingDetail(id) {
return request({
  url: '/Assem/GetAssemByAssemId?assemId='+id,
  method: 'post',
})
}

// ---------------------------------------------分销员------------------------------------------
//分销员列表
export function getDistributions(postData) {
  return request({
    url: '/Distribution/GetDistributions',
    method: 'post',
    data: postData
  })
}

//新增分销员
export function addDistribution(Phone) {
  return request({
    url: '/Distribution/AddDistribution',
    method: 'post',
    data: {
      Phone
    }
  })
}

//修改分销员备注
export function editDistributionRemark(postData) {
  return request({
    url: '/Distribution/EditDistributionRemark',
    method: 'post',
    data: postData
  })
}

//审核分销员
export function editDistributionStatus(postData) {
  return request({
    url: '/Distribution/EditDistributionStatus',
    method: 'post',
    data: postData
  })
}

//分销员详情
export function getDistributionDetail(ID) {
  return request({
    url: '/Distribution/GetDistributionDetail',
    method: 'post',
    data: {
      ID
    }
  })
}

//分销员客户列表
export function getDistributionCustomers(postData) {
  return request({
    url: '/Distribution/GetDistributionCustomers',
    method: 'post',
    data: postData
  })
}

//分销员提成列表
export function getDistributionIncome(postData) {
  return request({
    url: '/Distribution/GetDistributionIncome',
    method: 'post',
    data: postData
  })
}