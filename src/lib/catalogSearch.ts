const aliases: Record<string, string> = {
  kreatin: "creatine",
  creatin: "creatine",
  креатин: "creatine",
  proteinlar: "protein",
  протеин: "protein",
  протеины: "protein",
  geynerlar: "gainer",
  geyner: "gainer",
  гейнер: "gainer",
  vitaminlar: "vitamin",
  витамины: "vitamin",
  monogidrat: "monohydrate",
  моногидрат: "monohydrate",
};

function terms(text: string) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).map(
    (word) => Object.hasOwn(aliases, word) ? aliases[word] : word,
  );
}

export function catalogMatches(text: string, query: string) {
  const haystack = terms(text).join(" ");
  return terms(query).every((word) => haystack.includes(word));
}
