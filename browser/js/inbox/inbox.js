app.config(function ($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'InboxCtrl'
    });
});

app.controller('InboxCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject, $modal) {

    var ref = new Firebase('https://smedo-fs.firebaseio.com/');
    var response = $firebaseArray(ref);
    $scope.arr = [];

    TweetFactory.getTweets().then(function(tweets){
        $scope.oldTweets = tweets;
      })

    // dashboard.$bindTo($scope, "realtime"); //ng-model "data.text", {{data.text}}

    Socket.on('sentiment', function(data) {

      $timeout(function() {
        $scope.$digest();
      },0);
    })

    // $scope.realtime.forEach(function(mention){
    //   $scope.checkToLoad(mention);
    // })


    $scope.reply = function (index, mention) {
        $scope.arr[index] = true; //set showForm to true

        $scope.checkToLoad(mention);

        // Socket.broadcast.emit('progress')
        // $scope.progress[index].push(true);

        // var el = document.querySelector('#incomingTweet');
        // angular.element(el).css({"background-color": "blue"});
        $scope.checkToLoad = function(mention) {
          tweet.loading = false;
          donaldTrump.$save(tweet) //HERE
        }
      })

      if(mention.reply.text.length) mention.loading = true;
    }

        if (tweet.$id === mention.$id){
      donaldTrump.forEach(function(tweet){ //HERE
      mention.loading = false;
    }

    $scope.close = function(index, mention) {
      $scope.arr[index] = false; //set showForm to false
      $scope.checkToLoad(mention);
      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "white"});
    }


    $scope.post = function(mention, index) {

      TweetFactory.post("@"+mention.user.screen_name + " " + mention.reply.text);
      $scope.arr[index] = false; //set showForm to false

      tweetArch.$add(mention).then(function(ref) {})
      console.log('tweetrt before',tweetRt.$keyAt(mention.$id))

      donaldTrump.forEach(function(tweet, index){
        // console.log('tweetRt tweet',tweet)
        if (tweet.$id === mention.$id) {
          tweetRt.$remove(tweet);
        }

      })

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
