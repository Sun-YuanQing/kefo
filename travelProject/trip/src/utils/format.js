//将图片转换为Base64
export function  getImgToBase64(url,callback){ 
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

//将base64转换为文件
export function  dataURLtoFile(dataurl, filename) { 
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//获取本地文件路径
export function	getObjectURL(file) {
    let url = null;
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    }else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    } 
    return url;
}

/**
 * 格式化时间
 * @param  {Date} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 *月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(f)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * formatDate(new Date(1494818037415),"yyyy-M-d H:m:s.f") ==>2017-5-15 11:13:57.415
 * formatDate(new Date(),"yyyy-MM-dd HH:mm:ss") ==> 2017-05-15 11:15:33
 */
export function formatDate(source, format) {
  //防止时区显示误差，转换成中国时间
  source = new Date(source.toLocaleString('zh-CN', { hour12: false }));
  const o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

export function formatProjectType(type){
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
      return '产品'
  }
}
