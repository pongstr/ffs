const express = require('express');
const sass = require('node-sass');

module.exports = () => {
  const router = express.Router();

  function sparser(context, opts) {
    const options = Object.assign({}, opts);
    return new Promise((resolve, reject) => {
      sass.render(Object.assign({ data: context }, options), (err, data) => {
        (!err)
          ? resolve({ source: context, output: data.css.toString() })
          : reject(err);
      });
    });
  }

  function isString(req, res, next) {
    (req.body && typeof req.body === 'string')
      ? sparser(req.body)
        .then(data => res.format({ 'application/json': () => res.send(data) }))
        .catch(err => res.format({ 'application/json': () => res.send(err) }))
      : next();
  }

  function isObject(req, res, next) {
    if (req.body && req.body.toString() === '[object Object]') {
      if (Object.prototype.hasOwnProperty.call(req.body, 'sass')) {
        sparser(req.body.sass)
          .then((data) => {
            res.format({ 'application/json': () => {
              res.status(200);
              res.send(data);
            }});
          })
          .catch(err => res.format({ 'application/json': () => res.send(err) }))
      } else {
        const error = {
          status: 400,
          message: 'Invalid syntax, try: {"sass": "sass/scss string goes here"}'
        };
        res.status(400);
        res.format({ 'application/json':  () => res.send(error) });
      }
    }
  }

  function isError(req, res, next) {
    res.send({ status: 400, message: 'Bad Request.'})
  }

  router.route('/')
    .get((req, res) => res.format({ 'application/json': () => res.send({
        status: 200,
        message: 'This endpoint does not have a GET method.'
      })
    }))
    .post([ isString, isObject, isError ]);

  return router;
};
