import * as GiriGiriDeployedContracts from "../../hardhat/deployments2/sepolia/GiriGiriBashi.json";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  11155111: {
    GiriGiriBashi: {
      address: GiriGiriDeployedContracts.address,
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "_hashi",
              type: "address",
            },
            {
              internalType: "address payable",
              name: "_bondRecipient",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AdapterAlreadyEnabled",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AdapterHasNotYetTimedOut",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AdapterNotEnabled",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AdapterNotQuarantined",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AdaptersCannotContainChallengedAdapter",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapterOne",
              type: "address",
            },
            {
              internalType: "contract IAdapter",
              name: "adapterTwo",
              type: "address",
            },
          ],
          name: "AdaptersDisagree",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "AlreadyQuarantined",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "CannotProveNoConfidence",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "ChallengeNotFound",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "ChallengeRangeAlreadySet",
          type: "error",
        },
        {
          inputs: [],
          name: "CountCannotBeZero",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "CountMustBeZero",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "DuplicateChallenge",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IHashi",
              name: "hashi",
              type: "address",
            },
          ],
          name: "DuplicateHashiAddress",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapterOne",
              type: "address",
            },
            {
              internalType: "contract IAdapter",
              name: "adapterTwo",
              type: "address",
            },
          ],
          name: "DuplicateOrOutOfOrderAdapters",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "DuplicateThreashold",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "InvalidAdapter",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "InvalidThreshold",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "NoAdaptersEnabled",
          type: "error",
        },
        {
          inputs: [],
          name: "NoAdaptersGiven",
          type: "error",
        },
        {
          inputs: [],
          name: "NoConfidenceRequired",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "NotEnoughValue",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "OutOfRange",
          type: "error",
        },
        {
          inputs: [],
          name: "ThresholdNotMet",
          type: "error",
        },
        {
          inputs: [],
          name: "UnequalArrayLengths",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "AdaptersDisabled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "AdaptersEnabled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address payable",
              name: "bondRecipient",
              type: "address",
            },
          ],
          name: "BondRecipientSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "challenger",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bond",
              type: "uint256",
            },
          ],
          name: "ChallengeCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "range",
              type: "uint256",
            },
          ],
          name: "ChallengeRangeUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "challenger",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bond",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "challengeSuccessful",
              type: "bool",
            },
          ],
          name: "ChallengeResolved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "contract IHashi",
              name: "hashi",
              type: "address",
            },
          ],
          name: "HashiSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "contract IHashi",
              name: "hashi",
              type: "address",
            },
          ],
          name: "Init",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint8",
              name: "version",
              type: "uint8",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "head",
              type: "uint256",
            },
          ],
          name: "NewHead",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "NoConfidenceDeclared",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "quarantined",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "minimumBond",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "startId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "idDepth",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timeout",
                  type: "uint256",
                },
              ],
              indexed: false,
              internalType: "struct IGiriGiriBashi.Settings",
              name: "settings",
              type: "tuple",
            },
          ],
          name: "SettingsInitialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "ThresholdSet",
          type: "event",
        },
        {
          inputs: [],
          name: "bondRecipient",
          outputs: [
            {
              internalType: "address payable",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "challengeAdapter",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "checkAdapterOrderAndValidity",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "declareNoConfidence",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "disableAdapters",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "quarantined",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "minimumBond",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "startId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "idDepth",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timeout",
                  type: "uint256",
                },
              ],
              internalType: "struct IGiriGiriBashi.Settings[]",
              name: "settings",
              type: "tuple[]",
            },
          ],
          name: "enableAdapters",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "getAdapterLink",
          outputs: [
            {
              components: [
                {
                  internalType: "contract IAdapter",
                  name: "previous",
                  type: "address",
                },
                {
                  internalType: "contract IAdapter",
                  name: "next",
                  type: "address",
                },
              ],
              internalType: "struct IShuSho.Link",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "getAdapters",
          outputs: [
            {
              internalType: "contract IAdapter[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
          ],
          name: "getChallenge",
          outputs: [
            {
              components: [
                {
                  internalType: "address payable",
                  name: "challenger",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "bond",
                  type: "uint256",
                },
              ],
              internalType: "struct IGiriGiriBashi.Challenge",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "getChallengeId",
          outputs: [
            {
              internalType: "bytes32",
              name: "challengeId",
              type: "bytes32",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "getChallengeRange",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "getDomain",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "threshold",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "count",
                  type: "uint256",
                },
              ],
              internalType: "struct IShuSho.Domain",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "getHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "hash",
              type: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
          ],
          name: "getHead",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
          ],
          name: "getSettings",
          outputs: [
            {
              components: [
                {
                  internalType: "bool",
                  name: "quarantined",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "minimumBond",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "startId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "idDepth",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timeout",
                  type: "uint256",
                },
              ],
              internalType: "struct IGiriGiriBashi.Settings",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain_",
              type: "uint256",
            },
          ],
          name: "getThresholdAndCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "getThresholdHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "hash",
              type: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "getUnanimousHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "hash",
              type: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "hashi",
          outputs: [
            {
              internalType: "contract IHashi",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "initParams",
              type: "bytes",
            },
          ],
          name: "init",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter[]",
              name: "currentAdapters",
              type: "address[]",
            },
            {
              internalType: "contract IAdapter[]",
              name: "newAdapters",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "quarantined",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "minimumBond",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "startId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "idDepth",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timeout",
                  type: "uint256",
                },
              ],
              internalType: "struct IGiriGiriBashi.Settings[]",
              name: "settings",
              type: "tuple[]",
            },
          ],
          name: "replaceQuarantinedAdapters",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "contract IAdapter",
              name: "adapter",
              type: "address",
            },
            {
              internalType: "contract IAdapter[]",
              name: "adapters",
              type: "address[]",
            },
          ],
          name: "resolveChallenge",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable",
              name: "_bondRecipient",
              type: "address",
            },
          ],
          name: "setBondRecipient",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "range",
              type: "uint256",
            },
          ],
          name: "setChallengeRange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IHashi",
              name: "_hashi",
              type: "address",
            },
          ],
          name: "setHashi",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "domain",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "setThreshold",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        challengeAdapter: "contracts/interfaces/IGiriGiriBashi.sol",
        checkAdapterOrderAndValidity: "contracts/ownable/ShuSo.sol",
        declareNoConfidence: "contracts/interfaces/IGiriGiriBashi.sol",
        disableAdapters: "contracts/interfaces/IGiriGiriBashi.sol",
        enableAdapters: "contracts/interfaces/IGiriGiriBashi.sol",
        getAdapterLink: "contracts/ownable/ShuSo.sol",
        getAdapters: "contracts/ownable/ShuSo.sol",
        getChallenge: "contracts/interfaces/IGiriGiriBashi.sol",
        getChallengeId: "contracts/interfaces/IGiriGiriBashi.sol",
        getChallengeRange: "contracts/interfaces/IGiriGiriBashi.sol",
        getDomain: "contracts/ownable/ShuSo.sol",
        getHash: "contracts/interfaces/IGiriGiriBashi.sol",
        getHead: "contracts/interfaces/IGiriGiriBashi.sol",
        getSettings: "contracts/interfaces/IGiriGiriBashi.sol",
        getThresholdAndCount: "contracts/ownable/ShuSo.sol",
        getThresholdHash: "contracts/interfaces/IGiriGiriBashi.sol",
        getUnanimousHash: "contracts/interfaces/IGiriGiriBashi.sol",
        hashi: "contracts/ownable/ShuSo.sol",
        replaceQuarantinedAdapters: "contracts/interfaces/IGiriGiriBashi.sol",
        resolveChallenge: "contracts/interfaces/IGiriGiriBashi.sol",
        setBondRecipient: "contracts/interfaces/IGiriGiriBashi.sol",
        setChallengeRange: "contracts/interfaces/IGiriGiriBashi.sol",
        setThreshold: "contracts/interfaces/IGiriGiriBashi.sol",
        init: "contracts/ownable/ShuSo.sol",
        owner: "contracts/ownable/ShuSo.sol",
        renounceOwnership: "contracts/ownable/ShuSo.sol",
        setHashi: "contracts/ownable/ShuSo.sol",
        transferOwnership: "contracts/ownable/ShuSo.sol",
      },
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
