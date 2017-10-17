const express = require('express');
const marked = require('marked');
const highlight = require('highlight.js');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: (code) => highlight.highlightAuto(code).value
});

module.exports = () => {
  const router = express.Router();

  function mparser(context) {
    return new Promise((resolve, reject) => {
      marked(context, (err, content) => (!err)
        ? resolve({ markdown: context, output: content })
        : reject(err));
    });
  }

  function isString(req, res, next) {
    (req.body && typeof req.body === 'string')
      ? mparser(req.body)
        .then(data => res.format({ 'application/json': () => res.send(data) }))
        .catch(err => res.format({ 'application/json': () => res.send(err) }))
      : next();
  }

  function isObject(req, res, next) {
    if (req.body && req.body.toString() === '[object Object]') {
      if (Object.prototype.hasOwnProperty.call(req.body, 'markdown')) {
        mparser(req.body.markdown)
          .then((data) => {
            res.status(200);
            res.format({ 'application/json': () => res.send(data) });
          })
          .catch(err => res.format({ 'application/json': () => res.send(err) }))
      } else {
        const error = {
          status: 400,
          message: 'Invalid syntax, try: {"markdown": "markdown string goes here"}'
        };

        res.status(400);
        res.format({ 'application/json':  () => res.send(error) });
      }
    }

    next();
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
    .post([ isString, isObject ])

  return router;
};
