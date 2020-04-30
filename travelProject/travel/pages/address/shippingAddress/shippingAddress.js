// pages/address/shippingAddress/shippingAddress.js
// 到本页请参考pages/address/shippingAddress/shippingAddress?TraveOrderId=' + OrderId
//快递
const server = require('../../../utils/server.js');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objAddress: {}, //去重对象
    arrAddress: [], //不重复的地址数据
    TraveOrderId: "", //补充地址的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TraveOrderId: options.TraveOrderId
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  },
  onShow: function () {
    this.loadData();
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserAddress/GetUserAddresslisttVX',
      method: 'post',
      success: res => {
        wx.hideLoading();
        that.setData({
          arrAddress: res.Data
        })
      }
    });
  },

  /**
   * 导入微信地址
   */
  onAddressWx() {
    var that = this;
    wx.chooseAddress({
      success(res) {
        if (!that.data.objAddress[res.detailInfo]) {
          that.data.objAddress[res.detailInfo] = true;
          that.data.arrAddress.push(res);
        }
        that.setData({
          arrAddress: that.data.arrAddress
        })
        server.sendRequest({
          url: '/UserAddress/AddUserAddressVX',
          method: 'post',
          data: {
            Name: res.userName,
            Phone: res.telNumber,
            Province: res.provinceName,
            City: res.cityName,
            District: res.countyName,
            Address: res.detailInfo
          },
          success: apiRes => {
            that.loadData();
          }
        })
      }
    })
  },
  /**
   * 新建/编辑地址(同一个页面)
   */
  onAddressAdd(e) {
    this.triggerEvent('customevent', {}) 
    var id = e.currentTarget.dataset.id || '';
    wx.navigateTo({
      url: '/pages/address/newAddress?id=' + id
    })
  },
  onSubmitAddress(e) {
    //订单为取货方式的补地址
   var that = this;
   wx.showModal({
    title: '提示',
    content: '是否提交订单地址?',
    success (res) {
      if (res.confirm) {
        if (that.data.TraveOrderId == "") {
          return false;
        }
        var data = e.currentTarget.dataset.item;
        data.TraveOrderId = that.data.TraveOrderId;
        server.sendRequest({
          url: '/UserAddress/AddOrderAddressVX',
          method: 'post',
          data,
          success: function (res) {
            $Message({
              content: '订单地址提交成功！',
              type: 'success'
            });
            setTimeout(function () {
              wx.navigateBack({});
            }, 700);
          }
        });
      } else if (res.cancel) {
        return false
      }
    }
  })
  
   
  

  }
})