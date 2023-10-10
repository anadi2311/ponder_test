import { ponder } from "@/generated";
import { Client } from "@covalenthq/client-sdk";

const ApiServices = async (address: string, api_key: string) => {
  try {
    const client = new Client(api_key);
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
      "eth-mainnet",
      address
    );
    console.log("The balance is: " + resp.data.items[0].balance);
  } catch (error) {
    console.error("Error fetching token balances:", error);
  }
};

ApiServices(
  "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
  "ckey_ecca9197bf304ba68a1115110e0"
);

function calculateAPR(rate: string | number | BigInt): number {
  const rateNum = typeof rate !== "number" ? Number(rate) : rate;
  return rateNum / 10 ** 18 * 3153600000;;
}

ponder.on("TransparentUpgradeableProxy:Supply", async ({ event, context }) => {
  const { Pool,AssetInfo } = context.entities;
  const { TransparentUpgradeableProxy } = context.contracts;
  // Concatenate the transaction hash and log index to create a unique ID
  const unique_pool_ID = `${event.transaction.hash}-${event.log.logIndex}`;

  const utilizationRate = await TransparentUpgradeableProxy.read.getUtilization();
  const borrowRate = await TransparentUpgradeableProxy.read.getBorrowRate([utilizationRate]);
  const supplyRate = await TransparentUpgradeableProxy.read.getSupplyRate([utilizationRate]);
  const totalBorrow = await TransparentUpgradeableProxy.read.totalBorrow();
  const totalSupply = await TransparentUpgradeableProxy.read.totalSupply();

  const borrowAPR = calculateAPR(borrowRate);
  const supplyAPR = calculateAPR(supplyRate);

  console.log(
    "utilization rate at " +
    unique_pool_ID +
    " is " +
    utilizationRate +
    " making a borrow rate of " +
    borrowAPR
  );
  console.log(
    "utilization rate at " +
    unique_pool_ID +
    " is " +
    utilizationRate +
    " making a supply rate of " +
    supplyAPR
  );

  const numAssets = await TransparentUpgradeableProxy.read.numAssets();


  const assetInfoArray = [];

  for (let i = 0; i < numAssets; i++) {
    const assetInfo = await TransparentUpgradeableProxy.read.getAssetInfo([i]);
    const totalcollateral = await TransparentUpgradeableProxy.read.totalsCollateral([assetInfo['asset']]);
    assetInfoArray.push(assetInfo);
    const unique_asset_ID = unique_pool_ID + assetInfo['asset']
    await AssetInfo.create( {
      id: unique_asset_ID,
      data: {
        pool_id: unique_pool_ID,
        offset: assetInfo['offset'],
        asset: assetInfo['offset'],
        priceFeed: assetInfo['priceFeed'],
        scale: assetInfo['scale'],
        borrowCollateralFactor: assetInfo['borrowCollateralFactor'],
        liquidateCollateralFactor: assetInfo['liquidateCollateralFactor'],
        liquidationFactor: assetInfo['liquidationFactor'],
        supplyCap: assetInfo['supplyCap'],
        totalcollateral: totalcollateral[0]
        }
      }
    )


  }


  console.log(assetInfoArray);

  await Pool.create({
    id: unique_pool_ID, // Use the unique ID
    data: {
      address: event.params.from,
      supplyAmount: event.params.amount,
      lastEmittedAt: event.block.timestamp,
      utilizationRate: utilizationRate,
      borrowRate: borrowRate,
      borrowAPR: borrowAPR,
      supplyRate: supplyRate, // Include supply rate in the data
      supplyAPR: supplyAPR, // Include supply APR in the data
      totalSupply: totalSupply,
      totalBorrow: totalBorrow,
    },
  });
});

// still neds price from chain link api or our endpoint

// chain_name: "eth-mainnet",
// chain_id: "1",
// signed_at: "2023-10-04T15:00:00Z",
// protocol_name: "compound",
// pool_address: "0xc3d688b66703497daa19211eedff47f25384cdc3",
/// pool_name: "Compound USDC"
// contract_address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
// contract_name: "Compound",
// contract_decimals: "18",
// contract_ticker_symbol: "COMP",
// total_collateral_balance: 8.999969841021206e+23,
// base_contract_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
// base_contract_name: "USD Coin",
// base_contract_decimals: 6,
// base_contract_ticke  r_symbol: "USDC",
// total_supplied_balance: "388303676615125",
// total_borrowed_balance: "362238167096127",
// total_available_balance: "26065509518998",
// utilization_rate: 0.932873389852465,
// borrow_apr: 0.04527908477869749,
// supply_apy: 0.03593008477869749,
// quote: 38958121.75028611,
// tvl_quote: 579796049.652113