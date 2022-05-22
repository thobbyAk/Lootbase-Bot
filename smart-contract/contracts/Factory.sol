//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./GroupManagement.sol";
import './interfaces/Ifactory.sol';
import './interfaces/Ignosis.sol';

contract Factory is IFactory {

    IGnosisSafeProxyFactory private PROXY_FACTORY;
    address private MASTER_COPY;

    constructor(IGnosisSafeProxyFactory _PROXY_FACTORY, address _MASTER_COPY) {
        PROXY_FACTORY = IGnosisSafeProxyFactory(_PROXY_FACTORY);
        MASTER_COPY = _MASTER_COPY;
    }


    function createGroup(
        address[] memory _gnosisowners,
        string memory _groupName, 
        string memory _groupSymbol, 
        address _depositToken,
        uint256 _depositEndDate,
        uint256 _depositLimit,
        uint256 _maxMembers) external override returns (address groupAddress, address safeAddress)  {
        bytes memory proxyInitData = abi.encodeWithSelector(
            IGnosisSafeSetup.setup.selector,
            _gnosisowners,
            2,
            address(0x0),
            new bytes(0),
            address(0x0),
            address(0x0),
            0,
            address(0x0)
        );    
        address payable safe = PROXY_FACTORY.createProxy(MASTER_COPY, proxyInitData);
        require(safe != address(0x0), "Safe deployment failed");
        safeAddress = address(safe);

        GroupManagement group = new GroupManagement(_groupName, _groupSymbol, _depositToken, _depositEndDate, _depositLimit, _maxMembers, safeAddress, msg.sender);
        groupAddress = address(group);

        emit NewGroup(groupAddress, msg.sender, _groupName, _groupSymbol, _depositToken, _depositEndDate, _depositLimit, _maxMembers, safeAddress);

    }
}