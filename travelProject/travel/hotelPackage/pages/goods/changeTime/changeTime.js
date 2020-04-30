// hotelPackage/pages/goods/changeTime/changeTime.js
const server = require('../../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    selIndex: 0,
    loadSpin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId: options.Id
    })
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        for (let x in res.Data.MonthPrice) {
          for (let y in res.Data.MonthPrice[x].Dates) {
            res.Data.MonthPrice[x].Dates[y].chooseSel = false;
          }
        }
        that.setData({
          goodsDetail: res.Data,
          loadSpin: false,
          MyDistId: wx.getStorageSync('MyDistId')
        })
      }
    })
  },

  changeIndex(e) {
    this.setData({
      selIndex: e.currentTarget.dataset.index
    })
  },

  changeDate(e) {
    let index = e.currentTarget.dataset.index;
    let timeItem = this.data.goodsDetail.MonthPrice[this.data.selIndex].Dates[index];
    if (!timeItem.Price) {
      return false;
    }
    let showUnify = timeItem.UnifiedSale ? 1 : 2;
    timeItem.chooseSel = !timeItem.chooseSel;
    this.setData({
      goodsDetail: this.data.goodsDetail,
      showUnify
    })
  },

  toEdit() {
    let departure = [];
    this.data.goodsDetail.MonthPrice.map((item, index) => {
      item.Dates.map((time, timeIndex) => {
        if (time.chooseSel) {
          departure.push(time.ItemTime)
          this.data.departureDate = departure.join(',');
        }
      })
    })
    if (!this.data.departureDate) {
      $Message({
        content: '请选择日期！！！',
        type: 'error'
      });
      return false;
    }
    wx.navigateTo({
      url: '/hotelPackage/pages/goods/editPrice/editPrice?dates=' + this.data.departureDate + '&id=' + this.data.goodsId,
    })
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