'use strict'
/**
 * LobbyController
 *
 * @description :: Server-side logic for managing lobbies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `LobbyController.join()`
   */
  join: function (req, res) {
		console.log(req.body);
		Ticket.create(req.body)
			.then((ticket) => {
				console.log(ticket);
	    	return res.json(ticket.toJSON());
			})
			.catch((err) => {
				return res.json(err);
			});
  }
};
