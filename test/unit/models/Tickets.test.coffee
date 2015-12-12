chai = require 'chai'
chai.should()
describe 'TicketModel', ->
  describe '#toJSON()', ->
    it 'should hide the session ID', (done) ->
      Ticket.create({name: 'someticket13614', socketId:'bar'})
        .then (ticket) ->
          ticket.should.have.property 'id'
          ticket.should.have.property 'socketId'
          json = ticket.toJSON()
          json.should.not.have.property 'socketId'
          done()
