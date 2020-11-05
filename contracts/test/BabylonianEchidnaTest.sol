// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

contract BabylonianEchidnaTest {
    function checkMaxForIndex(uint8 index) {
        checkSqrt(2**index);
        checkSqrt(index == 255 ? uint256(-1) : 2**(index + 1));
    }

    function checkSqrt(uint256 input) external pure {
        uint256 sqrt = Babylonian.sqrt(input);

        assert(sqrt < 2**128); // 2**128 == sqrt(2^256)
        // since we compute floor(sqrt(input))
        assert(sqrt**2 <= input);
        assert((sqrt + 1)**2 > input);
    }
}
