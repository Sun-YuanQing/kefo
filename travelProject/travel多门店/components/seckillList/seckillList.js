// components/seckillList/seckillList.js
Component({
  properties: {
    seckill: Object,
    showSet: String,
    setting: Number
  },
  data: {
    timer: "",
    sellout: 0
  },
  attached() {
    let sellout = parseInt(this.data.seckill.SaleNum / this.data.seckill.StockNum * 100);
    this.setData({
      isAdmin: wx.getStorageSync('isAdmin'),
      sellout: sellout
    })
    if (sellout < 100) {
      this.calculate();
    }
  },
  methods: {
    calculate() {
      let that = this;
      clearTimeout(that.data.timer)
      let nowTime = new Date();
      let endTime = that.data.seckill.EndTime;
      let enddate = new Date(parseInt(endTime.replace("/Date(", "").replace(")/", ""), 10));
      let totalTime = enddate - nowTime;
      let hours = parseInt(totalTime / 1000 / 60 / 60 / 24, 10) * 24 + parseInt(totalTime / 1000 / 60 / 60 % 24, 10);
      let minutes = parseInt(totalTime / 1000 / 60 % 60, 10);
      let seconds = parseInt(totalTime / 1000 % 60, 10);
      let hour = hours >= 10 ? hours : '0' + hours;
      let minute = minutes >= 10 ? minutes : '0' + minutes;
      let second = seconds >= 10 ? seconds : '0' + seconds;
      if (hours < 0 || minutes < 0 || seconds < 0) {
        hour = '00';
        minute = '00';
        second = '00';
      }
      that.setData({
        hour,
        minute,
        second
      })
      // this.data.timer = setTimeout(function () {
      //   that.calculate();
      // }, 1000)
    },
    toDetail() {
      if (this.data.sellout >= 100) {
        this.triggerEvent('sellFail');
        return false;
      }
      if (this.data.setting == 2) {
        if (this.data.seckill.ActivitType == 'assem' && this.data.seckill.TraveOrderState != '10') {
          wx.navigateTo({
            url: '/pages/groupBook/invite/invite?id=' + this.data.seckill.LaunchAssemId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.seckill.TraveOrderId,
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/seckillDetail/seckillDetail?Id=' + this.data.seckill.Id + '&type=' + this.data.seckill.ActivitType,
        })
      }

    },
    showModal() {
      this.triggerEvent('showModal', {
        id: this.data.seckill.Id
      })
    },
    toRecommend() {
      let type = 0;
      if (this.data.seckill.ActivitType == 'seck') {
        type = 2
      } else if (this.data.seckill.ActivitType == 'assem') {
        type = 3
      }
      this.triggerEvent('toRecommend', {
        id: this.data.seckill.Id,
        recommend: !this.data.seckill.Recommend,
        type
      })
    },
  }
})