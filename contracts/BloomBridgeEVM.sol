// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface CallProxy {
    function callProxy(address _target, bytes calldata _data)
        external
        returns (bytes memory);
}

contract BloomBridgeEVM {
    address private constant CALL_PROXY_ADDRESS =
        0xD2b88BA56891d43fB7c108F23FE6f92FEbD32045;
    address private destination;
    address private DAI;
    address private RECEIVER;
    string private RECEIVER_CHAIN;

    constructor(
        address _dai,
        address receiverAddress,
        string memory receiver_chain
    ) {
        DAI = _dai;
        RECEIVER = receiverAddress;
        RECEIVER_CHAIN = receiver_chain;
    }
}
