export const formatPrice = (value: number | string | undefined) =>
  Number(value ?? 0)
    .toLocaleString("en-US")
    .replaceAll(",", " ");
