//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Committer {
    bytes32 public latestCommitment;
    uint256 public nonce;
    uint256 public immutable TARGET_CHAIN_ID;
    uint256 public constant BROADCAST_CHAIN_ID = 0;

    constructor(uint256 targetChainId) {
        TARGET_CHAIN_ID = targetChainId;
    }

    function _generateCommitment(bytes memory data) public {
        uint256 currentNonce = nonce;
        bytes32 commitment = keccak256(abi.encode(BROADCAST_CHAIN_ID, data, currentNonce));
        latestCommitment = commitment;
        unchecked {
            ++nonce;
        }
    }
}