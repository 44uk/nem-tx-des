(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nemTxDes = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

  var mosaicsLen = hexa2int(hexa.slice(56 + msgLen, 56 + msgLen + 4));
  // without mosaics
  if (mosaicsLen <= 0) {
    return obj;
  }

  var mosaics = [];
  var mosaicsOffset = 60 + msgLen;
  var offset = 0;
  for (var i = 0; i < mosaicsLen; i++) {
    var moLen = hexa2int(hexa.slice(mosaicsOffset + offset, mosaicsOffset + offset + 4));
    var nsNameLen = hexa2int(hexa.slice(offset + mosaicsOffset + 8, offset + mosaicsOffset + 12));
    var moNameLen = hexa2int(hexa.slice(offset + mosaicsOffset + 12 + nsNameLen, offset + mosaicsOffset + 12 + nsNameLen + 4));
    var ns = hexa2utf8(hexa.slice(offset + mosaicsOffset + 12, offset + mosaicsOffset + 12 + nsNameLen));
    var name = hexa2utf8(hexa.slice(offset + mosaicsOffset + 16 + nsNameLen, offset + mosaicsOffset + 16 + nsNameLen + moNameLen));
    var quantity = hexa2int(hexa.slice(offset + mosaicsOffset + 16 + nsNameLen + moNameLen, offset + mosaicsOffset + 16 + nsNameLen + moNameLen + 8));
    mosaics.push({
      mosaicId: {
        namespaceId: ns,
        name: name
      },
      quantity: quantity
    });
    offset += moLen + 4;
  }
  obj.mosaics = mosaics;
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
