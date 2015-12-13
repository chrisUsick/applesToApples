'use strict';
var P = require('bluebird');
var _ = require('lodash');
/**
 * TicketControllerController
 *
 * @description :: Server-side logic for managing Ticketcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	hi:(req, res) => {
		'use strict';
		return res.json({hello:'world'});
	},
	hiPost: (req, res) => {
		return res.json({hello:req.body.value});
	},
	createTicket: P.coroutine(function* (req, res) {
		let data = req.body;
		if (req.isSocket) {
			try {
				data.socketId = req.socket.id;
				let ticket;
				ticket = yield Ticket.create(data);

				// req.session.save();
				let count = yield Ticket.count({gameId:null});
				console.log('ticket created', ticket.id, 'total: ', count);
				if (count >= 3) {
					let game = yield Game.create();
					let newTickets = yield Ticket.update({gameId:null}, {gameId:game.id});
					ticket = _.find(newTickets, {id:ticket.id});
				}
				if (sails.config.environment != 'testing') {
					Ticket.publishCreate(ticket.toJSON());
				}
				req.session.ticket = ticket.toObject();
				return res.json(ticket.toJSON());
			} catch (e) {
				console.log('error creating ticket', e);
				return res.json(e);
			}
		} else {
			return res.json({
				"error":"Can't create sessions from HTTP"
			});
		}

	}),

	myTicket: (req, res) => {
		// console.log('from my ticket', req.session);
		return res.json(req.session.ticket);
	}
};
