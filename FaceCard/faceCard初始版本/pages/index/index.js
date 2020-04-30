//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    SiteId: '',
  },
  
  onLoad: function (options) {
    const self = this;
    
    //二维码进入
    if (options.q){
      console.log('options.q', options.q)
      var url = decodeURIComponent(options.q);
      var query = url.split('?')[1];
      var SiteId = query.split('=')[1];
      if (wx.getStorageSync("SiteId") != SiteId){
        wx.clearStorage();//先清缓存,不同商户进入，需要重新登录一次
      }
      
      //console.log("options767",  url);
      self.setData({
        SiteId: SiteId
      })
      
    }
    console.log('options.q2', options)
    setTimeout(self.userLogin,2000)
  },

  //校验用户当前session_key是否有效。
  userLogin() {
    const self = this;
    wx.setStorageSync("SiteId", self.data.SiteId);
    try {
      var token = wx.getStorageSync('WxToken');
      var phone = wx.getStorageSync('PhoneNumber');
      var siteId = wx.getStorageSync("SiteId");
      var isMember = wx.getStorageSync("IsMember");
      var OpenId = wx.getStorageSync("OpenId");
      var SiteName = wx.getStorageSync('SiteName');

      console.log("token =", wx.getStorageSync('WxToken'))
      console.log("phone =", wx.getStorageSync('PhoneNumber'))
      console.log("siteId =", wx.getStorageSync('SiteId'))
      console.log("isMember =", wx.getStorageSync('IsMember'))
      console.log("OpenId =", wx.getStorageSync('OpenId'))
      console.log("SiteName =", wx.getStorageSync('SiteName'))
      console.log("6666 =", wx.getStorageSync('666'))

       //存在登陆态
      if (token && phone && OpenId) {
        
        if (siteId){
          if (isMember){
            //扫描进来的,领过卡(注册会员了)
            wx.redirectTo({
              url: "/pages/new_user/received/received"
            })
          }else{
            //扫描进来的,存在token && phone，不是会员
            wx.redirectTo({
              url: "/pages/new_user/take/take"
            })
          }

        }else{
          //小程序进来的
          wx.switchTab({
            url: "/pages/card_bag/index/index"
          })
        }

        // Do something with return value
      }else{
        //不存在登陆态
        wx.redirectTo({
          url: "/pages/phone/phone"
        })
      }
    } catch (e) {
      
    }

  },
  

})
