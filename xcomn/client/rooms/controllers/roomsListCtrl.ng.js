app.controller('roomsListCtrl', function($scope, $meteor, $rootScope, $state) {
  $scope.rooms = $meteor.collection(Rooms);
  $scope.newRoom = {owner : ""};
  $scope.createRoom = function() {
    var createTime = new Date().getTime();
    $scope.newRoom.owner = $rootScope.currentUser._id || $rootScope.currentUser.id || "";
    $scope.newRoom.users = [];
    $scope.newRoom.createTime = createTime;
    $scope.rooms.save($scope.newRoom);
    $scope.newRoom = '';

    var newRoomID = $meteor.object(Rooms, {createTime:createTime}, false)._id;
    $state.go('roomDetails',{roomId:newRoomID});
  };
});
