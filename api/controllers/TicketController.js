'use strict';
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
	createTicket: (req, res) => {
		let data = req.body;
		if (req.isSocket) {
			data.socketId = req.socket.id;
			Ticket.create(data)
				.then((ticket) => {
					if (sails.config.environment != 'testing') {
						Ticket.publishCreate(ticket.toJSON());
					}
					req.session.ticket = ticket.toObject();
					// req.session.save();

					console.log('ticket created', ticket.id);
					return res.json(ticket.toJSON());
				})
				.catch((err) => {
					return res.json(err);
				})
		} else {
			return res.json({
				"error":"Can't create sessions from HTTP"
			});
		}

	},

	myTicket: (req, res) => {
		// console.log('from my ticket', req.session);
		return res.json(req.session.ticket);
	}
};
