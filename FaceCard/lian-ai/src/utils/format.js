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

//跨域
export function getBase64ByUrl(src, callback, outputFormat){
  var xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);

      xhr.responseType = 'arraybuffer';

      xhr.onload = function(e) {
        if (xhr.status == 200) {
          var uInt8Array = new Uint8Array(xhr.response);
          var i = uInt8Array.length;
          var binaryString = new Array(i);
          while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
          }
          var data = binaryString.join('');
          var base64 = window.btoa(data);
          var dataUrl = "data:" + (outputFormat || "image/png") + ";base64," + base64;
          // alert(dataUrl)
          callback.call(this, dataUrl);
        }
      };

      xhr.send();
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

