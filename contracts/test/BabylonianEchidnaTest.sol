// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

contract BabylonianEchidnaTest {
    function checkSqrt(uint256 input) external {
        uint256 sqrt = Babylonian.sqrt(input_);
        assert(sqrt < 2**128);
        assert(sqrt * sqrt <= input);
        assert(nextSquared > input);
    }
}
