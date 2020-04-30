// compoment/card_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardList: {
      type: Array, //类型
      value: [] //默认值
    },
    totalCards: {
      type: Number, //类型
      value: 1 //默认值
    },
    minHeight:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    allFlag: [false],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //手风琴效果
    changeToggle: function(e) {
      let index = e.currentTarget.dataset.index;
      if (this.data.allFlag[index]) {
        this.data.allFlag[index] = false;
      } else {
        this.data.allFlag[index] = true;
      }
      this.setData({
        allFlag: this.data.allFlag
      })
    },
    navigate(e) {
      let options = e.currentTarget.dataset.options;
      wx.navigateTo({
        url: "/pages/card_bag/balance/balance?SiteId=" + options.SiteId + "&UserId=" + options.UserId + "&CardId=" + options.CardId
      })
    }
  }
})