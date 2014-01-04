'use strict';

var gulp = require('gulp')
  , assert = require('assert')
  , es = require('event-stream')
  , fs = require('fs')
  , ttf2eot = require(__dirname + '/../src/index.js')
;

// Erasing date to get an invariant created and modified font date
// See: https://github.com/fontello/ttf2eot/blob/c6de4bd45d50afc6217e150dbc69f1cd3280f8fe/lib/sfnt.js#L19
Date = (function(d) {
  function Date() {
    d.call(this, 3600);
  }
  Date.now = d.now;
  return Date;
})(Date);

describe('gulp-ttf2eot conversion', function() {
  var filename = __dirname + '/fixtures/iconsfont';
  var eot = fs.readFileSync(filename + '.eot');

  it('should work in buffer mode', function(done) {

      gulp.src(filename + '.ttf')
        .pipe(ttf2eot())
        // Uncomment to regenerate the test files if changes in the ttf2eot lib
        // .pipe(gulp.dest(__dirname + '/fixtures/'))
        .pipe(es.map(function(file) {
          assert.equal(file.contents.length, eot.length);
          assert.equal(file.contents.toString('utf-8'), eot.toString('utf-8'));
          done();
        }));

  });

  it('should work in stream mode', function(done) {

      gulp.src(filename + '.ttf', {buffer: false})
        .pipe(ttf2eot())
        .pipe(es.map(function(file) {
          // Get the buffer to compare results
          file.contents.pipe(es.wait(function(err, data) {
            assert.equal(data.length, eot.toString('utf-8').length);
            assert.equal(data, eot.toString('utf-8'));
            done();
          }));
        }));

  });

});
