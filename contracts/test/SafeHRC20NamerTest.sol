// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.5.0;

import '../libraries/SafeHRC20Namer.sol';

// used for testing the logic of token naming
contract SafeHRC20NamerTest {
    function tokenSymbol(address token) public view returns (string memory)  {
        return SafeHRC20Namer.tokenSymbol(token);
    }

    function tokenName(address token) public view returns (string memory)  {
        return SafeHRC20Namer.tokenName(token);
    }
}

// does not implement name or symbol
contract NamerTestFakeOptionalHRC20 {
}

// complies with HRC20 and returns strings
contract NamerTestFakeCompliantHRC20 {
    string public name;
    string public symbol;
    constructor (string memory name_, string memory symbol_) public {
        name = name_;
        symbol = symbol_;
    }
}

// implements name and symbol but returns bytes32
contract NamerTestFakeNoncompliantHRC20 {
    bytes32 public name;
    bytes32 public symbol;
    constructor (bytes32 name_, bytes32 symbol_) public {
        name = name_;
        symbol = symbol_;
    }
}
