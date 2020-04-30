var config = require('./config.js');
const setting = require('./setting.js');
const app = getApp();
module.exports = {
  config,

  // 重新封装请求方式
  sendRequest: function (param) {
    var that = this,
      data = param.data || {},
      header = param.header,
      requestUrl = config.host_url + param.url;
    if (param.method) {
      param.method = param.method.toUpperCase();
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json',
        'access-token': wx.getStorageSync("token")
      },
      success: function (res) {
        if (res.data.Code == 0) {
          typeof param.success == 'function' && param.success(res.data);
        } else if (res.data.Code == 400) {
          wx.navigateTo({
            url: '/pages/phone/phone',
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        typeof param.fail == 'function' && param.fail(res);
        // 监视网络变化
        wx.onNetworkStatusChange(function (res) {
          if (res.isConnected) {
            //重新发起请求
            that.sendRequest(param);
          }
        });
        return false;
      }
    });
  },

  // 获取appid
  getAppid: function () {
    var accountInfo = wx.getAccountInfoSync();
    var appId = accountInfo.miniProgram.appId;
    return appId;
  },

  // 获取商家信息
  getMerchant(type, appId, siteId, seckId) {
    var appId = appId || this.getAppid();
    wx.removeStorageSync('merchant');
    this.sendRequest({
      url: '/Site/GetAppSiteInfo',
      method: 'post',
      data: {
        appId: appId,
        siteId: siteId
      },
      success: res => {
        let data = res.Data.Site;
        wx.setStorageSync('merchant', data);
        if (type == 2) {
          //搜索进入无缓存
          wx.switchTab({
            url: "/pages/index/index"
          })
        } else {
          //扫码进入或选择进入
          let lastDate = setting.formatDate(new Date());
          let item = {
            appId: appId,
            siteId: siteId,
            type: data.Type,
            siteName: data.Name,
            lastDate: lastDate
          }
          let storeArray = wx.getStorageSync("storeArray");
          if (storeArray && storeArray.length > 0) {
            let index = storeArray.findIndex(store => store.siteId == siteId && store.appId == appId);
            if (index != -1) {
              storeArray[index].lastDate = lastDate;
            } else {
              storeArray.push(item);
            }
            wx.setStorageSync('storeArray', storeArray);
          } else {
            wx.setStorageSync('storeArray', [item]);
          }

          if (type == 1) {
            //扫码进入
            //分享
            if (seckId) {
              app.globalData.seckId = seckId;
              app.globalData.showSeck = true;
              wx.redirectTo({
                url: "pages/seckillDetail/seckillDetail?type='seck"
              })
            } else {
              app.globalData.showSeck = false;

              setTimeout(function () {
                wx.switchTab({
                  url: "/pages/index/index"
                })
              }, 2000)
            }
          } else if (type == 3) {
            //选择进入
            app.globalData.showShop = {
              home: true,
              shop: true,
              activity: true
            }
            wx.switchTab({
              url: "/pages/index/index"
            })
          }
        }

      }
    })
  }
}