// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var db = require('./models');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/
var albumGenres = [];
/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums){
    if(err) console.log(err);
    res.json(albums);
  });
});

app.post('/api/albums', function createAlbum(req, res){
  var newAlbum = new db.Album({
    artistName: req.body.artistName,
    name: req.body.name,
    releaseDate: req.body.releaseDate,
    genres: req.body.genres
  });
  newAlbum.save(function(err, album){
    if(err) console.log(err);
    res.json(album);
  });
  console.log(req.body);
  console.log(req.body.genres);
  albumGenres.push(req.body.genres);
  console.log(albumGenres);
});

app.get('/api/albums/:id', function(req,res){
  db.Album.findOne({_id: req.params.id}, function(err, data){
    res.json(data);
  });
});

app.post('/api/albums/:id/song', function createSong(req,res){
  var albumId = req.params.album_id;
  // console.log(req);
  console.log(req.body);
  // console.log(req.params._id);
  db.Song.findById(albumId)
    .populate('song')
    .exec(function(err, foundAlbum){
      console.log(albumId);
      if (err){
        console.log(err);
      }
      console.log(foundAlbum);
      // foundAlbum.save();
    });
});
/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
