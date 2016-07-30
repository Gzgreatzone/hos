'use strict';
angular.module('chafangbao.filters')
.filter('max', function () {
  return function (input) {
    var out;
    if (input) {
      console.log(input);
      for (i = 0;i < input.length;i++) {
        if (input[i] > out || out === undefined || out === null) {
          out = input[i];
        }
      }
    }
    return out;
  };
});