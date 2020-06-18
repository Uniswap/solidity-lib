import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { bigNumberify, BigNumberish } from 'ethers/utils'

import TickMathTest from '../build/TickMathTest.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

const Q112 = bigNumberify(2).pow(112)

describe.only('TickMath', () => {
  const provider = new MockProvider({
    hardfork: 'istanbul',
    mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    gasLimit: 9999999,
  })
  const [wallet] = provider.getWallets()

  let tickMath: Contract
  before('deploy TickMathTest', async () => {
    tickMath = await deployContract(wallet, TickMathTest, [], overrides)
  })

  // handles if the result is an array (in the case of fixed point struct return values where it's an array of one uint224)
  function bnify2(a: BigNumberish | [BigNumberish]) {
    if (Array.isArray(a)) {
      return bigNumberify(a[0])
    } else {
      return bigNumberify(a)
    }
  }

  // checks that an actual number is within allowedDiffBips of an expected number
  async function checkApproximatelyEquals(
    actualP: BigNumberish | Promise<BigNumberish>,
    expectedP: BigNumberish | Promise<BigNumberish>,
    allowedDiffBips: BigNumberish
  ) {
    const [actual, expected] = [bnify2(await actualP), bnify2(await expectedP)]
    const absDiff = actual.sub(expected).abs()
    expect(
      absDiff.lte(expected.mul(allowedDiffBips).div(10000)),
      `
      ${actual.toString()} differs from ${expected.toString()} by >${allowedDiffBips.toString()}bips. 
      abs diff: ${absDiff.toString()}
      abs diff bips: ${absDiff.mul(10000).div(expected).toString()}`
    ).to.be.true
  }

  describe('matches js implementation', () => {
    function exactTickRatioQ112x112(tickIndex: number): BigNumberish {
      return tickIndex > 0
        ? Q112.mul(bigNumberify(101).pow(tickIndex)).div(bigNumberify(100).pow(tickIndex))
        : Q112.mul(bigNumberify(100).pow(tickIndex)).div(bigNumberify(101).pow(tickIndex))
    }

    for (let tick of [-775, -750, -500, -400, -300, -200, -100, -20, 0, 50, 100, 200, 300, 400, 500, 750, 775]) {
      it(`tick index: ${tick}`, async () => {
        await checkApproximatelyEquals(tickMath.getPrice(tick), exactTickRatioQ112x112(tick), 25)
      })
    }
  })

  // these hand written tests make sure we are computing it correctly
  it('returns exactly 1 for tick 0', async () => {
    await checkApproximatelyEquals(tickMath.getPrice(0), Q112, 0)
  })
  it('returns ~2/1 for tick 70', async () => {
    await checkApproximatelyEquals(tickMath.getPrice(70), bigNumberify(2).mul(Q112), 34)
  })
  it('returns ~1/2 for tick -70', async () => {
    await checkApproximatelyEquals(tickMath.getPrice(-70), Q112.div(2), 34)
  })
  it('returns ~1/4 for tick 140', async () => {
    await checkApproximatelyEquals(tickMath.getPrice(-140), Q112.div(4), 70)
  })
  it('returns ~4/1 for tick 140', async () => {
    await checkApproximatelyEquals(tickMath.getPrice(140), Q112.mul(4), 70)
  })
})
