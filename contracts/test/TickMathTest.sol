pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import '../libraries/TickMath.sol';
import '../libraries/FixedPoint.sol';

contract TickMathTest {
    function getPrice(int16 tick) public pure returns (FixedPoint.uq112x112 memory) {
        return TickMath.getPrice(tick);
    }

    event TickPrice(uint224 price);
    function logTickPrice(int16 tick) external {
        emit TickPrice(TickMath.getPrice(tick)._x);
    }
}
