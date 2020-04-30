// pages/shopMall/shopList/shopList.js
const config = require('../../utils/config');
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
    travelType: -1,
    twoType: -1,
    loadSpin: true,
    showSet: "",
    noGoods: false,
    productTypes: [],
    tabs: [],
    twoTabs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!config.globalData.showShop.shop) {
      this.setData({
        showSet: "",
        recommendData: []
      })
      this.iniData();
    }
    if (options.DistId) {
      wx.setStorageSync('DistId', options.DistId);
      if (wx.getStorageSync('token')) {
        server.reportVisit()
      }
    }
    if (options.siteId) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      wx.setStorageSync('siteId', options.siteId)
      config.globalData.showSelect = true;
    }
    if (options.siteId || options.DistId) {
      server.getMerchant(4);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (config.globalData.showShop.shop) {
      config.globalData.showShop.shop = false;
      this.setData({
        loadSpin: true
      })
      this.iniData();
    }
  },

  iniData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProductClass/GetSiteClassListVx',
      method: 'post',
      data: {
        AppId: server.getAppid(),
        SiteId: wx.getStorageSync('siteId')
      },
      success: res => {
        that.setData({
          tabs: res.Data,
          isAdmin: wx.getStorageSync('isAdmin'),
          twoTabs: res.Data.length == 1 ? res.Data[0].SecondClassList : []
        })
        this.loadData();
      }
    })
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppStore',
      method: 'post',
      data: {
        Type: that.data.travelType, // 一级分类的type
        TravelProductType: that.data.twoType, //二级分类的Id
        appId: server.getAppid(),
        siteId: wx.getStorageSync('siteId'),
        MyDistId: wx.getStorageSync('MyDistId') || null
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

  changeType(e) {
    let index = e.currentTarget.dataset.index;
    let twoTabs = index >= 0 ? this.data.tabs[index].SecondClassList : [];
    this.setData({
      twoType: -1,
      travelType: index >= 0 ? this.data.tabs[index].Type : -1,
      twoTabs,
      recommendData: [],
      loadSpin: true
    })
    this.loadData();
  },

  changeTravelType(e) {
    this.setData({
      twoType: e.currentTarget.dataset.type,
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
    let dist = wx.getStorageSync('MyDistId') || '';
    let siteId = wx.getStorageSync('siteId') || '';
    return {
      path: '/pages/shopList/shopList?DistId=' + dist + '&siteId=' + siteId
    }
  }
})