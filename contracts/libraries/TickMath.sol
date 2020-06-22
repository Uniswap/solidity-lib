pragma solidity >=0.5.0;

import './FixedPoint.sol';
import './ABDKMathQuad.sol';

library TickMath {
    // quad tick multiplier
    // ABDKMathQuad.ln(ABDKMathQuad.from64x64(int128(101 << 64) / 100))
    bytes16 public constant TICK_MULTIPLIER = 0x3ff8460d6ccca3676b5d9a618c6f6aa7;
    uint224 public constant ONE = 1 << 112;

    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == 0) {
            return FixedPoint.uq112x112(ONE);
        }

        bytes16 ePower = ABDKMathQuad.mul(TICK_MULTIPLIER, ABDKMathQuad.fromInt(tick));

        int256 result = ABDKMathQuad.to128x128(ABDKMathQuad.exp(ePower));

        require(result < uint240(-1), 'TickMath: OVERFLOW_UQ112x112');
        require(result > 0, 'TickMath: NEGATIVE_OR_ZERO_RESULT');

        uint224 converted = uint224(result >> 16);

        return FixedPoint.uq112x112(converted);
    }
}
