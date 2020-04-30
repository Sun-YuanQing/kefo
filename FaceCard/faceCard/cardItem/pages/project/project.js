const server = require('../../../utils/server');
const {
  $Message
} = require('../../compoment/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listtabs: [],
    selId: '',
    listData: [],
    page: 1,
    showRecom: '',
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
    this.loadData();
  },
  loadData() {
    server.sendRequest({
      url: '/Lable/GetServiceTypesBySiteIdApp?SiteId=' + this.data.siteid,
      method: 'POST',
      success: res => {
        if (res.data.Code == 0) {
          this.setData({
            listtabs: res.data.Data.ServiceTypes
          })
          this.iniData();
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
  iniData() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/Lable/GetServiceBySiteId',
      method: 'POST',
      data: {
        TypeId: that.data.selId,
        PageIndex: that.data.page,
        PageSize: 10,
        SiteId: that.data.siteid
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.Code == 0) {
          let listData = that.data.page == 1 ? [] : that.data.listData;
          let page = res.data.Data.SiteServices.length <= 0 ? that.data.page : ++that.data.page;
          listData.push(...res.data.Data.SiteServices)
          for (let x in listData) {
            listData[x].ruiling = listData[x].Price.toFixed(2);
            listData[x].sellmoney = listData[x].SellPrice.toFixed(2);
            let sell = listData[x].SellPrice.toFixed(2);
            listData[x].sellHead = sell.split('.')[0];
            listData[x].sellEnd = sell.split('.')[1];
          }
          that.setData({
            listData,
            page
          })
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
      listData: []
    })
    this.iniData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    this.iniData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  checktabs(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      selId: e.currentTarget.dataset.id || '',
      page: 1,
      listData: []
    })
    this.iniData();
  },
  todetail(e) {
    console.log(e.currentTarget.dataset.serviceid)
    wx.navigateTo({
      url: '/cardItem/pages/projectdetail/projectdetail?serviceid=' + e.currentTarget.dataset.serviceid + '&siteid=' + e.currentTarget.dataset.siteid,
    })
  },
  isrecommend(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showRecom: "",
      servicedata: e.currentTarget.dataset,
      showModal: true
    })
  },
  toshowMore(e) {
    if (e.currentTarget.dataset.cardid == this.data.showRecom) {
      e.currentTarget.dataset.cardid = '';
    }
    this.setData({
      showRecom: e.currentTarget.dataset.cardid
    })
  },
  isModal({
    detail
  }) {
    let that = this;
    const index = detail.index;
    if (index === 1) {
      server.sendRequest({
        url: '/Lable/SetSiteIdServicesRecom',
        method: 'POST',
        data: {
          ServiceId: that.data.servicedata.cardid,
          IsRecom: that.data.servicedata.recom
        },
        success: res => {
          console.log(res.data)
          if (res.data.Code == 0) {
            that.setData({
              page: 1,
              listData: []
            })
            that.iniData();
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
  }
})