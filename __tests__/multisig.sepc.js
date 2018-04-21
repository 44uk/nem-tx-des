describe('Deserializer', () => {
  const des = require('../index')

  describe('parse()', () => {
    describe('multisig transfer transaction', () => {
      it('should be parsed', () => {
        const serialized = '04100000010000987fcd9d0520000000cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0df0490200000000008fdb9d058600000001010000010000987fcd9d05200000003061144f1096de8b71178dfbc588069e30310112af57afe5fce87dbb828bbe8ba0860100000000008fdb9d05280000005441574b4a5455503444574b4c444b4b53353334545950364733323443424e4d584b424134583742809698000000000012000000010000000a000000476f6f64206c75636b21';
        const expected = {
          type: 4100,
          version: -1744830463,
          signer: "cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0d",
          timeStamp: 94227839,
          deadline: 94231439,
          fee: 150000,
          otherTrans: {
            type: 257,
            version: -1744830463,
            signer: "3061144f1096de8b71178dfbc588069e30310112af57afe5fce87dbb828bbe8b",
            timeStamp: 94227839,
            deadline: 94231439,
            recipient: "TAWKJTUP4DWKLDKKS534TYP6G324CBNMXKBA4X7B",
            amount: 10000000,
            fee: 100000,
            message: {
              type: 1,
              payload: "Good luck!"
            }
          }
        }
        expect(des.parse(serialized)).toEqual(expected)
      })
    })
  })
})
