pragma solidity >=0.5.0;

import './FixedPoint.sol';

library TickMath {
    using FixedPoint for FixedPoint.uq112x112;

    uint8 public constant EXPONENTIATE_PRECISION = 16; // 16 because our tick range is represented by 16 bits
    uint public constant MAX_DIFF = 2 ** 20;
    uint112 public constant TICK_DENOMINATOR = 100; // the denominator is


    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    // math adapted from:
    // https://ethereum.stackexchange.com/questions/10425/is-there-any-efficient-way-to-compute-the-exponentiation-of-a-fraction-and-an-in
    // returns the price as a 128.128 fixed point number
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == 0) {
            return FixedPoint.encode(1);
        }

        uint16 absoluteTick = tick > 0 ? uint16(tick) : uint16(- 1 * tick);

        uint256 price = 0;
        uint256 N = 1;
        uint256 B = 1;
        uint256 term;

        for (uint8 i = 0; i < EXPONENTIATE_PRECISION && N > 0; ++i) {
            // max value is 100^15 or 1e30 or ~2^100
            uint q_i = TICK_DENOMINATOR ** i;

            // s += k * N / B / (q**i);
            if (N < uint128(- 1)) {
                term = ((N << 128) / B) / q_i;
            } else if (N < uint192(- 1)) {
                term = (((N << 64) / B) / q_i) << 64;
            } else {
                term = ((N / B) / q_i) << 128;
            }
            price = add(price, term);
            // N = N * (n-i);
            N = mul(N, (absoluteTick - i));
            // B = B * (i+1);
            B = mul(B, (i + 1));
            // 16! requires 45 bits
        }

        require(price <= uint224(- 1), 'price too large');

        FixedPoint.uq112x112 memory ret = FixedPoint.uq112x112(uint224(price >> 16));
        if (tick < 0) {
            return ret.reciprocal();
        }

        return ret;
    }
}
