'use strict';
/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var P = require('bluebird');
var _ = require('lodash');

module.exports = {

  attributes: {
    tickets: {
      collection:'ticket',
      via:'gameId'
    },
    registeredTickets: {
      type:'array'
    },
    register: P.coroutine(function* (ticket) {
      if (this.tickets.length == 0) {
        yield this.getTickets();
      }
      let foundTicket = _.find(this.tickets, {id:ticket.id});
      if (foundTicket) {
        this.registeredTickets.push(foundTicket.id);
      }
      return foundTicket;
    }),

    getTickets: P.coroutine(function* () {
      this.tickets = (yield Game.findOne({id:this.id}).populate('tickets')).tickets;
      return this.tickets;
    })
  }
};
