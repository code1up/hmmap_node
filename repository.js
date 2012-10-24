var util = require("util");
var connectionStringFormat = "mongodb://kong:d0nkeykong@ds041157.mongolab.com:41157/hmmap";

/*
var connectionString = util.format(
	connectionStringFormat,
	config.mongodb.username,
	config.mongodb.password,
	config.mongodb.at,
	config.mongodb.port,
	config.mongodb.collection));
*/

var connectionString = connectionStringFormat;

var mongoose = require("mongoose");
var gridfs_stream = require("gridfs-stream");

gridfs_stream.mongo = mongoose.mongo;

var connection = mongoose.createConnection(connectionStringFormat);
var gridfs = null;

connection.once("open", function() {
	gridfs = gridfs_stream(connection.db);
});

var schema = mongoose.Schema({
	name: "string"
});

var Cat = connection.model("Cat", schema);

var kitty = new Cat({
	name: "Zildjian"
});

exports.saveKitty = function() {
	kitty.save(function(err) {
		if (err) {
			console.log("Error 1000");
		}
	});
};

exports.saveItemImage = function(encodedImage) {
	Buffer
	var options = null;
	var writestream = gridfs.createWriteStream("image.png", options);

	fs.createReadStream('/some/path').pipe(writestream);
};
