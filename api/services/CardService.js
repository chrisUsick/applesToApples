'use strict';
var P = require('bluebird');
var co = P.coroutine;
module.exports = class CardService {
  constructor(gameId) {
    this.gameId = gameId;
    this.RED = 'redCards';
    this.GREEN = 'greenCards';
  }

  redKey (color) {
    return `${this.RED}:${this.gameId}`;
  }

  greenKey (color) {
    return `${this.GREEN}:${this.gameId}`;
  }

  initializeGame () {
    return P.all([
      Redis.sunionstore(this.redKey(), this.RED),
      Redis.sunionstore(this.greenKey(), this.GREEN)
    ]);
  }

  getRedCards (count) {
    // return co(function* () {
    // })();
    return this._getCards(this.redKey(), count);
  }

  _getCards (key, count) {
    let self = this;
    let func = co(function* () {
      let cardCount = yield Redis.scardAsync(key);
      if (cardCount < count) {
        yield this.initializeGame();
      }
      let cards = yield Redis.srandmemberAsync(key, count);
      for (let card of cards) {
        yield Redis.sremAsync(key, card);
      }

      return cards.map((c) => JSON.parse(c));
    });
    return func.bind(this)();
  }
}
