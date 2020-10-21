// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

contract BabylonianEchidnaTest {
    uint256 input;
    uint256 sqrt;

    function storeSqrt(uint256 input_) external {
        input = input_;
        sqrt = Babylonian.sqrt(input_);
    }

    function echidna_sqrtAlwaysLessThanMaxUint128() external view returns (bool) {
        return sqrt < 2**128; // because (2**128)^2 > uint256(-1)
    }

    function echidna_sqrtSquaredAlwaysLteInput() external view returns (bool) {
        return sqrt * sqrt <= input;
    }

    function echidna_sqrtPlusOneSquaredAlwaysGtInput() external view returns (bool) {
        uint256 next = sqrt + 1;
        uint256 nextSquared = next * next;
        return (nextSquared > input); /*|| ((nextSquared) / next != next)*/
    }
}
