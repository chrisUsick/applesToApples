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
    judge: {
      type:'json'
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
      this.hasTickets = true
      return this.tickets;
    }),

    getJudge: P.coroutine(function* () {
      if (!this.hasTickets) {
        yield this.getTickets();
      }

      if (!this.judge) {
        yield this.setJudge(this.tickets[0]);
      }
      return this.judge;
    }),

    setJudge: P.coroutine(function* (ticket) {
      this.judge = ticket;
      return this.save();
    })

    // dealRedCards: P.coroutine(function* (ticket) {
    //   let cardService = new CardService(this.id);
    //   cards = yield cardService.dealRedCards(7);
    //   for (card of cards) {
    //     ticket.cards.add(card);
    //   }
    //   yield ticket.save();
    //   Ticket.publishUpdate(ticket.id, {cards:cards});
    // })
  }
};
