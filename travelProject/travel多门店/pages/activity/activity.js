// pages/activity/activity.js
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
    //   showCapsule: 2, //显示左上角图标   1表示发现    0表示返回
    //   title: '活动', //导航栏 中间的标题
    // },
    activityList: [{
      id: '',
      imgUrl: '/images/icon-all.png',
      name: '全部'
    }, {
      id: 'seck',
      imgUrl: '/images/icon-seckill.png',
      name: '秒杀'
    }, {
      id: 'assem',
      imgUrl: '/images/icon-puzzle.png',
      name: '拼团'
    }, {
      id: 3,
      imgUrl: '/images/icon-bargain.png',
      name: '砍价'
    }],
    selAct: '',
    page: 1,
    showSet: "",
    noGoods: false,
    seckKillData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.showShop.activity) {
      this.setData({
        showSet: "",
        seckKillData: []
      })
      this.loadData();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.showShop.activity) {
      this.setData({
        showSet: "",
        seckKillData: [],
        page: 1
      })
      this.loadData();
    }
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/Activit/GetActivitBySiteIdVx',
      method: 'post',
      data: {
        PageIndex: that.data.page,
        PageSize: 10,
        appId: server.getAppid(),
        siteId: app.globalData.siteId,
        ActivitType: that.data.selAct
      },
      success: res => {
        wx.stopPullDownRefresh();
        let seckKillData = that.data.page == 1 ? [] : that.data.seckKillData;
        let page = res.Data.SiteActivits.length > 0 ? ++that.data.page : that.data.page;
        seckKillData.push(...res.Data.SiteActivits)
        that.data.noGoods = seckKillData.length > 0 ? false : true;
        that.setData({
          seckKillData,
          page,
          noGoods: that.data.noGoods
        })
      }
    })
  },
  changeAct(e) {
    if (e.currentTarget.dataset.index > 2) {
      $Toast({
        content: '功能开发中，敬请期待！'
      });
      return false;
    }
    this.setData({
      seckKillData: [],
      page: 1,
      selAct: e.currentTarget.dataset.id
    });
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
        Type: e.detail.type, //1商品  2.秒杀 3.拼团
        Id: e.detail.id, // 1商品Id  2.秒杀Id
        Recommend: e.detail.recommend
      },
      method: 'post',
      success: res => {
        $Message({
          content: e.detail.recommend ? '已成功推荐到首页' : '取消推荐到首页',
          type: 'success'
        });
        this.setData({
          page: 1,
          noGoods: false,
          showSet: ""
        })
        this.loadData();
      }
    })
  },
  sellFail() {
    $Message({
      content: '该商品已售罄！',
      type: 'error'
    });
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
      seckKillData: [],
      page: 1
    });
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})