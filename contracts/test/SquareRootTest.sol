// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/SquareRoot.sol';

contract SquareRootTest {
    function sqrt(uint256 num) external pure returns (uint256) {
        return SquareRoot.sqrt(num);
    }

    function getGasCostOfSqrt(uint256 num) external view returns (uint256) {
        uint256 gasBefore = gasleft();
        SquareRoot.sqrt(num);
        return gasBefore - gasleft();
    }
}
