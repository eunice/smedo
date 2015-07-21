###Smedo

This is a tool for marketers to collaborate and manage Twitter conversations better in the organization. 

###Development
- The Twitter streaming API is used to stream live tweets into the web app based on keywords specified by users. 
- The Alchemy API is then used to conduct a sentiment analysis on the tweets. 
- A priority score is generated for each tweet, which is calculated by the sentiment score, number of followers and potential impression reach. 
- These tweets are then displayed into the inbox ordered by its priority score. 
- Tweets will authomatically update the view on the browser without page refresh. 
- Users can tweet back to these tweets.
- If another user is already working on the tweet, the user can see what that user is responding real time. 
- All tweets and responses are stored in Firebase. 

###Get started 
```
$ npm install
$ gulp 
$ npm start 
```
