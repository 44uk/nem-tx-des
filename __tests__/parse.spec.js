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
    })

    describe('throw error', () => {
      it('should be throw error: must be hexadecimal', () => {
        const serialized = '0101000001000098ghijklmnopqrstuvwxyz'
        expect(() => des.parse(serialized)).toThrow()
      })

      it('should be throw error: must be even number length', () => {
        const serialized = '01010000010000983ef0880420000000cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0da0860100000000004efe8804280000005441574b4a5455503444574b4c444b4b53353334545950364733323443424e4d584b42413458374200e1f5050000000012000000010000000a000000476f6f64206c75636b2'
        expect(() => des.parse(serialized)).toThrow()
      })

      it('should be throw error: unknown transaction type', () => {
        const serialized = '11010000010000983ef0880420000000cc63b4dcdec745417043c3fa0992ec3a1695461a26d90264744648abbd5caa0da0860100000000004efe8804280000005441574b4a5455503444574b4c444b4b53353334545950364733323443424e4d584b42413458374200e1f5050000000012000000010000000a000000476f6f64206c75636b21'
        expect(() => des.parse(serialized)).toThrow()
      })
    })
  })
})
