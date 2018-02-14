// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 3000;
// app.use('/',express.static(path.join(__dirname)));
// app.listen(port,()=>console.log("Served on " + port));
var express    = require('express');
var app        = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Bear = require('./bear.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


var router = express.Router();

mongoose.connection.openUri('mongodb://localhost/bear');

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bear').post(function(req, res) {
  var bear = new Bear();
  bear.name = req.body.name;
  bear.save(function(err) {
    if (err)
      res.send(err);

    res.json({message: 'Bear created!'});
  });
})
  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if (err)
        res.send(err);

      res.json(bears);
    });
  });

router.route('/bear/:bear_id').get(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear){
    if (err)
      res.send(err);
    res.json(bear);
  });
})
  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err)
        res.send(err);
      bear.name = req.body.name;
      bear.save(function(err) {
        if (err)
          res.send(err);
        res.json({message: 'Bear updated!'});
      });
    });
  });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
