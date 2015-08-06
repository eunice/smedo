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
  var donaldTrump = $firebaseArray(donaldTrumpRoom);

  var testRoom = new Firebase('https://smedo-fs.firebaseio.com/test');
  var test = $firebaseArray(testRoom);

  var testAnalytics = new Firebase('https://smedo-fs.firebaseio.com/testanalytics');
  var obj = $firebaseObject(testAnalytics);

//loading the object
  obj.$loaded().then(function(data){

    if (data.timeInterval === undefined){

      //analytics firebase
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
        obj.$save();
    }


  })

//all the logic for TEST ANALYTICS (COMMENTED)
  test.$loaded().then(function(tweets){

      tweets.forEach(function(data){
        var date = data.created_at;
        var day_str = date.split(" ")[0];
        var hour_str = date.split(" ")[3].split(":")[0];
        var hour = parseInt(hour_str);
        var min_str = date.split(" ")[3].split(":")[1];
        var min = parseInt(min_str);
        var s = parseFloat(data.sentiment.score);

        var key;
        // M,A,N
        // if (hour >= 6 && hour < 9) key = day+'M1';
        // else if (hour >= 9 && hour < 12) key = day+'M2';
        // else if (hour >= 12 && hour < 15) key = day+'A1';
        // else if (hour >= 15 && hour < 18) key = day+'A2';
        // else if (hour >= 18 && hour < 21) key = day+'N1';
        // else if (hour >= 21 && hour <= 23) key = day+'N2';
        // else if (hour >= 0 && hour < 3) key = day+'L1';
        // else if (hour >= 3 && hour < 6) key = day+'L2';

        // every 5 min (Tue10:00, Tue10:05)
        if (min < 5) key = day_str+hour_str+":00";
        else if (min < 10) key = day_str+hour_str+":05";
        else if (min < 15) key = day_str+hour_str+":10";
        else if (min < 20) key = day_str+hour_str+":15";
        else if (min < 25) key = day_str+hour_str+":20";
        else if (min < 30) key = day_str+hour_str+":25";
        else if (min < 35) key = day_str+hour_str+":30";
        else if (min < 40) key = day_str+hour_str+":35";
        else if (min < 45) key = day_str+hour_str+":40";
        else if (min < 50) key = day_str+hour_str+":45";
        else if (min < 55) key = day_str+hour_str+":50";
        else if (min <= 59) key = day_str+hour_str+":55";

        //create key = day+hour -> update value

        obj.$loaded().then(function(obj){

              obj.timeInterval[key] = obj.timeInterval[key] || {};
              //incomingTweets
              obj.timeInterval[key].incomingTweets = obj.timeInterval[key].incomingTweets || 0;
              obj.timeInterval[key].incomingTweets++;
              //ave Tweet frequency per interval -> tooltip
              obj.timeInterval[key].frequency = obj.timeInterval[key].incomingTweets / 3;
              // impression
              obj.timeInterval[key].impressions = obj.timeInterval[key].impressions || 0;
              obj.timeInterval[key].impressions += data.user.followers_count;
              //totalTweets
              obj.totalTweets++;
              // totalImpressions
              obj.totalImpressions += data.user.followers_count;
              //sentimentScores(Experiment 2)
              obj.timeInterval[key].sentimentScores = obj.timeInterval[key].sentimentScores || [];
              obj.timeInterval[key].sentimentScores.push(s);

              //NEED FURTHER TESTING!!!
              // sentimentScores(Experiment 1)
              // obj.sentimentScores = obj.sentimentScores || [[]];
              // var arrOftimeInterval = Object.keys(obj.timeInterval);
              // var i = arrOftimeInterval.indexOf(key);
              // console.log('sent scores',obj.sentimentScores, i, typeof key, arrOftimeInterval)

              //loop through each nested arrays -> check if array[i] already has a value -> yes: push[], no: put
              // obj.sentimentScores.forEach(function(innerArr,j){
              //     // console.log('foreach', innerArr);
              //     var last = obj.sentimentScores.length-1;
              //     if (!innerArr[i]) {
              //       innerArr[i]=s;
              //       return
              //     }
              //
              //       if (j === last) {
              //         obj.sentimentScores.push([]);
              //         obj.sentimentScores[last][i] = s;
              //         return
              //       };
              //
              // })

              // sentimentDonut
              // {green: 0, blue: 0, yellow: 0, purple: 0, red: 0}
              if (s > 0.5 && s <= 1){
                obj.sentimentDonut.green++
              } else if (s > 0 && s <= 0.5) {
                obj.sentimentDonut.blue++
              } else if (s === 0) {
                obj.sentimentDonut.yellow++
              } else if (s > -0.5 && s < 0) {
                obj.sentimentDonut.purple++
              } else if (s <= -0.5) {
                obj.sentimentDonut.red++
              }


              // aveSentiment per time interval
              obj.timeInterval[key].totalSentiment = obj.timeInterval[key].totalSentiment || s;
              obj.timeInterval[key].totalSentiment += s;
              obj.timeInterval[key].aveSentiment =  obj.timeInterval[key].totalSentiment / obj.timeInterval[key].incomingTweets;

              // aveSentiments
              obj.totalSentiments += s;
              obj.aveSentiments = obj.totalSentiments / obj.totalTweets;


              // uniqueUsers + non-unique users
              if (!obj.users[data.user.id_str]) obj.uniqueUsers++;
              obj.users[data.user.id_str] = obj.users[data.user.id_str] || {};
              obj.users[data.user.id_str].tweets = obj.users[data.user.id_str].tweets || 1;
              obj.users[data.user.id_str].tweets++;
              obj.users[data.user.id_str].totalSentiments = obj.users[data.user.id_str].totalSentiments || s;
              obj.users[data.user.id_str].totalSentiments += s;
              obj.users[data.user.id_str].aveSentiments = obj.users[data.user.id_str].totalSentiments / obj.users[data.user.id_str].tweets;
              obj.users[data.user.id_str].username = data.user.screen_name;
              obj.users[data.user.id_str].followers = data.user.followers_count;
              obj.users[data.user.id_str].img = data.user.profile_image_url_https; //added image


              // hashTags
              data.text.split(" ").forEach(function(word){
                word = word.toLowerCase();
                if (word.indexOf("trump") === -1) {
                    var initial = word.split("").shift();
                    if (initial === "#") {
                      var re = /([A-Za-z0-9])+/g
                      word = word.match(re)[0];
                      // console.log(word);
                      obj.hashtags = obj.hashtags || {};
                      obj.hashtags[word] = obj.hashtags[word] || {};
                      obj.hashtags[word].count = obj.hashtags[word].count || 0;
                      obj.hashtags[word].count++
                      obj.hashtags[word].totalSentiment = obj.hashtags[word].totalSentiment || 0;
                      obj.hashtags[word].totalSentiment += s;
                      obj.hashtags[word].aveSentiment = obj.hashtags[word].totalSentiment / obj.hashtags[word].count;

                      //update other relevant word
                      for (var otherWord in obj.hashtags) {
                        var alternate = word.slice(0,5);
                        if (otherWord.indexOf(alternate) !== -1) {
                          console.log('duplicated',alternate, otherWord)
                          obj.hashtags[otherWord].count++
                          obj.hashtags[otherWord].count = obj.hashtags[otherWord].count || 0;
                          obj.hashtags[otherWord].totalSentiment = obj.hashtags[otherWord].totalSentiment || 0;
                          obj.hashtags[otherWord].totalSentiment += s;
                          obj.hashtags[otherWord].aveSentiment = obj.hashtags[otherWord].totalSentiment / obj.hashtags[otherWord].count;
                        }
                      }
                    }
                }
              })
              obj.$save();

            }); //....

            //tweetFrequency
            for (var key in obj.timeInterval) {
              obj.overallTweetFrequency = obj.timeInterval[key].frequency / Object.keys(obj.timeInterval).length;
              obj.$save();
            }


            // console.log('!!!!!!!!!!', obj)
            obj.$save();
        });

  }).then(function(){
    console.log('hey DONE! VISUALIZE')
    //DATA VISUALIZATION!!!!!!!!!!!!!!!!!!!!!!!!!
    obj.$loaded().then(function(data){

        //IMPRESSION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var impressionData = {
          labels: Object.keys(data.timeInterval),
          series: [
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].impressions})
          ]
        };
        var impressionOptions = {weight: 300, height: 300, low: 0, showArea: true};
        new Chartist.Line('#impression-chart', impressionData, impressionOptions);

        //INCOMINGTWEETS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var incomingTweetData = {
          labels: Object.keys(data.timeInterval),
          series: [
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].incomingTweets}),
            Object.keys(data.timeInterval).map(function(k){return data.timeInterval[k].frequency})
          ]
        };
        var incomingTweetOptions = {weight: 300, height: 300, low: 0};
        new Chartist.Line('#incomingTweet-chart', incomingTweetData, incomingTweetOptions);

        //SENTIMENT PLOTS (Experiment1) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var sentimentData = {
          labels: Object.keys(data.timeInterval), //timeInterval   [1,2,3,4]
          series: obj.sentimentScores //[[1,2,undefined,3],[undefined,1,2,5]]
        }
        console.log('hi data1',data)

        var sentOptions = {
          showLine: false,
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
        new Chartist.Line('#sentiments-plot1', sentimentData, sentOptions); //, responsiveOptions

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
        var sentimentDonutSeries = [];
        for (var i=0; i< sentimentDonutLabel.length; i++){
          var k = sentimentDonutLabel[i]
          sentimentDonutSeries.push(obj.sentimentDonut[k]);
        }

        var dataD = {
          labels: sentimentDonutLabel,
          series: sentimentDonutSeries
        };

        var sum = function(a, b) { return a + b };

        console.log('donutt', dataD, sum);

        var optionsD = {
          // {
            labelInterpolationFnc: function(value) {
              console.log('label', value)
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
              console.log('labelresponsive', value)
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



    })//....dataVisblock(objload)

  })//...then block


});
