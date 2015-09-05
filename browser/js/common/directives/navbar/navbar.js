app.directive('navbar', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Inbox', state: 'inbox' },
                { label: 'Tweets Archives', state: 'archives' },
                { label: 'Dashboard', state: 'dashboard'}
            ];

        }

    };

});
