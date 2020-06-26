import chai, { expect } from 'chai'
import { Contract, BigNumber, constants } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'

import BabylonianTest from '../build/BabylonianTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('Babylonian', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet] = provider.getWallets()

  let babylonian: Contract
  before('deploy BabylonianTest', async () => {
    babylonian = await deployContract(wallet, BabylonianTest, [], overrides)
  })

  describe('#sqrt', () => {
    it('works for 0-99', async () => {
      for (let i = 0; i < 100; i++) {
        expect(await babylonian.sqrt(i)).to.eq(Math.floor(Math.sqrt(i)))
      }
    })

    it('max uint256', async () => {
      const expected = BigNumber.from(2).pow(128).sub(1)
      expect(await babylonian.sqrt(constants.MaxUint256)).to.eq(expected)
    })
  })
})
