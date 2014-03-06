'use strict';

var CHAR_CODE_INDEX_ZERO = 65,
key  = 'REDDIT',
message = 'TODAYISMYBIRTHDAY';

function createModKey(k, m) {
  var modKey = '', 
    i;
  for(i = 0; i < m.length; i++) {
    modKey += k[i % k.length];
  }
  return modKey
}

function encodeMessage(k, m) {
  var modKey, i,
    cypher = '';
  
  modKey = createModKey(k,m);

  for(i = 0; i < m.length; i++) {
    var keyCode = modKey.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var messageCode = m.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var cypherCode = (keyCode + messageCode) % 26;
    cypher += String.fromCharCode(cypherCode + CHAR_CODE_INDEX_ZERO);
  }
  return cypher;
}


function decypherMessage(k, c) {
  var modKey, 
    message = '', 
    i;

  modKey = createModKey(k,c);
  for(i = 0; i < c.length; i++) {
    var cypherCode = c.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var keyCode = modKey.charCodeAt(i) - CHAR_CODE_INDEX_ZERO;
    var messageCode = (cypherCode - keyCode);
    if(messageCode < 0) {
      messageCode += 26;
    } 
    message += String.fromCharCode(messageCode+ CHAR_CODE_INDEX_ZERO);
  }
  return message;
}
var encoded = encodeMessage(key, message);
console.log('key:\t\t\t', key);
console.log('original message:\t', message);
console.log('encoded message:\t', encoded);
console.log('decyphered message:\t', decypherMessage(key, encoded));