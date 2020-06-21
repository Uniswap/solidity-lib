pragma solidity >=0.5.0;

import './FixedPoint.sol';
import './ABDKMathQuad.sol';

library TickMath {
    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == 0) {
            return FixedPoint.encode(1);
        }

        uint16 n = tick > 0 ? uint16(tick) : uint16(tick * - 1);

        // quad representation of 1.01
        bytes16 tickMultiplier = ABDKMathQuad.from64x64(int128(101 << 64) / 100);
        bytes16 power = ABDKMathQuad.mul(ABDKMathQuad.ln(tickMultiplier), ABDKMathQuad.fromUInt(n));

        int256 result = ABDKMathQuad.to128x128(ABDKMathQuad.exp(power));

        require(result < uint240(-1), 'OVERFLOW_UQ112x112');
        require(result > 0, 'NEGATIVE_OR_ZERO_RESULT');

        uint256 lower = uint256(result & int256(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000)) >> 16;
        uint256 upper = uint256(result & int256(0x0000FFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000000000000000000000000000)) >> 128;
        uint224 converted = uint224((upper << 112) + lower);

        return tick > 0 ? FixedPoint.uq112x112(converted) : FixedPoint.reciprocal(FixedPoint.uq112x112(converted));
    }
}
