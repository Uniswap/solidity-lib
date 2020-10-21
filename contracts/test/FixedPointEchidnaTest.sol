// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.4.0;

import '../libraries/FixedPoint.sol';

contract FixedPointEchidnaTest {
    uint224 input;
    uint224 inputReciprocal;
    uint224 inputReciprocalReciprocal;

    function reciprocal(uint224 input_) external {
        input = input_;
        inputReciprocal = FixedPoint.reciprocal(FixedPoint.uq112x112(input_))._x;
        inputReciprocalReciprocal = FixedPoint.reciprocal(FixedPoint.uq112x112(inputReciprocal))._x;
    }

    function echidna_reciprocalReciprocalRounding() external view returns (bool) {
        return inputReciprocalReciprocal == input;
    }
}
