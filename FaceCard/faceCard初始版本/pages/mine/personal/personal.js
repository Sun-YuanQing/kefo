// pages/mine/personal/personal.js
//获取应用实例
const app = getApp()
const server = require('../../../utils/server')
var common_js =  require('../../../utils/dataPicker.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeName: false,
    name: "",
    array: ["男","女"],
    personalInfor: { },
    dateArray: [],
    multiIndex: [0 , 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryUserInfo()
  },

  //获取用户信息
  queryUserInfo: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/PhoneUser/GetPhoneUser",
      method: 'POST', 
      success: function (res) {
        wx.hideLoading();
        //console.log("res", res.data)
        let { Code, Data, Message } = res.data;
        if (Code == "0") {
          if (Data.Birthday) {
            var arr = Data.Birthday.split('月');
          }else{
            var arr = '9月10日'.split('月');
          }
          var month = parseInt(arr[0]);
          var date = parseInt(arr[1]);
          //console.log("date", month, date)
          var obj = common_js.datePicker(month);
          self.data.multiIndex[0] = parseInt(month - 1);
          self.data.multiIndex[1] = parseInt(date - 1);

          self.setData({
            dateArray: obj,
            name: Data.Name,
            multiIndex: self.data.multiIndex,
            personalInfor: Data
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
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },

  //更改用户信息
  changeUserInfor: function(key,value){
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/PhoneUser/SavePhoneUser",
      method: 'POST', 
      data: {
        [key]: value
      },
      success: function (res) {
        wx.hideLoading();
        //console.log(key, res.data)
        let { Code, Data, Message } = res.data;
        if (Code == "0") {
          if(key == 'Name'){
            self.setData({
              changeName: false
            })
          }
          self.setData({
            personalInfor: Data,
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
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },

  changePhoto: function (key, value) {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.uploadFile({
      url: app.globalData.baseUrl + "/PhoneUser/SavePhoneUser",
      filePath: value,
      name: key,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "multipart/form-data",
        "accept": "application/json",
        'access-token': wx.getStorageSync("WxToken")
      },
      success: function (res) {
        wx.hideLoading();
        //console.log(key, res.data)
        let { Code, Data, Message } = JSON.parse(res.data) ;
        if (Code == 0) {
          //console.log('key', Data)
          self.setData({
            personalInfor: Data,
          })
          var pages = getCurrentPages();
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            prePage.setData({
              userInfo: Data
            })
          }

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
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function(err){
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //更换头像
  changeAvatar: function(){
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            wx.navigateTo({
              url: '/pages/mine/avatar_cropper/avatar_cropper?data=' + JSON.stringify(res)
            })
          }
        })
        
      }
    })
  },

  

  //修改昵称
  editName: function(){
    this.setData({
      changeName: true
    })
  },
  bindKeyInput: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  cancel: function(){
    this.setData({
      changeName: false
    })
  },
  confirm: function () {
    const self = this;
    if (!self.data.name){
      wx.showToast({
        title: '昵称不能为空!',
        icon: 'loading',
        duration: 2000
      })
    }else{
      self.changeUserInfor('Name',self.data.name)
    }
    
  },

  //修改性别
  editSex: function(){
    const self = this;
    wx.showActionSheet({
      itemList: ['女','男'],
      success(res) {
        //console.log(res.tapIndex)
        self.changeUserInfor('Sex', res.tapIndex)
      },
      fail(res) {
        //取消按钮
        //console.log(res.errMsg)
      }
    })
  },

  //生日修改
  // bindDateChange: function (e) {
  //   //console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.data.personalInfor.Birthday = e.detail.value;
  //   this.setData({
  //     personalInfor: this.data.personalInfor,
  //   })
  // },

  changeDate: function(e){
    //console.log('e1', e.detail)
    var arr = e.detail.value;
    let birthday = (arr[0] + 1) + '月' + (arr[1] + 1) + '日';
    this.changeUserInfor('Birthday', birthday);
  },

  changeDateColumn: function(e){
    //console.log('e2', e.detail)
    if (e.detail.column == 0){
      var obj = common_js.datePicker(e.detail.value + 1);
      this.setData({
        dateArray: obj,
      })
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