chai = require 'chai'
P = require 'bluebird'
{expect} = chai
chai.should()
describe 'CardService', ->
  game = null;
  before (done) ->
    P.all [Ticket.destroy(), Game.destroy()]
      .then ->
        Game.create()
      .then (createdGame) ->
        game = createdGame
        done()
      #   Ticket.create(
      #     [{name: 'chris'},
      #     {name: 'kimbo'}])
      # .then (tickets) ->
      #   GameManager.createGame tickets
      # .then (createdGame) ->
      #   game = createdGame
      #   done()
  describe '#initializeGame', ->
    it 'create a set of red cards and green cards for the game', (done) ->
      (P.coroutine ->
        cardService = new CardService(game.id);
        yield cardService.initializeGame()
        count = yield Redis.scard cardService.redKey()
        expect(count).to.be.greater.than 9
      )()
      return undefined
  describe '#getRedCards', ->
    it 'should return a list of cards'
    it 'should add cards to used cards set'
