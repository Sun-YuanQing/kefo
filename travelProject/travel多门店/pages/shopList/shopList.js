// pages/shopMall/shopList/shopList.js
var app = getApp();
const server = require('../../utils/server');
const {
  $Toast,
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nvabarData: {
    //   showCapsule: 1, //显示左上角图标   1表示发现    0表示返回
    //   title: '商城', //导航栏 中间的标题
    // },
    typeData: [{
      id: -1,
      imgUrl: '/images/icon-total.png',
      name: '全部'
    }, {
      id: 1,
      imgUrl: '/images/icon-travel.png',
      name: '旅游'
    }, {
      id: 3,
      imgUrl: '/images/icon-other.png',
      name: '其他'
    }, {
      id: 5,
      imgUrl: '/images/icon-card.png',
      name: '卡项'
    }, {
      id: 4,
      imgUrl: '/images/icon-combination.png',
      name: '组合'
    }],
    selType: -1,
    travelType: '',
    loadSpin: true,
    showSet: "",
    noGoods: false,
    productTypes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.showShop.shop) {
      this.setData({
        showSet: "",
        recommendData: []
      })
      this.loadData();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.showShop.shop) {
      app.globalData.showShop.shop = false;
      this.setData({
        loadSpin: true
      })
      this.loadData();
    }
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppStore',
      method: 'post',
      data: {
        Type: that.data.selType, // -1 全部 1.旅游  4. 组合 3.其他 5.卡项
        TravelProductType: that.data.travelType, //出游类型id
        appId: server.getAppid(),
        siteId: app.globalData.siteId,
      },
      success: res => {
        wx.stopPullDownRefresh();
        that.data.noGoods = res.Data.length > 0 ? false : true;
        that.setData({
          recommendData: res.Data,
          loadSpin: false,
          noGoods: that.data.noGoods,
          isAdmin: wx.getStorageSync('isAdmin')
        })
      }
    })
  },
  getTravel() {
    let that = this;
    server.sendRequest({
      url: '/Lable/GetTravelProductTypes',
      method: 'post',
      data: {
        appId: server.getAppid(),
        siteId: app.globalData.siteId,
      },
      success: res => {
        that.setData({
          productTypes: that.data.selType == '3' ? res.Data.OtherProductTypes : res.Data.LineProductTypes
        })
        that.loadData();
      }
    })
  },
  changeType(e) {
    this.setData({
      travelType: ''
    })
    if (e.currentTarget.dataset.type == 1 || e.currentTarget.dataset.type == 3) {
      this.setData({
        selType: e.currentTarget.dataset.type
      })
      this.getTravel();
    } else if (e.currentTarget.dataset.type == -1) {
      this.setData({
        selType: e.currentTarget.dataset.type
      })
      this.loadData();
    } else {
      $Toast({
        content: '功能开发中，敬请期待！'
      });
      return false;
    }
  },
  changeTravelType(e) {
    this.setData({
      travelType: e.currentTarget.dataset.type,
      loadSpin: true
    })
    this.loadData();
  },
  showModal(e) {
    this.data.showSet = e.detail.id == this.data.showSet ? "" : e.detail.id;
    this.setData({
      showSet: this.data.showSet
    })
  },
  toRecommend(e) {
    server.sendRequest({
      url: '/TravelProduct/RecommendProduct',
      data: {
        Type: 1, //1商品  2.秒杀
        Id: e.detail.id, // 1商品Id  2.秒杀Id
        Recommend: e.detail.recommend
      },
      method: 'post',
      success: res => {
        this.loadData();
        $Message({
          content: e.detail.recommend ? '已成功推荐到首页' : '取消推荐到首页',
          type: 'success'
        });
        this.setData({
          showSet: ""
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      recommendData: []
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})