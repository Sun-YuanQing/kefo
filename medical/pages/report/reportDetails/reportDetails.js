// pages/doctor/reportDetails/reportDetails.js
const server = require('../../../utils/server.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phyDate: "2020-03-28", //上个页面传来的日期,用来默认高亮选项卡
    productId: "51c5fc1aed6d4ce0b9a7cdb5613eeff8",
    reportDetail: [],
    packageName: "",
    packageNumder: 0,
    packageHospital: "",
    index: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      phyDate: options.phyDate
    });
    this.loadData();
  },
  loadData() {
    let that = this;
    let productId = that.data.productId;
    server.sendRequest({
      url: '/HealthyReport/GetMyHealthyReportDetailsVX?productId=' + productId,
      method: 'post',
      success: res => {
        console.log(res.Data)
        that.setData({
          reportDetail: res.Data,
          packageName: res.Data[0].ProductName,
          packageNumder: res.Data.length,
          packageHospital: res.Data[0].Hospital
        })
        for (let i = 0, len = res.Data.length; i < len; i++) {
          if (res.Data[i].PhyDate == that.data.phyDate) {
            that.setData({
              index: i
            })
          }
        }

      },
      fail: error => {
        console.log(error)
      }
    });
  },
  changeProduct(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      phyDate: this.data.reportDetail[index].PhyDate,
      index: index
    });
  },
  toReportDetail(e) {
    let healthyid = e.currentTarget.dataset.healthyid;
    wx.navigateTo({
      url: '/pages/report/reportDetail/reportDetail?healthyid=' + healthyid,
    })
  }
})