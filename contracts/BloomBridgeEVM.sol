// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Wormhole/ITokenBridge.sol";

contract BloomBridgeEVM {
    string private current_msg;
    address private DAI;
    IERC20 private DAIContract;
    address wormhole_token_bridge_address;
    ITokenBridge private token_bridge;
    uint32 nonce = 0;

    constructor(address _dai, address _wormhole_token_bridge_address) {
        DAI = _dai;
        DAIContract = IERC20(DAI);
        wormhole_token_bridge_address = _wormhole_token_bridge_address;
        token_bridge = ITokenBridge(wormhole_token_bridge_address);
    }

    function bridgeDAI(
        uint256 amountToTransfer,
        uint16 receipientChainId,
        bytes32 recipient
    ) public returns (uint64 sequence) {
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
