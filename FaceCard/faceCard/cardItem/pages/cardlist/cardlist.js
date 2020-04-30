// cardItem/pages/cardlist/cardlist.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../compoment/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listtabs: [{
      id: '',
      name: '全部'
    }, {
      id: '次卡',
      name: '次卡'
    }, {
      id: '折扣卡',
      name: '折扣卡'
    }, {
      id: '体验卡',
      name: '体验卡'
    }],
    selId: '',
    page: 1,
    cardList: [],
    showCard: '',
    showNo: false,
    showModal: false,
    modalList: [{
      name: '取消',
      color: '#FF4142',
    }, {
      name: '确认',
      color: '#666'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      siteid: options.siteid
    })
    this.loadData()
  },
  loadData() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/CardProject/GetCardProjectBySiteId',
      method: 'POST',
      data: {
        ClassType: that.data.selId,
        PageIndex: that.data.page,
        PageSize: 10,
        SiteId: that.data.siteid
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.Code == 0) {
          let cardList = that.data.page == 1 ? [] : that.data.cardList;
          let page = res.data.Data.SiteServices.length <= 0 ? that.data.page : ++that.data.page;
          for (let x in res.data.Data.SiteServices) {
            let card = res.data.Data.SiteServices[x].CardPrice.toFixed(2);
            let feicard = res.data.Data.SiteServices[x].FeiKaPrice.toFixed(2);
            res.data.Data.SiteServices[x].cardHead = card.split('.')[0];
            res.data.Data.SiteServices[x].cardEnd = card.split('.')[1];
            res.data.Data.SiteServices[x].feicardHead = feicard.split('.')[0];
            res.data.Data.SiteServices[x].feicardEnd = feicard.split('.')[1];
          }
          cardList.push(...res.data.Data.SiteServices)
          that.setData({
            cardList,
            page,
            showNo: false
          })
          if (that.data.cardList.length <= 0) {
            that.setData({
              showNo: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.Message,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      cardList: []
    })
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  checktabs(e) {
    this.setData({
      selId: e.currentTarget.dataset.id,
      page: 1,
      cardList: []
    })
    this.loadData();
  },
  toshowMore(e) {
    if (e.currentTarget.dataset.cardid == this.data.showCard) {
      e.currentTarget.dataset.cardid = '';
    }
    this.setData({
      showCard: e.currentTarget.dataset.cardid
    })
  },
  isrecommend(e) {
    this.setData({
      showCard: "",
      servicedata: e.currentTarget.dataset,
      showModal: true
    })
  },
  isModal({
    detail
  }) {
    let that = this;
    const index = detail.index;
    if (index === 1) {
      server.sendRequest({
        url: '/CardProject/SetCardProjectRecom',
        method: 'POST',
        data: {
          CardId: that.data.servicedata.cardid,
          IsRecom: that.data.servicedata.recom
        },
        success: res => {
          if (res.data.Code == 0) {
            that.setData({
              page: 1,
              cardList: []
            })
            that.loadData();
            $Message({
              content: that.data.servicedata.recom == 1 ? '推荐成功！' : '取消推荐成功！',
              type: 'success'
            });
          } else {
            wx.showToast({
              title: res.data.Message,
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
    }
    that.setData({
      showModal: false
    });
  },
  todetail(e) {
    wx.navigateTo({
      url: '/cardItem/pages/cardDetail/cardDetail?cardid=' + e.currentTarget.dataset.cardid,
    })
  }
})