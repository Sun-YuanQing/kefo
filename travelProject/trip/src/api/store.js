import request from '@/utils/request'

// ------------------------门店管理------------------------------

// 门店管理列表
export function storeList(dataList) {
    return request({
        url: '/Site/GetSiteManagerBySiteId',
        method: 'post',
        data: {
            ...dataList
        }
    })
}

// 获取门店详情
export function getDetail(siteid) {
    return request({
        url: '/Site/GetSiteManagerDetailBySiteId?siteId=' + siteid,
        method: 'post'
    })
}

// 门店审核
export function SetSiteAudit(auditData) {
    return request({
        url: '/Site/SetSiteAuditBySiteId',
        method: 'post',
        data:{
            ...auditData
        }
    })
}

// 修改门店信息
export function UpdateSite(auditData) {
    return request({
        url: '/Site/UpdateSiteBySiteId',
        method: 'post',
        data:{
            ...auditData
        }
    })
}
