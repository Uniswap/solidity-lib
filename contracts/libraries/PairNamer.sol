pragma solidity >=0.5.0;

import './strings.sol';
import './SafeERC20Namer.sol';

// produces names for pairs of tokens using Uniswap's naming scheme
library PairNamer {
    using strings for *;

    string private constant TOKEN_SYMBOL_PREFIX = '🦄';
    string private constant TOKEN_SEPARATOR = ':';

    // produces a pair symbol in the format of `🦄${symbol0}:${symbol1}`
    function pairSymbol(address token0, address token1) internal view returns (string memory) {
        strings.slice memory ts_0 = SafeERC20Namer.tokenSymbol(token0).toSlice();
        strings.slice memory ts_1 = SafeERC20Namer.tokenSymbol(token1).toSlice();

        return TOKEN_SYMBOL_PREFIX.toSlice()
            .concat(ts_0).toSlice()
            .concat(TOKEN_SEPARATOR.toSlice()).toSlice()
            .concat(ts_1).toSlice()
            .toString();
    }
}
