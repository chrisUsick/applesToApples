chai = require 'chai'
P = require 'bluebird'
chai.should()

describe 'GameManager', ->
  describe '#createGame()', ->
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
