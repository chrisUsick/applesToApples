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
		console.log(this);
		return res.json(this);
	},
	createTicket: (req, res) => {
		let data = req.body;
		data.sessionId = req.socket.id;
		Ticket.create(data)
			.then((ticket) => {
				Ticket.publishCreate(ticket.toJSON());
				console.log('ticket created: ', ticket.id, ticket.sessionId);
				return res.json(ticket.toJSON());
			})
			.catch((err) => {
				return res.json(err);
			})
	}
};
