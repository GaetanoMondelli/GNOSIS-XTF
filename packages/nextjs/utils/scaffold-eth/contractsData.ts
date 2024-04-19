import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-eth/contract";

export function getAllContracts(chainId: number = scaffoldConfig.targetNetworks[0].id) {
  const contractsData = contracts?.[chainId];
  return contractsData ? contractsData : {};
}
