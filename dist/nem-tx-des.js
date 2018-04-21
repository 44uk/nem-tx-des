(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nemTxDes = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _methods = {
  257: transfer,
  2049: importanceTransfer,
  4097: multisigAggregateModification,
  4098: multisigSignature,
  4100: multisig,
  8193: provisionNamespace,
  16385: mosaicDefinitionCreation,
  16386: mosaicSupplyChange
};

function parse(serialized) {
  if (!/^[A-Fa-f0-9]+$/.test(serialized)) {
    throw new Error('argument must be hexadecimal string.');
  }
  if (serialized.length % 2 == 1) {
    throw new Error('argument length may be wrong.');
  }
  return deserialize(serialized);
}

function deserialize(serialized) {
  var hexa = hexString2a(serialized);
  return transaction(hexa);
}

function transaction(hexa) {
  var obj = {};
  var comm = common(hexa.slice(0, 60));
  var spec = specify(hexa.slice(60, hexa.length), comm.type);
  Object.assign(obj, comm, spec);
  return obj;
}

function common(hexa) {
  return {
    type: hexa2int(hexa.slice(0, 4)),
    version: hexa2int(hexa.slice(4, 8)),
    timeStamp: hexa2int(hexa.slice(8, 12)),
    signer: hexa.slice(16, 48).join(''),
    fee: hexa2int(hexa.slice(48, 56)),
    deadline: hexa2int(hexa.slice(56, 60))
  };
}

function specify(hexa, type) {
  var method = _methods[type];
  if (method == null) {
    throw new Error('unknown transaction type: ' + type);
  }
  return method(hexa);
}

function transfer(hexa) {
  var obj = {
    recipient: hexa2ascii(hexa.slice(4, 44)),
    amount: hexa2int(hexa.slice(44, 52))
  };
  var msgLen = hexa2int(hexa.slice(52, 56));
  if (msgLen > 0) {
    var payloadLen = hexa2int(hexa.slice(60, 64));
    obj.message = {
      type: hexa2int(hexa.slice(56, 60)),
      payload: hexa2utf8(hexa.slice(64, 64 + payloadLen))
    };
  }
  // TODO: mosaic transfer
  return obj;
}

function importanceTransfer(hexa) {
  throw new Error('not implemented.');
}

function multisigAggregateModification(hexa) {
  throw new Error('not implemented.');
}

function multisigSignature(hexa) {
  throw new Error('not implemented.');
}

function multisig(hexa) {
  var msigLen = hexa2int(hexa.slice(0, 4));
  var other = hexa.slice(4, 4 + msigLen);
  return { otherTrans: transaction(other) };
}

function provisionNamespace(hexa) {
  throw new Error('not implemented.');
}

function mosaicDefinitionCreation(hexa) {
  throw new Error('not implemented.');
}

function mosaicSupplyChange(hexa) {
  throw new Error('not implemented.');
}

function hexString2a(hex) {
  return hex.match(/.{2}/g);
}

function hexa2int(hexa) {
  var rhexa = hexa.reverse();
  var hex = rhexa.join('');
  return parseInt(new Int32Array([parseInt(hex, 16)]));
}

function hexa2ascii(hexa) {
  var str = '';
  for (var i = 0; i < hexa.length; i++) {
    str += String.fromCharCode(parseInt(hexa[i], 16));
  }
  return str;
}

function hexa2utf8(hexa) {
  var inta = hexa.map(function (hex) {
    return parseInt(hex, 16);
  });
  var out = '';
  var i = void 0;
  while (i = inta.shift()) {
    if (i <= 0x7f) {
      out += String.fromCharCode(i);
    } else if (i <= 0xdf) {
      var c = ((i & 0x1f) << 6) + (inta.shift() & 0x3f);
      out += String.fromCharCode(c);
    } else if (i <= 0xe0) {
      var _c = ((inta.shift() & 0x1f) << 6 | 0x0800) + (inta.shift() & 0x3f);
      out += String.fromCharCode(_c);
    } else {
      var _c2 = ((i & 0x0f) << 12) + ((inta.shift() & 0x3f) << 6) + (inta.shift() & 0x3f);
      out += String.fromCharCode(_c2);
    }
  }
  return out;
}

module.exports = {
  parse: parse
};

},{}]},{},[1])(1)
});
