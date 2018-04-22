const _methods = {
  257: transfer,
  2049: importanceTransfer,
  4097: multisigAggregateModification,
  4098: multisigSignature,
  4100: multisig,
  8193: provisionNamespace,
  16385: mosaicDefinitionCreation,
  16386: mosaicSupplyChange,
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
  const hexa = hexString2a(serialized);
  return transaction(hexa);
}

function transaction(hexa) {
  const obj = {};
  const comm = common(hexa.slice(0, 60));
  const spec = specify(hexa.slice(60, hexa.length), comm.type);
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
    deadline: hexa2int(hexa.slice(56, 60)),
  };
}

function specify(hexa, type) {
  const method = _methods[type];
  if (method == null) {
    throw new Error(`unknown transaction type: ${type}`);
  }
  return method(hexa);
}

function transfer(hexa) {
  const obj = {
    recipient: hexa2ascii(hexa.slice(4, 44)),
    amount: hexa2int(hexa.slice(44, 52)),
  };
  const msgLen = hexa2int(hexa.slice(52, 56));
  if (msgLen > 0) {
    const payloadLen = hexa2int(hexa.slice(60, 64));
    obj.message = {
      type: hexa2int(hexa.slice(56, 60)),
      payload: hexa2utf8(hexa.slice(64, 64 + payloadLen)),
    };
  }

  const mosaicsLen = hexa2int(hexa.slice(56 + msgLen, 56 + msgLen + 4));
  // without mosaics
  if (mosaicsLen <= 0) { return obj; }

  const mosaics = [];
  const mosaicsOffset = 60 + msgLen;
  let offset = 0;
  for (let i = 0; i < mosaicsLen; i++) {
    const moLen = hexa2int(hexa.slice(mosaicsOffset + offset, mosaicsOffset + offset + 4));
    const nsNameLen = hexa2int(hexa.slice(
      offset + mosaicsOffset + 8,
      offset + mosaicsOffset + 12,
    ));
    const moNameLen = hexa2int(hexa.slice(
      offset + mosaicsOffset + 12 + nsNameLen,
      offset + mosaicsOffset + 12 + nsNameLen + 4,
    ));
    const ns = hexa2utf8(hexa.slice(
      offset + mosaicsOffset + 12,
      offset + mosaicsOffset + 12 + nsNameLen,
    ));
    const name = hexa2utf8(hexa.slice(
      offset + mosaicsOffset + 16 + nsNameLen,
      offset + mosaicsOffset + 16 + nsNameLen + moNameLen,
    ));
    const quantity = hexa2int(hexa.slice(
      offset + mosaicsOffset + 16 + nsNameLen + moNameLen,
      offset + mosaicsOffset + 16 + nsNameLen + moNameLen + 8,
    ));
    mosaics.push({
      mosaicId: {
        namespaceId: ns,
        name,
      },
      quantity,
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
  const msigLen = hexa2int(hexa.slice(0, 4));
  const other = hexa.slice(4, 4 + msigLen);
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
  const rhexa = hexa.reverse();
  const hex = rhexa.join('');
  return parseInt(new Int32Array([parseInt(hex, 16)]));
}

function hexa2ascii(hexa) {
  let str = '';
  for (let i = 0; i < hexa.length; i++) {
    str += String.fromCharCode(parseInt(hexa[i], 16));
  }
  return str;
}

function hexa2utf8(hexa) {
  const inta = hexa.map(hex => parseInt(hex, 16));
  let out = '';
  let i;
  while (i = inta.shift()) {
    if (i <= 0x7f) {
      out += String.fromCharCode(i);
    } else if (i <= 0xdf) {
      const c = ((i & 0x1f) << 6)
        + (inta.shift() & 0x3f);
      out += String.fromCharCode(c);
    } else if (i <= 0xe0) {
      const c = (((inta.shift() & 0x1f) << 6) | 0x0800)
        + (inta.shift() & 0x3f);
      out += String.fromCharCode(c);
    } else {
      const c = ((i & 0x0f) << 12)
        + ((inta.shift() & 0x3f) << 6)
        + (inta.shift() & 0x3f);
      out += String.fromCharCode(c);
    }
  }
  return out;
}

module.exports = {
  parse,
};
