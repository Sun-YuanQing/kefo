// pages/cardBag/card_bag.js
//获取应用实例
const server = require('../../../utils/server')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    normalSrc: '../../../images/normal_star.png',
    selectedSrc: '../../../images/full_star.png',
    halfSrc: '../../../images/half_star.png',
    curren: 0,
    cardList: [],
    totalCards: 1,
    showBigCard: true,
    amount: 0,
    isOpen: false,
    isShowImg: false,
    isShowNum: false,
    heiBox: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio - 147;
        let minHeight = clientHeight * ratio - 180;
        self.setData({
          heiBox: height,
          minHeight
        });
      }
    });
    if (app.globalData.redPacket == true && app.globalData.existRed == true) {
      self.setData({
        isOpen: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryCard()
  },

  toggle: function() {
    let val = this.data.showBigCard;
    this.setData({
      showBigCard: !val
    })
  },

  closeImg: function() {
    this.setData({
      isShowImg: false,
    })
  },
  closeOpenImg: function() {
    this.setData({
      isOpen: false
    })
  },


  //请求红包接口
  queryRedpacket: function() {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Redpacket/GetRegisterRedAmount",
      data: {
        "SITEID": wx.getStorageSync("SiteId"),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          if (Data.RedAmont > 0) {

            self.setData({
              amount: Data.RedAmont,
              isShowImg: true,
              isOpen: false
            });

            setTimeout(function() {
              self.setData({
                isShowNum: true,
              })
            }, 1600);

          } else {
            wx.showToast({
              title: '红包已经抢完了！',
              icon: 'none',
              duration: 2000
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
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //请求卡包数据
  queryCard: function() {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    server.sendRequest({
      url: '/Card/GetAppCardList',
      data: {
        'TelePhone': wx.getStorageSync("PhoneNumber") //'15929567730' //app.globalData.phoneNumber
      },
      method: "POST",
      success(res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == "0") {
          self.setData({
            cardList: Data.SiteCards,
            totalCards: Data.TotalCards
          })
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
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  navigate: function(e) {
    let options = e.currentTarget.dataset.options;
    let card = options.Cards[0];
    if (options.Count == 1) {
      wx.navigateTo({
        url: "/pages/card_bag/balance/balance?SiteId=" + options.SiteId + "&UserId=" + card.UserId + "&CardId=" + card.CardId
      })
    } else {
      wx.navigateTo({
        url: '/pages/card_bag/menber_center/menber_center?SiteId=' + card.SiteId + '&UserId=' + card.UserId,
      })
    }
  },
  // toMember: function(e) {
  //   let options = e.currentTarget.dataset.options;
  //   let count = e.currentTarget.dataset.count;
  //   if (e.currentTarget.dataset.count ==1){
  //     wx.navigateTo({
  //       url: '',
  //     })
  //   }
  //   wx.navigateTo({
  //     url: '/pages/card_bag/menber_center/menber_center?SiteId=' + options.SiteId + '&UserId=' + options.UserId,
  //   })
  // },

  swiperChange: function(event) {
    this.setData({
      curren: event.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.redPacket = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.queryCard();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})