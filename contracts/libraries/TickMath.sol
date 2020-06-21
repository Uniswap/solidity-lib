pragma solidity >=0.5.0;

import './FixedPoint.sol';

library TickMath {
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

    uint256 public constant ONE = 1 << 112;
    uint256 public constant TICK_ONE = ONE * 101 / 100;

    // given a tick index, return the corresponding price in a FixedPoint.uq112x112 struct
    // a tick represents a reserves ratio of 1.01^tick
    // math adapted from:
    // https://ethereum.stackexchange.com/questions/10425/is-there-any-efficient-way-to-compute-the-exponentiation-of-a-fraction-and-an-in
    // returns the price as a 128.128 fixed point number
    function getPrice(int16 tick) internal pure returns (FixedPoint.uq112x112 memory) {
        if (tick == 0) {
            return FixedPoint.uq112x112(uint224(ONE));
        }

        uint16 n = tick > 0 ? uint16(tick) : uint16(tick * - 1);
        // Function exp_by_squaring_iterative(x, n)
        //    if n < 0 then
        //      x := 1 / x;
        //      n := -n;
        //    if n = 0 then return 1
        //    y := 1;
        //    while n > 1 do
        //      if n is even then
        //        x := x * x;
        //        n := n / 2;
        //      else
        //        y := x * y;
        //        x := x * x;
        //        n := (n – 1) / 2;
        //    return x * y

        uint256 x = TICK_ONE;
        uint256 y = ONE;
        while (n > 1) {
            if (n % 2 != 0) {
                y = mul(x, y) >> 112;
            }
            x = mul(x, x) >> 112;
            n /= 2;
        }

        FixedPoint.uq112x112 memory result = FixedPoint.uq112x112(uint224((x * y) >> 112));
        return tick < 0 ? FixedPoint.reciprocal(result) : result;
    }
}
