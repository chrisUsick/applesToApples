chai = require 'chai'
P = require 'bluebird'
chai.should()
describe 'GameModel', ->
  game = null;
  before (done) ->
    P.all [Ticket.destroy(), Game.destroy()]
      .then ->
        Game.create().populate('tickets')
      .then (newGame) ->
        game = newGame
        done()
  describe 'tickets relationship', ->
    it 'should add associated tickets', (done) ->
      tickets = yield Ticket.create(
        [{name: 'chris'},
        {name: 'kimbo'}])
      for ticket in tickets
        game.tickets.add ticket

      yield game.save()
      newGame = yield Game.findOne(id: game.id).populate 'tickets'
      newGame.tickets.should.have.length 2
      newGame.tickets[0].name.should.equal 'chris'
      done()

  describe '#getTickets', ->
    it 'populates the `tickets` property', (done) ->
      Game.findOne(id: game.id)
        .then (game) ->
          game.tickets.should.have.length 0
          [game, game.getTickets()]
        .spread (game, tickets) ->
          game.should.have.property('tickets').with.length 2
          done()
  describe '#register', ->
    it 'registers a ticket', (done) ->
      throw new Error("not tested")
