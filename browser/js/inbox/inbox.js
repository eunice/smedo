app.config(function ($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'InboxCtrl'
    });
});

app.controller('InboxCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject, $modal) {
    var ref = new Firebase('https://smedo-fs.firebaseio.com/response');
    var firebaseRes = $firebaseObject(ref);
    firebaseRes.$bindTo($scope, "firebaseRes");

    TweetFactory.getTweets().then(function(tweets){
        $scope.oldTweets = tweets;
        $scope.updatedTweets = tweets;
        $scope.count = 0;
        $scope.skip = 0;
        $scope.form = [];
    })

    Socket.on('newTweet', function(data) {

      $scope.updatedTweets.unshift(data);
      $scope.count += 1; //update noti-bar
      $scope.skip += 1;

      $timeout(function() {
        $scope.$digest();
      },0);
    })

    $scope.showNewTweets = function () {
      $scope.updatedTweets.forEach(function(tweet){
        tweet.active = true;
      });
      $scope.oldTweets = $scope.updatedTweets;
      $scope.count = 0;
    };

    $scope.showForm= function (index, tweet) {
        $scope.form[index] = true;
    }

    $scope.close = function(index, tweet) {
        $scope.form[index] = false;
    }

    $scope.post = function(tweet, index) {
      delete $scope.firebaseRes[tweet._id];
      TweetFactory.post("@"+tweet.twuser.screenName + " " + firebaseRes[tweet._id], tweet._id);
      $scope.form[index] = false;
    }

    $scope.viewProfile = function(user) {
        var modalInstance = $modal.open({
          templateUrl: 'js/inbox/profile.html',
          controller: 'viewProfileModalCtrl',
          resolve: {
            user: function() {
              return user;
            }
          }
        });
    }

});

app.controller('viewProfileModalCtrl', function ($scope, $modalInstance, user, $state) {

  $scope.user = user;
  $scope.close = function () {
    $modalInstance.close();
  }

});
