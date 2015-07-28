app.config(function ($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'InboxCtrl'
    });
});

app.controller('InboxCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject, $modal) {
    //inbox firebase
    var ref = new Firebase('https://smedo-fs.firebaseio.com/');
    var tweetRt = $firebaseArray(ref);

    //order of realtime tweets
    var query = ref.orderByChild('priority');
    $scope.realtime = $firebaseArray(query);

    //archives firebase
    var arch = new Firebase('https://smedo-fs.firebaseio.com/archives');
    var tweetArch = $firebaseArray(arch);

    $scope.arr = [];
    // $scope.progress = [];
    // $scope.progress-circular = false;

    console.log('realtimee',tweetRt)
    tweetRt.$loaded(function(tweets){
      console.log('tweets',tweets)
      console.log('tweets',tweets.length)
    })

    // realtimeTweets.$bindTo($scope, "realtime"); //ng-model "data.text", {{data.text}}

    Socket.on('sentiment', function(data) {
      console.log('priorrr',data.priority);
      // data.priority = priorityScore(data.time, data.sentiment.score, data.user.followers_count);
      // console.log(data.priority);
      // console.log('sentiment',data)
      tweetRt.$add(data).then(function(ref) {
        $scope.arr.push(false); // setting the showForm var for all tweets to false
        // $scope.progress.push([]);
      })


      $timeout(function() {
        $scope.$digest();
      },0);

    })

    $scope.realtime.forEach(function(mention){
      console.log('loading',mention)
      $scope.checkToLoad(mention);
    })


    $scope.reply = function (index, mention) {
      $scope.arr[index] = true; //set showForm to true

      $scope.checkToLoad(mention);

      // Socket.broadcast.emit('progress')
      // $scope.progress[index].push(true);

      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "blue"});

    }

    $scope.close = function(index, mention) {
      $scope.arr[index] = false; //set showForm to false
      $scope.checkToLoad(mention);

      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "white"});
    }

    $scope.checkToLoad = function(mention) {
      mention.loading = false;
      if(mention.reply.text.length) mention.loading = true;

    }

    $scope.post = function(mention, index) {

      TweetFactory.post("@"+mention.user.screen_name + " " + mention.reply.text);
      $scope.arr[index] = false; //set showForm to false

      tweetArch.$add(mention).then(function(ref) {})
      console.log('tweetrt before',tweetRt.$keyAt(mention.$id))

      tweetRt.forEach(function(tweet, index){
        // console.log('tweetRt tweet',tweet)
        if (tweet.$id === mention.$id) {
          tweetRt.$remove(tweet);
        }

      })

    }

    $scope.viewProfile = function(mention) {
        var modalInstance = $modal.open({
          templateUrl: 'js/inbox/profile.html',
          controller: 'viewProfileModalCtrl',
          resolve: {
            mention: function() {
              return mention;
            }
          }
        });
    }

});

app.controller('viewProfileModalCtrl', function ($scope, $modalInstance, mention, $state) {

  $scope.mention = mention;

  $scope.close = function () {
    $modalInstance.close();
  }

})
