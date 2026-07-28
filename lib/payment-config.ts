// TODO: fill in real account details before going live.
// These are placeholders shown to guests on the Payment step.
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
    accountTitle: "N/A",
    accountNumber: "N/A",
  },
  JazzCash: {
    accountTitle: "N/A",
    accountNumber: "N/A",
  },
  Sadapay: {
    accountTitle: "N/A",
    accountNumber: "N/A",
  },
  Nayapay: {
    accountTitle: "N/A",
    accountNumber: "N/A",
  },
};
