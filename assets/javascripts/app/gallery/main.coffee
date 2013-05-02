module = angular.module 'virgen.gallery', []

# Image Gallery
module.controller 'VirgenGalleryCtrl', ($scope, $timeout) ->
  $scope.images = []
  $scope.index = 0
  $scope.playerQueue = null

  $scope.currentImage = ->
    $scope.images[$scope.index]

  $scope.isCurrent = ($index) ->
    $scope.index == $index

  $scope.show = ($index) ->
    $scope.index = $index

  $scope.next = ->
    $scope.index++
    $scope.index = 0 if $scope.index >= $scope.images.length

  $scope.previous = ->
    $scope.index--
    $scope.index = $scope.images.length - 1 if $scope.index < 0

  $scope.play = ->
    return if $scope.playerQueue?
    enqueue = ->
      $scope.playerQueue = $timeout ->
        $scope.next()
        enqueue()
      , 2000
    enqueue()

  $scope.stop = ->
    return unless $scope.playerQueue?
    $timeout.cancel $scope.playerQueue
    $scope.playerQueue = null

  $scope.isPlaying = ->
    $scope.playerQueue?

  mockImages = (num) ->
    i = 0

    addMockImage = ->
      $timeout ->
        text = "mock+#{i}"

        $scope.images.push
          thumbUrl: "http://placehold.it/120x80&text=#{text}"
          url: "http://placehold.it/800x600&text=#{text}"

        i++
        addMockImage() if i <= num - 1
      , 50

    addMockImage()

  mockImages(20)

module.config ($routeProvider) ->
  $routeProvider
    .when('/', {controller: 'VirgenGalleryCtrl', templateUrl: '/templates/gallery.tpl'})
