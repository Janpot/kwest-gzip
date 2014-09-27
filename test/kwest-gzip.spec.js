var kwestGzip = require('..'),
    Promise   = require('bluebird'),
    kwest     = require('kwest-base'),
    zlib      = require('zlib'),
    assert    = require('chai').assert;

describe('kwest-gzip', function () {

  it('no gzip', function (done) {

    var kwestMock = kwest.wrap(function (request, next) {
      assert.ok(request.headers.has('accept-encoding'));
      return Promise.resolve({
        body: 'hello',
        headers: {}
      });
    });

    var gzip = kwestMock.wrap(kwestGzip());
    gzip('http://www.example.com')
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

      var kwestMock = kwest.wrap(function (request, next) {
        assert.ok(request.headers.has('accept-encoding'));
        return Promise.resolve({
          body: gzipped,
          headers: {
            'content-encoding': 'gzip'
          }
        });
      });

      var gzip = kwestMock.wrap(kwestGzip());
      gzip('http://www.example.com')
        .then(function (res) {
          var body = String(res.body);
          assert.strictEqual(body, 'hello');
          done();
        })
        .catch(done);

    });

  });

  it('faulty gzip', function (done) {

    var kwestMock = kwest.wrap(function (request, next) {
      assert.ok(request.headers.has('accept-encoding'));
      return Promise.resolve({
        body: 'hello',
        headers: {
          'content-encoding': 'gzip'
        }
      });
    });

    var gzip = kwestMock.wrap(kwestGzip());
    gzip('http://www.example.com')
      .then(function (res) {
        done(new Error('should fail'));
      })
      .catch(kwestGzip.GzipError, function (err) {
        done();
      })
      .catch(done);

  });




});
