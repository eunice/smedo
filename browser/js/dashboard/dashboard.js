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
  // test.$loaded().then(function(tweets){

      // tweets.forEach(function(data){
      //   var date = data.created_at;
      //   var day = date.split(" ")[0];
      //   var hour = parseInt(date.split(" ")[3].split(":")[0]);
      //   var s = parseFloat(data.sentiment.score);
      //
      //   var key;
      //   if (hour >= 6 && hour < 9) key = day+'M1';
      //   else if (hour >= 9 && hour < 12) key = day+'M2';
      //   else if (hour >= 12 && hour < 15) key = day+'A1';
      //   else if (hour >= 15 && hour < 18) key = day+'A2';
      //   else if (hour >= 18 && hour < 21) key = day+'N1';
      //   else if (hour >= 21 && hour <= 23) key = day+'N2';
      //   else if (hour >= 0 && hour < 3) key = day+'L1';
      //   else if (hour >= 3 && hour < 6) key = day+'L2';
      //
      //   //create key = day+hour -> update value
      //
      //   obj.$loaded().then(function(obj){
      //         obj.timeInterval[key] = obj.timeInterval[key] || {};
      //         //incomingTweets
      //         obj.timeInterval[key].incomingTweets = obj.timeInterval[key].incomingTweets || 0;
      //         obj.timeInterval[key].incomingTweets++;
      //         //ave Tweet frequency per interval -> tooltip
      //         obj.timeInterval[key].frequency = obj.timeInterval[key].incomingTweets / 3;
      //         // impression
      //         obj.timeInterval[key].impressions = obj.timeInterval[key].impressions || 0;
      //         obj.timeInterval[key].impressions += data.user.followers_count;
      //         // sentimentScores
      //         obj.timeInterval[key].sentimentScores = obj.timeInterval[key].sentimentScores || [];
      //         obj.timeInterval[key].sentimentScores.push(s);
      //         // aveSentiment
      //         obj.timeInterval[key].totalSentiment = obj.timeInterval[key].totalSentiment || s;
      //         obj.timeInterval[key].totalSentiment += s;
      //         obj.timeInterval[key].aveSentiment =  obj.timeInterval[key].totalSentiment / obj.timeInterval[key].incomingTweets;
      //         // console.log('ssss', obj.timeInterval[key].aveSentiment, s)
      //
      //         //totalTweets
      //         obj.totalTweets++;
      //         // totalImpressions
      //         obj.totalImpressions += data.user.followers_count;
      //
      //         // aveSentiments
      //         obj.totalSentiments += s;
      //         obj.aveSentiments = obj.totalSentiments / obj.totalTweets;
      //
      //         // sentimentDonut
      //         // {green: 0, blue: 0, yellow: 0, purple: 0, red: 0}
      //         if (s > 0.5 && s <= 1) obj.sentimentDonut.green++
      //         else if (s > 0 && s <= 0.5) obj.sentimentDonut.blue++
      //         else if (s === 0) obj.sentimentDonut.yellow++
      //         else if (s > -0.5 && s < 0) obj.sentimentDonut.purple++
      //         else if (s <= -0.5) obj.sentimentDonut.red++
      //
      //         // uniqueUsers + non-unique users
      //         if (!obj.users[data.user.id_str]) obj.uniqueUsers++;
      //         obj.users[data.user.id_str] = obj.users[data.user.id_str] || {};
      //         obj.users[data.user.id_str].tweets = obj.users[data.user.id_str].tweets || 1;
      //         obj.users[data.user.id_str].tweets++;
      //         obj.users[data.user.id_str].totalSentiments = obj.users[data.user.id_str].totalSentiments || s;
      //         obj.users[data.user.id_str].totalSentiments += s;
      //         obj.users[data.user.id_str].aveSentiments = obj.users[data.user.id_str].totalSentiments / obj.users[data.user.id_str].tweets;
      //         obj.users[data.user.id_str].username = data.user.screen_name;
      //         obj.users[data.user.id_str].followers = data.user.followers_count;
      //
      //
      //         // hashTags
      //         data.text.split(" ").forEach(function(word){
      //           word = word.toLowerCase();
      //           if (word.indexOf("trump") === -1) {
      //               var initial = word.split("").shift();
      //               if (initial === "#") {
      //                 var re = /([A-Za-z0-9])+/g
      //                 word = word.match(re)[0];
      //                 // console.log(word);
      //                 obj.hashtags = obj.hashtags || {};
      //                 obj.hashtags[word] = obj.hashtags[word] || 1;
      //                 obj.hashtags[word]++
      //               }
      //           }
      //         })
      //         obj.$save();

            // }); //....

        //     //tweetFrequency
        //     for (var key in obj.timeInterval) {
        //       obj.overallTweetFrequency = obj.timeInterval[key].frequency / Object.keys(obj.timeInterval).length;
        //       obj.$save();
        //     }
        //
        //
        //     // console.log('!!!!!!!!!!', obj)
        //     obj.$save();
        // });

  // });

//DATA VISUALIZATION!!!!!!!!!!!!!!!!!!!!!!!!!



});

// var ref = new Firebase('https://smedo-fs.firebaseio.com/');
// var tweetRt = $firebaseArray(ref);
//
//   var tv = 50;
//
// var tweets = new Rickshaw.Graph({
// element: document.querySelector("#tweets"),
// width: "300",
// height: "200",
// renderer: "line",
// series: new Rickshaw.Series.FixedDuration([{
//     name: 'one', color: 'gold'
// }], undefined, {
//     timeInterval: tv,
//     maxDataPoints: 100,
//     timeBase: new Date().getTime() / 1000
// })
// });
//
// var sentiments = new Rickshaw.Graph({
// element: document.querySelector("#sentiments"),
// width: "300",
// height: "200",
// renderer: "area",
// series: new Rickshaw.Series.FixedDuration([{
//     name: 'one', color: '#FF5252'
// }], undefined, {
//     timeInterval: tv,
//     maxDataPoints: 100,
//     timeBase: new Date().getTime() / 1000
// })
// });
//
// var oldTweets = 0;
// var newTweets = 0;
// var impression = 0;
//
// tweetRt.$loaded(function(tweets){
// console.log('loaddd',tweets);
// $scope.newTweets = tweets.length;
//
// tweets.forEach(function(tweet) {
// $scope.impression += tweet.user.followers_count;
// })
// // $scope.newTweets = tweets.
// })
//
// for(var i = 0; i < 100; i++){
// addRandomData(tweets);
// // tweets.series.addData({one: Math.floor(Math.random() * 40) + 120})
//
// // tweetRt.$loaded(function(tweets){
// //   newTweets = tweets.length;
// // })
//
// // tweets.series.addData({one: newTweets - oldTweets});
// // oldTweets = newTweets;
//
// addRandomData(sentiments);
// }
//
// tweets.render();
// sentiments.render();
//
// setInterval(function () {
// addRandomData(tweets);
// addRandomData(sentiments);
//
// //rendering
// tweets.render();
// sentiments.render();
//
// }, tv);
//
// function addRandomData(chart) {
// var data = {
//     one: Math.floor(Math.random() * 40) + 120
// };
// chart.series.addData(data);
// }
//
// //donut
//
// var width = 960,
// height = 500,
// radius = Math.min(width, height) / 2;
//
// var color = d3.scale.ordinal()
// .range(["#E81919", "#DA6CB5", "#FFFF00", "#99FFFF", "#5EEF5E"]);
//
// var arc = d3.svg.arc()
// .outerRadius(radius - 10)
// .innerRadius(radius - 70);
//
// var pie = d3.layout.pie()
// .sort(null)
// .value(function(d) { return d.count; });
//
// var svg = d3.select(".donut").append("svg")
// .attr("width", width)
// .attr("height", height)
// .append("g")
// .attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");
//
// // d3.csv("data.csv", function(error, data) {
//
// //finding the portion of sentiment
// var tweetData =
// [{"score": "-1<s<-0.5", "count": 0},
// {"score": "-0.5<s<-0", "count": 0},
// {"score": "s=0", "count": 0},
// {"score": "0<s<0.5", "count": 0},
// {"score": "0.5<s<1", "count": 0}
// ];
// console.log('tweet rt', tweetRt)
//
// tweetRt.$loaded(function(tweets){
// console.log('loaddd',tweets);
//
// tweets.forEach(function(tweet) {
// console.log('tweet',tweet)
// if (tweet.sentiment.score < -0.5) {
//   tweetData[0]["count"] ++
// } else if (tweet.sentiment.score >= -0.5 && tweet.sentiment.score < 0) {
//   tweetData[1]["count"] ++
// } else if(tweet.sentiment.score === 0) {
//     tweetData[2]["count"] ++
// } else if (tweet.sentiment.score >0 && tweet.sentiment.score < 0.5) {
//   tweetData[3]["count"] ++
// } else if (tweet.sentiment.score >= 0.5 && tweet.sentiment.score < 1) {
//   tweetData[4]["count"] ++
// }
// })
//
//
// })
//
// tweetData.forEach(function(d) {
// d.count = +d.count;
// });
//
// setTimeout(function(){
//
// console.log('tweetdata',tweetData)
// //////////////////////////////////
//
// var g = svg.selectAll(".arc")
//     .data(pie(tweetData))
//   .enter().append("g")
//     .attr("class", "arc");
//
// g.append("path")
//     .attr("d", arc)
//     .style("fill", function(d) {
//       console.log('d',d)
//       return color(d.data.score); });
//
// g.append("text")
//     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//     .attr("dy", ".35em")
//     .style("text-anchor", "middle")
//     .text(function(d) { return d.data.score; });
//
// }, 2000)
//
//
// // });
