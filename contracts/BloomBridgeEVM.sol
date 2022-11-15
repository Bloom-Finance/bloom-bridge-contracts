// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Wormhole/ITokenBridge.sol";

contract BloomBridgeEVM {
    string private current_msg;
    address private DAI = 0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844;
    IERC20 private DAIContract = IERC20(DAI);
    address wormhole_token_bridge_address =
        address(0xF890982f9310df57d00f659cf4fd87e65adEd8d7);
    ITokenBridge private token_bridge =
        ITokenBridge(wormhole_token_bridge_address);
    uint32 nonce = 0;

    constructor() {}

    function bridgeDAIToMumbai(
        uint256 amountToTransfer,
        uint16 receipientChainId,
        bytes32 recipient
    ) public returns (uint64 sequence) {
        //To initiate transfer of normal ERC-20s
        nonce += 1;
        return
            token_bridge.transferTokens(
                DAI,
                amountToTransfer,
                receipientChainId,
                recipient,
                0,
                nonce
            );
    }

    function approveTokenBridge(uint256 amount) public returns (bool) {
        return DAIContract.approve(wormhole_token_bridge_address, amount);
    }

    function completeTransfer(bytes memory vaa) public {
        token_bridge.completeTransfer(vaa);
    }
}
