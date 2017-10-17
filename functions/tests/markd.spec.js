
const chai = require('chai');
const chttp = require('chai-http');
const server = require('../lib/express').listen(3000);

const should = chai.should();
const expect = chai.expect;

chai.use(chttp);

describe('Markdown parser endpoint.', function () {
  describe('GET: request method response', function () {
    it('Should respond with a status and message', function (done) {
      chai.request(server)
        .get('/m')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('{"status":200,"message":"This endpoint does not have a GET method."}');
          done();
        });
    });
  });

  describe('POST: request method response', function () {
    it('Should validate the submitted content', function (done) {
      chai.request(server).post('/m')
        .set('Content-Type', 'application/json')
        .send({ content: '# Hello World!' })
        .end((err, res) => {
          const actual = { status: 400, message: 'Invalid syntax, try: {"markdown": "markdown string goes here"}' };
          expect(res.statusCode).to.equal(400);
          expect(res.text).to.equal(JSON.stringify(actual))
          done();
        });
    });

    it('Should respond with a parsed content', function (done) {
      const actual = {
        markdown: "# Hello World!",
        output: "<h1 id=\"hello-world-\">Hello World!</h1>\n"
      };

      chai.request(server).post('/m')
        .set('Content-Type', 'application/json')
        .send(actual)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal(JSON.stringify(actual))
          done();
        });
    });
  });
});
