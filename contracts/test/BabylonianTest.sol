// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

// used for testing the logic of token naming
contract BabylonianTest {
    function sqrt(uint256 num) external pure returns (uint256) {
        return Babylonian.sqrt(num);
    }
}
