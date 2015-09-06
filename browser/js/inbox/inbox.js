app.config(function ($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'InboxCtrl'
    });
});

app.controller('InboxCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject, $modal) {

    TweetFactory.getTweets().then(function(tweets){
        $scope.oldTweets = tweets;
        $scope.updatedTweets = tweets;
        $scope.count = 0;
        $scope.skip = 0;
    })

    Socket.on('newTweet', function(data) {

      //add Tweet
      $scope.updatedTweets.unshift(data);
      $scope.count += 1; //update noti-bar
      $scope.skip += 1;

      // $timeout(function() {
      //   $scope.$digest();
      // },0);
    })

    //add event listener on scroll in browser in angular?
    window.addEventListener('scroll', $scope.checkWindowScroll);

    $scope.showNewTweets = function () {
      $scope.updatedTweets.forEach(function(tweet){
        tweet.active = true; //?????
      });
      $scope.oldTweets = $scope.updatedTweets;
      $scope.count = 0;
    };


    // $scope.realtime.forEach(function(mention){
    //   $scope.checkToLoad(mention);
    // })

    var ref = new Firebase('https://smedo-fs.firebaseio.com/');
    var response = $firebaseArray(ref);
    $scope.arr = [];

    $scope.reply = function (index, mention) {
        $scope.arr[index] = true; //set showForm to true

        $scope.checkToLoad(mention);

        // Socket.broadcast.emit('progress')
        // $scope.progress[index].push(true);

        // var el = document.querySelector('#incomingTweet');
        // angular.element(el).css({"background-color": "blue"});
        $scope.checkToLoad = function(mention) {
          if(mention.reply.text.length) mention.loading = true;
          tweet.loading = false;
          donaldTrump.$save(tweet) //HERE
        }

        if (tweet.$id === mention.$id){
          donaldTrump.forEach(function(tweet){ //HERE
            mention.loading = false;
          })
        }

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
