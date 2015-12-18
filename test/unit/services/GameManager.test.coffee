chai = require 'chai'
P = require 'bluebird'
chai.should()

describe 'GameManager', ->
  describe '#createGame()', ->
    game = null
    before (done) ->
      P.all [Ticket.destroy(), Game.destroy()]
        .then ->
          done()
    it 'should add tickets', (done) ->
      tickets = yield Ticket.create(
          [{name: 'chris'},
          {name: 'kimbo'}])

      game = yield GameManager.createGame tickets
      game.tickets.should.have.length 2
      done()

    it 'should initialize the Game', (done) ->
      (P.coroutine ->
        cardService = new CardService game.id
        count = yield Redis.scardAsync cardService.redKey()
        count.should.be.above 9
        done()
      )()
      return undefined
