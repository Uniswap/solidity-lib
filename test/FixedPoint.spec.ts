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

  describe('#div', () => {
    it('correct division', async () => {
      expect((await fixedPoint.div([BigNumber.from(3).mul(Q112)], BigNumber.from(2)))[0]).to.eq(
        BigNumber.from(3).mul(Q112).div(2)
      )
    })
    it('throws for div by zero', async () => {
      await expect(fixedPoint.div([BigNumber.from(3).mul(Q112)], 0)).to.be.revertedWith('FixedPoint: DIV_BY_ZERO')
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
        'FixedPoint: DIV_BY_ZERO'
      )
    })
  })

  describe('#reciprocal', () => {
    it('works for 0.25', async () => {
      expect((await fixedPoint.reciprocal([Q112.mul(BigNumber.from(25)).div(100)]))[0]).to.eq(Q112.mul(4))
    })
    it('fails for 0', async () => {
      await expect(fixedPoint.reciprocal([BigNumber.from(0)])).to.be.revertedWith('FixedPoint: ZERO_RECIPROCAL')
    })
    it('works for 5', async () => {
      expect((await fixedPoint.reciprocal([Q112.mul(BigNumber.from(5))]))[0]).to.eq(Q112.mul(BigNumber.from(1)).div(5))
    })
  })

  describe('#sqrt', () => {
    it('works for 25', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(25).mul(Q112)]))[0]).to.eq(BigNumber.from(5).mul(Q112))
    })

    it('works with numbers less than 1', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(1225).mul(Q112).div(100)]))[0]).to.eq(
        BigNumber.from(35).mul(Q112).div(10)
      )
    })

    it('works with 0', async () => {
      expect((await fixedPoint.sqrt([BigNumber.from(0)]))[0]).to.eq(BigNumber.from(0))
    })
  })
})
