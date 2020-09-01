#!/usr/bin/env bash

usage() {
   cat << EOT
Usage: $0 [option] command
Options:
   --method     method      what method to use for deployment (truffle or hmy)
   --network    network     what network to deploy to (testnet or mainnet)
   --reset                  if truffle should be run with --reset
   --help                   print this help
EOT
}

while [ $# -gt 0 ]
do
  case $1 in
  --method) method="${2}" ; shift;;
  --network) network="${2}" ; shift;;
  --reset) reset=true;;
  --skip-dry-run) skip_dry_run=true;;
  -h|--help) usage; exit 1;;
  (--) shift; break;;
  (-*) usage; exit 1;;
  (*) break;;
  esac
  shift
done

set_defaults() {  
  if [ -z "$method" ]; then
    method="hmy"
  fi
  
  if [ -z "$network" ]; then
    network="testnet"
  fi
  
  if [ -z "$reset" ]; then
    reset=false
  fi

  if [ -z "$skip_dry_run" ]; then
    skip_dry_run=false
  fi
}

truffle_deployment() {
  if [ "$reset" = true ]; then
    reset="--reset"
  fi

  if [ "$skip_dry_run" = true ]; then
    skip_dry_run="--skip-dry-run"
  fi

  echo "Deploying using truffle - command: truffle migrate --network $network $reset $skip_dry_run"
  truffle migrate --network $network $reset $skip_dry_run
}

hmy_deployment() {
  echo "Deploying using hmy - network: ${network}"
  node tools/deployment/deploy.js --network $network
}

deploy() {
  set_defaults

  if [ "$method" = "hmy" ]; then
    hmy_deployment
  else
    truffle_deployment
  fi
}

deploy
