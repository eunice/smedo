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
    $scope.firebaseRes = firebaseRes;

    TweetFactory.getTweets().then(function(tweets){
        $scope.oldTweets = tweets;
        $scope.updatedTweets = tweets;
        $scope.count = 0;
        $scope.skip = 0;
        $scope.form = [];
    })

    //every refresh, firebase response loading
    firebaseRes.$loaded().then(function(){
        Object.keys(firebaseRes).forEach(function(id){

          for (var i=0; i < $scope.oldTweets.length; i++){
            if ($scope.oldTweets[i]._id === id){
                if (firebaseRes[id]) $scope.oldTweets[i].loading = true;
                $scope.oldTweets[i].response.responseText = firebaseRes[id];
            }
          }
        });
    });

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
        $scope.form[index] = false; //set showForm to false
    }

    $scope.reply = function(text,tweet){
      //save the text
      firebaseRes.$loaded().then(function(){
        firebaseRes[tweet._id] = text;
        firebaseRes.$save();
      })
    }

      // $scope.checkToLoad(mention);
      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "white"});

    $scope.post = function(mention, index) {
      //after tweeting back
      //delete firebaseObj.

      TweetFactory.post("@"+mention.user.screen_name + " " + mention.reply.text);
      $scope.arr[index] = false; //set showForm to false

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
