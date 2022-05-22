import { Injectable } from "@nestjs/common";
import Safe, { SafeFactory, EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import { ConfigService } from "@nestjs/config";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial, SafeTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import SafeServiceClient, {
  SafeMultisigTransactionListResponse,
  SafeMultisigTransactionResponse,
} from "@gnosis.pm/safe-service-client";

@Injectable()
export class GnosisService {
  ethAdapter: EthersAdapter;
  signer: ethers.Wallet;
  safeService: SafeServiceClient;
  constructor(private readonly configService: ConfigService) {
    const chainName = this.configService.get("chainName");
    const provider = new ethers.providers.AlchemyProvider(chainName, process.env.ALCHEMY_API_KEY);
    const privateKey = this.configService.get("dyspay.privateKey");
    const txServiceUrl = this.configService.get("gnosis.txServiceUrl");
    this.signer = new ethers.Wallet(privateKey, provider);
    this.ethAdapter = new EthersAdapter({ ethers, signer: this.signer });
    this.safeService = new SafeServiceClient({
      txServiceUrl,
      ethAdapter: this.ethAdapter,
    });
  }

  async createTransaction(
    safeTxHash: string,
    safeAddress: string
  ): Promise<ethers.ContractReceipt> {
    const transaction = await this.getTransaction(safeTxHash);
    if (!transaction) return;
    const safeTransactionData: SafeTransactionData = {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      operation: transaction.operation,
      safeTxGas: transaction.safeTxGas,
      baseGas: transaction.baseGas,
      gasPrice: Number(transaction.gasPrice),
      gasToken: transaction.gasToken,
      refundReceiver: transaction.refundReceiver,
      nonce: transaction.nonce,
    };
    const safeSdk = await Safe.create({ ethAdapter: this.ethAdapter, safeAddress });
    const safeTransaction = await safeSdk.createTransaction(safeTransactionData);
    transaction.confirmations.forEach((confirmation) => {
      const signature = new EthSignSignature(confirmation.owner, confirmation.signature);
      safeTransaction.addSignature(signature);
    });
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    return (
      executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
    );
  }

  async getPendingTransaction(safeAddress: string): Promise<SafeMultisigTransactionListResponse> {
    return await this.safeService.getPendingTransactions(safeAddress);
  }

  async getTransaction(safeTxHash: string): Promise<SafeMultisigTransactionResponse> {
    return await this.safeService.getTransaction(safeTxHash);
  }
}
