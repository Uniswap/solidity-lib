import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { bigNumberify } from 'ethers/utils'

import FixedPointTest from '../build/FixedPointTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

const Q112 = bigNumberify(2).pow(112)

describe('FixedPoint', () => {
  const provider = new MockProvider({
    hardfork: 'istanbul',
    mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    gasLimit: 9999999,
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
      expect(() => fixedPoint.encode(bigNumberify(2).pow(113).sub(1))).to.throw
    })
  })

  describe('#encode144', () => {
    it('shifts left by 112', async () => {
      expect((await fixedPoint.encode144('0x01'))[0]).to.eq(Q112.toHexString())
    })
    it('will not take >uint144(-1)', async () => {
      expect(() => fixedPoint.encode144(bigNumberify(2).pow(145).sub(1))).to.throw
    })
  })

  describe('#decode', () => {
    it('shifts right by 112', async () => {
      expect(await fixedPoint.decode([bigNumberify(3).mul(Q112)])).to.eq(bigNumberify(3))
    })
    it('will not take >uint224(-1)', async () => {
      expect(() => fixedPoint.decode([bigNumberify(2).pow(225).sub(1)])).to.throw
    })
  })

  describe('#decode144', () => {
    it('shifts right by 112', async () => {
      expect(await fixedPoint.decode([bigNumberify(3).mul(Q112)])).to.eq(bigNumberify(3))
    })

    it('will not take >uint256(-1)', async () => {
      expect(() => fixedPoint.decode([bigNumberify(2).pow(257).sub(1)])).to.throw
    })
  })

  describe('#div', () => {
    it('correct division', async () => {
      expect((await fixedPoint.div([bigNumberify(3).mul(Q112)], bigNumberify(2)))[0]).to.eq(
        bigNumberify(3).mul(Q112).div(2)
      )
    })
    it('throws for div by zero', async () => {
      await expect(fixedPoint.div([bigNumberify(3).mul(Q112)], 0)).to.be.revertedWith('FixedPoint: DIV_BY_ZERO')
    })
  })

  describe('#mul', () => {
    it('correct multiplication', async () => {
      expect((await fixedPoint.mul([bigNumberify(3).mul(Q112)], bigNumberify(2)))[0]).to.eq(
        bigNumberify(3).mul(2).mul(Q112)
      )
    })
    it('overflow', async () => {
      await expect(fixedPoint.mul([bigNumberify(1).mul(Q112)], bigNumberify(2).pow(144))).to.be.revertedWith(
        'FixedPoint: MULTIPLICATION_OVERFLOW'
      )
    })
    it('max of q112x112', async () => {
      expect((await fixedPoint.mul([bigNumberify(2).pow(112)], bigNumberify(2).pow(112)))[0]).to.eq(
        bigNumberify(2).pow(224)
      )
    })
  })

  describe('#fraction', () => {
    it('correct computation less than 1', async () => {
      expect((await fixedPoint.fraction(4, 100))[0]).to.eq(bigNumberify(4).mul(Q112).div(100))
    })

    it('correct computation greater than 1', async () => {
      expect((await fixedPoint.fraction(100, 4))[0]).to.eq(bigNumberify(100).mul(Q112).div(4))
    })

    it('fails with 0 denominator', async () => {
      await expect(fixedPoint.fraction(bigNumberify(1), bigNumberify(0))).to.be.revertedWith('FixedPoint: DIV_BY_ZERO')
    })
  })

  describe('#reciprocal', () => {
    it('works for 0.25', async () => {
      expect((await fixedPoint.reciprocal([Q112.mul(bigNumberify(25)).div(100)]))[0]).to.eq(Q112.mul(4))
    })
    it('fails for 0', async () => {
      await expect(fixedPoint.reciprocal([bigNumberify(0)])).to.be.revertedWith('FixedPoint: ZERO_RECIPROCAL')
    })
  })

  describe('#sqrt', () => {
    it('works for 25', async () => {
      expect((await fixedPoint.sqrt([bigNumberify(25).mul(Q112)]))[0]).to.eq(bigNumberify(5).mul(Q112))
    })

    it('works with numbers less than 1', async () => {
      expect((await fixedPoint.sqrt([bigNumberify(1225).mul(Q112).div(100)]))[0]).to.eq(
        bigNumberify(35).mul(Q112).div(10)
      )
    })
  })
})
