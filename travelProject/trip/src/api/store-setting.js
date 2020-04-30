import request from '@/utils/request'

// 获取分店详情
export function getSiteSetInfo() {
    return request({
        url: '/Site/GetSiteSetInfo',
        method: 'post'
    })
}

//修改分店信息
export function updateSiteSet(postData) {
    return request({
      url: '/Site/UpdateSiteSet',
      method: 'post',
      data: postData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

//会员标签列表
export function getLabelBySiteId() {
    return request({
        url: '/Lable/GetLabelBySiteId',
        method: 'post'
    })
}

//新增、修改会员标签
export function addLabel(postData) {
    return request({
        url: '/Lable/AddLabel',
        method: 'post',
        data: postData
    })
}

//删除会员标签
export function delLabel(id) {
    return request({
        url: '/Lable/DelLabel?labelId='+id,
        method: 'post'
    })
}

//获取门店二维码
export function getQRCoderUrl() {
    return request({
        url: '/QRCoder/GetQRCoderUrl',
        method: 'post'
    })
}

//下载门店二维码
export function downloadQRCoderUrl() {
    return request({
        url: '/QRCoder/DownloadQRCoderUrl',
        method: 'get',
        responseType: "blob"
    })
}

// 修改提成和优惠
export function editSiteDiscount(postData) {
    return request({
        url: '/Site/EditSiteDiscount',
        method: 'post',
        data: postData
    })
}

// 获取提成和优惠
export function getSiteDiscount(Type) {
    return request({
        url: '/Site/GetSiteDiscount',
        method: 'post',
        data: {Type}
    })
}


