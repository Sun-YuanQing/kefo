// pages/doctor/reportDetail/reportDetail.js
const server = require('../../../utils/server.js');
const uCharts = require('../../../js/ucharts/u-charts.js');
var _self;
var canvaLineA = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cWidth: '',
    cHeight: '',
    ItemName: "", //默认高亮名称(不能只用下标默认高亮)
    index: null, //选项卡的高亮下标(默认高亮下标)
    tabBar: [], //选项卡的数据
    objreport: {}, //辅助reportDetail去重对象(利用对象的键都是不重的特性),已有键,再次点击选项卡不会再放到reportDetail
    reportDetail: {}, //对应选项卡的页面图表完整数据
    uChartIndex: 0, //选中x轴的下标 reportDetail[tabBar[index].ItemName].detail[uChartIndex]
    //选中x轴的下标 reportDetail[选项卡[选中的下标].的名称].detail[选中x轴的下标]
    healthyid: "2519d5132cfc4f7d9ac8dec2de986887"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   healthyid : options.healthyid
    // })
    _self = this;
    this.cWidth = "292";
    this.cHeight = "113";
    this.loadData();
  },
  loadData() {
    let that = this;
    let healthyid = that.data.healthyid;
    server.sendRequest({
      url: '/HealthyReport/GetMyHealthyItemNamesVX?healthyId=' + healthyid,
      method: 'post',
      success: res => {
        console.log(res.Data)
        that.setData({
          tabBar: res.Data,
          ItemName: res.Data[0].ItemName //默认高亮
        })
        var e = {
          currentTarget: {
            dataset: {
              index: 0
            }
          }
        }; //模拟点击数据
        that.changeProduct(e); //模拟点击选项卡
      },
      fail: error => {
        console.log(error)
      }
    });
  },
  changeProduct(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      ItemName: that.data.tabBar[index].ItemName,
      index: index
    });
    if (!that.data.objreport[that.data.tabBar[index].ItemName]) {
      server.sendRequest({
        url: '/HealthyReport/GetMyHealthyDetailResultVX?itemName=' + that.data.tabBar[index].ItemName,
        method: 'post',
        success: res => {
          var detail = res.Data.MyHealthyDetailResult;
          var reportDetail = {
            detail: detail,
            LineA: {
              categories: [],
              series: [{
                "name": "",
                "color": '#FFAE3B',
                "data": []
              }]
            }
          };
          for (var i = 0, len = detail.length; i < len; i++) {
            reportDetail.LineA.categories.push(detail[i].PhyDate);
            reportDetail.LineA.series[0].data.push(detail[i].ItemAct); //注意是series[0].data
          }
          reportDetail.LineA.categories.push("日期");
          that.data.objreport[that.data.tabBar[index].ItemName] = true; //不必在意值,在意键有没有重
          that.data.reportDetail[that.data.tabBar[index].ItemName] = reportDetail; //整理好的后台数据

          that.setData({
            reportDetail: that.data.reportDetail
          })
          that.showLineA("canvasLineA", that.data.reportDetail[that.data.tabBar[index].ItemName]);
          console.log(that.data.reportDetail)
        },
        fail: error => {
          console.log(error)
        }
      });
    } else {
      that.showLineA("canvasLineA", that.data.reportDetail[that.data.tabBar[index].ItemName]);
    }
  },
  showLineA(canvasId, chartData) {
    canvaLineA = new uCharts({
      $this: _self,
      canvasId: canvasId,
      type: 'line',
      fontSize: 11,
      legend: true,
      dataLabel: true,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.LineA.categories,
      series: chartData.LineA.series,
      animation: true,
      enableScroll: true, //开启图表拖拽功能
      legend: {
        show: false
      }, //图列
      xAxis: {
        type: 'grid',
        gridType: 'dash',
        disabled: false, //!不绘制轴
        axisLine: false, //!坐标轴轴线是否显示
        disableGrid: true, //不绘制X轴网格(即默认绘制网格)
        itemCount: 5,
        scrollShow: false, //不显示滚动条
        scrollAlign: 'left',
        scrollBackgroundColor: '#F7F7FF',
        scrollColor: '#DEE7F7',
        calibration: true, //刻度线
        gridColor: "#00ffff", //X轴网格颜色(和刻度线) 
        //scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
        //scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
      },
      yAxis: {
        //disabled:true
        splitNumber: 3,
        min: 0,
        max: 180,
        format: (val) => {
          return val.toFixed(0)
        }, //如不写此方法，Y轴刻度默认保留两位小数(+"元")
        gridType: 'solid', //X轴网格线型 'solid'为实线、'dash'为虚线`
        disabled: false, //不绘制轴 false即默认绘制网格)
        axisLine: false, //坐标轴轴线是否显示
        gridColor: "#00ffff", //轴网格颜色(和刻度线) 
        disableGrid: false //不绘制X轴网格(false即默认绘制网格)
      },
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        line: {
          type: 'curve'
        }
      },
    });

  },
  touchLineA(e) {
    canvaLineA.scrollStart(e);
  },
  moveLineA(e) {
    canvaLineA.scroll(e);
  },
  touchEndLineA(e) {
    canvaLineA.scrollEnd(e);

    _self.setData({
      uChartIndex: canvaLineA.getCurrentDataIndex(e)
    })
    //下面是toolTip事件，如果滚动后不需要显示，可不填写
    canvaLineA.showToolTip(e, {
      format: function (item, category) {
        return item.data
      }
    });
    //下面是etoolTip事件，如果滚动后不需要显示，可不填写
    let currIndex = canvaLineA.getCurrentDataIndex(e);
    if (currIndex > -1 && currIndex < canvaLineA.opts.categories.length) {
      let riqi = canvaLineA.opts.categories[currIndex];
      let leibie = canvaLineA.opts.series[0].name;
      let shuju = canvaLineA.opts.series[0].data[currIndex];
      var Interactive = leibie + ':' + riqi + '-' + shuju;
    }
    _self.setData({
      Interactive: Interactive
    })
    console.log(Interactive);
  }
})