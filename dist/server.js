'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bear = require('./../model/bear.js');

var _bear2 = _interopRequireDefault(_bear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

var port = process.env.PORT || 8080;

var router = _express2.default.Router();

_mongoose2.default.connection.openUri('mongodb://localhost/bear');

router.use(function (req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bear').post(function (_ref, res) {
  var body = _ref.body;

  var bear = new _bear2.default();
  bear.name = body.name;
  bear.save(function (err) {
    if (err) res.send(err);

    res.json({ message: 'Bear created!' });
  });
}).get(function (req, res) {
  _bear2.default.find(function (err, bears) {
    if (err) res.send(err);

    res.json(bears);
  });
});

router.route('/bear/:bear_id').get(function (_ref2, res) {
  var params = _ref2.params;

  _bear2.default.findById(params.bear_id, function (err, bear) {
    if (err) res.send(err);
    res.json(bear);
  });
}).put(function (_ref3, res) {
  var params = _ref3.params,
      body = _ref3.body;

  _bear2.default.findById(params.bear_id, function (err, bear) {
    if (err) res.send(err);
    bear.name = body.name;
    bear.save(function (err) {
      if (err) res.send(err);
      res.json({ message: 'Bear updated!' });
    });
  });
}).delete(function (_ref4, res) {
  var params = _ref4.params;

  _bear2.default.remove({
    _id: params.bear_id
  }, function (err, bear) {
    if (err) res.send(err);

    res.json({ message: 'Successfully deleted' });
  });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);