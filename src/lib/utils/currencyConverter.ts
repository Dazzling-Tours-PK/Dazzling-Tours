/**
 * Currency Symbol Utility
 * Returns currency symbols with PKR as default
 */

export type CurrencyCode =
  | "USD"
  | "PKR"
  | "EUR"
  | "GBP"
  | "INR"
  | "AED"
  | "SAR"
  | string;

/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  PKR: "₨",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
};

/**
 * Gets the currency symbol for a given currency code
 * Defaults to PKR (₨) if currency is not found
 * @param currency - Currency code (default: "PKR")
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode = "PKR"): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || CURRENCY_SYMBOLS.PKR;
}

/**
 * Formats a number with currency symbol
 * Defaults to PKR symbol
 * @param amount - The amount to format
 * @param currency - Currency code (default: "PKR")
 * @returns Formatted string with symbol and number
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "PKR",
): string {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedAmount}`;
}
