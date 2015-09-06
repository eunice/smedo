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

    TweetFactory.getTweets().then(function(tweets){
        $scope.oldTweets = tweets;
        $scope.updatedTweets = tweets;
        $scope.count = 0;
        $scope.skip = 0;
        $scope.form = [];
    })

    //every refresh, firebase response loading
    firebaseRes.$loaded().then(function(){

        Object.keys(firebaseRes).forEach(function(res){
          console.log('response la', res)
          for (var i=0; i < $scope.oldTweets.length; i++){
            if ($scope.oldTweets[i]._id === res.twid){
                $scope.oldTweets[i].loading = true;
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

    $scope.checkToLoad = function() {

    }

    //during typing
    //get el by twid -> set scope.tweet loading = true
    //save tweet res in firebase-> tw_id
    //bind scopeobj(twid)'s input ng-model to firebase(twid)

    $scope.reply = function(text,id){
      firebaseRes.$loaded().then(function(){
        firebaseRes[id] = text;
        firebaseRes.$save();
      })
    }

    // if(tweet.response.responseText) tweet.loading = true;
    // tweet.loading = false;
    // response.$save(tweet)
    //
    // if (tweet.$id === mention.$id){
    //   donaldTrump.forEach(function(tweet){ //HERE
    //     mention.loading = false;
    //   })
    // }

    $scope.close = function(index, mention) {

      //save to db!!!!

      $scope.form[index] = false; //set showForm to false
      // $scope.checkToLoad(mention);
      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "white"});
    }

    $scope.post = function(mention, index) {
      //after tweeting back
      //delete firebaseObj.

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
