var Q, Sipgate, errorLogger, sg, successLogger, user, util;

Sipgate = require('./lib/sipgate.js');

util = require('util');

Q = require('q');

successLogger = function(res) {
  return console.log(util.inspect(res, {
    colors: true,
    depth: null
  }));
};

errorLogger = function(reason) {
  return console.error(new Error(reason));
};

user = require('./config');

new Sipgate(user, function(sipgate) {
  return sipgate.ownUriListGet().then(successLogger, errorLogger);
});

sg = new Sipgate(user);

sg.on('ready', function(sipgate) {
  console.log("Sipgate API ready!");
  sipgate.sessionInitiate({
    LocalUri: 'sip:5555555e0@sipgate.de',
    RemoteUri: 'sip:490311123123@sipgate.de'
  }).delay(1000).then(function(sessionId) {
    console.log("Initiated Call with SessionID '" + sessionId + "'");
    return sipgate.sessionStatusGet(sessionId);
  }).then(successLogger, errorLogger);
  return sipgate.phonebookListGet().then(function(results) {
    var entryIds;
    entryIds = results.map(function(result) {
      return result.EntryID;
    });
    return sipgate.phonebookEntryGet(entryIds).then(successLogger, errorLogger);
  });
});

// ---
// generated by coffee-script 1.9.2