
import express from 'express';
const app        = express();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Bear from './../model/bear.js';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;


const router = express.Router();

mongoose.connection.openUri('mongodb://localhost/bear');

router.use((req, res, next) => {
  console.log('Something is happening.');
  next();
});

router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bear').post(({body}, res) => {
  let bear = new Bear();
  bear.name = body.name;
  bear.save(err => {
    if (err)
      res.send(err);

    res.json({message: 'Bear created!'});
  });
})
  .get((req, res) => {
    Bear.find((err, bears) => {
      if (err)
        res.send(err);

      res.json(bears);
    });
  });

router.route('/bear/:bear_id').get(({params}, res) => {
  Bear.findById(params.bear_id, (err, bear) => {
    if (err)
      res.send(err);
    res.json(bear);
  });
})
  .put(({params, body}, res) => {
    Bear.findById(params.bear_id, (err, bear) => {
      if (err)
        res.send(err);
      bear.name = body.name;
      bear.save(err => {
        if (err)
          res.send(err);
        res.json({message: 'Bear updated!'});
      });
    });
  })
  .delete(({params}, res) => {
    Bear.remove({
      _id: params.bear_id
    }, (err, bear) => {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

app.use('/api', router);

app.listen(port);
console.log(`Magic happens on port ${port}`);
