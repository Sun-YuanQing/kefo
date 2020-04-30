// components/commodity/commodity.js
Component({
  properties: {
    goods: Object,
    setting: Number,
    showSet: String,
    isAdmin: Boolean
  },
  attached() {
    let MyDistId = wx.getStorageSync('MyDistId') ? true : false;
    this.setData({
      MyDistId
    })
  },
  methods: {
    toShopDetail(e) {
      wx.navigateTo({
        url: '/pages/shopDetail/shopDetail?Id=' + this.data.goods.Id,
      })
    },
    showModal() {
      this.triggerEvent('showModal', {
        id: this.data.goods.Id
      })
    },
    toRecommend() {
      this.triggerEvent('toRecommend', {
        id: this.data.goods.Id,
        recommend: !this.data.goods.Recommend
      })
    },
    toSeckill(e) {
      wx.removeStorageSync('formVal');
      if (e.currentTarget.dataset.type == "seckill") {
        if (this.data.goods.SecKill) {
          return false;
        }
      } else {
        if (this.data.goods.Assem) {
          return false;
        }
      }
      wx.navigateTo({
        url: '/pages/openSeckill/openSeckill?id=' + this.data.goods.Id + "&type=" + e.currentTarget.dataset.type,
      })
    }
  }
})