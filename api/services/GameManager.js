'use strict';
var P = require('bluebird');
module.exports = {
  createGame: P.coroutine(function* (tickets){
    let game = yield Game.create().populate('tickets');
     tickets.forEach(ticket => {
      game.tickets.add(ticket);
    });
    yield game.save();
    return yield Game.findOne({id:game.id}).populate('tickets');
  })
}
