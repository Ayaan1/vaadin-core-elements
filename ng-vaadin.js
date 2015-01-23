(function(angular) {'use strict';

  var vModule = angular.module('vaadin-components', []);

  function attrFnc() {
    return {
      restrict : 'E',
      link : function(scope, element, attrs) {

        var attrMap = {};
        for ( var prop in attrs.$attr) {
          var _attr = attrs.$attr[prop];
          var _match = element.attr(_attr).match(/\{\{\s*([\.\w]+)\s*\}\}/);
          if (_match) {
            attrMap[_attr] = _match[1];
          }
        }

        new MutationObserver(function() {
          scope.$apply();
        }).observe(element[0], {
          attributes : true
        });

        for (var attr in attrMap) {
          scope.$watch(function() {return element.attr(attr)}, function(value, oldValue) {
            var parent = scope;
            var tokens = attrMap[attr].split(/\./);
            for (var i = 0; i < tokens.length - 1; i++) {
              if (typeof (parent[tokens[i]]) == 'undefined') {
                parent[tokens[i]] = {};
              }
              parent = parent[tokens[i]];
            }
            parent[tokens[tokens.length - 1]] = value;
          });
        }
      }
    };
  }

  var vaadinComponents = ['vSlider', 'vProgress', 'vGrid'];

  angular.forEach(vaadinComponents, function(tag) {
    vModule.directive(tag, attrFnc);
  });

})(angular);