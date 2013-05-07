module = angular.module 'virgen.gallery', []

# Image Gallery
module.filter 'coverflow', ->
  (images, index) ->
    coverflow = []

    for i in [-1..1]
      j = index + i

      if j < 0
        j = images.length - 1
      else if j > images.length - 1
        j = 0

      coverflow.push images[j]

    return coverflow

module.controller 'VirgenGalleryCtrl', ($scope, $timeout) ->
  $scope.images = []
  $scope.index = 0
  $scope.playerQueue = null

  $scope.coverflowClasses = (image) ->
    index = $scope.images.indexOf(image)

    return if index == $scope.index
      'current'
    else if index == 0 and $scope.index == $scope.images.length - 1
      'right'
    else if index < $scope.index
      'left'
    else if index - $scope.index > 2
      'left'
    else
      'right'

  $scope.currentImage = ->
    $scope.images[$scope.index]

  $scope.isCurrent = ($index) ->
    $scope.index == $index

  $scope.show = ($index) ->
    total = $scope.images.length

    diff = $index - $scope.index
    diff += total if diff < 0

    func = if diff < total / 2
      $scope.next
    else
      $scope.previous

    go = ->
      return if $index == $scope.index
      $timeout ->
        func()
        go()
      , 40
    go()

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
    createImage = (i) ->
      text = "mock+#{i}"
      image =
        id: i
        thumbUrl: "/images/thumbs/#{i+1}.jpg"
        url: "/images/#{i+1}.jpg"

    for i in [0...num]
      $scope.images.push createImage i

  mockImages(15)

module.config ($routeProvider) ->
  $routeProvider
    .when('/', {controller: 'VirgenGalleryCtrl', templateUrl: '/templates/gallery.tpl'})
