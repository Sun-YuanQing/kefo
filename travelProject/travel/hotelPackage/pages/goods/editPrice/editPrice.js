// hotelPackage/pages/goods/editPrice/editPrice.js
const server = require('../../../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelPrices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dates: options.dates,
      orderId: options.id
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
      url: "/TravelProduct/GetHotelPricesByDate",
      data: {
        Dates: that.data.dates,
        Id: that.data.orderId
      },
      method: 'post',
      success: res => {
        that.setData({
          hotelPrices: res.Data.HotelPrices,
          postData: res.Data.HotelPrices
        })
      }
    })
  },

  changeSwitch(e) {
    let index = e.currentTarget.dataset.index;
    this.data.hotelPrices[index].TypePrice.Valid = e.detail.value;
    this.setData({
      hotelPrices: this.data.hotelPrices,
      postData: this.data.hotelPrices
    })
  },

  getPrice(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (that.data.postData[index].TypePrice.UnifiedSale == 1) {
      that.data.postData[index].TypePrice.SalePrice = e.detail.value;
    } else {
      let itemIndex = e.currentTarget.dataset.itemindex;
      that.data.postData[index].TypePrice.VisitorTypePrice[itemIndex].SalePrice = e.detail.value;
    }
    this.setData({
      postData: that.data.postData
    })
  },

  toSave() {
    let that = this;
    server.sendRequest({
      url: "/TravelProduct/EditHotelPrice",
      data: {
        productId: that.data.orderId,
        HotelPrices: that.data.postData
      },
      method: 'post',
      success: res => {
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },

  toRecord(e) {
    wx.navigateTo({
      url: '/hotelPackage/pages/goods/priceRecord/priceRecord?ProductId=' + this.data.orderId + '&ItemType=' + e.currentTarget.dataset.id + '&UnifiedSale=' + e.currentTarget.dataset.saletype + '&Date=' + e.currentTarget.dataset.time,
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