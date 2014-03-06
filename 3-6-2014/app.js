'use strict';

var CHAR_CODE_INDEX_ZERO = 65,
key  = 'REDDIT',
message = 'TODAYISMYBIRTHDAY',
encodeMessage;

encodeMessage = function(k, m) {
  var modKey = '',
    cypher = '',
    i;

  for(i = 0; i < m.length; i++) {
    modKey += k[i % k.length];
  }

  for(i = 0; i < m.length; i++) {
    var keyCode = modKey.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var messageCode = m.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var cypherCode = (keyCode + messageCode) % 26;
    cypher += String.fromCharCode(cypherCode + CHAR_CODE_INDEX_ZERO);
  }
  return cypher;
};

console.log('cypher: ', encodeMessage(key, message));