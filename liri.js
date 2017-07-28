//spotify keys
var spotID = "b5ebe33443c04bad8046ee36c779d658";
var spotSecret = "470593081afb49a7803a33ceaacc8346";
//requires
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//  consumer_key, consumer_secret, access_token_key, access_token_secret
keys = keys.twitterKeys;

// commands to recieve: `my-tweets` `spotify-this-song` `movie-this` `do-what-it-says'
var tweets = "my-tweets";
var spotify = "spotify-this-song";
var imdb = "movie-this";
var file = "do-what-it-says";
var empty = "";

var command = process.argv[2];
var term = process.argv;

// figure out what to do
if (command == tweets || command == "mytweets") {
    twit();
} else if (command == spotify || command == "spotifythissong") {
    spot(empty);
} else if (command == imdb || command == "moviethis") {
    movie(empty);
} else if (command == file || command == "dowhatitsays") {
    text();
}

// ***************FUNCTIONS************************************************
//This will show your last 20 tweets and when they were created at in your terminal/bash window
//Error
//You must add your mobile phone to your Twitter profile before creating an application. Please read https://support.twitter.com/articles/110250-adding-your-mobile-number-to-your-account-via-web for more information.
//Dont want to give phone number to site, gave amazon last number and payed for it
//Confident i would be able to complete if i had keys.
function twit() {
    console.log("twitter");
    var client = new Twitter({
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''
    });

    var params = { screen_name: 'nodejs' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });

} // end twit

//* This will show the following information about the song in your terminal/bash window
//Artist(s)
//The song's name
//A preview link of the song from Spotify
//The album that the song is from
//If no song is provided then your program will default to "The Sign" by Ace of Base.
function spot(b) {
    console.log("*******SPOTIFY*********");

    var spotify = new Spotify({
        id: spotID,
        secret: spotSecret
    });

    var song = "";
    if (b == "") {
        // default song
        if (term.length == 3)
            song = "All The Small Things";
        else {
            // get console song input
            for (var i = 2; i < term.length; i++) {
                if (i > 2 && i < term.length)
                    song = song + "+" + term[i];
            }
        }
    } else
        song = b;
    // api call
    spotify.search({ type: 'track', query: song }).then(function(response) {
        //array containing show info
        var showme = [];
        //console.log(response);
        var find = response.tracks.items[0];
        //console.log(find);
        //artist
        showme.push(find.album.artists[0].name);
        //name of song
        showme.push(find.name);
        //preview link 
        showme.push(find.external_urls.spotify);
        //album name
        showme.push(find.album.name);

        //display information
        console.log("Artist: " + showme[0]);
        console.log("Song Name: " + showme[1]);
        console.log("Link: " + showme[2]);
        console.log("Album Name: " + showme[3]);
        console.log("******END SPOTIFY******");
    }).catch(function(err) {
        console.log(err);
    });

} //end spot

// * This will output the following information to your terminal/bash window:
//     * Title of the movie.
//     * Year the movie came out.
//     * IMDB Rating of the movie.
//     * Rotten Tomatoes Rating of the movie.
//     * Country where the movie was produced.
//     * Language of the movie.
//     * Plot of the movie.
//     * Actors in the movie
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
function movie(b) {
    console.log("*******omdb*******");

    var movieName = "";
    //if called from text function b will hold moviename else will be empty
    if (b == "") {
        // default movie
        if (term.length == 3)
            movieName = "Mr. Nobody";
        else {
            // get console song input
            for (var i = 2; i < term.length; i++) {
                if (i > 2 && i < term.length)
                    movieName = movieName + "+" + term[i];
            }
        }
    } else
        movieName = b;

    // api call
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            result = JSON.parse(body);
            //console.log(result);
            //Title
            console.log("Title: " + result.Title);
            //Year
            console.log("Year: " + result.Year);
            //IMDB Rating
            console.log("IMDB Rating: " + result.Ratings[0].Value);
            //RT rating
            if (typeof result.Ratings[1] != "undefined")
                console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
            else
                console.log("No Rotten Tomatoes Rating.");
            //Country Produced
            console.log("Produced In: " + result.Country);
            //Plot
            console.log("Plot: " + result.Plot);
            //Actors
            console.log("Actors / Actresses: " + result.Actors);

            console.log("*****end omdb*****");
        }
        if (error) {
            console.log(error);
        }
    });
} //end movie

//Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
function text() {
    console.log("*******file*******");
    fs.readFile("random.txt.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        // grab the text, split by ',' send search term through argument
        var stuff = data.split(",");
        console.log(stuff);
        var dothis = stuff[0];
        var sendthis = stuff[1];
        if (dothis == tweets || dothis == "mytweets") {
            twit();
        } else if (dothis == spotify || dothis == "spotifythissong") {
            spot(sendthis);
        } else if (dothis == imdb || dothis == "moviethis") {
            movie(sendthis);
        } else if (dothis == file || dothis == "dowhatitsays") {
            console.log("You trying to infinite loop me you jerk?");
        }
    });
}// end text