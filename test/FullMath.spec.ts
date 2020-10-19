import chai, {expect} from 'chai'
import {Contract, BigNumber} from 'ethers'
import {solidity, MockProvider, deployContract} from 'ethereum-waffle'

import FullMathTest from '../build/FullMathTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('FullMath', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet] = provider.getWallets()

  let fm: Contract
  before('deploy FullMathTest', async () => {
    fm = await deployContract(wallet, FullMathTest, [], overrides)
  })

  describe('#fullMul', () => {
    it('less than max uint', async () => {
      const [l, h] = await fm.fullMul(5, 8)
      expect(l).to.eq(40)
      expect(h).to.eq(0)
    })
    it('result just 1 more than max uint', async () => {
      const [l, h] = await fm.fullMul(BigNumber.from(2).pow(128), BigNumber.from(2).pow(128))
      expect(l).to.eq(0)
      expect(h).to.eq(1)
    })
  })
  describe('#mulDiv', () => {
    it('works without phantom overflow', async () => {
      expect(await fm.mulDiv(12, 3, 8)).to.eq(4)
    })
  })
})
