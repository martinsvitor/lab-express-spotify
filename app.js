require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path')

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res) => res.render('index'));

app.get('/search', (req,res)=> {
    const { artist } = req.query;
       spotifyApi.searchArtists(artist)
        .then(match => {
            res.render('artist-search-results', {items: match.body.artists.items})
        })
        .catch(err=> console.log('This error occurred when trying to search for the artist: ',err));
});

app.get('/albums/:id', (req,res) => {
    const { id } = req.params
    spotifyApi.getArtistAlbums(id)
        .then(match => {
            // console.log(match.body.items[0].images[0])
            res.render('albums', {albums: match.body.items});
        }
        )
        .catch(err => console.log('This error occured when trying to access the artist`s albums:', err));
});


app.get('/albums/tracks/:id', (req,res) => {
    const { id } = req.params;
    spotifyApi.getAlbumTracks(id)
        .then(match => {
            console.log(match.body)
            res.render('tracks', {tracks: match.body.items});
        }
        )
        .catch(err => console.log('This error occured when trying to access the album`s tracks:', err))

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
