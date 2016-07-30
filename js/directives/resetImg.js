'use strict';
//--------------
// name        : 
// type        : 
// dependences : 
// usage       : 
//             : 
// copyright   : 
//--------------
angular.module('chafangbao.directives')
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

//--------------
// name        : 
// type        : 
// dependences : 
// usage       : 
//             : 
// copyright   : 
//--------------
.myDirective(
  'expander', function(){
        return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: { title:'@expanderTitle' },
        template:'<div class="list card card_checkset">心率参考正常值<div>'，
        link: function(scope, element, attrs) {
            scope.showMe = false;
            scope.toggle = function toggle() {
            scope.showMe = !scope.showMe;
            }
        }
    };
   };

  );
.erDirective('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
