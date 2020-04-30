const server = require('../../utils/server');
const WxParse = require('../../wxParse/wxParse');
const {
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillDetail: {},
    detailIndex: 1,
    showActive: false,
    selIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.Id,
      openType: options.type,
      formVal: wx.getStorageSync('formVal')
    })
    this.loadData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppTravelProductDetail',
      data: {
        Id: that.data.goodsId
      },
      method: 'post',
      success: res => {
        if (res.Data.TravelProfile) {
          var contain = res.Data.TravelProfile;
          WxParse.wxParse('contain', 'html', contain, that, 5);
        }
        that.setData({
          merchant: wx.getStorageSync('merchant'),
          seckillDetail: res.Data
        })
      }
    })
  },

  changeActive() {
    this.setData({
      showActive: !this.data.showActive
    })
  },

  currentChange(e) {
    this.setData({
      detailIndex: e.detail.current + 1
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  changeDate(e) {
    if (e.currentTarget.dataset.show == false) {
      return false;
    }
    this.setData({
      departureDate: e.currentTarget.dataset.time
    })
  },
  changeJoin(e) {
    let selJoin = e.currentTarget.dataset.join == this.data.selJoin ? '' : e.currentTarget.dataset.join;
    this.setData({
      selJoin
    })
  },
  changeIndex(e) {
    this.setData({
      selIndex: e.currentTarget.dataset.index
    })
  },
  changeNum(e) {
    let index = e.currentTarget.dataset.index;
    this.data.orderPriceList[index].ItemNum = e.detail.value;
    this.setData({
      orderPriceList: this.data.orderPriceList
    })
  },
  currentChange(e) {
    this.setData({
      detailIndex: e.detail.current + 1
    })
  },
  toLookPDF() {
    wx.navigateTo({
      url: '/pages/pdfFile/pdfFile?id=' + this.data.goodsId,
    })
  },
  changeActive() {
    this.setData({
      showActive: !this.data.showActive
    })
  },
  toBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  noneAddr() {
    $Message({
      content: '暂无定位！',
      type: 'error'
    });
  },
  toIssue() {
    let that = this;
    let dataUrl = that.data.openType == "seckill" ? '/Seckill/AddSiteSeckillVx' : '/Assem/AddSiteAssemVx';
    server.sendRequest({
      url: dataUrl,
      data: {
        ProductId: that.data.goodsId,
        ...that.data.formVal
      },
      method: 'post',
      success: res => {
        wx.removeStorageSync('formVal');
        $Message({
          content: '发布成功！',
          type: 'success'
        });
        wx.switchTab({
          url: '/pages/activity/activity',
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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