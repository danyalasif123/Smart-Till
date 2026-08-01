// ==========================================
// CURRENCY
// ==========================================

export const formatCurrency = (
  amount
) => {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(
    Number(amount || 0)
  );
};


// ==========================================
// DATE
// ==========================================

export const formatDate = (
  date
) => {
  if (!date) {
    return "-";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// ==========================================
// TEXT
// ==========================================

export const formatText = (
  value
) => {
  if (!value) {
    return "-";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};


// ==========================================
// PERCENT
// ==========================================

export const formatPercent = (
  value
) => {
  return `${Number(
    value || 0
  ).toFixed(2)}%`;
};