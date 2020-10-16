# uniswap-lib

[![Tests](https://github.com/Uniswap/uniswap-lib/workflows/Tests/badge.svg)](https://github.com/Uniswap/uniswap-lib/actions?query=workflow%3ATests)
[![Static Analysis](https://github.com/Uniswap/uniswap-lib/workflows/Static%20Analysis/badge.svg)](https://github.com/Uniswap/uniswap-lib/actions?query=workflow%3A%22Static+Analysis%22)
[![Lint](https://github.com/Uniswap/uniswap-lib/workflows/Lint/badge.svg)](https://github.com/Uniswap/uniswap-lib/actions?query=workflow%3ALint)
[![npm](https://img.shields.io/npm/v/@uniswap/lib)](https://unpkg.com/@uniswap/lib@latest/)

Solidity libraries that are shared across Uniswap contracts. These libraries are focused on safety and gas efficiency.

## Install

Run `yarn` to install dependencies.

## Test

Run `yarn test` to execute the test suite.

## Usage

Install this in another project via `yarn add @uniswap/lib`

Then import the contracts via:

```solidity
import '@uniswap/lib/contracts/libraries/Babylonian.sol';

```
