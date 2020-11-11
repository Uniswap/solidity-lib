import chai, {expect} from 'chai'
import {Contract, BigNumber, constants} from 'ethers'
import {solidity, MockProvider, deployContract} from 'ethereum-waffle'

import SquareRootTest from '../build/SquareRootTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('SquareRoot', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet] = provider.getWallets()

  let squareRoot: Contract
  before('deploy SquareRootTest', async () => {
    squareRoot = await deployContract(wallet, SquareRootTest, [], overrides)
  })

  describe('#sqrt', () => {
    it('works for 0-99', async () => {
      for (let i = 0; i < 100; i++) {
        expect(await squareRoot.sqrt(i)).to.eq(Math.floor(Math.sqrt(i)))
      }
    })

    it('product of numbers close to max uint112', async () => {
      const max = BigNumber.from(2).pow(112).sub(1)
      expect(await squareRoot.sqrt(max.mul(max))).to.eq(max)
      const maxMinus1 = max.sub(1)
      expect(await squareRoot.sqrt(maxMinus1.mul(maxMinus1))).to.eq(maxMinus1)
      const maxMinus2 = max.sub(2)
      expect(await squareRoot.sqrt(maxMinus2.mul(maxMinus2))).to.eq(maxMinus2)

      expect(await squareRoot.sqrt(max.mul(maxMinus1))).to.eq(maxMinus1)
      expect(await squareRoot.sqrt(max.mul(maxMinus2))).to.eq(maxMinus2)
      expect(await squareRoot.sqrt(maxMinus1.mul(maxMinus2))).to.eq(maxMinus2)
    })

    it('max uint256', async () => {
      const expected = BigNumber.from(2).pow(128).sub(1)
      expect(await squareRoot.sqrt(constants.MaxUint256)).to.eq(expected)
    })

    it('gas cost', async () => {
      expect(await squareRoot.getGasCostOfSqrt(150)).to.eq(693)
    })

    it('gas cost of large number', async () => {
      expect(await squareRoot.getGasCostOfSqrt(BigNumber.from(2).pow(150))).to.eq(735)
    })

    it('gas cost of max uint', async () => {
      expect(await squareRoot.getGasCostOfSqrt(BigNumber.from(2).pow(256).sub(1))).to.eq(813)
    })
  })
})
