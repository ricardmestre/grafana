define([
  'angular',
  'jquery',
  'jquery.qtip2',
],
function (angular, $) {
  "use strict";

  var module=angular.module('grafana.controllers');

  module.controller('qtipController',
    ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var defaultOptions = {
        position: {
          my: 'left top',
          at: 'center right'
        },
        style: {
          classes: 'qtip-bootstrap'
        },
        show: {
          delay: 100,
          when: 'mouseover',
          solo: true
        },
        hide: {
          when: 'mouseout'
        }
      };
      $scope.getQtipOptions = function (options) {
        return $.extend(true, defaultOptions, options ? options : {});
      };
      $scope.showTooltip = function() {
        if ($element.qtip) {
          $element.qtip('show');
        }
      };
      $scope.hideTooltip = function () {
        if ($element.qtip) {
          $element.qtip('hide');
        }
      };
      $scope.$on('destroy', function () {
        if ($element.qtip) {
          $element.qtip.destroy();
        }
      });
      $scope.attachQtip = function() {
        var css = $attrs["qtipCss"] ? $attrs["qtipCss"] : 'qtip-bootstrap';
        var thisOptions = {
          content: {
            text: $scope.qtipContent ? $scope.qtipContent.text : '',
            title: {
              text: $scope.qtipContent ? $scope.qtipContent.title : '',
            }
          },
          position: {
            target: $($element)
          },
          style: {
            classes: css
          },
          events: {
            show: function (event, api) {
              if($scope.qtipContent){
                var text = $scope.qtipContent.text;
                var title = $scope.qtipContent.title;
              }
              if ($scope.qtipCallback) {
                var newContent = $scope.qtipCallback({ id: $scope.qtipContext });
                if (newContent) {
                  text = newContent.text;
                  title = newContent.title;
                }
              }
              api.set('content.text', text);
              api.set('content.title', title);
            },
          }
        };
        var options = $scope.getQtipOptions(thisOptions);
        return $($element).qtip(options);
      };
    }]);
});