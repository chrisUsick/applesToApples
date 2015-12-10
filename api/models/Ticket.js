'use strict';
/**
* Ticket.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection:'localDiskDb',
  attributes: {

    name : {
      type: 'string'
      , unique:true
    },
    sessionId : {
      type: 'string'
    },
    toJSON: function () {
      let obj = this.toObject();
      delete obj.sessionId;
      return obj;
    }
  }
};
