app.config(function ($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'InboxCtrl'
    });
});

app.controller('InboxCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject) {
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

    // realtimeTweets.$bindTo($scope, "realtime"); //ng-model "data.text", {{data.text}}

    Socket.on('sentiment', function(data) {
      console.log('priorrr',data.priority);
      // data.priority = priorityScore(data.time, data.sentiment.score, data.user.followers_count);
      // console.log(data.priority);
      // console.log('sentiment',data)
      tweetRt.$add(data).then(function(ref) {
        $scope.arr.push(false); // setting the showForm var for all tweets to false
      })


      $timeout(function() {
        $scope.$digest();
      },0);

    })


    $scope.reply = function (index) {
      $scope.arr[index] = true; //set showForm to true

      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "blue"});
    }

    $scope.close = function(index) {
      $scope.arr[index] = false; //set showForm to false

      // var el = document.querySelector('#incomingTweet');
      // angular.element(el).css({"background-color": "white"});
    }

    $scope.post = function(mention, index) {

      TweetFactory.post("@"+mention.user.screen_name + " " + mention.reply.text);
      $scope.arr[index] = false; //set showForm to false


      tweetArch.$add(tweetRt[index]).then(function(ref) {})   //put to archive

      tweetRt.$remove(tweetRt[index]).then(function(ref){}); //remove tweet from firebase

    }

    //color generator


    // //Priority score generator------------------------------------------
    // function priorityScore (time, sentiScore, followers) {
    //
    //   var w = {
    //     timePast: 0.00000000000555,
    //     tweetSentiment: 3,
    //     followers: 2
    //   }
    //
    //   if(sentiScore < 0) sentiScore = -sentiScore;
    //
    //   var score =
    //   + w.tweetSentiment * sentiScore
    //   + w.followers * followers
    //   - w.timePast * time;
    //
    //   return -score;
    // }
    // //--------------------------------------------------------------


});
