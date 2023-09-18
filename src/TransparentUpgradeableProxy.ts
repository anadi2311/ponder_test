import { ponder } from "@/generated";

ponder.on("TransparentUpgradeableProxy:Supply", async ({ event, context }) => {
  const { Pool } = context.entities;

  // Concatenate the transaction hash and log index to create a unique ID
  const uniqueID = `${event.transaction.hash}-${event.log.logIndex}`;

  await Pool.create({
    id: uniqueID, // Use the unique ID
    data: {
      address: event.params.from,
      supplyAmount: event.params.amount,
    },
  });
});
