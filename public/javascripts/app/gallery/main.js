(function() {
  var module;

  module = angular.module('virgen.gallery', []);

  module.filter('coverflow', function() {
    return function(images, index) {
      if (index === 0) {
        return images.slice(-1).concat(images.slice(0, 2));
      } else if (index === images.length - 1) {
        return images.slice(-2).concat([images[0]]);
      } else {
        return images.slice(index - 1, index + 2);
      }
    };
  });

  module.controller('VirgenGalleryCtrl', function($scope, $timeout) {
    var mockImages;
    $scope.images = [];
    $scope.index = 0;
    $scope.playerQueue = null;
    $scope.coverflowClasses = function(image) {
      var index;
      index = $scope.images.indexOf(image);
      if (index === $scope.index) {
        return 'current';
      } else if (index === 0 && $scope.index === $scope.images.length - 1) {
        return 'right';
      } else if (index < $scope.index) {
        return 'left';
      } else if (index - $scope.index > 2) {
        return 'left';
      } else {
        return 'right';
      }
    };
    $scope.currentImage = function() {
      return $scope.images[$scope.index];
    };
    $scope.isCurrent = function($index) {
      return $scope.index === $index;
    };
    $scope.show = function($index) {
      var diff, func, go, total;
      total = $scope.images.length;
      diff = $index - $scope.index;
      if (diff < 0) {
        diff += total;
      }
      func = diff < total / 2 ? $scope.next : $scope.previous;
      go = function() {
        if ($index === $scope.index) {
          return;
        }
        return $timeout(function() {
          func();
          return go();
        }, 40);
      };
      return go();
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
      var createImage, i, _i, _results;
      createImage = function(i) {
        var image, text;
        text = "mock+" + i;
        return image = {
          id: i,
          thumbUrl: "/images/thumbs/" + (i + 1) + ".jpg",
          url: "/images/" + (i + 1) + ".jpg"
        };
      };
      _results = [];
      for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
        _results.push($scope.images.push(createImage(i)));
      }
      return _results;
    };
    return mockImages(15);
  });

  module.config(function($routeProvider) {
    return $routeProvider.when('/', {
      controller: 'VirgenGalleryCtrl',
      templateUrl: '/templates/gallery.tpl'
    });
  });

}).call(this);
