// pages/doctor/reportList/reportList.js
const server = require('../../../utils/server');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reportList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('token', options.token)
    this.loadData();
  },
  loadData() {
    server.sendRequest({
      url: '/HealthyReport/GetMyHealthyReportResultVX',
      method: 'post',
      success: res => {
        this.setData({
          reportList: res.Data
        })
      },
      fail: error => {
        console.log(error)
      }
    });
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
  onToReportDetail(e) {
    let item = e.currentTarget.dataset.item;
    let productId = item.ProductId || '';
    let phyDate = item.PhyDate || '';
    wx.navigateTo({
      url: '/pages/report/reportDetails/reportDetails?productId=' + productId + '&phyDate=' + phyDate,
    })
  }
})