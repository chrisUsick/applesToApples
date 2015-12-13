chai = require 'chai'
P = require 'bluebird'
chai.should()
describe 'GameModel', ->
  describe 'tickets relationship', ->
    before (done) ->
      P.all [Ticket.destroy(), Game.destroy()]
        .then ->
          done()
    it 'should add associated tickets', (done) ->
        game = yield Game.create().populate('tickets')
        tickets = yield Ticket.create(
          [{name: 'chris'},
          {name: 'kimbo'}])
        c = 0
        for ticket in tickets
          console.log 'count:', c++
          game.tickets.add ticket

        yield game.save()
        newGame = yield Game.findOne(id: game.id).populate 'tickets'
        newGame.tickets.should.have.length 2
        newGame.tickets[0].name.should.equal 'chris'
        done()
        # game.save ->
        #   console.log 'in save cb'
        #   newGame = yield Game.findOne(id: game.id).populate 'tickets'
        #   console.log newGame.tickets
        #   newGame.tickets.should.have.length 3
        #   newGame.tickets[0].name.should.equal 'chris'
        #   done()
