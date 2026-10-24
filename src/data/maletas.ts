export type MaletaKit = {
  id: string;
  name: string;
  tier: "maleta" | "emprendedora";
  price: number;
  image: string;
  inventoryLabel: string;
  contents: string[];
  paymentLink: string;
  featured?: boolean;
};

export const maletas: MaletaKit[] = [
  {
    id: "maleta-1",
    name: "Maleta #1",
    tier: "maleta",
    price: 299,
    image: "/image4.png",
    inventoryLabel: "Inventario para 3 órdenes",
    contents: [
      "1 S · 20 mg",
      "1 T · 30 mg",
      "1 R/A · 20 mg",
      "3 NAD+ · 1000 mg",
      "3 Fb + B12",
    ],
    paymentLink: "https://buy.stripe.com/aFa28q1BP2Zg57ecPfaR43U",
  },
  {
    id: "maleta-2",
    name: "Maleta #2",
    tier: "maleta",
    price: 329,
    image: "/image3.png",
    inventoryLabel: "Inventario para 3 órdenes",
    contents: [
      "1 S · 10 mg",
      "1 S · 20 mg",
      "1 S · 30 mg",
      "3 Fb + B12",
      "3 NAD+ · 1000 mg",
      "3 GHK-Cu · 100 mg",
    ],
    paymentLink: "https://buy.stripe.com/fZu6oGdkx6bs2Z616xaR43V",
  },
  {
    id: "maleta-3",
    name: "Maleta #3",
    tier: "maleta",
    price: 399,
    image: "/image1.png",
    inventoryLabel: "Inventario para 3 órdenes",
    contents: [
      "1 T · 20 mg",
      "1 T · 30 mg",
      "1 T · 40 mg",
      "3 Fb + B12",
      "3 NAD+ · 1000 mg",
      "3 MOTS-C · 40 mg",
    ],
    paymentLink: "https://buy.stripe.com/8x2eVc1BP6bseHOcPfaR43W",
  },
  {
    id: "maleta-4",
    name: "Maleta #4",
    tier: "maleta",
    price: 349,
    image: "/image0.png",
    inventoryLabel: "Inventario para 3 órdenes",
    contents: [
      "1 R/A · 10 mg",
      "1 R/A · 20 mg",
      "1 R/A · 30 mg",
      "3 NAD+ · 1000 mg",
      "3 Fb + B12",
    ],
    paymentLink: "https://buy.stripe.com/4gM8wO94harIbvCg1raR43X",
  },
  {
    id: "emprendedora-start",
    name: "Emprendedora Start",
    tier: "emprendedora",
    price: 399,
    image: "/image6.png",
    inventoryLabel: "6 viales · Precio de oportunidad",
    contents: [
      "2 T · 30 mg, 40 mg",
      "2 S · 20 mg, 30 mg",
      "2 R/A · 20 mg, 30 mg",
    ],
    paymentLink: "https://buy.stripe.com/aFabJ02FT57oary4iJaR43Y",
  },
  {
    id: "emprendedora-vip",
    name: "Emprendedora VIP",
    tier: "emprendedora",
    price: 599,
    image: "/image5.png",
    inventoryLabel: "9 viales · Precio de oportunidad",
    featured: true,
    contents: [
      "3 T · 20 mg, 30 mg, 40 mg",
      "3 S · 10 mg, 20 mg, 30 mg",
      "3 R/A · 10 mg, 20 mg, 30 mg",
    ],
    paymentLink: "https://buy.stripe.com/dRm7sK1BP6bsdDK3eFaR43Z",
  },
];
