pragma solidity >=0.4.0;

import '../libraries/Babylonian.sol';

// used for testing the logic of token naming
contract BabylonianTest {
    function sqrt(uint num) public pure returns (uint)  {
        return Babylonian.sqrt(num);
    }
}
