describe('Deserializer', () => {
  const des = require('../index')

  describe('parse()', () => {
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
