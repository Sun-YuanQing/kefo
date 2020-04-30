// 计算倒计时 
const calculate = val => {
  var nowTime = (new Date()).valueOf(),
    enddate = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10)),
    totalTime = enddate - nowTime,
    hours = parseInt(totalTime / 1000 / 60 / 60 / 24, 10) * 24 + parseInt(totalTime / 1000 / 60 / 60 % 24, 10),
    minutes = parseInt(totalTime / 1000 / 60 % 60, 10),
    seconds = parseInt(totalTime / 1000 % 60, 10),
    getTime = {
      hour: hours >= 10 ? hours : '0' + hours,
      minute: minutes >= 10 ? minutes : '0' + minutes,
      second: seconds >= 10 ? seconds : '0' + seconds
    };
  if (getTime.hours < 0 || getTime.minutes < 0 || getTime.seconds < 0) {
    hour = '00';
    minute = '00';
    second = '00';
  }
  return getTime;
}

//毫秒转化为日期时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//毫秒转化为日期
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//解析路由参数
const getQueryVariable = (href) => {
  let query = href.substring(href.indexOf('?') + 1);
  let vars = query.split("&");
  let obj = {}
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    obj[pair[0]] = pair[1]
  }
  return obj;
}

module.exports = {
  calculate,
  formatTime,
  formatDate,
  getQueryVariable
}