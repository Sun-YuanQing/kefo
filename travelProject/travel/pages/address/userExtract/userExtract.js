// pages/address/userExtract/userExtract.js

//到本页请参考pages/address/userExtract/userExtract?TraveOrderId='+orderId
//自提联系
const server = require('../../../utils/server.js');
const {
  $Message
} = require('../../../components/iview/base/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    telNumber: null,
    TraveOrderId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TraveOrderId: options.TraveOrderId
    })
  },
  bindUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindTelNumber(e) {
    this.setData({
      telNumber: e.detail.value
    })
  },
  onAddress() {
    var that = this;
    if (!that.data.userName) {
      $Message({
        content: '联系人不能为空！',
        type: 'error'
      });
      return false;
    }
    if (!that.data.telNumber || that.data.telNumber.length != 11) {
      $Message({
        content: '手机号填写不正确！',
        type: 'error'
      });
      return false;
    }
    if (!that.data.TraveOrderId) {
      return false;
    }
    server.sendRequest({
      url: '/TraveOrder/SetTraveOrderSelfTakeVX',
      method: 'post',
      data: {
        Name: that.data.userName,
        Phone: that.data.telNumber,
        TraveOrderId: that.data.TraveOrderId
      },
      success: function (res) {
        $Message({
          content: '提交成功！',
          type: 'success'
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);

      }
    });
  }
})