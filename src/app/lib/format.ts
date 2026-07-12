export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateTime(date: string) {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function toDateInputValue(date?: string) {
  if (!date) {
    return new Date().toISOString().slice(0, 10);
  }
  return new Date(date).toISOString().slice(0, 10);
}
