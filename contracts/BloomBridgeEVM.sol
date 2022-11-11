// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./Wormhole/IWormhole.sol";

contract BloomBridgeEVM {
    string private current_msg;
    address private DAI;
    address wormhole_core_bridge_address =
        address(0x706abc4E45D419950511e474C7B9Ed348A4a716c);
    uint32 nonce = 0;
    address owner;
    mapping(uint16 => bytes32) _applicationContracts;
    IWormhole core_bridge = IWormhole(wormhole_core_bridge_address);
    mapping(bytes32 => bool) _completedMessages;

    constructor() {
        owner = msg.sender;
    }

    function sendMsg(bytes memory str) public returns (uint64 sequence) {
        sequence = core_bridge.publishMessage(nonce, str, 200);
        nonce = nonce + 1;
    }

    function receiveEncodedMsg(bytes memory encodedMsg) public {
        (IWormhole.VM memory vm, bool valid, string memory reason) = core_bridge
            .parseAndVerifyVM(encodedMsg);
        require(valid, reason);
        require(
            _applicationContracts[vm.emitterChainId] == vm.emitterAddress,
            "Invalid Emitter Address!"
        );
        require(!_completedMessages[vm.hash], "Message already processed");
        _completedMessages[vm.hash] = true;
        current_msg = string(vm.payload);
    }

    function getCurrentMsg() public view returns (string memory) {
        return current_msg;
    }

    function registerApplicationContracts(
        uint16 chainId,
        bytes32 applicationAddr
    ) public {
        require(msg.sender == owner, "Only owner can register new chains!");
        _applicationContracts[chainId] = applicationAddr;
    }
}
