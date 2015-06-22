app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('archives', {
        url: '/archives',
        controller: 'ArchivesCtrl',
        templateUrl: 'js/archives/archives.html'
    });

});

app.controller('ArchivesCtrl', function ($scope, Socket, TweetFactory, AuthService, $state, $firebaseArray, $firebaseObject) {

    var arch = new Firebase('https://smedo-fs.firebaseio.com/archives');
    var tweetArch = $firebaseArray(arch);

    $scope.mentions = tweetArch;
    console.log($scope.mentions)

    // TweetFactory.getPastMentions().then(function(mentions) {
    //   $scope.mentions = mentions
    // })

});
