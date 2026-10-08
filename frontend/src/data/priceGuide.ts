export type PriceItem = {
  name: string;
  price: string;
};

export type PriceCategory = {
  category: string;
  items: PriceItem[];
};

export const priceGuide: PriceCategory[] = [
  {
    category: "Shirts",
    items: [
      { name: "Casual Shirts", price: "GH₵200–300" },
      { name: "Official Shirts", price: "GH₵200–450" },
      { name: "Lacoste", price: "GH₵200–400" },
      { name: "T-Shirts", price: "GH₵90–280" },
    ],
  },
  {
    category: "Plain T-Shirts",
    items: [
      { name: "Zara", price: "GH₵200" },
      { name: "Converse", price: "GH₵160–180" },
      { name: "Polo", price: "GH₵160" },
      { name: "Others", price: "GH₵90" },
    ],
  },
  {
    category: "Jeans",
    items: [{ name: "Jeans", price: "GH₵250–550" }],
  },
  {
    category: "Sneakers & Shoes",
    items: [
      { name: "Sneakers", price: "GH₵300–1,500+" },
      { name: "Shoes", price: "GH₵450–1,250" },
    ],
  },
  {
    category: "Slides & Sandals",
    items: [
      { name: "Slides", price: "GH₵180–550" },
      { name: "Sandals", price: "GH₵300–600" },
    ],
  },
  {
    category: "Birkenstock",
    items: [
      { name: "Zurich", price: "GH₵500" },
      { name: "Arizona", price: "GH₵400" },
      { name: "Boston", price: "GH₵600" },
    ],
  },
  {
    category: "Belts & Wallets",
    items: [
      { name: "Belt Set (double-sided belt + wallet)", price: "GH₵300" },
      { name: "Double-Sided Belt Alone", price: "GH₵160" },
      { name: "Wallet Set (wallet + keychain + card holder)", price: "GH₵230" },
      { name: "Wallet Alone", price: "GH₵150" },
    ],
  },
  {
    category: "Watches",
    items: [
      { name: "Watches", price: "GH₵350–2,500" },
      { name: "Ladies Curren Watch", price: "GH₵270" },
    ],
  },
  {
    category: "Perfumes",
    items: [{ name: "Perfumes", price: "GH₵300–1,200" }],
  },
  {
    category: "9PM Collection",
    items: [
      { name: "9AM Dive", price: "GH₵450 (packaging) / GH₵650 (retail)" },
      { name: "9PM Rebel", price: "GH₵450 (packaging) / GH₵650 (retail)" },
      { name: "9PM Elixir", price: "GH₵450 (packaging) / GH₵650 (retail)" },
    ],
  },
  {
    category: "Accessories",
    items: [
      { name: "Eyewear", price: "GH₵250–800" },
      { name: "New Era Caps", price: "GH₵180–220" },
      { name: "Beanie", price: "GH₵90–200" },
    ],
  },
  {
    category: "Other",
    items: [
      { name: "Tracksuit", price: "GH₵450–650" },
      { name: "Men's Top and Down", price: "GH₵380–650" },
      { name: "Corporate Vest", price: "GH₵250" },
    ],
  },
];
