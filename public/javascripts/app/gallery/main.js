(function() {
  var module;

  module = angular.module('virgen.gallery', []);

  module.controller('VirgenGalleryCtrl', function($scope, $timeout) {
    var getNextImage, getPreviousImage, mockImages;
    $scope.images = [];
    $scope.coverflowImages = [];
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
        $scope.index = 0;
      }
      $scope.coverflowImages.shift();
      return $scope.coverflowImages.push(getNextImage());
    };
    getNextImage = function() {
      var i;
      i = $scope.index + 1;
      if (i >= $scope.images.length) {
        i = 0;
      }
      return $scope.images[i];
    };
    $scope.previous = function() {
      $scope.index--;
      if ($scope.index < 0) {
        $scope.index = $scope.images.length - 1;
      }
      $scope.coverflowImages.pop();
      return $scope.coverflowImages.unshift(getPreviousImage());
    };
    getPreviousImage = function() {
      var i;
      i = $scope.index - 1;
      if (i < 0) {
        i = $scope.images.length - 1;
      }
      return $scope.images[i];
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
      var createImage, i, image, _i, _results;
      createImage = function(i) {
        var image, text;
        text = "mock+" + i;
        return image = {
          id: i,
          thumbUrl: "/images/" + (i + 1) + ".jpg",
          url: "/images/" + (i + 1) + ".jpg"
        };
      };
      _results = [];
      for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
        image = createImage(i);
        $scope.images.push(image);
        if (i < 2) {
          $scope.coverflowImages.push(image);
        }
        if (i === num - 1) {
          _results.push($scope.coverflowImages.unshift(image));
        } else {
          _results.push(void 0);
        }
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
