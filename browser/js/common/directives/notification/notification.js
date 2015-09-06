app.directive('notification', function ($rootScope, $state) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/notification/notification.html',
        link: function(){
          // Socket.on('hitLimit', function(hit){
          //   $scope.hitLimit = true;
          // })
        }
    };

});
