import chai, {expect} from 'chai'
import {Contract, BigNumber, constants} from 'ethers'
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

    it('combination of both', async () => {
      // try multiplying two numbers, 3.5 * 8.45 both 128.128, resulting in a 256x256
      // l should contain fractional part, h should contain whole part
      const [l, h] = await fm.fullMul(
        BigNumber.from(35).mul(BigNumber.from(2).pow(128)).div(10),
        BigNumber.from(845).mul(BigNumber.from(2).pow(128)).div(100)
      )

      // 3.5 * 8.45 = 29.575
      // fractional part
      // to get 0.575, divided by (2^256 - 1)
      // https://www.wolframalpha.com/input/?i=66580451311456812368553316379995547015392043525898667398263748579347811794944+%2F+%282%5E256-1%29
      expect(l).to.eq('66580451311456812368553316379995547015392043525898667398263748579347811794944')
      // whole part
      expect(h).to.eq('29')
    })

    it('max inputs', async () => {
      const [l, h] = await fm.fullMul(constants.MaxUint256, constants.MaxUint256)
      expect(l).to.eq(1)
      expect(h).to.eq(constants.MaxUint256.sub(1))
    })

    it('min inputs', async () => {
      const [l, h] = await fm.fullMul(0, 0)
      expect(l).to.eq(0)
      expect(h).to.eq(0)
    })
  })

  describe('#mulDiv', () => {
    const Q128 = BigNumber.from(2).pow(128)
    it('accurate without phantom overflow', async () => {
      const result = Q128.div(3)
      expect(
        await fm.mulDiv(
          Q128,
          /*0.5=*/ BigNumber.from(50).mul(Q128).div(100),
          /*1.5=*/ BigNumber.from(150).mul(Q128).div(100)
        )
      ).to.eq(result)

      expect(
        await fm.mulDivRoundingUp(
          Q128,
          /*0.5=*/ BigNumber.from(50).mul(Q128).div(100),
          /*1.5=*/ BigNumber.from(150).mul(Q128).div(100)
        )
      ).to.eq(result.add(1))
    })

    it('accurate with phantom overflow', async () => {
      const result = BigNumber.from(4375).mul(Q128).div(1000)
      expect(await fm.mulDiv(Q128, BigNumber.from(35).mul(Q128), BigNumber.from(8).mul(Q128))).to.eq(result)
      expect(await fm.mulDivRoundingUp(Q128, BigNumber.from(35).mul(Q128), BigNumber.from(8).mul(Q128))).to.eq(result)
    })

    it('accurate with phantom overflow and repeating decimal', async () => {
      const result = BigNumber.from(1).mul(Q128).div(3)
      expect(await fm.mulDiv(Q128, BigNumber.from(1000).mul(Q128), BigNumber.from(3000).mul(Q128))).to.eq(result)
      expect(await fm.mulDivRoundingUp(Q128, BigNumber.from(1000).mul(Q128), BigNumber.from(3000).mul(Q128))).to.eq(
        result.add(1)
      )
    })
  })
})
