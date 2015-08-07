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

    var fsAcademyRoom = new Firebase('https://smedo-fs.firebaseio.com/fsAcademy');
    var fsAcademy = $firebaseArray(fsAcademyRoom);

    var donaldTrumpRoom = new Firebase('https://smedo-fs.firebaseio.com/donaldTrump');
    var donaldTrump = $firebaseArray(donaldTrumpRoom);

    var testRoom = new Firebase('https://smedo-fs.firebaseio.com/test');
    var test = $firebaseArray(testRoom);

    var analytics = new Firebase('https://smedo-fs.firebaseio.com/analytics');
    var obj = $firebaseObject(analytics);

    //order of realtime tweets + LIMITTT
    // var query = donaldTrump.orderByChild('priority');
    $scope.realtime = donaldTrump;

    //archives firebase
    var arch = new Firebase('https://smedo-fs.firebaseio.com/archives');
    var tweetArch = $firebaseArray(arch);

    // dashboard.$bindTo($scope, "realtime"); //ng-model "data.text", {{data.text}}


    //STARTING THE ANALYTICS!!!
    obj.$loaded().then(function(dashboard){

      if (dashboard.timeInterval === undefined) {

          obj.timeInterval = {};
          obj.totalTweets = 0;
          obj.overallTweetFrequency = 0;
          obj.totalImpressions = 0;
          obj.users = {}; //non-unique
          obj.uniqueUsers = 0;
          obj.totalSentiments = 0;
          obj.aveSentiments = 0;
          obj.sentimentDonut = {green: 0, blue: 0, yellow: 0, purple: 0, red: 0};
          obj.hashtags = {};

          obj.$save()

      }

    });


    $scope.arr = [];
    var prevTweetId;
    //ALL DATA ANALYTICS + DISPLAYING TWEETS
    Socket.on('sentiment', function(data) {

      //start removing when hits 50;
      // donaldTrump.$loaded().then(function(tweets){
      //   if (tweets.length >= 50) {
      //     donaldTrump.$remove(tweets[0]);
      //   }
      // })

      //add tweet only if it's not duplicated
      if (prevTweetId !== data.id) {
        // console.log('idddd',data.id, prevTweetId);
        donaldTrump.$add(data).then(function(ref) {
          $scope.arr.push(false); // setting the showForm var for all tweets to false
        })

      $timeout(function() {
        $scope.$digest();
      },0);

      }

      prevTweetId = data.id;

      //DATA analytics!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //
      // var date = data.created_at;
      // var day = date.split(" ")[0];
      // var hour = parseInt(date.split(" ")[3].split(":")[0]);
      // var s = parseFloat(data.sentiment.score);
      //
      // var key;
      // if (hour >= 6 && hour < 9) key = day+'M1';
      // else if (hour >= 9 && hour < 12) key = day+'M2';
      // else if (hour >= 12 && hour < 15) key = day+'A1';
      // else if (hour >= 15 && hour < 18) key = day+'A2';
      // else if (hour >= 18 && hour < 21) key = day+'N1';
      // else if (hour >= 21 && hour <= 23) key = day+'N2';
      // else if (hour >= 0 && hour < 3) key = day+'L1';
      // else if (hour >= 3 && hour < 6) key = day+'L2';
      //
      //
      //
      //     // console.log('objects',obj.timeInterval);
      //     //create key = day+hour -> update value
      //     obj.timeInterval[key] = obj.timeInterval[key] || {};
      //     //incomingTweets
      //     obj.timeInterval[key].incomingTweets = obj.timeInterval[key].incomingTweets || 0;
      //     obj.timeInterval[key].incomingTweets++;
      //     //ave Tweet frequency per interval -> tooltip
      //     obj.timeInterval[key].frequency = obj.timeInterval[key].incomingTweets / 3;
      //     // impression
      //     obj.timeInterval[key].impressions = obj.timeInterval[key].impressions || 0;
      //     obj.timeInterval[key].impressions += data.user.followers_count;
      //     // sentimentScores
      //     obj.timeInterval[key].sentimentScores = obj.timeInterval[key].sentimentScores || [];
      //     obj.timeInterval[key].sentimentScores.push(s);
      //     // aveSentiment
      //     obj.timeInterval[key].totalSentiment = obj.timeInterval[key].totalSentiment || s;
      //     obj.timeInterval[key].totalSentiment += s;
      //     obj.timeInterval[key].aveSentiment =  obj.timeInterval[key].totalSentiment / obj.timeInterval[key].incomingTweets;
      //     // console.log('ssss', obj.timeInterval[key].aveSentiment, s)
      //
      //     //totalTweets
      //     obj.totalTweets++;
      //     // totalImpressions
      //     obj.totalImpressions += data.user.followers_count;
      //
      //     // aveSentiments
      //     obj.totalSentiments += s;
      //     obj.aveSentiments = obj.totalSentiments / obj.totalTweets;
      //
      //     // sentimentDonut
      //     // {green: 0, blue: 0, yellow: 0, purple: 0, red: 0}
      //     if (s > 0.5 && s <= 1) obj.sentimentDonut.green++
      //     else if (s > 0 && s <= 0.5) obj.sentimentDonut.blue++
      //     else if (s === 0) obj.sentimentDonut.yellow++
      //     else if (s > -0.5 && s < 0) obj.sentimentDonut.purple++
      //     else if (s <= -0.5) obj.sentimentDonut.red++
      //
      //     // uniqueUsers + non-unique users
      //     if (!obj.users[data.user.id_str]) obj.uniqueUsers++;
      //     obj.users[data.user.id_str] = obj.users[data.user.id_str] || {};
      //     obj.users[data.user.id_str].tweets = obj.users[data.user.id_str].tweets || 1;
      //     obj.users[data.user.id_str].tweets++;
      //     obj.users[data.user.id_str].totalSentiments = obj.users[data.user.id_str].totalSentiments || s;
      //     obj.users[data.user.id_str].totalSentiments += s;
      //     obj.users[data.user.id_str].aveSentiments = obj.users[data.user.id_str].totalSentiments / obj.users[data.user.id_str].tweets;
      //     obj.users[data.user.id_str].username = data.user.screen_name;
      //     obj.users[data.user.id_str].followers = data.user.followers_count;
      //
      //
      //     // hashTags
      //     data.text.split(" ").forEach(function(word){
      //       word = word.toLowerCase();
      //       if (word.indexOf("trump") === -1) {
      //           var initial = word.split("").shift();
      //           if (initial === "#") {
      //             var re = /([A-Za-z0-9])+/g
      //             word = word.match(re)[0];
      //             // console.log('trump hashtags',word, obj)
      //             obj.hashtags = obj.hashtags || {};
      //             obj.hashtags[word] = obj.hashtags[word] || 1;
      //             obj.hashtags[word]++;
      //
      //
      //           }
      //       }
      //     })
      //
      //     obj.$save();
      //
      //     //overallTweetFrequency
      //     obj.$loaded().then(function(d){
      //         for (var key in d.timeInterval) {
      //           obj.overallTweetFrequency = obj.timeInterval[key].frequency / Object.keys(obj.timeInterval).length;
      //           obj.$save();
      //         }
      //     });
      //
      // //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    })

    $scope.realtime.forEach(function(mention){
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

    //UPDATE THE DB HEREEEE
    $scope.checkToLoad = function(mention) {
      mention.loading = false;
      donaldTrump.forEach(function(tweet){ //HERE
        if (tweet.$id === mention.$id){
          tweet.loading = false;
          donaldTrump.$save(tweet) //HERE
        }
      })

      if(mention.reply.text.length) mention.loading = true;


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

});
