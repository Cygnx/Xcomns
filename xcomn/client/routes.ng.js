app.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('rooms', {
      url: '/rooms',
      templateUrl: 'client/rooms/views/rooms-list.ng.html',
      controller: 'roomsListCtrl'
    })

    .state('roomDetails', {
      url: '/room/:roomId',
      templateUrl: 'client/rooms/views/room.ng.html',
      controller: 'roomCtrl'
    });


  $urlRouterProvider.otherwise("/rooms");
});
