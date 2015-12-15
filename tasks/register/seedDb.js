'use strict';
var P = require('bluebird');
var Redis = require('../../api/services/Redis');
var redCards = require('./redCards');
var greenCards= require('./greenCards');
module.exports = function (grunt){
  grunt.registerTask('seedDb', () => {
    // console.log(Redis);
    let task = grunt.task.current;
    let done = task.async();
    Redis.incrAsync('fooTest')
      .then((i) => {
        grunt.log.writeln(`fooTest is ${i}`);
      })

    P.all([
      insertCards('greenCards', greenCards),
      insertCards('redCards', redCards)
    ])
      .then(() => {
        return Redis.smembersAsync('redCards');
      })
      .then((cards) => {
        console.log(cards);
        done();
      });
  });
};

function insertCards(key, cards) {
  let ps = [];
  for (var card of cards) {
    ps.push(Redis.saddAsync(key, JSON.stringify(card)));
  }
  return P.all(ps);
}
