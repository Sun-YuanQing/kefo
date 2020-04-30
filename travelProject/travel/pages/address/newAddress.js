// pages/address/newAddress.js
const server = require('../../utils/server.js');
const userLocation = require('../../utils/userLocation.js');
const {
  $Message
} = require('../../components/iview/base/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //修改会有id
    index: null, //在编辑的地址列表nidex
    region: {},
    customItem: '全部',
    address: {} //新增修改的地址
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.id ? '编辑收货地址' : '新建收货地址'
    })
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.loadData();
    } else {
      this.getLocation();
    }
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserAddress/GetUserAddressByIdVX?Id=' + that.data.id,
      method: 'post',
      success: function (res) {
        that.data.region = {
          Province: res.Data.Province,
          City: res.Data.City,
          District: res.Data.District
        }
        that.setData({
          region: that.data.region,
          address: res.Data
        });
      }
    });
  },

  /**
   * 获取用户位置
   */
  getLocation: function (e) {
    var that = this;
    userLocation.getLocation({
      success(address) {
        that.data.region.Province = address.province;
        that.data.region.City = address.city;
        that.data.region.District = address.district;
        that.setData({
          region: that.data.region
        })
      },
      fail(e) {
        $Message({
          content: '定位失败,请手动选择所在区域！',
          type: 'error'
        });
      }
    })
  },

  bindRegionChange: function (e) {
    this.data.region.Province = e.detail.value[0];
    this.data.region.City = e.detail.value[1];
    this.data.region.District = e.detail.value[2];
    this.setData({
      region: this.data.region
    })
  },


  // 新增/修改收货地址
  onAddress() {
    var that = this;
    if (!that.data.address.Name) {
      $Message({
        content: '请填写收货人信息！',
        type: 'error'
      });
      return false;
    }
    if (!that.data.address.Phone || that.data.address.Phone.length != 11) {
      $Message({
        content: '请填写正确的手机号！',
        type: 'error'
      });
      return false;
    }
    if (!that.data.address.Address) {
      $Message({
        content: '请填写完整详细地址！',
        type: 'error'
      });
      return false;
    }
    let addrId = that.data.id ? {
      Id: that.data.id
    } : {}
    var urlData = {
      Name: that.data.address.Name,
      Phone: that.data.address.Phone,
      ...that.data.region,
      Address: that.data.address.Address,
      ...addrId
    }
    server.sendRequest({
      url: '/UserAddress/AddUserAddressVX',
      method: 'post',
      data: urlData,
      success: function (res) {
        $Message({
          content: that.data.id ? '修改地址成功！': '新增地址成功！',
          type: 'success'
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
      }
    });
  },

  bindAddressName(e) {
    this.setData({
      'address.Name': e.detail.value
    })
  },
  bindAddressPhone(e) {
    this.setData({
      'address.Phone': e.detail.value
    })
  },
  bindAddressAddress(e) {
    this.setData({
      'address.Address': e.detail.value
    })
  }
})