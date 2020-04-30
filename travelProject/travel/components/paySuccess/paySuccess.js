// components/paySuccess/paySuccess.js
Component({
  properties: {
    type: String || Number,
    takeWay: String || Number,
    orderid: String
  },
  methods: {
    toHome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    toOrderDetail() {
      this.triggerEvent('toOrderDetail')
    },
    toHotel() {
      wx.redirectTo({
        url: '/hotelPackage/pages/hotelInfo/replenishInfo/replenishInfo?orderid=' + this.data.orderid,
      })
    },
    toSubmitAddress() {
      wx.redirectTo({
        url: '/pages/address/shippingAddress/shippingAddress?TraveOrderId=' + this.data.orderid 
      })
    },
    toUserExtract() {
      wx.redirectTo({
        url: '/pages/address/userExtract/userExtract?TraveOrderId=' + this.data.orderid
      })
    }
  }
})