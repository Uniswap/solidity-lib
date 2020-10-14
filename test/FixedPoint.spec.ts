import chai, { expect } from 'chai'
import { Contract, BigNumber } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'

import FixedPointTest from '../build/FixedPointTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

const Q112 = BigNumber.from(2).pow(112)

describe('FixedPoint', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet] = provider.getWallets()

  let fixedPoint: Contract
  before('deploy FixedPointTest', async () => {
    fixedPoint = await deployContract(wallet, FixedPointTest, [], overrides)
  })

  describe('#encode', () => {
    it('shifts left by 112', async () => {
      expect((await fixedPoint.encode('0x01'))[0]).to.eq(Q112.toHexString())
    })
    it('will not take >uint112(-1)', async () => {
      expect(() => fixedPoint.encode(BigNumber.from(2).pow(113).sub(1))).to.throw
    })
  })

  describe('#encode144', () => {
    it('shifts left by 112', async () => {
      expect((await fixedPoint.encode144('0x01'))[0]).to.eq(Q112.toHexString())
    })
    it('will not take >uint144(-1)', async () => {
      expect(() => fixedPoint.encode144(BigNumber.from(2).pow(145).sub(1))).to.throw
    })
  })

  describe('#decode', () => {
    it('shifts right by 112', async () => {
      expect(await fixedPoint.decode([BigNumber.from(3).mul(Q112)])).to.eq(BigNumber.from(3))
    })
    it('will not take >uint224(-1)', async () => {
      expect(() => fixedPoint.decode([BigNumber.from(2).pow(225).sub(1)])).to.throw
    })
  })

  describe('#decode144', () => {
    it('shifts right by 112', async () => {
      expect(await fixedPoint.decode([BigNumber.from(3).mul(Q112)])).to.eq(BigNumber.from(3))
    })

    it('will not take >uint256(-1)', async () => {
      expect(() => fixedPoint.decode([BigNumber.from(2).pow(257).sub(1)])).to.throw
    })
  })

  describe('#mul', () => {
    it('correct multiplication', async () => {
      expect((await fixedPoint.mul([BigNumber.from(3).mul(Q112)], BigNumber.from(2)))[0]).to.eq(
        BigNumber.from(3).mul(2).mul(Q112)
      )
    })
    it('overflow', async () => {
      await expect(fixedPoint.mul([BigNumber.from(1).mul(Q112)], BigNumber.from(2).pow(144))).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
    })
    it('max of q112x112', async () => {
      expect((await fixedPoint.mul([BigNumber.from(2).pow(112)], BigNumber.from(2).pow(112)))[0]).to.eq(
        BigNumber.from(2).pow(224)
      )
    })
    it('max without overflow, largest fixed point', async () => {
      const maxMultiplier = BigNumber.from('4294967296')
      expect((await fixedPoint.mul([BigNumber.from(2).pow(224).sub(1)], maxMultiplier))[0]).to.eq(
        BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007908834672640')
      )
      await expect(fixedPoint.mul([BigNumber.from(2).pow(224).sub(1)], maxMultiplier.add(1))).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
    })
    it('max without overflow, smallest fixed point', async () => {
      const maxUint = BigNumber.from(2).pow(256).sub(1)
      expect((await fixedPoint.mul([BigNumber.from(1)], maxUint))[0]).to.eq(maxUint)
      await expect(fixedPoint.mul([BigNumber.from(2)], maxUint)).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
    })
  })

  describe('#muli', () => {
    it('works for 0', async () => {
      expect(await fixedPoint.muli([BigNumber.from(0).mul(Q112)], BigNumber.from(1))).to.eq(BigNumber.from(0))
      expect(await fixedPoint.muli([BigNumber.from(1).mul(Q112)], BigNumber.from(0))).to.eq(BigNumber.from(0))
    })

    it('works for 3*2', async () => {
      expect(await fixedPoint.muli([BigNumber.from(3).mul(Q112)], BigNumber.from(2))).to.eq(BigNumber.from(6))
    })

    it('works for 3*-2', async () => {
      expect(await fixedPoint.muli([BigNumber.from(3).mul(Q112)], BigNumber.from(-2))).to.eq(BigNumber.from(-6))
    })

    it('overflow', async () => {
      await expect(fixedPoint.muli([BigNumber.from(1).mul(Q112)], BigNumber.from(2).pow(144))).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
      await expect(
        fixedPoint.muli([BigNumber.from(1).mul(Q112)], BigNumber.from(2).pow(144).mul(-1))
      ).to.be.revertedWith('FixedPoint: MULTIPLICATION_OVERFLOW')
    })
    it('max without overflow, largest fixed point', async () => {
      const maxMultiplier = BigNumber.from('4294967296')
      expect(await fixedPoint.muli([BigNumber.from(2).pow(224).sub(1)], maxMultiplier)).to.eq(
        BigNumber.from('22300745198530623141535718272648361505980415')
      )
      await expect(fixedPoint.muli([BigNumber.from(2).pow(224).sub(1)], maxMultiplier.add(1))).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
      // negative version
      expect(await fixedPoint.muli([BigNumber.from(2).pow(224).sub(1)], maxMultiplier.mul(-1))).to.eq(
        BigNumber.from('22300745198530623141535718272648361505980415').mul(-1)
      )
      await expect(
        fixedPoint.muli([BigNumber.from(2).pow(224).sub(1)], maxMultiplier.add(1).mul(-1))
      ).to.be.revertedWith('FixedPoint: MULTIPLICATION_OVERFLOW')
    })

    it('max without overflow, smallest fixed point', async () => {
      const maxInt = BigNumber.from(2).pow(255).sub(1)
      expect(await fixedPoint.muli([BigNumber.from(2)], maxInt)).to.eq(
        BigNumber.from('22300745198530623141535718272648361505980415')
      )
      await expect(fixedPoint.muli([BigNumber.from(3)], maxInt)).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
      // negative version
      const minInt = BigNumber.from(2).pow(255).mul(-1)
      expect(await fixedPoint.muli([BigNumber.from(1)], minInt)).to.eq(
        BigNumber.from('11150372599265311570767859136324180752990208').mul(-1)
      )
      await expect(fixedPoint.muli([BigNumber.from(2)], minInt)).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
    })
  })

  describe('#fraction', () => {
    it('correct computation less than 1', async () => {
      expect((await fixedPoint.fraction(4, 100))[0]).to.eq(BigNumber.from(4).mul(Q112).div(100))
    })

    it('correct computation greater than 1', async () => {
      expect((await fixedPoint.fraction(100, 4))[0]).to.eq(BigNumber.from(100).mul(Q112).div(4))
    })

    it('fails with 0 denominator', async () => {
      await expect(fixedPoint.fraction(BigNumber.from(1), BigNumber.from(0))).to.be.revertedWith(
        'FixedPoint: DIV_BY_ZERO_FRACTION'
      )
    })
  })

  describe('#reciprocal', () => {
    it('fails for 0', async () => {
      await expect(fixedPoint.reciprocal([BigNumber.from(0)])).to.be.revertedWith('FixedPoint: DIV_BY_ZERO_RECIPROCAL')
    })
    it('fails for 1', async () => {
      await expect(fixedPoint.reciprocal([BigNumber.from(1)])).to.be.revertedWith('FixedPoint: RECIPROCAL_OVERFLOW')
    })
    it('works for 0.25', async () => {
      expect((await fixedPoint.reciprocal([Q112.mul(BigNumber.from(25)).div(100)]))[0]).to.eq(Q112.mul(4))
    })
    it('works for 5', async () => {
      expect((await fixedPoint.reciprocal([Q112.mul(BigNumber.from(5))]))[0]).to.eq(Q112.mul(BigNumber.from(1)).div(5))
    })
  })

  describe('#sqrt', () => {
    it('works with 0', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(0)]))[0]).to.eq(BigNumber.from(0))
    })

    it('works with numbers less than 1', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(1225).mul(Q112).div(100)]))[0]).to.eq(
        BigNumber.from(35).mul(Q112).div(10)
      )
    })

    it('works for 25', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(25).mul(Q112)]))[0]).to.eq(BigNumber.from(5).mul(Q112))
    })

    it('works for max uint112', async () => {
      const input = BigNumber.from(2).pow(112).sub(1).mul(Q112)
      const result = (await fixedPoint.sqrt([input]))[0]
      const expected = BigNumber.from('374144419156711147060143317175368417003121712037887')
      expect(result).to.eq(expected.shr(40).shl(40))
    })

    it('works for max uint224', async () => {
      const input = BigNumber.from(2).pow(224).sub(1)
      const result = (await fixedPoint.sqrt([input]))[0]
      const expected = BigNumber.from('374144419156711147060143317175368453031918731001855')
      expect(result).to.eq(expected.shr(40).shl(40))
    })
  })
})
