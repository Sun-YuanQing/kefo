export const validateCoverPhoto = (rule, value, callback) => {
    if(!value){
        callback(new Error('请上传封面图片'));
    }else{
        callback();
    }
};
export const validateDisplayPhoto = (rule, value, callback) => {
    if(value.length == 0){
        callback(new Error('请上传展示图片'));
    }else{
        callback();
    }
};
export const validateTypePrice = (rule, value, callback) => {
    let arr = [];
    if(value.length == 0){
        callback(new Error('至少上传一个日期、价格'));
    }else{
        this.formData.TypePrice.forEach((item,index) => {
            if(item.DepartureDate==""){
                callback(new Error('出发日期未填写'));
            }else if(item.UnifiedSale==1 && !item.SalePrice){
                callback(new Error('价格未填写'));
            }else if(item.UnifiedSale==1 && !item.CostPrice){
                callback(new Error('价格未填写'));
            }else if(item.UnifiedSale==0){
                item.VisitorTypePrice.forEach(itm => {
                    if(!itm.SalePrice || itm.SalePrice < 0) {
                        callback(new Error(itm.VisitorTypeName+'的售价未填写'));
                    }else if(!itm.CostPrice || itm.CostPrice < 0){
                        callback(new Error(itm.VisitorTypeName+'的成本价未填写'));
                    }else{
                        // callback();
                        arr[index] = 1;
                    }
                })
            }else{
                // callback();
                arr[index] = 1;
            }
        })
        
    }
    let flag = arr.every(item => item==1);
    if(flag){
        callback();
    }
    
};
export const validateLineProduct = (rule, value, callback) => {
    if(value.length == 0){
        callback(new Error('请添加路线产品'));
    }else{
        callback();
    }
};
export const validateOtherProduct = (rule, value, callback) => {
    if(value.length == 0){
        callback(new Error('请添加其他产品'));
    }else{
        callback();
    }
};
export const validateComposeSalePrice = (rule, value, callback) => {
    if(value < 0){
        callback(new Error('请输入售价'));
    }else{
        callback();
    }
};
export const validateComposeCostPrice = (rule, value, callback) => {
    if(value < 0){
        callback(new Error('请输入成本价'));
    }else{
        callback();
    }
};
export const validatePermanent = (rule, value, callback) => {
    if(value == 0){
        if(!this.formData.StartTime){
            callback(new Error('请选择有效时间'));
        }else if(!this.formData.EndTime){
            callback(new Error('请选择有效时间'));
        }else{
            callback();
        }
    }else{
        callback();
    }
};
export const validateShare = (rule, value, callback) => {
    if(value !== 0 && value !== 1){
        callback(new Error('请选择是否共享商品'));
    }else{
        callback();
    }
};