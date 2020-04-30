// components/member/member.js
Component({
  properties: {
    merchant: Object
  },
  methods: {
    downphone() {
      this.setData({
        showTel: !this.data.showTel
      })
    },
    makeCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.merchant.Tel
      })
    },
    // 地址导航
    getAddress() {
      let that = this;
      if (that.data.merchant.Lat && that.data.merchant.Lon) {
        wx.openLocation({
          latitude: parseFloat(that.data.merchant.Lat),
          longitude: parseFloat(that.data.merchant.Lon),
          scale: 18
        })
      } else {
        that.triggerEvent('noneAddr')
      }
    },
  }
})