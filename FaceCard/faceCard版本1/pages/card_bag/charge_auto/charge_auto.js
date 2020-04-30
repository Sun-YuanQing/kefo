// pages/card_bag/charge_auto/charge_auto.js
//获取应用实例
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: false,
    checked: false,
    options: {},
    amount: '',
    preferentials: [],
    selected: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = JSON.parse(options.array)
    this.setData({
      options: options,
      preferentials: arr
    })
  },

  //下单充值
  charge: function () {
    if (!this.data.disable) return;
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Pay/WxPayApiRecharge",
      method: "POST",
      data: {
        SiteId: self.data.options.SiteId,
        UserId: self.data.options.UserId,
        CardId: self.data.options.CardId,
        Amount: self.data.amount,
        PreferentialAmount: self.data.selected.PreferentialAmount || 0,
        OpenId: wx.getStorageSync("OpenId"),
      },
      success: function (res) {
        wx.hideLoading();
        let { Code, Data, Message } = res.data;
        if (Code == "0") {
          // let { timeStamp, nonceStr, paySign, signType, package } = Data.m_values;
          let data = Data.m_values;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok'){
                let amount = self.data.selected.Amount || self.data.amount;
                let preferentialAmount = self.data.selected.PreferentialAmount || 0;
                let total = Number(amount) + Number(preferentialAmount);
                let param = {
                  type: 1,
                  total: total
                }
                wx.navigateTo({
                  url: '/pages/card_bag/success/success?param=' + JSON.stringify(param)
                })
              }
              
            },
            'fail': function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (Code == '400') {

          wx.showModal({
            title: '',
            content: Message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/phone/phone'
                })
              }
            }
          })


        } else {
          // wx.showToast({
          //   title: Message,
          //   icon: 'none',
          //   duration: 2000
          // })
        }

      },
      fail: function (err) {
        // wx.showToast({
        //   title: err,
        //   icon: 'none',
        //   duration: 2000
        // })
      }

    })
  },

  checkboxChange: function () {
    this.setData({
      checked: !this.data.checked
    })
    if (this.data.amount && this.data.checked) {
      this.setData({ disable: true })
    } else {
      this.setData({ disable: false })
    }
  },

  //升序排列
  up: function(x,y){
    return x.ratio - y.ratio
  },

  inputChange: function(e){
    let value = e.detail.value ;
    this.setData({ amount: value })
    if (value && this.data.checked){
      this.setData({ disable: true })
    }else{
      this.setData({ disable: false })
    }

    //匹配优惠金额
    let oldArr = this.data.preferentials;
    if (oldArr.length> 0){
      //按充值金额升序排列
      let minArr = oldArr.sort(function (x, y) {
        return x.Amount - y.Amount
      });
      //输入值大于等于最小优惠金额才匹配
      if (value >= minArr[0].Amount){
        //小于输入值的数组
        let arr = [];
        for (let i = 0; i < oldArr.length; i++) {
          if (oldArr[i].Amount <= value) {
            arr.push(oldArr[i])
          }
        }
        //选择符合条件优惠力度又大的
        //按充值优惠金额降序排列
        let maxArr = arr.sort(function (x, y) {
          return y.PreferentialAmount - x.PreferentialAmount
        });
        this.setData({
          selected: maxArr[0]
        })
        
      }else{
        this.setData({ selected: {} })
      }
      
    }
    
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