// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/FullMath.sol';

contract FullMathTest {
    function fullMul(uint256 x, uint256 y) external pure returns (uint256 l, uint256 h) {
        return FullMath.fullMul(x, y);
    }

    function mulDiv(
        uint256 x,
        uint256 y,
        uint256 z
    ) external pure returns (uint256) {
        return FullMath.mulDiv(x, y, z);
    }
}
