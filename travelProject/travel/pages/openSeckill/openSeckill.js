// pages/openSeckill/openSeckill.js
const server = require('../../utils/server');
const {
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    visitorType: [],
    formVal: {
      StartTime: '',
      EndTime: '',
      VisitorTypeName: '',
      VisitorTypeId: "",
      DepartureDate: '',
      Price: '',
      CostPrice: '',
      IsLimtBuy: 1,
      KillPrice: '',
      StockNum: '',
      Extens: '',
      LimtNum: 1
    },
    startData: "",
    startTime: "",
    endData: '',
    endTime: '',
    openType: 'seckill',
    showText: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == "seckill") {
      wx.setNavigationBarTitle({
        title: '发起秒杀'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '发起拼团'
      })
    }
    this.setData({
      goodId: options.id,
      openType: options.type
    })
    this.getNowDate();
    this.loadData();
  },

  getNowDate() {
    let date = new Date();
    // 年 - 月 - 日
    let year = date.getFullYear();
    let month = this.processData(date.getMonth() + 1);
    let day = this.processData(date.getDate());
    // 时 - 分 - 秒
    let hour = this.processData(date.getHours());
    let minutes = this.processData(date.getMinutes());
    let startData = year + "-" + month + "-" + day;
    let startTime = hour + ":" + minutes;
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    var endData = date.getFullYear() + "-" + this.processData(date.getMonth() + 1) + "-" + this.processData(date.getDate());
    this.data.formVal.StartTime = startData + ' ' + startTime;
    this.data.formVal.EndTime = endData + ' ' + startTime;
    this.setData({
      startData,
      startTime,
      endData,
      endTime: startTime,
      formVal: this.data.formVal
    })
  },

  processData(time) {
    time = time > 9 ? time : '0' + time;
    return time;
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
    if (wx.getStorageSync('formVal')) {
      this.setData({
        formVal: wx.getStorageSync('formVal')
      })
    }
  },

  loadData() {
    server.sendRequest({
      url: '/TravelProduct/GetAppTravelProductDetail',
      data: {
        Id: this.data.goodId
      },
      method: 'post',
      success: res => {
        if (res.Data.Type == '1' || res.Data.Type == '2') {
          this.getType();
        } else if (res.Data.Type == '3' || res.Data.Type == 5) {
          let visitorType = res.Data.OtherProduct.UnifiedSale ? res.Data.OtherProduct.UnifyType : res.Data.OtherProduct.DisunityType;
          this.setData({
            visitorType
          })
        }
        this.setData({
          goodsDetail: res.Data
        })
      }
    })
  },
  getType() {
    let that = this;
    server.sendRequest({
      url: '/Lable/GetVisitorTypes',
      method: 'post',
      success: res => {
        that.setData({
          visitorType: res.Data.VisitorTypes
        })
      }
    })
  },
  getStartData(e) {
    this.data.startData = e.detail.value;
    this.data.formVal.StartTime = this.data.startData + ' ' + this.data.startTime;
    this.setData({
      startData: this.data.startData,
      formVal: this.data.formVal
    })
  },
  getStartTime(e) {
    this.data.startTime = e.detail.value;
    this.data.formVal.StartTime = this.data.startData + ' ' + this.data.startTime;
    this.setData({
      startTime: this.data.startTime,
      formVal: this.data.formVal
    })
  },
  getEndData(e) {
    this.data.endData = e.detail.value;
    this.data.formVal.EndTime = this.data.endData + ' ' + this.data.endTime;
    this.setData({
      endData: this.data.endData,
      formVal: this.data.formVal
    })
  },
  getEndTime(e) {
    this.data.endTime = e.detail.value;
    this.data.formVal.EndTime = this.data.endData + ' ' + this.data.endTime;
    this.setData({
      endTime: this.data.endTime,
      formVal: this.data.formVal
    })
  },
  getVisitor(e) {
    let index = e.detail.value;
    this.data.formVal.VisitorTypeName = this.data.visitorType[index].Name;
    this.data.formVal.VisitorTypeId = this.data.visitorType[index].Id;
    let type = this.data.goodsDetail.Type;
    this.setData({
      formVal: this.data.formVal
    })
    if (type == 1 || type == 2 || type == 5) {
      if (this.data.formVal.DepartureDate && this.data.formVal.VisitorTypeId) {
        this.getprice();
      }
    } else if (type == 3) { //其他产品
      this.data.formVal.Price = this.data.visitorType[index].SalePrice;
      this.data.formVal.CostPrice = this.data.visitorType[index].CostPrice;
      this.setData({
        formVal: this.data.formVal
      })
    }
  },
  getGoTime(e) {
    let index = e.detail.value;
    this.data.formVal.DepartureDate = this.data.goodsDetail.DepartureDate[index]
    this.setData({
      formVal: this.data.formVal
    })
    if (this.data.formVal.DepartureDate && this.data.formVal.VisitorTypeId) {
      this.getprice();
    }
  },
  getprice() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetSalePrice',
      data: {
        Id: that.data.goodId, // 商品Id 
        Date: that.data.formVal.DepartureDate, //日期
        VistorType: that.data.formVal.VisitorTypeId // 游客类型
      },
      method: 'post',
      success: res => {
        that.data.formVal.Price = res.Data.SalePrice;
        that.data.formVal.CostPrice = res.Data.CostPrice;
        that.setData({
          formVal: that.data.formVal
        })
      }
    })
  },
  getKillPrice(e) {
    this.data.formVal.KillPrice = e.detail.value <= 0 ? 1 : e.detail.value;
    this.setData({
      formVal: this.data.formVal
    })
  },
  getASSENUM(e) {
    this.data.formVal.ASSENUM = parseInt(e.detail.value);
    this.setData({
      formVal: this.data.formVal
    })
  },
  getStockNum(e) {
    this.data.formVal.StockNum = e.detail.value <= 0 ? 1 : parseInt(e.detail.value);
    this.setData({
      formVal: this.data.formVal
    })
  },
  changeLimit(e) {
    this.data.formVal.IsLimtBuy = e.currentTarget.dataset.limit;
    this.setData({
      formVal: this.data.formVal
    })
  },
  getLimtNum(e) {
    this.data.formVal.LimtNum = e.detail.value == 0 ? 1 : e.detail.value;
    this.setData({
      formVal: this.data.formVal
    })
  },

  showTextarea() {
    this.setData({
      showText: true
    })
  },

  getExtens(e) {
    this.data.formVal.Extens = e.detail.value;
    this.setData({
      formVal: this.data.formVal,
      showText: false
    })
  },
  toIssue() {
    let that = this;
    let dataUrl = that.data.openType == "seckill" ? '/Seckill/AddSiteSeckillVx' : '/Assem/AddSiteAssemVx';
    server.sendRequest({
      url: dataUrl,
      data: {
        ProductId: that.data.goodId,
        ...that.data.formVal
      },
      method: 'post',
      success: res => {
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
  toPreview() {
    wx.setStorageSync('formVal', this.data.formVal);
    wx.navigateTo({
      url: '/pages/previewDetail/previewDetail?Id=' + this.data.goodId + '&type=' + this.data.openType,
    })
  },
  reviseData(e) {
    if ((this.data.goodsDetail.Type == '1' || this.data.goodsDetail.Type == '2' || this.data.goodsDetail.Type == '5') && !this.data.formVal.DepartureDate) {
      let content = this.data.goodsDetail.Type == '5' ? '入住日期不为空！' : '出发日期不为空！';
      $Message({
        content,
        type: 'error'
      });
      return false;
    }
    if (!this.data.formVal.StartTime || !this.data.formVal.EndTime) {
      $Message({
        content: '活动时间不为空！',
        type: 'error'
      });
      return false;
    }
    if (!this.data.formVal.VisitorTypeName) {
      $Message({
        content: '类型不为空！',
        type: 'error'
      });
      return false;
    }

    if (!this.data.formVal.KillPrice) {
      $Message({
        content: '活动价不为空！',
        type: 'error'
      });
      return false;
    }
    if (!this.data.formVal.StockNum) {
      $Message({
        content: '活动库存不为空！',
        type: 'error'
      });
      return false;
    }
    if (this.data.openType == 'assem') {
      if (!this.data.formVal.ASSENUM) {
        $Message({
          content: '成团人数不为空！',
          type: 'error'
        });
        return false;
      }
      if (this.data.formVal.ASSENUM < 2) {
        $Message({
          content: '成团人数不为空且大于2！',
          type: 'error'
        });
        return false;
      }
      if (this.data.formVal.StockNum % this.data.formVal.ASSENUM != 0) {
        $Message({
          content: '活动库存需为成团人数的倍数！',
          type: 'error'
        });
        return false;
      }
    }
    if (!this.data.formVal.Extens) {
      $Message({
        content: '分享文案不为空！',
        type: 'error'
      });
      return false;
    }
    if (this.data.formVal.Extens.replace(/\s+/g, "").length < 5) {
      $Message({
        content: '分享文案不低于5字！',
        type: 'error'
      });
      return false;
    }
    if (e.currentTarget.dataset.type == 'issue') {
      this.toIssue();
    } else if (e.currentTarget.dataset.type == 'preview') {
      this.toPreview();
    }
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