var express = require('express');
var api = express();
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var HttpStatus = require('http-status-codes');

var Serie = require('../api-node/models/serie');
var serie = new Serie();

mongoose.connect('mongodb://root:12345678@jello.modulusmongo.net:27017/Hira2hyp');

api.use(body_parser.urlencoded({extend: true}));
api.use(body_parser.json());

var port = process.env.PORT || 2000;

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
  .post(
    function(request, response){

      serie.name = request.body.name;
      serie.year = request.body.year;
      serie.season = request.body.season;
      serie.genre = request.body.genre

      if(serie.name == null || serie.year == null || serie.season == null || serie.genre == null)
        response.status(400).json({ message: 'Missing required property: name/year/season or genre'});
      else {
        serie.save(
          function(error){
            if(error)
              response.send(error);
            else {
              response.status(201).json({ message: 'Serie was created'});
            }
          });
      }

      })

    .get(
      function(request, response){
        Serie.find(
          function(err, series){
            if(err)
              response.send(err);
            response.json(series)
        });
      });

// router.route('/series/:nome')
//   .get(
//     function(request, response){
//       Serie.findOne({nome: request.params.nome}, function(error, serie){
//         if(error)
//           response.send(error)
//
//         response.json(serie);
//       });
//     })

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
          serie.nome = request.body.nome;
          serie.ano = request.body.ano;
          serie.temporadas = request.body.temporadas;
          serie.genero = request.body.genero;

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
