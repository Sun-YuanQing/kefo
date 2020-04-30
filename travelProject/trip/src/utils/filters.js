let orderState = type => {
    if(type=='10'){
        return '待付款';
    }else if(type=='11'){
        return '待审核';
    }else if(type=='12'){
        return '待退款审核';
    }else if(type=='13'){
        return '审核不通过';
    }else if(type=='21'){
        return '待出行';
    }else if(type=='22'){
        return '退款完成';
    }else if(type=='23'){
        return '待提货';
    }else if(type=='30'){
        return '已完成';
    }else if(type=='0'){
        return '已关闭';
    }else{
        return ''
    }
}

let assemState = type => {
    if(type=='0'){
        return '拼团失败';
    }else if(type=='1'){
        return '拼团中';
    }else if(type=='2'){
        return '拼团成功';
    }else{
        return ''
    }
}

//一级产品类型
let productTypes = type => {
    if(type==1){
        return '旅游直营产品';
    }else if(type==2){
        return '旅游非直营产品';
    }else if(type==3){
        return '其他产品';
    }else if(type==4){
        return '组合产品';
    }else if(type==5){
        return '酒店产品';
    }else{
        return ''
    }
}

let deliveryStatus = status => {
    if(status==0){
        return '快递收件(揽件)';
    }else if(status==1){
        return '在途中';
    }else if(status==2){
        return '正在派件';
    }else if(status==3){
        return '已签收';
    }else if(status==4){
        return '派送失败';
    }else if(status==5){
        return '疑难件';
    }else if(status==6){
        return '退件签收';
    }else{
        return '—'
    }
}

export {
    orderState,
    assemState,
    productTypes,
    deliveryStatus
}