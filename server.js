var fs = require('fs');
var musicmetadata = require('musicmetadata');
var walk = require('walk');
var path = require('path');
var express = require('express');
var cors = require('cors');

var rootMusicDir = './music';

// Read a track dictionary for a music file.
var trackDict = function(path, fileName, func) {
  musicmetadata(fs.createReadStream(path), function (err, metadata) {
    if (err) {
      return;
    }
    func({
      'path': fileName,
      'artist': metadata.artist[0],
      'genre': metadata.genre,
      'title': metadata.title,
      'album': metadata.album
    });
  });
};

// Read all the music files in a directory (recursively) and record all of
// their metadata dictionaries in a giant array.
var readMetadata = function (basedir, func) {
  var md = [];
  var walker = walk.walk(basedir);
  walker.on("file", function (root, stats, next) {
    var p = path.join(root, stats.name);
    var fileName = p.replace('music/', '');
    trackDict(p, fileName,  function (d) {
        console.log(d);
      md.push(d);
    });

    next();
  }).on("end", function () {
    // Add IDs to each.
    for (var i = 0; i < md.length; ++i) {
      md[i].id = i.toString();
    }
    func(md);
  });
};

// Read the metadata and start the server.
readMetadata(rootMusicDir, function (tracks) {
  let genres = [];
  let playlist = {};
  for(let track of tracks){
    if(!genres.includes(track.genre[0])){
      genres.push(track.genre[0]);
      playlist[track.genre[0]] = [track];
    } else {
      playlist[track.genre[0]].push(track);
    }
  }

  var loadTrack = function (req, res, next) {
    var id = parseInt(req.params.id);
    if (isNaN(id) || id < 0 || id > tracks.length) {
      res.status(404).end();
    } else {
      req.track = tracks[id];
      next();
    }
  };

  // The Express Router contains all the AURA endpoints.
  var aura = express.Router();
  // Enable cross-origin resource sharing.
  aura.use(cors());

  // Utility for JSON endpoints to set the content type.
  var jtype = function(req, res, next) {
    res.set('Content-Type', 'application/vnd.api+json');
    next();
  };

  var shuffle = function (playlist) {
    var currentIndex = playlist.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = playlist[currentIndex];
      playlist[currentIndex] = playlist[randomIndex];
      playlist[randomIndex] = temporaryValue;
    }

    playlist = playlist.slice(0, 5)
    return playlist;
  };

  // AURA API endpoints.
  aura.use("/", express.static(__dirname + '/dist/'));
  
  aura.use("/music", express.static(__dirname + '/music/'));


  aura.get('/genres', jtype, function (req, res) {
    res.json(genres);
  });
  aura.get('/tracks', jtype, function (req, res) {
    res.json(tracks);
  });
  aura.get('/getAllPlaylists', jtype, function (req, res) {
    res.json(playlist);
  });
  aura.get('/getPlaylist/:genre', jtype, function (req, res) {
    shuffle(playlist[req.params.genre]);
    res.json(playlist[req.params.genre].slice(0, 5));
  });
  aura.get('/tracks/:id', jtype, loadTrack, function (req, res) {
    res.json(req.track);
  });
  aura.get('/tracks/:id/audio', loadTrack, function (req, res) {
    var fname = path.basename(req.track.path);
    res.sendFile(req.track.path, {
      'headers': {
        'Content-Disposition': 'attachment; filename="' + fname + '"'
      }
    });
  });

  // An Express Application to host the API under the /aura prefix.
  var app = express();
  app.use('/', aura);

  var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host + ':' +  port);
  });
});
