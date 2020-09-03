// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.5.0;

import './SafeHRC20Namer.sol';

// produces names for pairs of tokens using Swoop's naming scheme
library PairNamer {
    string private constant TOKEN_SYMBOL_PREFIX = '🦄';
    string private constant TOKEN_SEPARATOR = ':';

    // produces a pair descriptor in the format of `${prefix}${name0}:${name1}${suffix}`
    function pairName(address token0, address token1, string memory prefix, string memory suffix) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                prefix,
                SafeHRC20Namer.tokenName(token0),
                TOKEN_SEPARATOR,
                SafeHRC20Namer.tokenName(token1),
                suffix
            )
        );
    }

    // produces a pair symbol in the format of `🦄${symbol0}:${symbol1}${suffix}`
    function pairSymbol(address token0, address token1, string memory suffix) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                TOKEN_SYMBOL_PREFIX,
                SafeHRC20Namer.tokenSymbol(token0),
                TOKEN_SEPARATOR,
                SafeHRC20Namer.tokenSymbol(token1),
                suffix
            )
        );
    }
}
