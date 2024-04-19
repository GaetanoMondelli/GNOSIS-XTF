//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { RLPReader } from "solidity-rlp/contracts/RLPReader.sol";
import { MerklePatriciaProofVerifier } from ".//MerklePatriciaProofVerifier.sol";

interface IGiriGiriBashi {
	function getThresholdHash(
		uint256 domain,
		uint256 id
	) external view returns (bytes32);
}

interface IProver {
	error InvalidLatestCommitment(
		bytes32 latestCommitment,
		bytes32 expectedLatestCommitment
	);
	error InvalidBlockHeader(
		bytes32 blockHeaderHash,
		bytes32 expectedBlockHeaderHash
	);
	error InvalidAccountStorageRoot();
	error InvalidNonce(uint256 nonce, uint256 expectedNonce);
	error InvalidAccountRlp(bytes accountRlp);

	struct Proof {
		uint256 blockNumber;
		uint256 nonce;
		// bytes blockHeader;
		bytes32 storageRoot;
		// bytes accountProof;
		bytes storageProof;
	}

	function setAccount(address account) external;
}

contract Prover is IProver {
	using RLPReader for RLPReader.RLPItem;
	using RLPReader for bytes;

	uint256 public immutable SOURCE_CHAIN_ID;
	uint256 public immutable COMMITMENTS_SLOT;
	address public ACCOUNT;
	address public immutable GIRI_GIRI_BASHI;

	uint256 public expectedNonce;

	constructor(
		uint256 sourceChainId,
		uint256 commitmentsSlot,
		address giriGiriBashi
	) {
		SOURCE_CHAIN_ID = sourceChainId;
		COMMITMENTS_SLOT = commitmentsSlot;
		GIRI_GIRI_BASHI = giriGiriBashi;
	}

	// @inheritdoc IProver
	function setAccount(address account) external {
		ACCOUNT = account;
	}

	function _verifyProof(
		Proof calldata proof,
		bytes memory data
	) public returns (bool) {
		// bytes32 expectedBlockHeaderHash = IGiriGiriBashi(GIRI_GIRI_BASHI)
		// 	.getThresholdHash(SOURCE_CHAIN_ID, proof.blockNumber);
		// bytes32 blockHeaderHash = keccak256(proof.blockHeader);
		// if (expectedBlockHeaderHash != blockHeaderHash)
		// 	revert InvalidBlockHeader(blockHeaderHash, expectedBlockHeaderHash);

		// bytes32 expectedLatestCommitment = _verifyStorageProofAndGetValue(
		// 	_verifyAccountProofAndGetStorageRoot(
		// 		proof.blockHeader,
		// 		proof.accountProof
		// 	),
		// 	proof.storageProof
		// );
		bytes32 expectedLatestCommitment = _verifyStorageProofAndGetValue(
			proof.storageRoot,
			proof.storageProof
		);
		bytes32 latestCommitment = keccak256(
			abi.encode(block.chainid, data, proof.nonce)
		);
		if (expectedLatestCommitment != latestCommitment) {
			return false;
		}

		// _checkNonceAndIncrementExpectedNonce(proof.nonce);
		return true;
	}

	// function _verifyAccountProofAndGetStorageRoot(
	// 	bytes memory blockHeader,
	// 	bytes memory accountProof
	// ) internal view returns (bytes32) {
	// 	RLPReader.RLPItem[] memory blockHeaderFields = blockHeader
	// 		.toRlpItem()
	// 		.toList();
	// 	bytes32 stateRoot = bytes32(blockHeaderFields[3].toUint());
	// 	bytes memory accountRlp = MerklePatriciaProofVerifier.extractProofValue(
	// 		stateRoot,
	// 		abi.encodePacked(keccak256(abi.encodePacked(ACCOUNT))),
	// 		accountProof.toRlpItem().toList()
	// 	);
	// 	bytes32 accountStorageRoot = bytes32(
	// 		accountRlp.toRlpItem().toList()[2].toUint()
	// 	);
	// 	if (accountStorageRoot.length == 0) revert InvalidAccountStorageRoot();
	// 	RLPReader.RLPItem[] memory accountFields = accountRlp
	// 		.toRlpItem()
	// 		.toList();
	// 	if (accountFields.length != 4) revert InvalidAccountRlp(accountRlp); // [nonce, balance, storageRoot, codeHash]
	// 	return bytes32(accountFields[2].toUint());
	// }

	function _verifyStorageProofAndGetValue(
		bytes32 storageRoot,
		bytes calldata storageProof
	) internal view returns (bytes32) {
		bytes memory slotValue = MerklePatriciaProofVerifier.extractProofValue(
			storageRoot,
			// abi.encodePacked(
			// 	keccak256(
			// 		abi.encode(
			// 			keccak256(abi.encode(msg.sender, COMMITMENTS_SLOT))
			// 		)
			// 	)
			// ),
            abi.encodePacked(keccak256(abi.encodePacked(uint256(0)))),
			storageProof.toRlpItem().toList()
		);
		return _bytesToBytes32(slotValue);
	}

	function _checkNonceAndIncrementExpectedNonce(uint256 nonce) internal {
		if (nonce != expectedNonce) revert InvalidNonce(nonce, expectedNonce);
		unchecked {
			++expectedNonce;
		}
	}

	function _bytesToBytes32(
		bytes memory source
	) internal pure returns (bytes32 result) {
		if (source.length == 0) {
			return bytes32(0);
		}
		// solhint-disable-next-line
		assembly {
			result := mload(add(add(source, 1), 32))
		}
	}
}
