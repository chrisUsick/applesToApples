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
        count = yield Redis.scardAsync cardService.redKey()
        expect(count).to.be.above 9
        done()
      )()
      return undefined
  # describe '#getRedCards', ->
  #   it 'should return a list of cards'
  #   it 'should add cards to used cards set'
  describe '#_getCards', ->
    cardService = null
    cards = null
    before (done) ->
      (P.coroutine ->
        cardService = new CardService game.id
        cards = yield cardService._getCards cardService.redKey(), 3
        done()
      )()
    it 'should return n cards', ->
      cards.should.have.length 3

    it 'should deserialize the cards',  ->
      cards[0].should.have.property 'word'
      cards[0].should.have.property 'description'
      cards[0].should.have.property 'type'
    it 'should reset the deck if not enough cards are left', (done) ->
      (P.coroutine ->
        count = yield Redis.scardAsync cardService.redKey()
        cards = yield cardService._getCards cardService.redKey(), count + 1
        cards.should.have.length count + 1
        done()
      )()
