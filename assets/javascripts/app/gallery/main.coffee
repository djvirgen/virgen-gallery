module = angular.module 'virgen.gallery', []

# Image Gallery
module.controller 'VirgenGalleryCtrl', ($scope, $timeout) ->
  $scope.images = []
  $scope.coverflowImages = []
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
    $scope.coverflowImages.shift()
    $scope.coverflowImages.push(getNextImage())

  getNextImage = ->
    i = $scope.index + 1
    i = 0 if i >= $scope.images.length
    $scope.images[i]

  $scope.previous = ->
    $scope.index--
    $scope.index = $scope.images.length - 1 if $scope.index < 0
    $scope.coverflowImages.pop()
    $scope.coverflowImages.unshift(getPreviousImage())

  getPreviousImage = ->
    i = $scope.index - 1
    i = $scope.images.length - 1 if i < 0
    $scope.images[i]

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
        thumbUrl: "/images/#{i+1}.jpg"
        url: "/images/#{i+1}.jpg"

    for i in [0...num]
      image = createImage i
      $scope.images.push image
      $scope.coverflowImages.push image if i < 2
      $scope.coverflowImages.unshift image if i == num - 1

  mockImages(15)

module.config ($routeProvider) ->
  $routeProvider
    .when('/', {controller: 'VirgenGalleryCtrl', templateUrl: '/templates/gallery.tpl'})
