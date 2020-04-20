pragma solidity >=0.4.0;

// a library for performing various math operations that are inherently safe
library Math {
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }
}
