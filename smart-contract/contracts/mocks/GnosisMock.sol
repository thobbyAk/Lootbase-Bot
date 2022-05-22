//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GnosisSafeProxyMock {
  address masterCopy;
  bytes data;
  constructor() { }
  function createProxy(address _masterCopy, bytes calldata _data) external returns (address payable proxy)
    {
        masterCopy = _masterCopy;
        data = _data;
        proxy = payable(address(this));
    }

    fallback() external payable {
    }

    receive() external payable {
    }

}

