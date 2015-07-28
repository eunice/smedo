app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashCtrl'
    });
});

app.controller('DashCtrl', function ($scope, Socket, TweetFactory, $timeout, $state, $firebaseArray, $firebaseObject) {

    var ref = new Firebase('https://smedo-fs.firebaseio.com/');
    var tweetRt = $firebaseArray(ref);

      var tv = 50;

var tweets = new Rickshaw.Graph({
    element: document.querySelector("#tweets"),
    width: "300",
    height: "200",
    renderer: "line",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'one', color: 'gold'
    }], undefined, {
        timeInterval: tv,
        maxDataPoints: 100,
        timeBase: new Date().getTime() / 1000
    })
});

var sentiments = new Rickshaw.Graph({
    element: document.querySelector("#sentiments"),
    width: "300",
    height: "200",
    renderer: "area",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'one', color: '#FF5252'
    }], undefined, {
        timeInterval: tv,
        maxDataPoints: 100,
        timeBase: new Date().getTime() / 1000
    })
});

var oldTweets = 0;
var newTweets = 0;
var impression = 0;

tweetRt.$loaded(function(tweets){
  console.log('loaddd',tweets);
  $scope.newTweets = tweets.length;

  tweets.forEach(function(tweet) {
    $scope.impression += tweet.user.followers_count;
  })
  // $scope.newTweets = tweets.
})

for(var i = 0; i < 100; i++){
    addRandomData(tweets);
    // tweets.series.addData({one: Math.floor(Math.random() * 40) + 120})

    // tweetRt.$loaded(function(tweets){
    //   newTweets = tweets.length;
    // })

    // tweets.series.addData({one: newTweets - oldTweets});
    // oldTweets = newTweets;

    addRandomData(sentiments);
}

tweets.render();
sentiments.render();

setInterval(function () {
    addRandomData(tweets);
    addRandomData(sentiments);

    //rendering
    tweets.render();
    sentiments.render();

}, tv);

function addRandomData(chart) {
    var data = {
        one: Math.floor(Math.random() * 40) + 120
    };
    chart.series.addData(data);
}

//donut

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#E81919", "#DA6CB5", "#FFFF00", "#99FFFF", "#5EEF5E"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });

var svg = d3.select(".donut").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");

// d3.csv("data.csv", function(error, data) {

//finding the portion of sentiment
var tweetData =
  [{"score": "-1<s<-0.5", "count": 0},
   {"score": "-0.5<s<-0", "count": 0},
   {"score": "s=0", "count": 0},
   {"score": "0<s<0.5", "count": 0},
   {"score": "0.5<s<1", "count": 0}
  ];
console.log('tweet rt', tweetRt)

tweetRt.$loaded(function(tweets){
  console.log('loaddd',tweets);

  tweets.forEach(function(tweet) {
    console.log('tweet',tweet)
    if (tweet.sentiment.score < -0.5) {
      tweetData[0]["count"] ++
    } else if (tweet.sentiment.score >= -0.5 && tweet.sentiment.score < 0) {
      tweetData[1]["count"] ++
    } else if(tweet.sentiment.score === 0) {
        tweetData[2]["count"] ++
    } else if (tweet.sentiment.score >0 && tweet.sentiment.score < 0.5) {
      tweetData[3]["count"] ++
    } else if (tweet.sentiment.score >= 0.5 && tweet.sentiment.score < 1) {
      tweetData[4]["count"] ++
    }
  })


})

tweetData.forEach(function(d) {
  d.count = +d.count;
});

setTimeout(function(){

  console.log('tweetdata',tweetData)
  //////////////////////////////////

    var g = svg.selectAll(".arc")
        .data(pie(tweetData))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
          console.log('d',d)
          return color(d.data.score); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.score; });

}, 2000)


// });

});


// var dataArr = [];
//
// var canvas = d3.select('body')
//              .append('svg')
//              .attr('width', 500)
//              .attr('height', 500);

//  var graph = new Rickshaw.Graph({
//          element: document.querySelector("#chart"),
//          width: 235,
//          height: 300,
//          renderer: 'bar',
//          series: [
//              {
//                  data: [{ x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 }],
//                  color: '#4682b4'
//              }, {
//                  data: [{ x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 }],
//                  color: '#9cc1e0'
//          }]
//      });
//   graph.render();

  ////////////////////////////////
