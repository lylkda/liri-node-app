var keys = require('./keys');
// console.log(keys);
var command = process.argv[2];

//For Twitter API
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var params = {screen_name: 'PlsSendBoba'};

//For Spotify API
var Spotify = require('node-spotify-api');
var SpotifyClient = new Spotify(keys.spotifyKeys);




switch (command) {
	case "my-tweets":
	tweet();
	break;

	case "spotify-this-song":
	spotify();
	break;

	case "movie-this":
	movie();
	break;

	case "do-what-it-says":
	parrot();
	break;
}

function tweet(){
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i<tweets.length; i++){
			console.log("-----------------------------------")
			console.log("On " + tweets[i].created_at + ":\nI tweeted: " + tweets[i].text);
			console.log("-----------------------------------");
			}
			}
	  });
}//End tweet();

function spotify(){
	var song = [];
	for (var t = 3; t<process.argv.length; t++){
		song.push(process.argv[t]);
	}
	song = song.join(" "); //Joins the arguments to form song title

	if (!song){
		song = "The Sign";
	}
	SpotifyClient.search({ type: 'track', query: song, limit: 10 }, function(err, data) {
		if (err) {
		  return console.log('Error occurred: ' + err);
		}
		var query = data.tracks.items;
		for (var i = 0; i<query.length ; i++ ){
			if (query[i].name.toLowerCase() === song.toLowerCase()){
				console.log("---------------------------------------------");
				console.log("Artist: " + query[i].album.artists[0].name);
				console.log("Song Name: " + query[i].name);
				console.log("Preview Link of Song: " + query[i].preview_url);
				console.log("The Album: " + query[i].album.name);
				console.log("---------------------------------------------");
				break
			}
			else{
				console.log("---------------------------------------------");
				console.log("Couldn't find exact match. Here's the first result: ");
				console.log("---------------------------------------------");				
				console.log("Artist: " + query[0].album.artists[0].name);
				console.log("Song Name: " + query[0].name);
				console.log("Preview Link of Song: " + query[0].preview_url);
				console.log("The Album: " + query[0].album.name);
				console.log("---------------------------------------------");
				break
			}
		}
	  });
}//Ends Spotify();

function movie(){
	var movie = [];
	for (var t = 3; t<process.argv.length; t++){
		movie.push(process.argv[t]);
	}
	movie = movie.join(" "); //Joins the arguments to form movie title
	if (!movie){
		movie = "Mr. Nobody";
	}

	var request = require("request");
	
	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
	  if (!error && response.statusCode === 200) {
		var data = JSON.parse(body);
		console.log("-------------------------------------------");
		console.log("Title: " + JSON.parse(body).Title);
		console.log("Released: " + data.Released);
		console.log("Rating: " + JSON.parse(body).imdbRating +
		"\nRotten Tomatoes' Rating: " + data.Ratings[1].Value +
		"\nCountry Where Movie was Produced: " + data.Country +
		"\nLanguage: " + data.Language +
		"\nCast: " + data.Actors +
		"\n\nPlot: " + data.Plot);
		console.log("-------------------------------------------");

		if (data.Error){
			console.log(data.Error);
		}
	  }
	})
}

function parrot(){
	var fs = require('fs');
	fs.readFile("random.txt","utf8", function(err, data){
		var output = data.split(",");
		command = output[0];
		process.argv[3] = output[1];
		
		switch (command) {
			case "my-tweets":
			tweet();
			break;

			case "spotify-this-song":
			spotify();
			break;

			case "movie-this":
			movie();
			break;
		}
	})
}