console.log('this is loaded');


// var twitterKey=function([process.env.TWITTER_CONSUMER_KEY],[process.env.TWITTER_CONSUMER_SECRET],[process.env.TWITTER_ACCESS_TOKEN_KEY],[process.env.TWITTER_ACCESS_TOKEN_SECRET]){
//   this.consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   this.consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   this.access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   this.access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET

// }

exports.twitter = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb={
  api:process.env.OMDB_API_KEY
}