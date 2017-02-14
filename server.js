var express = require('express');
var api = express();
var body_parser = require('body-parser');
var mongoose = require('mongoose');

var Serie = require('../api-node/models/serie');


mongoose.connect('mongodb://root:12345678@jello.modulusmongo.net:27017/Hira2hyp')

api.use(body_parser.urlencoded({extend: true}));
api.use(body_parser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(
  function(request, response, next){
    console.log('Something is happening here ... ');
    next();
});

router.get('/',
  function(request, response){
    response.json({ message: "We've got it - This is our API"});
});

router.route('/series')
  .post( function(request, response){
    var serie = new Serie();
    serie.name = request.body.name;
    serie.year = request.body.year;
    serie.season = request.body.season;
    serie.genre = request.body.genre;

    if(serie.name == null || serie.year == null || serie.season == null || serie.genre == null)
      response.status(400).json({ message: 'Missing required property: name/year/season or genre'});
    else
    {
      serie.save(function(error, serie){
        if(error)
          response.send(error);
        else
          response.status(201).json(serie);
      });
    }

  })

  .get(function(request, response){
    Serie.find(function(err, series){
      if(err)
        response.send(err);
      else
        response.json(series);
      });
  });

router.route('/series/:serie_id')
  .get(
    function(request, response){
      Serie.findById(request.params.serie_id, function(error, serie){
        if(serie == null)
          response.status(404).json({message: "Not Found"});
        else if(error)
          response.send(error);
        else
          response.json(serie);
      });
    })

  .put(
    function(request, response){
      Serie.findById(request.params.serie_id, function(error, serie){
        if(serie == null)
          response.status(404).json({message: "Not Found"});
        else if(error)
          response.send(error);
        else {
          var serie = new Serie();
          serie.name = request.body.name;
          serie.year = request.body.year;
          serie.season = request.body.season;
          serie.genre = request.body.genre;

          serie.save(
            function(error){
              if(error)
                response.status(404).send(error);
              else {
                response.status(204).send();
              }
          });

        }
      });
    })

  .delete(
    function(request, response){
      Serie.remove({
        _id: request.params.serie_id
      }, function(error){
        if(error)
          response.status(404).json({message: "Not Found"});
        else {
          response.status(204).send();
        }


      });
    });

api.use('/api', router);

api.listen(port);
console.log('Starting API on port ' + port);
