pragma solidity >=0.5.0;

import './FixedPoint.sol';

library TickMath {
    using FixedPoint for FixedPoint.uq112x112;


    uint8 public constant EXPONENTIATE_PRECISION = 12;
    uint112 public constant TICK_DENOMINATOR = 100;
    int16 public constant EQUAL_RATIO_TICK = 0;

    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    // math adapted from:
    // https://ethereum.stackexchange.com/questions/10425/is-there-any-efficient-way-to-compute-the-exponentiation-of-a-fraction-and-an-in
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == EQUAL_RATIO_TICK) {
            return FixedPoint.encode(1);
        }

        uint16 absoluteTick = tick > 0 ? uint16(tick) : uint16(- 1 * tick);

        FixedPoint.uq112x112 memory price = FixedPoint.uq112x112(0);
        FixedPoint.uq112x112 memory N = FixedPoint.encode(1);
        uint112 B = 1;
        for (uint8 i = 0; i < EXPONENTIATE_PRECISION; ++i) {
            //   s += k * N / B / (q**i);
            price = price.add(N.div(B).div(TICK_DENOMINATOR ** i));
            //    N  = N * (n-i);
            N = N.mul112(uint112(absoluteTick - i));
            //    B  = B * (i+1);
            B *= (i + 1);
        }

        if (tick < 0) {
            return price.reciprocal();
        }

        return price;
    }
}
