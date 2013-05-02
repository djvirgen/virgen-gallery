(function() {
  var module;

  module = angular.module('virgen.gallery', []);

  module.controller('VirgenGalleryCtrl', function($scope, $timeout) {
    var mockImages;
    $scope.images = [];
    $scope.index = 0;
    $scope.playerQueue = null;
    $scope.currentImage = function() {
      return $scope.images[$scope.index];
    };
    $scope.isCurrent = function($index) {
      return $scope.index === $index;
    };
    $scope.show = function($index) {
      return $scope.index = $index;
    };
    $scope.next = function() {
      $scope.index++;
      if ($scope.index >= $scope.images.length) {
        return $scope.index = 0;
      }
    };
    $scope.previous = function() {
      $scope.index--;
      if ($scope.index < 0) {
        return $scope.index = $scope.images.length - 1;
      }
    };
    $scope.play = function() {
      var enqueue;
      if ($scope.playerQueue != null) {
        return;
      }
      enqueue = function() {
        return $scope.playerQueue = $timeout(function() {
          $scope.next();
          return enqueue();
        }, 2000);
      };
      return enqueue();
    };
    $scope.stop = function() {
      if ($scope.playerQueue == null) {
        return;
      }
      $timeout.cancel($scope.playerQueue);
      return $scope.playerQueue = null;
    };
    $scope.isPlaying = function() {
      return $scope.playerQueue != null;
    };
    mockImages = function(num) {
      var addMockImage, i;
      i = 0;
      addMockImage = function() {
        return $timeout(function() {
          var text;
          text = "mock+" + i;
          $scope.images.push({
            thumbUrl: "http://placehold.it/120x80&text=" + text,
            url: "http://placehold.it/800x600&text=" + text
          });
          i++;
          if (i <= num - 1) {
            return addMockImage();
          }
        }, 50);
      };
      return addMockImage();
    };
    return mockImages(20);
  });

  module.config(function($routeProvider) {
    return $routeProvider.when('/', {
      controller: 'VirgenGalleryCtrl',
      templateUrl: '/templates/gallery.tpl'
    });
  });

}).call(this);
