import { Cell, loadMessage } from "@ton/core";
import {
  type BlockchainTransaction,
  Blockchain,
  wrapTonClient4ForRemote,
  RemoteBlockchainStorage,
} from "@ton/sandbox";
import { TonClient4 } from "@ton/ton";

export async function getEmulatedTxInfo(
  cell: Cell | undefined,
  ignoreChecksig: boolean = false,
) {
  const blockchain = await Blockchain.create({
    storage: new RemoteBlockchainStorage(
      wrapTonClient4ForRemote(
        new TonClient4({
          endpoint: "https://mainnet-v4.tonhubapi.com",
        }),
      ),
    ),
  });
  // Somehow need to fetch libs
  // blockchain.libs = megaLibsCell;

  blockchain.verbosity = {
    blockchainLogs: true,
    vmLogs: "vm_logs_full",
    debugLogs: true,
    print: false,
  };

  const msg = loadMessage(cell.beginParse());
  const iter = await blockchain.sendMessageIter(msg, {
    ignoreChksig: ignoreChecksig,
  });

  const transactions: BlockchainTransaction[] = [];
  for await (const tx of iter) {
    transactions.push(tx);
  }

  return transactions;
}
