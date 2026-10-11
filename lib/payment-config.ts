// Account details shown to guests on the Payment step.
// The three wallets share one number; the bank account is separate.
export const PAYMENT_ACCOUNTS: Record<
  string,
  { accountTitle: string; accountNumber: string; extra?: string }
> = {
  "Bank Transfer": {
    accountTitle: "Zaid Muhammad",
    accountNumber: "0381319544402",
    extra: "UBL",
  },
  Easypaisa: {
    accountTitle: "Muhammad Ukasha",
    accountNumber: "0316 1240899",
  },
  JazzCash: {
    accountTitle: "Muhammad Ukasha",
    accountNumber: "0316 1240899",
  },
  Nayapay: {
    accountTitle: "Muhammad Ukasha",
    accountNumber: "0316 1240899",
  },
};
