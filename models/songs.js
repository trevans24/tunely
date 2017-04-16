var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema ({
	trackNumber: Number,
	name: String
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;