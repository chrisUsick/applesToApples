var Sails = require('sails'),
  sails, io;
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  io = sailsIOClient(socketIOClient);
  io.sails.url = 'http://localhost:1337';

  Sails.lift({
    // configuration for testing purposes
  }, function(err, server) {
    sails = server;
    sails.config.environment = 'testing';
    sails.config.gameSize = 3;
    sails.io = io;
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
