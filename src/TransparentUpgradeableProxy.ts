import { ponder } from "@/generated";

ponder.on("TransparentUpgradeableProxy:Supply", async ({ event, context }) => {
  const { Pool } = context.entities;
  const { TransparentUpgradeableProxy} = context.contracts
  // Concatenate the transaction hash and log index to create a unique ID
  const uniqueID = `${event.transaction.hash}-${event.log.logIndex}`;


  const utilizationRate = await TransparentUpgradeableProxy.read.getUtilization()
  const borrowRate = await TransparentUpgradeableProxy.read.getBorrowRate([utilizationRate])
  const borrowAPR = Number(borrowRate) / (10**18) * 3153600000
  console.log(borrowAPR)
  console.log("utilization rate at " + uniqueID + " is " + utilizationRate);
  await Pool.create({
    id: uniqueID, // Use the unique ID
    data: {
      address: event.params.from,
      supplyAmount: event.params.amount,
      lastEmittedAt: event.block.timestamp,
      utilizationRate: utilizationRate,
      borrowRate: borrowRate,
      borrowAPR: borrowAPR
    },
  });
});
