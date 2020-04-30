var QQMapWX = require('../js/libs/qqmap-wx-jssdk.min.js');
var qqmapsdk = null;
module.exports = {
  globalData: {
    address: null
  }, //由getLocation执行的来的对象,具体字段看它方法里面,//用户的实际真实地址位置
  getLocation(callBack) {
    //{ success, fail, complete }
    //处理缺省参数
    var that = this;
    var success = function () {};
    var fail = function () {};
    var complete = function () {};
    var fun = {
      success,
      fail,
      complete
    };
    callBack = {
      ...fun,
      ...callBack
    };
    //设置参数的包
    qqmapsdk = new QQMapWX({
      key: 'GXOBZ-6YNCQ-4VS5J-G35RC-6SXUT-QZBJM'
    });
    if (qqmapsdk == null) {
      callBack.fail('qqmapsdk 为null');
      callBack.complete('qqmapsdk 为null');
      return false;
    }
    //查看是否开启定位权限
    wx.getSetting({
      success(res) {
        //1.第一次没开定位权限
        if (typeof res.authSetting['scope.userLocation'] == 'undefined' || res.authSetting['scope.userLocation'] == true) {
          //提示申请使用位置
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
              wx.getLocation({
                success: function (res) {
                  type: 'wgs84'
                  qqmapsdk.reverseGeocoder({
                    location: {
                      latitude: res.latitude,
                      longitude: res.longitude
                    },
                    success: function (e) {
                      var strAddress = e.result.address;
                      //更新模块的address对象
                      that.globalData.address = e.result.address_component;
                      that.globalData.address.strAddress = strAddress;
                      that.globalData.address.latitude = res.latitude;
                      that.globalData.address.longitude = res.longitude;
                      callBack.success(that.globalData.address);
                      callBack.complete(that.globalData.address);
                    },
                    fail: function (e) {
                      callBack.fail(res);
                      callBack.complete(e);
                    },
                    complete: function (e) {
                      callBack.complete(e);
                    }
                  })
                },
                fail: function (res) {
                  callBack.fail(res);
                },
                complete: function (res) {
                  callBack.complete(res);
                }
              })
            }
          })
          //2.没开定位权限要手动开
        } else {
          wx.showModal({
            title: '请开启小程序定位权限',
            confirmText: '知道了',
            content: "小程序右上角>设置>允许定位",
            success: function (res) {
              if (res.confirm) {
                wx.openSetting()
              }
            },
            fail: function (res) {}
          });
        }
      }
    })
  }
}