
'use strict';
angular.module('chafangbao.filters')
.filter('min', function () {                    //最小值过滤器
  return function (input) {
    //console.log(input);
    var out;
    if (input) {
      for (var i in input) {
        if (input[i] < out || out === undefined || out === null) {
          out = input[i];
        }
      }
    }
    return out;
  };
});


angular.module('chafangbao.filters')
.filter('avg', function () {                  //平均值过滤器
  return function (input) {
    var out;
    var sum = 0;
    if (input) {
      for (var i = 0; i < input.length; i++) {
        sum = input[i] + sum;
      }
      out = sum / input.length;
    }
    return out;
  };
});

angular.module('chafangbao.filters')
.filter('max', function () {                //最大值
  return function (input) {
    var out;
    if (input) {
      for (var i in input) {
        if (input[i] > out || out === undefined || out === null) {
          out = input[i];
        }
      }
    }
    return out;
  };
});

angular.module('chafangbao.filters')
.filter('maxForSpo2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['spo2']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForSpo2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['spo2']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('avgForSpo2', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          list.push(input[i]['spo2']);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});
angular.module('chafangbao.filters')
.filter('maxForHr',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['hr']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForHr',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['hr']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});


angular.module('chafangbao.filters')
.filter('avgForHr', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          list.push(input[i]['hr']);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});

//
angular.module('chafangbao.filters')
.filter('maxForBP1',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['收缩压']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForBP1',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['收缩压']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});


angular.module('chafangbao.filters')
.filter('avgForBP1', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          list.push(input[i]['收缩压']);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});

//bp2
angular.module('chafangbao.filters')
.filter('maxForBP2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['舒张压']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForBP2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          list.push(input[i]['舒张压']);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});


angular.module('chafangbao.filters')
.filter('avgForBP2', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          list.push(input[i]['舒张压']);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});




//肺功能
angular.module('chafangbao.filters')
.filter('maxForLung1',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev1']) {
            if (input[i]['fev1'][j] > outer || outer === undefined || outer === null) {
                outer  = input[i]['fev1'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForLung1',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev1']) {
            if (input[i]['fev1'][j] < outer || outer === undefined || outer === null) {
                outer  = input[i]['fev1'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});


angular.module('chafangbao.filters')
.filter('avgForLung1', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev1']) {
            if (input[i]['fev1'][j] > outer || outer === undefined || outer === null) {
                outer  = input[i]['fev1'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});

//fev6
angular.module('chafangbao.filters')
.filter('maxForLung2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev6']) {
            if (input[i]['fev6'][j] > outer || outer === undefined || outer === null) {
                outer  = input[i]['fev6'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] > out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});
angular.module('chafangbao.filters')
.filter('minForLung2',function (){
  return function (input) {
    var out;
    var list = [];
    if(input){
      for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev6']) {
            if (input[i]['fev6'][j] < outer || outer === undefined || outer === null) {
                outer  = input[i]['fev6'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < input.length;i++) {
        if (list[i] < out || out === undefined || out === null) {
          out = list[i];
        }
      }
    }
    return out;
  }

});


angular.module('chafangbao.filters')
.filter('avgForLung2', function () {
  return function (input) {
    var out;
    var list = [];
    var sum = 0;
    for(var i = 0; i < input.length; i++){
          var outer;
          for (var j in input[i]['fev6']) {
            if (input[i]['fev6'][j] > outer || outer === undefined || outer === null) {
                outer  = input[i]['fev6'][j];
            }
          }
          list.push(outer);
      }
      for (i = 0;i < list.length;i++) {
        sum = list[i] + sum;
      }
      out = sum / list.length;
    return out;
  };
});

'use strict';
angular.module('chafangbao.filters')
.filter('maxforco2', function () {
  return function (input) {
    var out;
    if (input) {
      //console.log(input);
      for (i = 1;i < input.length;i++) {
        if (input[i] > out || out === undefined || out === null) {
          out = input[i];
        }
      }
    }
    return out;
  };
});


//这个是状态过滤器
angular.module('chafangbao.filters')
.filter('stateFilter', function () {
  return function (input) {
    var out;
    if (input =='true') {
      out = '住院中';
    }else if (input == 'false') {
      out = '已出院';
    }else if (input == 'outpatient') {
      out = '门诊';
    }
    return out;
  };
});



////这个是百分比过滤器
angular.module('chafangbao.filters')
.filter('percentage', function (){
    return function (input) {
      var out;
      input = input * 100;
      out = input + "%";
      return out;
    }
});