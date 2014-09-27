var kwestGzip = require('..'),
    Promise   = require('bluebird'),
    kwest     = require('kwest-base'),
    zlib      = require('zlib'),
    caseless  = require('caseless'),
    assert    = require('chai').assert;

describe('kwest-gzip', function () {

  function mockResponse(response) {
    response.headers = response.headers || {};
    caseless.httpify(response, response.headers);
    return Promise.resolve(response);
  }

  it('no gzip', function (done) {

    var gzipRequest = kwest(function (request) {
      assert.strictEqual(request.getHeader('accept-encoding'), 'gzip');
      return mockResponse({
        body: 'hello'
      });
    }).use(kwestGzip());

    gzipRequest('http://www.example.com')
      .then(function (res) {
        assert.deepPropertyVal(res, 'body', 'hello');
        done();
      })
      .catch(done);

  });

  it('with gzip', function (done) {

    zlib.gzip(new Buffer('hello'), function (err, gzipped) {
      if (err) {
        return done(err);
      }

      var gzipRequest = kwest(function (request) {
        return mockResponse({
          body: gzipped,
          headers: {
            'content-encoding': 'gzip'
          }
        });
      }).use(kwestGzip());

      gzipRequest('http://www.example.com')
        .then(function (res) {
          var body = String(res.body);
          assert.strictEqual(body, 'hello');
          done();
        })
        .catch(done);

    });

  });

  it('faulty gzip', function (done) {

    var gzipRequest = kwest(function (request) {
      return mockResponse({
        body: 'hello',
        headers: {
          'content-encoding': 'gzip'
        }
      });
    }).use(kwestGzip());

    gzipRequest('http://www.example.com')
      .then(function (res) {
        done(new Error('should fail'));
      })
      .catch(kwestGzip.GzipError, function (err) {
        done();
      })
      .catch(done);

  });




});
