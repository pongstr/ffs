const express    = require('express');
const bodyParser = require('body-parser');
const markdown = require('./markd');
const nodesass = require('./sass');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.format({
  'application/json': () => res.send('Dashboard tools up and running.')
}));
app.use('/m', markdown());
app.use('/s', nodesass());
module.exports = app;
