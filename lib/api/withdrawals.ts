import { apiClient } from "@/lib/api";
import { SaveBankAccountPayload, RequestWithdrawalPayload, ResolveAccountPayload } from "@/types/payload";
import {
  BankInfo,
  HostBankAccount,
  EarningsWallet,
  WithdrawalResult,
  WithdrawalRecord,
  TransactionHistory,
  SettlementStatus,
} from "@/types/response";

export async function getBanksApi() {
  return apiClient.get<BankInfo[]>("/withdrawals/banks", {
    withCredentials: true,
  });
}

export async function getSavedBankAccountApi() {
  return apiClient.get<HostBankAccount | null>("/withdrawals/bank-account", {
    withCredentials: true,
  });
}

export async function resolveAccountApi(payload: ResolveAccountPayload) {
  return apiClient.post<{ accountName: string; accountNumber: string; bankCode: string }>(
    "/withdrawals/resolve-account",
    { data: payload, withCredentials: true },
  );
}

export async function saveBankAccountApi(payload: SaveBankAccountPayload) {
  return apiClient.post<HostBankAccount>("/withdrawals/bank-account", {
    data: payload,
    withCredentials: true,
  });
}

export async function requestWithdrawalApi(payload: RequestWithdrawalPayload) {
  return apiClient.post<WithdrawalResult>("/withdrawals/request", {
    data: payload,
    withCredentials: true,
  });
}

export async function getEarningsApi() {
  return apiClient.get<EarningsWallet>("/withdrawals/earnings", {
    withCredentials: true,
  });
}

export async function getWithdrawalHistoryApi() {
  return apiClient.get<WithdrawalRecord[]>("/withdrawals/history", {
    withCredentials: true,
  });
}

export async function getTransactionHistoryApi() {
  return apiClient.get<TransactionHistory>("/withdrawals/transactions", {
    withCredentials: true,
  });
}

export async function getSettlementStatusApi() {
  return apiClient.get<SettlementStatus>("/withdrawals/settlement-status", {
    withCredentials: true,
  });
}
