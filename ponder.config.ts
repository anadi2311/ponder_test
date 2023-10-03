import type { Config } from "@ponder/core";

export const config: Config = {
  networks: [
    { name: "mainnet", chainId: 1, rpcUrl: process.env.PONDER_RPC_URL_1 },
  ],
  contracts: [
    {
      name: "TransparentUpgradeableProxy",
      network: "mainnet",
      abi: [
        "./abis/TransparentUpgradeableProxy.json",
        "./abis/CometFactory_0x1c18.json",
        "./abis/Comet_0x42f9.json",
        "./abis/Comet_0xe07c.json",
        "./abis/Comet_0x2db4.json",
        "./abis/Comet_0x1f0a.json",
        "./abis/Comet_0x528c.json",
        "./abis/Comet_0x9a75.json",
        "./abis/Comet_0xc82f.json",
        "./abis/Comet_0x7770.json",
        "./abis/Comet_0x7560.json",
        "./abis/Comet_0xcb00.json",
        "./abis/Comet_0x3bee.json",
        "./abis/Comet_0xea27.json",
        "./abis/Comet_0xd1be.json",
      ],
      address: "0xC3D688B66703497DAA19211EEDFF47F25384CDC3",
      startBlock: 18271730,
    },
  ],
};
