request = require 'supertest'

describe 'TicketController', ->
  describe 'POST /ticket basic', ->
    it 'prevents HTTP create', (done) ->
      agent = request.agent sails.hooks.http.app
      agent
        .post('/ticket')
        .send({name:'foo'})
        .end (err, res) ->
          res.body.should.have.property 'error'
          done()

    # can't use test the websockets
    it 'should add ticket to the session variable', (done) ->
      io = sails.io
      io.socket.post '/ticket', {name:'bob'}, (body, JWR) ->
        # console.log body
        io.socket.get '/ticket/myTicket', (body, JWR) ->
          body.should.have.property 'id'
          body.name.should.equal 'bob'
          done()

  describe 'POST /ticket when creating new game', ->
    createTicket3 = (io, cb) ->
      io.socket.post '/ticket', {name:'chris'}, (ticket) ->
        cb ticket

    beforeEach (done) ->
      Ticket.destroy {}
        .then ->
          Ticket.create [{name:'bob'}, {name:'kimbo'}]
            .then ->
              done()

    it 'should create a ticket with a gameId when enough tickets exist', (done) ->
      io = sails.io
      createTicket3 io, (ticket) ->
        ticket.should.have.property 'gameId'
        done()

    it 'should create a game', (done) ->
      io = sails.io
      createTicket3 io, (ticket) ->
        Game.findOne id: ticket.gameId
          .then (game) ->
            game.should.have.property 'id'
            done()
