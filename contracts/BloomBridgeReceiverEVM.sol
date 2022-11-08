// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface CallProxy {
    function callProxy(address _target, bytes calldata _data)
        external
        returns (bytes memory);
}

contract BloomBridgeReceiverEVM {
    address private constant CALL_PROXY_ADDRESS =
        0xD2b88BA56891d43fB7c108F23FE6f92FEbD32045;
    address private destination;
}
