function withData(param){
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start,end){
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for(var i=start;i<=end;i++){
    array.push(i+ '日');
  }
  return array;
}
function getMonthArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(i + '月');
  }
  return array;
}

function getMonthDay(month){
  var array = null;
  switch(month){
    case  1:
    case  3:
    case  5:
    case  7:
    case  8:
    case  10:
    case  12:
      array = getLoopArray(1,31)
      break;
    case  4:
    case  6:
    case  9:
    case  11:
      array = getLoopArray(1,30)
      break;
    case 2:
      array = getLoopArray(1, 29)
      break;
    default:
     array = []
  }
  return array;
}

function datePicker(month){
  var dataArray = [[],[]];
  dataArray[0] = getMonthArray(1, 12);
  dataArray[1] = getMonthDay(month);
  //console.log("dataArray", dataArray)
  return dataArray
}

module.exports = {
  datePicker: datePicker,
  getMonthDay: getMonthDay
}


