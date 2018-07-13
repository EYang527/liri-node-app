// Node modules used

var dotenv = require("dotenv").config();
var request = require("request");
var twitter =require("twitter");
var spotify = require("node-spotify-api")
var weather = require("weather-js");
var fs = require("fs");
var moment = require('moment');
const chalk=require('chalk');


var input="";
var divider="\n------------------------------------------------------------------------------\n";
var keys=require("./keys.js");


//Constructors for Spotify
var Spotify=function(spotifyKeys){
    this.id=spotifyKeys.id;
    this.secret=spotifyKeys.secret;    
}

//Constructor for Twitter
var Twitter=function(twitterKeys){
    this.consumer_key=twitterKeys.consumer_key;
    this.consumer_secret=twitterKeys.consumer_secret;
    this.access_token_key=twitterKeys.access_token_key;
    this.access_token_secret=twitterKeys.access_token_secret;
}


// Instantiation of both objects
var spotify_keys=new Spotify(keys.spotify);
var twitter_keys=new Twitter(keys.twitter);

var omdb_api_key=keys.omdb.api;

// Check if keys are loaded
// console.log(spotify_keys);
// console.log(twitter_keys);
// console.log(omdb_api_key);
run();

function run(){
var command=process.argv[2];
input=process.argv[3];
input=process.argv.splice(3).join(" ");

switch(command){

    case "my-tweets":
        runTwitter();
        break;

    case "spotify-this-song":
        runSpotify();    
        break;
    
    case "movie-this":
        runOmdb();
        break;

    case "tell-me-weather":
    runWeather();
    break;

    case "do-what-it-says":
        runDoWhat();
        break;

    case "help":
        console.log(`Commands available =>
                        1- node liri my-tweets <numberTweets> (default prints last 20 tweets)
                        2- node liri spotify-this-song <songName>  //default: "The sign"
                        3- node liri movie-this <movieName> // default: "Mr nobody"
                        4- node liri do-what-it-says <command from random.txt>
                        5- node liri tell-me-weather <city> // by default St Paul,Mn`);
        logFile(process.argv,"Help menu displayed");
        break;

   default:
    console.log("\n **** Liri => Command not found or incorrect. Try 'node liri.js help' ***");
    logFile(process.argv,"user bad command");
    break; 
}
}

function runTwitter()
{
    let numbTwitter=input;
    var client = new twitter({
        consumer_key: twitter_keys.consumer_key,
        consumer_secret: twitter_keys.consumer_secret,
        access_token_key: twitter_keys.access_token_key,
        access_token_secret: twitter_keys.access_token_secret,
      });
      var params = {screen_name: 'Edison7775',count:numbTwitter};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            
            console.log(tweets[0].text);
            console.log(tweets[0].user.name);
            console.log(tweets[0].user.screen_name);
            console.log(tweets[0].created_at);
            for (var t in tweets){
               
                console.log("\nTweet #",+(numbTwitter)+": "+tweets[t].user.name+"@"+tweets[t].user.screen_name
                +" created at : "+tweets[t].created_at+"\n =>: "+tweets[t].text);
                console.log("==================================================================");
                numbTwitter--;
            }
        
        var twitterInfo= "\nDisplayed last "+input+" tweets from "+tweets[0].user.screen_name;
        logFile(process.argv,twitterInfo);

        }
    });
}

function runSpotify()
{     
    (input==="")? input="The sign":input;  

    var spotifySearch = new spotify({
      id:spotify_keys.id,
      secret: spotify_keys.secret,
    });
     
    spotifySearch.search({ type: 'track', query:input,limit:5 }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      for (var i in data.tracks.items){
        //console.log(JSON.stringify(data.tracks.items[i],null,2));
        console.log(JSON.stringify("name of the song : "+data.tracks.items[i].name)); 
        console.log(JSON.stringify("preview url : "+data.tracks.items[i].preview_url)); 
        console.log(JSON.stringify("Artist name : " +data.tracks.items[i].artists[0].name)); 
        console.log(JSON.stringify("Album name : "+data.tracks.items[i].album.name)); 
        console.log("\n ************************ \n");
      }

      var spotifyInfo= "\nLast spotify search: "+input+" | artist(s) "+data.tracks.items[0].artists[0].name;
      logFile(process.argv,spotifyInfo);
   
    });
}

function runOmdb()
{
     (input==="")? input="Mr nobody":input;
    
    request("http://www.omdbapi.com/?t="+input+"&apikey="+omdb_api_key, function(error, response, body) {

    
  // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating

    console.log(JSON.parse(body));

    console.log("==========================================================")
    console.log("Title :"+JSON.parse(body).Title);
    console.log("==========================================================")
    console.log("Year : "+JSON.parse(body).Year);
    console.log("IMDB rating is: " + JSON.parse(body).imdbRating);
    console.log("Rotten tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
    console.log("Language(s): " + JSON.parse(body).Language);
    console.log("Plot : "+JSON.parse(body).Plot);
    console.log("Actors : "+JSON.parse(body).Actors);

    var movieInfo="\nTitle : "+JSON.parse(body).Title+", Year : "+JSON.parse(body).Year
    +"\nPlot : "+JSON.parse(body).Plot;

    //Logs into file
    logFile(process.argv,movieInfo);
    }

    else
    console.log(error);   
  
    });
}

function runDoWhat()
{
    
    fs.readFile("random.txt", "utf8", function(error, data) {
    
      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }
    
      // We will then print the contents of data
      console.log(data);
    
    //   // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    
    //   // We will then re-display the content as an array for later use.
     console.log(dataArr);

     process.argv[2]=dataArr[0];
     process.argv[3]=dataArr[1];

     console.log(process.argv);
    run();
    });
    
}

function runWeather() {

    (input==="")? input="St Paul,Mn":input;
    weather.find({ search: input, degreeType: "F" }, function(err, result) {
    
      // If there is an error log it.
      if (err) {
        console.log(err);
      }
    
      //console.log(JSON.stringify(result, null, 2));

      console.log("\ncity : "+JSON.stringify(result[0].location.name)); 
      console.log("current Temp : "+JSON.stringify(result[0].current.temperature));
      console.log("feels like : "+JSON.stringify(result[0].current.feelslike));
      console.log("desc : "+JSON.stringify(result[0].current.skytext));
      console.log("humidity : "+JSON.stringify(result[0].current.humidity));
      
      var weatherInfo="\n"+"city : "+result[0].location.name+" temp : "
      +result[0].current.temperature+" F.  Description : "+result[0].current.skytext;

      logFile(process.argv,weatherInfo);
    });
}

function logFile(command,text)
{
    
    var commandSave=chalk.blue("node liri "+command[2] +" "+input);
    console.log(commandSave);
    var timestamp=moment().format('MMMM Do YYYY, h:mm:ss a');
    var log=divider+timestamp+" | command=> "+commandSave+" "+text+"\n";

    fs.appendFile("logs.txt",log, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("log Added!");
  }

});


}
