import showdown from './showdown.js';
import HtmlToJson from './html2json.js';

var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function(res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})

function wxParse(bindName = 'wxParseData', type = 'html', data = '<div class="color:red;"></div>', target, imagePadding) {
  var that = target;
  var transData = {}; //存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName);
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName);
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if (typeof(imagePadding) != 'undefined') {
    transData.view.imagePadding = imagePadding
  }
  var bindData = {};
  bindData[bindName] = transData;
  that.setData(bindData)
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;
  that.wxParseTagATap = wxParseTagATap;
}
// 图片点击事件
function wxParseImgTap(e) {
  var that = this;
  var nowImgUrl = e.target.dataset.src;
  var tagFrom = e.target.dataset.from;
  if (typeof(tagFrom) != 'undefined' && tagFrom.length > 0) {
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: that.data[tagFrom].imageUrls // 需要预览的图片http链接列表
    })
  }
}
//a标签跳转事件
function wxParseTagATap(e) {
  const url = e.currentTarget.dataset.src;
  const tabbarUrl = [
    'pages/index/index',
    'pages/business/index',
    'pages/cart/index',
    'pages/member/index'
  ];
  let isTabbar = false;
  for (let i = 0; i < tabbarUrl.length; i++) {
    if (url.indexOf(tabbarUrl[i]) >= 0) {
      isTabbar = true;
    }
  }
  if (isTabbar) {
    wx.switchTab({
      url
    })
  } else {
    wx.navigateTo({
      url
    })
  }
}

function wxParseImgLoad(e) {
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof(tagFrom) != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom)
  }
}

function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;

  var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);

  var index = temImages[idx].index
  var key = `${bindName}`
  for (var i of index.split('.')) key += `.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  })
}

function wxAutoImageCal(originalWidth, originalHeight, that, bindName) {

  var windowWidth = 0,
    windowHeight = 0;
  var autoWidth = 0,
    autoHeight = 0;
  var results = {};
  var padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;

  if (originalWidth > windowWidth) {
    autoWidth = windowWidth;

    autoHeight = (autoWidth * originalHeight) / originalWidth;

    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;
  } else {
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that) {
  var array = [];
  var temData = that.data;
  var obj = null;
  for (var i = 0; i < total; i++) {
    var simArr = temData[bindNameReg + i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"' + temArrayName + '":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

function emojisInit(reg = '', baseSrc = "/wxParse/emojis/", emojis) {
  HtmlToJson.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray: wxParseTemArray,
  emojisInit: emojisInit
}