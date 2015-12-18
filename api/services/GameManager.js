'use strict';
var P = require('bluebird');
module.exports = {
  createGame: P.coroutine(function* (tickets){
    let game = yield Game.create().populate('tickets');
     tickets.forEach(ticket => {
      game.tickets.add(ticket);
    });
    yield game.save();
    let cardService = new CardService(game.id);
    yield cardService.initializeGame()
    return yield Game.findOne({id:game.id}).populate('tickets');
  })
}
