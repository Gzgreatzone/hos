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