import request from '@/utils/request'

// ------------------------ 体检产品 ------------------------------

// 体检列表
export function getPhysicalList(postData) {
    return request({
        url: '/HealthyReport/GetHealthyReportResultBySiteId',
        method: 'post',
        data: postData
    })
}

// 新增模板名称
export function addTemplateName(postName) {
    return request({
        url: '/HealthyReport/AddHealthyReportTemp',
        method: 'post',
        data: postName
    })
}

// 获取体检详情
export function getTemplateDetail(postId) {
    return request({
        url: '/HealthyReport/GetHealthyReportDetailById?Id=' + postId,
        method: 'post'
    })
}

// 保存体检报告
export function saveTemplate(postData) {
    return request({
        url: '/HealthyReport/SaveHealthyReport',
        method: 'post',
        data: postData
    })
}

// 新增/修改体检项目明细
export function editProductDetail(postData) {
    return request({
        url: '/HealthyReport/AddHealthyReportItem',
        method: 'post',
        data: postData
    })
}

// 删除项目明细/
export function delProductDetail(deleteData) {
    return request({
        url: 'HealthyReport/DelHealthyReportItem?Id=' + deleteData,
        method: 'post'
    })
}

// 复制报告--报告模板/历史报告模板
export function getHistoryTemplate(postData) {
    return request({
        url: '/HealthyReport/GetHealthyReportTemp0rHisResult',
        method: 'post',
        data: postData
    })
}

// 引入模板
export function setHistoryTemplate(postData) {
    return request({
        url: '/HealthyReport/SetHealthyReportBindTempOrHis',
        method: 'post',
        data: postData
    })
}