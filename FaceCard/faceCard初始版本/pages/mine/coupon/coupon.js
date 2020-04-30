// pages/mine/coupon/coupon.js
//获取应用实例
const server = require('../../../utils/server')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 700,
    navbarActiveIndex: 0,
    navbarTitle: ["未使用", "已使用", "已过期"],
    unUseList: [],
    usedList: [],
    overdueList: [],
  },

  onLoad: function(options) {
    let type = (parseInt(this.data.navbarActiveIndex) + 1).toString()
    this.queryCoupon(type)
  },
  onShow: function() {
    //获取swiper的高度
    //this.swiperHeight()
  },

  // 请求我的优惠券
  queryCoupon(type) {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Coupon/GetAppCoupons",
      data: {
        'Type': type
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        let {
          Code,
          Message,
          Data
        } = res.data;
        if (Code == '0') {
          let str;
          if (type == "1") {
            str = "unUseList"
          } else if (type == "2") {
            str = "usedList"
          } else if (type == "3") {
            str = "overdueList"
          }
          self.setData({
            [str]: Data
          })
          if (Data.length > 0) {
            //获取swiper的高度
            self.swiperHeight(type)
          } else {
            let height = 0;
            wx.getSystemInfo({
              success: function(res) {
                height = res.windowHeight - 50;
              }
            })
            self.setData({
              swiperHeight: height
            })
          }


        } else if (Code == '400') {
          wx.showModal({
            title: '',
            content: Message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/phone/phone'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //计算swiper的高度
  swiperHeight: function(e) {
    const self = this;
    var obj = wx.createSelectorQuery();
    obj.selectAll('.swiper_item').boundingClientRect();
    obj.exec(function(rect) {
      let height = 0;
      rect[0].forEach(function(item, index) {
        if (index + 1 == e) {
          if (item.height > height) {
            height = item.height
          }
        }
      })
      self.setData({
        swiperHeight: height
      })
    });
  },

  /**
   * 点击导航栏
   */
  onNavBarTap: function(event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
  },

  /**
   * 
   */
  indexChange: function({
    detail
  }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
    let type = (parseInt(this.data.navbarActiveIndex) + 1).toString();
    //console.log('type3', type);
    this.queryCoupon(type)
  }


})