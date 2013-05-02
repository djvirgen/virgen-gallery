# Main app
app = angular.module 'virgen', [
  'virgen.gallery'
]

app.config ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.otherwise({redirectTo: '/'})
