# kwest-gzip

gzip plugin for the [kwest](https://github.com/Janpot/kwest) module

## Installation

    $ npm install --save kwest-gzip

## Use

enable gzip for quest
```js
var kwestGzip = require('kwest-gzip'),
    kwest = require('kwest'),
    request = kwestGzip(kwest);

// requests with "accept-encoding: gzip" header
request('http://www.example.com/gzipped')
  .then(function (res) {
    // logs gunzipped body
    console.log(res.body);
  })
