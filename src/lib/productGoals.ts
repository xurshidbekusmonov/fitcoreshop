export const PRODUCT_GOALS = [
  "Mushak o‘stirish",
  "Vazn yig‘ish",
  "Mashq va tiklanish",
  "Kundalik salomatlik",
] as const;
export function productGoal(product: {
  goal?: string | null;
  category?: string;
}) {
  if (product.goal) return product.goal;
  return (
    (
      {
        Proteinlar: PRODUCT_GOALS[0],
        Geynerlar: PRODUCT_GOALS[1],
        Kreatin: PRODUCT_GOALS[2],
        Vitaminlar: PRODUCT_GOALS[3],
      } as Record<string, string>
    )[product.category || ""] || ""
  );
}
