chai = require 'chai'
P = require 'bluebird'
chai.should()
expect = chai.expect
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
    it "doesn't register a ticket that is not part of the game", (done) ->
      run = P.coroutine ->
        # create ticket
        newTicket = yield Ticket.create name:'not in game'
        registered = yield game.register(newTicket)
        expect(registered).to.be.undefined
        done()

      run()
      return undefined



  describe '#getJudge', ->
    it 'sets the judge when it is undefined', (done) ->
      run = P.coroutine ->
        game.should.not.have.property 'judge'
        judge = yield game.getJudge()
        judge.should.not.be.undefined
        done()

      run()
      return undefined

    it 'returns the judge once it has been set', (done) ->
      run = P.coroutine ->
        judge = yield game.getJudge()
        judge.name.should.equal 'chris'
        done()

      run()
      return undefined

  describe '#setJudge', ->
    it 'gets a judge from tickets', (done) ->
      run = P.coroutine ->
        yield game.getTickets()
        yield game.setJudge(game.tickets[0])
        judge = yield game.getJudge()
        judge.name.should.equal 'chris'
        done()

      run()
      return undefined

    it 'persists the changes to the db', (done) ->
      (P.coroutine ->
        gameLookup = yield Game.findOne(id:game.id)
        game.judge.name.should.equal 'chris'
        done()
      )()
      return undefined

  describe '#dealRedCards', ->
    it 'should deal red cards to a ticket'

  describe '#initializeGame', ->
    it 'sets the judge'
    it 'deals red cards'
    it 'sets the green card'
