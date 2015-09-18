app.controller('roomCtrl', function($scope, $stateParams, $meteor, $rootScope) {
  $scope.roomId = $stateParams.roomId;
  $scope.room = $meteor.object(Rooms, $scope.roomId, true);
  $scope.myVideoSrc = "";
  $scope.theirVideoSrc = "";
  $scope.room.users.push({
    name: "_",
    id: "_"
  });
  $scope.userID = $scope.room.users.length - 1;

  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  navigator.getUserMedia({
      audio: false,
      video: true
    }, function(stream) {
      $scope.$apply(function() {
        $scope.myVideoSrc = URL.createObjectURL(stream);
        console.log($scope.myVideoSrc);
        window.localStream = stream;
      });
    },
    function(error) {
      console.log(error);
    }
  );


  $scope.peer = new Peer({
    key: 'pteqwfu7ypiafw29',
    debug: 3,
    config: {
      'iceServers': [{
        url: 'stun:stun.l.google.com:19302'
      }, {
        url: 'stun:stun1.l.google.com:19302'
      }, ]
    }
  });

  $scope.peer.on('open', function() {
    $scope.$apply(function() {
      //$scope.peer.id = $scope.peer.id;
      $scope.room.users[$scope.userID].name = "guest" + $scope.userID;
      $scope.room.users[$scope.userID].id = $scope.peer.id;

    });
  });

  // Handle event: remote peer receives a call
  $scope.peer.on('call', function(incomingCall) {
    window.currentCall = incomingCall;
    incomingCall.answer(window.localStream);
    incomingCall.on('stream', function(remoteStream) {
      window.remoteStream = remoteStream;
      $scope.$apply(function() {
        $scope.theirVideoSrc = URL.createObjectURL(remoteStream);
      });
    });
  });

  $scope.call = function(friendID) {
    var outgoingCall = $scope.peer.call(friendID, window.localStream);
    window.currentCall = outgoingCall;
    outgoingCall.on('stream', function(remoteStream) {
      window.remoteStream = remoteStream;
      $scope.$apply(function() {
        $scope.theirVideoSrc = URL.createObjectURL(remoteStream);
      });
    });
  };

  $scope.endCall = function() {
    window.currentCall.close();
  };

  $scope.$on("$destroy", function() {
    //$scope.$apply(function() {
    //$scope.room.users.splice($scope.userID, 1);
    //  });
    try {
      if ($rootScope.currentUser._id == $scope.room.owner) {
        $scope.rooms = $meteor.collection(Rooms);
        $scope.rooms.splice($scope.rooms.indexOf($scope.room), 1);
      }
    }catch(e){}

    $scope.room.users[$scope.userID].name = null;
  });
});
