//index.js
//获取应用实例
const server = require('../../utils/server')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: ''
  },
  
  onLoad: function () {
      let self = this;
      wx.login({
        success: res => {
          if (res.code) {
            self.setData({
              code: res.code
            })
            //存储登录返回的code
            wx.setStorageSync("jsCode", res.code);
          } else {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
            console.log('登录失败！' + res.errMsg)
          }

        }
      })
  },
  //登录
  onLogin(encryptedData,iv,token){
    const self = this;
    server.sendRequest({
      url: "/User/GetUserPhoneNumber",
      data: {
        'encryptedData': encryptedData,
        'iv': iv,
        "SiteId": wx.getStorageSync("SiteId")
        // "SiteId": '08c2d4acba534867b58bc02d86de1cfb'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        "access-token": token
      },
      success: function (res) {
        //console.log("login", res.data)
        let { Code, Data, Message } = res.data;
        //隐藏授权框
        wx.hideLoading()
        if (Code == 0) {
          //console.log('Data', Data,'uu')
          wx.setStorageSync("PhoneNumber", Data.PhoneNumber)
          wx.setStorageSync("IsMember", Data.IsMember)
          wx.setStorageSync("SiteName", Data.SiteName)

          // console.log("2phone =", wx.getStorageSync('PhoneNumber'))
          // console.log("2siteId =", wx.getStorageSync('SiteId'))
          // console.log("2isMember =", wx.getStorageSync('IsMember'))
          // console.log("2SiteName =", wx.getStorageSync('SiteName'))


          if (wx.getStorageSync("SiteId")) {
            //扫描进来的
            // 已经是会员
            if (Data.IsMember){
              wx.reLaunch({
                url: "/pages/new_user/received/received"
              })
            }else{
              //还不是会员
              wx.reLaunch({
                url: "/pages/new_user/take/take"
              })
            }
            
          } else {
            //小程序进来的，进入卡包页面
            wx.switchTab({
              url: "/pages/card_bag/index/index"
            })
            
          }

        } else {
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 获取手机号码encodeURIComponent(e.detail.encryptedData)
  getPhoneNumber: function(e){
    const self = this;
    if (e.detail.errMsg=='getPhoneNumber:ok'){
      wx.showLoading({
        title: '授权中',
        mask: true
      });

      // 检查登录是否过期
      wx.checkSession({
        success() {
          // 发起网络请求
          server.sendRequest({
            url: "/User/WeiXinLogin",
            data: {
              'code': self.data.code
            },
            method: 'POST', 
            header: {
              'content-type': 'application/json'
            },
            success: function (result) {
              let { Code, Data, Message } = result.data;
              if (Code == 0) {
                //获取到用户凭证 存儲 3rd_session 
                wx.setStorageSync("WxToken", Data.WxToken);

                //存储登录返回的OpenId
                wx.setStorageSync("OpenId", Data.OpenId);

                console.log("2token =", wx.getStorageSync('WxToken'))
                console.log("2OpenId =", wx.getStorageSync('OpenId'))

                //登录
                self.onLogin(e.detail.encryptedData, e.detail.iv, Data.WxToken)

              } else {
                wx.showToast({
                  title: Message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success: res => {
              if (res.code){
                self.setData({
                  code: res.code
                })
                //存储登录返回的code
                wx.setStorageSync("jsCode", res.code);
              } else {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
                console.log('登录失败！' + res.errMsg)
              }
             
            }
          })
        }
      })  
    }else{
      wx.showToast({
        title: '授权失败，请重新授权',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

})
