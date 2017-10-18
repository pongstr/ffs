const chai = require('chai');
const chttp = require('chai-http');
const server = require('../lib/express').listen(3001);

const should = chai.should();
const expect = chai.expect;

chai.use(chttp);

describe('Sass parser endpoint.', function () {
  describe('GET: request method response', function () {
    it('Should respond with a status and message', function (done) {
      chai.request(server)
        .get('/s')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('{"status":200,"message":"This endpoint does not have a GET method."}');
          done();
        });
    });
  });

  describe('POST: request method response', function () {
    it('Should validate the submitted content', function (done) {
      chai.request(server).post('/s')
        .set('Content-Type', 'application/json')
        .send({ content: '$color: #000;\n\nbody { color: $color; }' })
        .end((err, res) => {
          const actual = { status: 400, message: 'Invalid syntax, try: {"sass": "sass/scss string goes here"}' };
          expect(res.statusCode).to.equal(400);
          expect(res.text).to.equal(JSON.stringify(actual))
          done();
        });
    });

    it('Should respond with a parsed content', function (done) {
      const actual = {
        sass: "$color: #ddd;\n\n.text {\n  color: $color;\n}",
        output: ".text {\n  color: #ddd; }\n"
      };

      chai.request(server).post('/s')
        .set('Content-Type', 'application/json')
        .send({ sass: actual.sass })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal(JSON.stringify({ source: actual.sass, output: actual.output }))
          done();
        });
    });
  });

});
