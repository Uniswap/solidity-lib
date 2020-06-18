pragma solidity >=0.5.0;

import './FixedPoint.sol';

library TickMath {
    using FixedPoint for FixedPoint.uq112x112;

    // Computes `k * (1+1/q) ^ n`, with precision `p`. The higher
    // the precision, the higher the gas cost. It should be
    // something around the log of `n`.
    // Much smaller values are sufficient to get a great approximation.
    function fracExp(uint k, uint q, uint n, uint p) pure private returns (uint) {
        uint s = 0;
        uint N = 1;
        uint B = 1;
        for (uint i = 0; i < p; ++i) {
            s += k * N / B / (q ** i);
            N = N * (n - i);
            B = B * (i + 1);
        }
        return s;
    }

    uint224 private constant ONE_UQ112x112 = 1 << 112; // 1.0
    uint private constant TICK_DENOMINATOR = 100; // price ticks are of size 1/100
    uint private constant EXPONENTIATE_PRECISION = 32; // we use 16 because our tick is 16 bits
    int16 private constant EQUAL_RATIO_TICK = int16(0);

    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == EQUAL_RATIO_TICK) {
            return FixedPoint.uq112x112(ONE_UQ112x112);
        }
        uint exponentiated = fracExp(ONE_UQ112x112, TICK_DENOMINATOR, tick < 0 ? uint(tick * - 1) : uint(tick), EXPONENTIATE_PRECISION);
        FixedPoint.uq112x112 memory result = FixedPoint.uq112x112(uint224(exponentiated));
        return tick < 0 ? result.reciprocal() : result;
    }
}
