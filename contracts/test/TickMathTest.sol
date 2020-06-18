pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import '../libraries/TickMath.sol';
import '../libraries/FixedPoint.sol';

library TickMathTest {
    function getPrice(int16 tick) public pure returns (FixedPoint.uq112x112 memory) {
        return TickMath.getPrice(tick);
    }
}
