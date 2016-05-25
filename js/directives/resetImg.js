'use strict';

angular.module('chafangbao.directives')
.directive(
  // Collection-repeat image recycling while loading
  // https://github.com/driftyco/ionic/issues/1742
  'resetImg', function ($document) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attributes) {
        var applyNewSrc = function (src) {
          var newImg = $element.clone(true);

          newImg.attr('src', src);
          $element.replaceWith(newImg);
          $element = newImg;
        };

        $attributes.$observe('src', applyNewSrc);
        $attributes.$observe('ngSrc', applyNewSrc);
      }
    };
  };
);

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
