(function() {
  var app;

  app = angular.module('virgen', ['virgen.gallery']);

  app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    return $routeProvider.otherwise({
      redirectTo: '/'
    });
  });

}).call(this);
