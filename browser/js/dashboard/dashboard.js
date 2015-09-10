app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashCtrl'
    });
});

app.controller('DashCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject) {

  //analytics firebase
  var analytics = new Firebase('https://smedo-fs.firebaseio.com/analytics');
  var dashboard = $firebaseObject(analytics);
  var donaldTrumpRoom = new Firebase('https://smedo-fs.firebaseio.com/donaldTrump');
  var donaldTrump = $firebaseArray(donaldTrumpRoom)
  var testRoom = new Firebase('https://smedo-fs.firebaseio.com/test');
  var test = $firebaseArray(testRoom);
  var testAnalytics = new Firebase('https://smedo-fs.firebaseio.com/testanalytics');
  var obj = $firebaseObject(testAnalytics);

    obj.$loaded().then(function(data){
        console.log('heyy', data)
        //STATIC numbers
        $scope.totalImpressions = data.totalImpressions;
        $scope.totalTweets = data.totalTweets;
        $scope.uniqueUsers = data.uniqueUsers;
        $scope.overallTweetFrequency = data.overallTweetFrequency;
        $scope.allHashtags = Object.keys(data.hashtags).length;
        $scope.aveSentiments = data.aveSentiments;

        //IMPRESSION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var impressionData = {
          labels: Object.keys(data.timeInterval),
          series: [
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].impressions})
          ]
        };
        var impressionOptions = {height: 200, weight: 200, low: 0, showArea: true};
        new Chartist.Line('#impression-chart', impressionData, impressionOptions);

        //INCOMINGTWEETS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var incomingTweetData = {
          labels: Object.keys(data.timeInterval),
          series: [
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].incomingTweets}),
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].frequency})
          ]
        };
        var incomingTweetOptions = {height: 200, weight: 200, low: 0};
        new Chartist.Line('#incomingTweet-chart', incomingTweetData, incomingTweetOptions);

        //SENTIMENT PLOTS (Experiment1) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // var sentimentData = {
        //   labels: Object.keys(data.timeInterval), //timeInterval   [1,2,3,4]
        //   series: obj.sentimentScores //[[1,2,undefined,3],[undefined,1,2,5]]
        // }
        // console.log('hi data1',data)
        //
        // var sentOptions = {
        //   showLine: false,
        //   height: 400,
        //   axisX: {
        //     labelInterpolationFnc: function(value, index) {
        //       return index % 1 === 0 ? value : null;
        //     }
        //   }
        // };
        //
        // // var responsiveOptions = [
        // //   ['screen and (min-width: 640px)', {
        // //     axisX: {
        // //       labelInterpolationFnc: function(value, index) {
        // //         return index % 4 === 0 ? 'W' + value : null;
        // //       }
        // //     }
        // //   }]
        // // ];
        // new Chartist.Line('#sentiments-plot1', sentimentData, sentOptions); //, responsiveOptions

        //SENTIMENT PLOTS (Experiment2) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var normalizedSentiments = [];
        var length = 0;
        for (var key in obj.timeInterval) {
          normalizedSentiments.push(obj.timeInterval[key].sentimentScores);
          if (obj.timeInterval[key].sentimentScores.length > length) {
            length = obj.timeInterval[key].sentimentScores.length;
          }
        }
        var labelArr = [];
        for (var i=0; i < length; i++) {
          labelArr.push([i]);
        }

        var sentmentdata2 = {
          labels: labelArr, //timeInterval   [1,2,3,4]
          series: normalizedSentiments //[[1,2,undefined,3],[undefined,1,2,5]]
        }
        console.log('hi data2',data)

        var options2 = {
          showLine: false,
          // width: 300,
          height: 250,
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 1 === 0 ? value : null;
            }
          }
        };

        // var responsiveOptions = [
        //   ['screen and (min-width: 640px)', {
        //     axisX: {
        //       labelInterpolationFnc: function(value, index) {
        //         return index % 4 === 0 ? 'W' + value : null;
        //       }
        //     }
        //   }]
        // ];

        new Chartist.Line('#sentiments-plot2', sentmentdata2, options2); //, responsiveOptions

        //DONUT GRAPH (SENTIMENTS)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        var sentimentDonutLabel = Object.keys(obj.sentimentDonut);

        $scope.sentimentDonutSeries = [];
        console.log('lllllll',$scope.sentimentDonutSeries)
        for (var i=0; i< sentimentDonutLabel.length; i++){
          var k = sentimentDonutLabel[i]
          $scope.sentimentDonutSeries.push(obj.sentimentDonut[k]);
        }

        // $scope.positive = Math.round

        var dataD = {
          // labels: sentimentDonutLabel,
          series: $scope.sentimentDonutSeries
        };

        var sum = function(a, b) { return a + b };

        console.log('donutt', dataD, sum);

        var optionsD = {
          // {
            height: 400,
            width: 400,
            labelInterpolationFnc: function(value) {
              // console.log('label', value)
              return Math.round(value / dataD.series.reduce(sum) * 100) + '%';
            }
          // labelInterpolationFnc: function(value) {
          //   return value[0]
          // }
        };

        var responsiveOptionsD = [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode',
            labelInterpolationFnc: function(value) {
              // console.log('labelresponsive', value)
              return value;
            }
          }],
          ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
          }]
        ];

        new Chartist.Pie('#sentiment-donut', dataD, optionsD, responsiveOptionsD);

        // new Chartist.Pie('.ct-chart', data, options, responsiveOptions);

        // top Tweets!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // array of obj =
        // [{rank: x, img: y,
        // username: a, follower: b, tweets: c, sentiment: d}]

        //generate topUsers
        (function generateTopUsers (){

            var topUsers = []; //only 10, sorted by most tweets;
            for (var id in obj.users) {
              var user = obj.users[id];

              if (topUsers.length < 10) topUsers.push(user);

              else {
                  //hit top 10?
                  if (topUsers[topUsers.length-1].tweets <= user.tweets) {
                      topUsers.push(user);
                  }

                  //sort by tweet counts
                  topUsers.sort(function(a,b){
                    if (a.tweets > b.tweets) return -1;
                    if (a.tweets < b.tweets) return 1;
                    return 0;
                  })

                  //sort by followers
                  topUsers.sort(function(a,b){
                    if (a.followers > b.followers) return -1;
                    if (a.followers < b.followers) return 1;
                    return 0;
                  })

                  // pop
                  topUsers.pop();
              }

            }

            $scope.topUsers = topUsers;
        })();

        // top Hashtags!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // [{rank: x, hashtag: y, count: z, sentiment: a}]
        (function generateTopHashtags (){

            var topHashtags = []; //only 10, sorted by most tweets;
            for (var word in obj.hashtags) {
              var hashtag = obj.hashtags[word];

              //attach text to obj
              hashtag.text = word;

              if (topHashtags.length < 10) topHashtags.push(hashtag);

              else {
                  //hit top 10?
                  if (topHashtags[topHashtags.length-1].count <= hashtag.count) {
                      topHashtags.push(hashtag);
                  }

                  //sort by tweet counts
                  topHashtags.sort(function(a,b){
                    if (a.count > b.count) return -1;
                    if (a.count < b.count) return 1;
                    return 0;
                  })

                  // //sort by followers
                  // topHashtags.sort(function(a,b){
                  //   if (a.followers > b.followers) return -1;
                  //   if (a.followers < b.followers) return 1;
                  //   return 0;
                  // })

                  //pop
                  topHashtags.pop();
              }

            }
            console.log('hashhash', topHashtags)
            $scope.topHashtags = topHashtags;

            var hashtagLabel = [];
            var hashtagSeries = [];
            for (var i=0; i< topHashtags.length; i++) {
              hashtagLabel.push(topHashtags[i].text)
              hashtagSeries.push(topHashtags[i].reach)
            }

            new Chartist.Bar('#tophashtag-reach-graph', {
            labels: hashtagLabel,
            series: [hashtagSeries]
            }, {
              width: 700,
              height: 400,
              seriesBarDistance: 20,
              reverseData: true,
              horizontalBars: true,
              axisY: {
                offset: 50
              }
          });

        })();

        //WORD CLOUDD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        $scope.hashtags = obj.hashtags;


    })//....dataVisblock(objload)

  // })//...then block


});
