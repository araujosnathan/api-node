var MongoClient = require('mongodb').MongoClient;
var Serie = require('../api-node/models/serie');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost/natflix";

var findSeries = function(db, callback) {
  var cursor = db.collection('series').find( );
  cursor.each(function(err, obj) {
     if (obj != null) {
        console.dir(obj);
     } else {
        callback();
     }
  });
};

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  
  db.collection("series").drop(function(err, sucess) {
    if (err) db.createCollection("series");
    if (sucess) console.log("Collection deleted");
  });

  db.collection("series").insertOne({ "_id" : ObjectId("77e0373c6f35bd826f47e977"),  name:"The Flash", year:"2014", season:"4", genre:"action"}, function(err, res) {
    if (err) throw err;
    console.log("Serie was inserted with successful!!");
  });

  findSeries(db, function() {
    db.close();
  });
});







































