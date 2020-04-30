var config = require('./config.js');

module.exports = {
  config,
  sendRequest: function(param, customSiteUrl) {
    var that = this,
      data = param.data || {},
      header = param.header,
      requestUrl;
    if (customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = config.host_url + param.url
    }
    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        // data = that.modifyPostParam(data); //格式化参数
        // header = header || {
        //   'content-type': 'application/json',
        //   'access-token': wx.getStorageSync("WxToken")
        // }
      }
      param.method = param.method.toUpperCase();
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json',
        'access-token': wx.getStorageSync("WxToken")
      },
      success: function(res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function(res) {
        typeof param.fail == 'function' && param.fail(res);
        // 监视网络变化
        wx.onNetworkStatusChange(function(res) {
          if (res.isConnected) {
            //重新发起请求
            that.sendRequest(param, customSiteUrl);
          }
        });
        return false;
      },
      complete: function(res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    });
  }
}