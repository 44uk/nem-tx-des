const des = require('../index').deserialize;

test('deserialize transfer transaction', () => {
  const serialized = '01010000010000983ef0880420000000cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0da0860100000000004efe8804280000005441574b4a5455503444574b4c444b4b53353334545950364733323443424e4d584b42413458374200e1f5050000000012000000010000000a000000476f6f64206c75636b21';
  const expected = {
    type: 257,
    fee: 100000,
    recipient: 'TAWKJTUP4DWKLDKKS534TYP6G324CBNMXKBA4X7B',
    amount: 100000000,
    message: { type: 1, payload: 'Good luck!' },
    timeStamp: 76083262,
    deadline: 76086862,
    version: -1744830463,
    signer: 'cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0d'
  }
  expect(des(serialized)).toEqual(expected);
});
