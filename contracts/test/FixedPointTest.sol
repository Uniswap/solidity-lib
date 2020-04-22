pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import "../libraries/FixedPoint.sol";

contract FixedPointTest {
    function encode(uint112 x) external pure returns (FixedPoint.uq112x112 memory) {
        return FixedPoint.encode(x);
    }

    function encode144(uint144 x) external pure returns (FixedPoint.uq144x112 memory) {
        return FixedPoint.encode144(x);
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function div(FixedPoint.uq112x112 calldata self, uint112 y) external pure returns (FixedPoint.uq112x112 memory) {
        return FixedPoint.div(self, y);
    }

    function fraction(uint112 numerator, uint112 denominator) external pure returns (FixedPoint.uq112x112 memory) {
        return FixedPoint.fraction(numerator, denominator);
    }

    // multiply a UQ112x112 by a uint, returning a UQ144x112
    function mul(FixedPoint.uq112x112 calldata self, uint y) external pure returns (FixedPoint.uq144x112 memory) {
        return FixedPoint.mul(self, y);
    }

    // decode a UQ112x112 in a uint container into a uint by truncating after the radix point
    function decode(FixedPoint.uq112x112 calldata self) external pure returns (uint112) {
        return FixedPoint.decode(self);
    }

    function decode144(FixedPoint.uq144x112 calldata self) external pure returns (uint144) {
        return FixedPoint.decode144(self);
    }
}
