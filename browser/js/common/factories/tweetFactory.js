app.factory('TweetFactory', function ($http) {

    return {
        getTweets: function(){
        	console.log('hit getTweets factory');
            return $http.get('api/getTweets').then(function(response){
                return response.data;
            });
        },

        post: function(status) {
          return $http.post('api/postStatus', {status: status}).then(function(response){
            return response.data;
          });
        }

        // signUpInfo: function(signupinfo){
        // 	console.log('hit factory'+signupinfo);
        //     return $http.post('/tweet/getMentions', signupinfo).then(function(response){
        //         return response.data;
        //     });
        // },

        // checkSignUp: function(email){
        // 	console.log('hit checkSignUp', email);
        // 	var queryParams= {};
        //   queryParams.email = email;
        //   //queryParams = req.query
        // 	return $http.get('/api/signup/findBeforeCreate', {params: queryParams}).then(function(response){
        // 		return response.data;
        // 	});
        //
        // },
        //
        // updatePw: function(pw) {
        //   console.log('update pw', pw);
        //   return $http.put('/api/user/updatepw', pw).then(function(response) {
        //     return response.data;
        //   })
        // }
    };


});
