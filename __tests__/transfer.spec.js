describe('Deserializer', () => {
  const des = require('../index')

  describe('parse()', () => {
    describe('transfer transaction', () => {
      it('should be parsed', () => {
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
        expect(des.parse(serialized)).toEqual(expected)
      })

      it('should be parsed without message', () => {
        const serialized = '010100000100009832e39a05200000000efc3228277de0f8c6107bac5d183bcb3497d58edd632273f1d03cae7d8f852d50c300000000000042f19a052800000054445757594447514e424b53414a4253485a58375157565837574e5641575742374847505752423200e1f5050000000000000000'
        const expected = {
          type: 257,
          fee: 50000,
          recipient: 'TDWWYDGQNBKSAJBSHZX7QWVX7WNVAWWB7HGPWRB2',
          amount: 100000000,
          timeStamp: 94036786,
          deadline: 94040386,
          version: -1744830463,
          signer: '0efc3228277de0f8c6107bac5d183bcb3497d58edd632273f1d03cae7d8f852d'
        }
        expect(des.parse(serialized)).toEqual(expected)
      })

      it('should be parsed with message', () => {
        const serialized = '0101000001000098d9e39a05200000000efc3228277de0f8c6107bac5d183bcb3497d58edd632273f1d03cae7d8f852da086010000000000e9f19a052800000054445757594447514e424b53414a4253485a58375157565837574e5641575742374847505752423200e1f5050000000017000000010000000f000000e38182e38184e38186e38188e3818a'
        const expected = {
          type: 257,
          fee: 100000,
          recipient: 'TDWWYDGQNBKSAJBSHZX7QWVX7WNVAWWB7HGPWRB2',
          amount: 100000000,
          message: { type: 1, payload: 'あいうえお' },
          timeStamp: 94036953,
          deadline: 94040553,
          version: -1744830463,
          signer: '0efc3228277de0f8c6107bac5d183bcb3497d58edd632273f1d03cae7d8f852d'
        }
        expect(des.parse(serialized)).toEqual(expected)
      })

      it('should be parsed with mosaics', () => {
        const serialized = '0101000002000098dfb3c40520000000be2ba9cb15a547110d511a4d43c0482fbb584d78781abac01fb053d18f4a0033e093040000000000efc1c4052800000054445757594447514e424b53414a4253485a58375157565837574e5641575742374847505752423240420f000000000000000000030000001c00000010000000030000006b6f6e05000000686561727410270000000000001c00000010000000030000006b6f6e0500000073776565740a000000000000001b0000000f000000030000006b6f6e04000000746561730a00000000000000'
        const expected = {
          type: 257,
          fee: 300000,
          recipient: 'TDWWYDGQNBKSAJBSHZX7QWVX7WNVAWWB7HGPWRB2',
          amount: 1000000,
          timeStamp: 96777183,
          deadline: 96780783,
          version: -1744830462,
          signer: 'be2ba9cb15a547110d511a4d43c0482fbb584d78781abac01fb053d18f4a0033',
          mosaics: [
            {
              mosaicId: {
                namespaceId: 'kon',
                name: 'heart'
              },
              quantity: 10000
            },
            {
              mosaicId: {
                namespaceId: 'kon',
                name: 'sweet'
              },
              quantity: 10
            },
            {
              mosaicId: {
                namespaceId: 'kon',
                name: 'teas'
              },
              quantity: 10
            }
          ]
        }
        expect(des.parse(serialized)).toEqual(expected)
      })
    })
  })
})
