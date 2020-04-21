pragma solidity >=0.5.0;

import "../libraries/AddressStringUtil.sol";

contract AddressStringUtilTest {
    function toAsciiString(address addr, uint len) pure external returns (string memory) {
        return AddressStringUtil.toAsciiString(addr, len);
    }
}
