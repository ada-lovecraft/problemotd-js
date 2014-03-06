'use strict';
var fs = require('fs'),
  readline = require('readline'),
  stream = require('stream'),
  EventEmitter = require('events').EventEmitter;

var CHAR_CODE_INDEX_ZERO = 65,
  mainKey  = 'REDDIT',
  mainMessage = 'TODAYISMYBIRTHDAY',
  vigenere = 'ZEJFOKHTMSRMELCPODWHCGAW',
  decode = 'DAY',
  counter = 0,
  matchCounter = 0,
  ee = new EventEmitter();

function createModKey(k, m) {
  var modKey = '',
    i;
  for(i = 0; i < m.length; i++) {
    modKey += k[i % k.length];
  }
  return modKey;
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

function getKeys() {
  var instream = fs.createReadStream('dictionary.txt');
  var outstream = new stream;
  var keys = []
  outstream.readable = true;
  outstream.writable = true;


  var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
  });

  rl.on('line', function(line) {
      keys.push(line.toUpperCase());
  });

  rl.on('close', function() {
    ee.emit('keysAcquired', keys);
  });
}



function crackCypher(c, maxKeyLength) {
  var cyphers = [], matches = [], cracks = '';
  getKeys(5);
  console.log('cracking:', vigenere);
  ee.on('keysAcquired', function(keys) {
    keys.forEach(function(key) {
      if(key.length <= maxKeyLength) {
        cyphers.push({key: key, msg: decypherMessage(key, c), matches: 0});
      }
    });
    cyphers.forEach(function(cypherObj) {
      process.stdout.write(counter + '/' + cyphers.length + '\r');
      counter++;
      keys.forEach(function(key) {
        if(key.length >= maxKeyLength && cypherObj.msg.indexOf(key) !== -1) {
          cypherObj.matches++;
          
        }
      });
    });

    cyphers.sort(function(a,b) { 
      return a.matches - b.matches; 
    });
    cyphers.reverse();
    var possibilities = cyphers.slice(0,24);
    console.log('Top 25 Possibilities:');
    possibilities.forEach(function(p) {
      console.log(p.key,p.msg,p.matches);
    });
    cyphers.forEach(function(cypher) {
      cracks += cypher.key + ' : ' + cypher.msg + ' : ' + cypher.matches + '\n';
    });



    fs.writeFile("cracked.txt", cracks, function(err) {
      if(err)
        throw(err);
      else
        console.log('all cracks written to cracked.txt.');
    });
  });
}
var encoded = encodeMessage(mainKey, mainMessage);
console.log('key:\t\t\t', mainKey);
console.log('original message:\t', mainMessage);
console.log('encoded message:\t', encoded);
console.log('decyphered message:\t', decypherMessage(mainKey, encoded));
crackCypher(vigenere, 5);

