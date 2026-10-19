export const numberWithCommas = (x: number) => {
  const s = (x ?? 0).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Message to show for a failed API request
export function apiErrorMessage(
  error: any,
  fallback: string,
  t: (key: string) => string,
): string {
  const detail = error?.response?.data;
  return typeof detail === "string" ? detail : fallback;
}
