// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.5.0;

import '../libraries/PairNamer.sol';

contract PairNamerTest {
    function pairName(
        address token0,
        address token1,
        string calldata prefix,
        string calldata suffix
    ) external view returns (string memory) {
        return PairNamer.pairName(token0, token1, prefix, suffix);
    }

    function pairSymbol(
        address token0,
        address token1,
        string calldata suffix
    ) external view returns (string memory) {
        return PairNamer.pairSymbol(token0, token1, suffix);
    }
}

// we do not test with non compliant ERC20 implementations because that's handled by token namer
contract PairNamerTestFakeToken {
    string public name;
    string public symbol;

    constructor(string memory name_, string memory symbol_) public {
        name = name_;
        symbol = symbol_;
    }
}
