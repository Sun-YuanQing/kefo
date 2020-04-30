// pages/statistics/index/index.js
//获取应用实例
const server = require('../../../utils/server')
import * as echarts from '../../../ec-canvas/echarts';
var lineChart = null;
var lineChartComponnet = null;
var pieChart = null;
var pieChartComponnet = null;

Page({


  /**
   * 页面的初始数据
   */
  data: {
    type1: '3',
    year: '2019',
    type2: '1',
    statistics: {},
    statisticsList: {},
    isShowImg: false,
    // //折线图
    ecLine: {
      // lazyLoad: true, // 延迟加载
    },
    //饼图
    ecPie: {
      // lazyLoad: true, // 延迟加载
    },
    lineshen: "block",
    pieShen: "block",
    lineBarArray: [],
    pieBarArray: [],
  },
  onReady: function() {
    // 获取组件
    // this.lineChartComponnet = this.selectComponent('#lineChart');
    // this.pieChartComponnet = this.selectComponent('#pieChart');

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    lineChartComponnet = this.selectComponent('#lineChart');
    pieChartComponnet = this.selectComponent('#pieChart');
    this.getAppStatistics();
    this.getLineBar();
  },


  radio1Change: function(e) {
    this.setData({
      type1: e.detail.value
    })
    this.getLineBar();
  },
  radio2Change: function(e) {
    const self = this;
    let value = e.detail.value;
    this.setData({
      type2: value
    });
    let statisticsList = this.data.statisticsList;
    let flag;
    let arr = [];
    if (value == '1') {
      flag = statisticsList.consume.every(item => {
        return item.value == 0;
      });
      flag ? arr = [] : arr = statisticsList.consume;
      self.setData({
        pieBarArray: arr
      })
    } else {
      flag = statisticsList.recharge.every(item => {
        return item.value == 0;
      });
      flag ? arr = [] : arr = statisticsList.recharge;
      self.setData({
        pieBarArray: arr
      })
    }
    if (flag) {
      self.setData({
        pieShen: 'none'
      });
      return;
    } else {
      self.setData({
        pieShen: 'block'
      });
      initPieChart(self.data.pieBarArray, self.data.type2);
    }

  },
  bindDateChange: function(e) {
    this.setData({
      year: e.detail.value
    });
    this.getLineBar();
  },
  closeImg: function(e) {
    let lineshen = this.data.lineBarArray.length > 0 ? 'block' : 'none';
    let pieShen = this.data.pieBarArray.length > 0 ? 'block' : 'none';

    this.setData({
      isShowImg: false,
      lineshen,
      pieShen
    })
  },
  showTip: function(e) {
    this.setData({
      isShowImg: true,
      lineshen: 'none',
      pieShen: "none"
    })
  },

  //获取统计数据和饼图数据
  getAppStatistics: function() {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Report/GetAppStatistics",
      data: {},
      method: 'POST',
      success: function(res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          Data.DecimalConsume = Number(Data.TotalConsume).toFixed(2).substr(-2, 2);
          Data.DecimalRecharge = Number(Data.TotalRecharge).toFixed(2).substr(-2, 2);
          Data.DecimalBalance = Number(Data.AccountBalance).toFixed(2).substr(-2, 2);

          Data.TotalConsume = parseInt(Data.TotalConsume);
          Data.TotalRecharge = parseInt(Data.TotalRecharge);
          Data.AccountBalance = parseInt(Data.AccountBalance);

          //饼图数据
          let consumeArray = [];
          let rechargeArray = [];
          Data.ConsumeStatistics.forEach(item => {
            consumeArray.push({
              name: item.Item,
              value: item.Consume
            });
          })
          Data.RechargeStatistics.forEach(item => {
            rechargeArray.push({
              name: item.Item,
              value: item.Recharge
            });
          })

          self.setData({
            statistics: Data,
            statisticsList: {
              consume: consumeArray,
              recharge: rechargeArray
            }
          });

          let flag;
          let arr = [];
          if (self.data.type2 == '1') {
            flag = consumeArray.every(item => {
              return item.value == 0;
            });
            flag ? arr = [] : arr = consumeArray;
            self.setData({
              pieBarArray: arr
            })
          } else {
            flag = rechargeArray.every(item => {
              return item.value == 0;
            });
            flag ? arr = [] : arr = rechargeArray;
            self.setData({
              pieBarArray: arr
            })
          }
          if (flag) {
            self.setData({
              pieShen: 'none'
            });
            return;
          } else {
            self.setData({
              pieShen: 'block'
            });
            initPieChart(self.data.pieBarArray, self.data.type2);
            // setPieOption(self.data.pieBarArray); //更新数据
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
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  lineInit(e) {
    this.setData({
      typeE: e.detail
    })
  },
  pieInit(e) {
    this.setData({
      typeP: e.detail
    })
  },
  //折线图数据
  getLineBar: function() {
    const self = this;
    server.sendRequest({
      url: "/Report/GetAppStatisticsByYear",
      data: {
        TYPE: self.data.type1, //1. 充值 3. 消费
        year: self.data.year
      },
      method: 'POST',
      success: function(res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          self.data.lineBarArray = Data.Arr;
          let flag = self.data.lineBarArray.every(item => {
            return item == 0;
          })
          if (flag) {
            self.data.lineBarArray = [];
            self.setData({
              lineshen: 'none'
            })
            return;
          } else {
            self.setData({
              lineshen: 'block'
            })
            // setLineOption(self.data.lineBarArray); //更新数据
            initLineChart(self.data.lineBarArray); //初始化图表
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
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

});

//创建折线图
function initLineChart(lineBarArray) {
  lineChartComponnet.init((canvas, width, height) => {
    // 初始化图表
    lineChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(lineChart);
    setLineOption(lineChart, lineBarArray);
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return lineChart;
  });
}
//更新折线图数据
function setLineOption(lineChart, lineBarArray) {
  lineChart.clear(); // 清除
  lineChart.setOption(getLineOption(lineBarArray)); //获取新数据
}

//折线图配置
function getLineOption(lineBarArray) {
  return {
    title: {
      text: "金额(元)",
      left: "left",
      top: "4%",
      textStyle: {
        color: "#999",
        fontSize: 12
      }
    },
    color: ["#FFAE3B"],
    tooltip: {
      trigger: 'axis',
      formatter: "{c}元" //"{b}:{c}元"
    },
    dataZoom: [{
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 50
    }],
    grid: {
      top: '17%',
      bottom: '3%',
      left: '1%',
      right: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ],
      axisLine: {
        lineStyle: {
          type: 'solid',
          color: '#f5f5f5', //左边线的颜色
          width: '1', //坐标线的宽度
        }
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#999', //坐标值得具体的颜色
        }
      },
    },
    yAxis: {
      x: 'center',
      type: 'value',
      // name: '金额(元)',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: ["#f5f5f5"]
        },
      },
      axisLine: {
        lineStyle: {
          type: 'solid',
          color: '#f5f5f5', //左边线的颜色
          width: '1' //坐标线的宽度
        }
      },
      axisLabel: {
        textStyle: {
          color: '#999', //坐标值得具体的颜色
        }
      }
    },
    series: [{
      data: lineBarArray, //[1,2,3,1,1,1,1,1,1,1,1,1],
      type: 'line',
      smooth: true,
    }],
  };


};

//创建饼图---------------------------------------------

function initPieChart(pieBarArray, type2) {
  pieChartComponnet.init((canvas, width, height) => {
    // 初始化图表
    pieChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(pieChart);
    setPieOption(pieChart, pieBarArray, type2);


    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return pieChart;
  });
}
//更新饼图数据
function setPieOption(pieChart, pieBarArray, type2) {
  pieChart.clear(); // 清除
  pieChart.setOption(getPieOption(pieBarArray, type2)); //获取新数据
}

//饼图配置
function getPieOption(pieBarArray, type2) {
  return {
    color: ["#FFAE3B", "#FF597A", "#76E7E4", "#588DFD", "#FF62E4", "#BD43FF"],
    tooltip: {
      trigger: 'item',
      position: function(point, params, dom, rect, size) {
        var viewWidth = size.viewSize[0] / 2;
        var viewHeight = size.viewSize[1];
        var boxWidth = size.contentSize[0] / 2;
        var boxHeight = size.contentSize[1];
        var posX = viewWidth - boxWidth;
        var posY = viewHeight - boxHeight;
        return [posX, posY];
      },
      formatter: function(e) {
        let fuhao = type2 == '2' ? '+' : '-';
        let tips = e.data.name + ' ' + e.percent + '%' + '       ' + fuhao + '￥' + e.data.value;
        return tips;
      },
      backgroundColor: 'rgba(255,239,239,1)',
      textStyle: {
        color: '#000',
      }
    },
    grid: {
      top: '25%',
      bottom: '1%',
      left: '5%',
      right: '5%',
      containLabel: true
    },
    series: [{
      type: 'pie',
      radius: ['0', '65%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
          textStyle: {
            fontWeight: 300,
            fontSize: 16 //文字的字体大小
          },
          formatter: function(e) {
            var percentage = parseInt(e.percent) + '%';
            return percentage
          }
        },
        emphasis: {
          show: false,
          textStyle: {
            fontSize: '14',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: pieBarArray,
      // animationDelay: function (idx) {
      //   return idx * 50;
      // },
      // animationEasing: 'elasticOut'
    }],
  };

  // return options;

}