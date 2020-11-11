import chai, {expect} from 'chai'
import {Contract, BigNumber} from 'ethers'
import {solidity, MockProvider, deployContract} from 'ethereum-waffle'

import BitMathTest from '../build/BitMathTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

describe('BitMath', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet] = provider.getWallets()

  let bitMath: Contract
  before('deploy BitMathTest', async () => {
    bitMath = await deployContract(wallet, BitMathTest, [], overrides)
  })

  describe('#mostSignificantBit', () => {
    it('0', async () => {
      await expect(bitMath.mostSignificantBit(0)).to.be.revertedWith('BitMath: ZERO')
    })
    it('1', async () => {
      expect(await bitMath.mostSignificantBit(1)).to.eq(0)
    })
    it('2', async () => {
      expect(await bitMath.mostSignificantBit(2)).to.eq(1)
    })
    it('all powers of 2', async () => {
      const results = await Promise.all(
        [...Array(255)].map((_, i) => bitMath.mostSignificantBit(BigNumber.from(2).pow(i)))
      )
      expect(results).to.deep.eq([...Array(255)].map((_, i) => i))
    })
    it('uint256(-1)', async () => {
      expect(await bitMath.mostSignificantBit(BigNumber.from(2).pow(256).sub(1))).to.eq(255)
    })
  })
})
