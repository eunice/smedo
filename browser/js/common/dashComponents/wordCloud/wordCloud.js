app.directive('wordCloud', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {
          hashtag: '='
        },
        
        templateUrl: 'js/common/dashComponents/wordCloud/wordCloud.html',
        link: function(scope){

              var frequency_list = [];

              for (var h in scope.hashtag) {
                frequency_list.push({"text": h, "size": parseInt(scope.hashtag[h].count)})
                console.log(scope.hashtag[h].count);
              };

                var color = d3.scale.linear()
                        .domain([0,1,2,3,4,5,6,10,15,20,100])
                        // Range of colours from darkest to lightest
                        .range(["#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999", "#aaa", "#bbb", "#ccc", "#ddd"]);

                d3.layout.cloud().size([850, 350])
                        .words(frequency_list)
                        .rotate(0)
                        .fontSize(function(d) { return d.size * 0.3; })
                        .on("end", draw)
                        .start();

                function draw(words) {
                    d3.select("#word-cloud").append("svg")
                            .attr("width", 800)
                            .attr("height", 300)
                            .attr("class", "wordcloud")
                            .append("g")
                            // without the transform, words words would get cutoff to the left and top, they would
                            // appear outside of the SVG area
                            .attr("transform", "translate(320,200)")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) { return d.size + "px"; })
                            .style("fill", function(d, i) { return color(i); })
                            .attr("transform", function(d) {
                                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                            })
                            .text(function(d) { return d.text; });
                }

        }
    };

});
