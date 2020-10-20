// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

contract EchidnaBabylonianTest {
    uint256 num;
    uint256 sqrt;

    function storeSqrt(uint256 num_) external {
        num = num_;
        sqrt = Babylonian.sqrt(num_);
    }

    function echidna_sqrtAlwaysLessThanMaxUint128() external view returns (bool) {
        return sqrt < 2**128; // because (2**128)^2 > uint256(-1)
    }

    function echidna_sqrtSquaredAlwaysLteInput() external view returns (bool) {
        return sqrt * sqrt <= num;
    }

    function echidna_sqrtPlusOneSquaredAlwaysGtInput() external view returns (bool) {
        uint256 next = sqrt + 1;
        uint256 nextSquared = next * next;
        assert(nextSquared / next == next);
        return (nextSquared > num); /*|| ((nextSquared) / next != next)*/
    }
}
