import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { bigNumberify } from 'ethers/utils'

import FixedPointTest from '../build/FixedPointTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

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
    it('shifts left', async () => {
      expect((await fixedPoint.encode('0x01'))[0]).to.eq(bigNumberify('1').mul(bigNumberify(2).pow(112)).toHexString())
    })
  })
})
