#!/usr/bin/env bash
rm -rf build/abi
mkdir -p build/abi

contracts=(
UniswapV2ERC20
UniswapV2Factory
UniswapV2Pair
)

for contract in "${contracts[@]}"; do
  cat build/contracts/${contract}.json | jq -c '.abi' > build/abi/${contract}.json
done

cd build/abi

tar -czvf abi.tar.gz *.json
