export function mapProviderStatus(
  providerStatus: string,
): "paid" | "pending" | "failed" | "unknown" {
  switch (providerStatus) {
    case "RECEIVED":
    case "CONFIRMED":
    case "PENDING":
      return "paid";
    case "FAILED":
      return "failed";
    default:
      return "unknown";
  }
}
