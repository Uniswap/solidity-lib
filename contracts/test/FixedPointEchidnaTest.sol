// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.6.12;

import '../libraries/FixedPoint.sol';

contract FixedPointEchidnaTest {
    using FixedPoint for FixedPoint.uq112x112;

    function sqrtInvariant(uint224 input) external pure {
        FixedPoint.uq112x112 memory root = FixedPoint.uq112x112(input).sqrt();
        FixedPoint.uq112x112 memory rootSquared = root.muluq(root);
        assert(rootSquared._x <= input);

        FixedPoint.uq112x112 memory rootPlusOne = FixedPoint.uq112x112(root._x + 1);
        FixedPoint.uq112x112 memory rootPlusOneSquared = rootPlusOne.muluq(rootPlusOne);
        assert(rootPlusOneSquared._x > input);
    }
}
