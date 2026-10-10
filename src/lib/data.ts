import hero from "@/assets/hero.jpg";
import roasted from "@/assets/roasted.jpg";
import green from "@/assets/green.jpg";
import drying from "@/assets/drying.jpg";

export const IMAGES = { hero, roasted, green, drying };
export const USD_RATE = 16000; // DEMO fixed rate: 1 USD = Rp16,000

export type Tier = { minKg: number; pricePerKg: number };
export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  sellerId: string;
  sellerName: string;
  sellerType: string;
  originId: string;
  originName: string;
  province: string;
  species: "Arabica" | "Robusta" | "Liberica";
  variety: string;
  processingMethod: string;
  beanFormat: "Green Bean" | "Roasted Bean" | "Ground";
  roastLevel?: string;
  flavorNotes: string[];
  body: string;
  acidity: string;
  stockKg: number;
  minimumOrderKg: number;
  pricePerKg: number;
  priceTiers: Tier[];
  harvestSeason: string;
  sampleAvailable: boolean;
  createdAt: string;
  status: "active" | "draft";
  demoData: true;
};
export type Origin = {
  id: string;
  name: string;
  province: string;
  description: string;
  varieties: string[];
  flavor: string;
  demoData: true;
};
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
  org: string;
  country: string;
};

export const ORIGINS: Origin[] = [
  {
    id: "gayo",
    name: "Gayo",
    province: "Aceh",
    description: "Highland arabica grown around Lake Laut Tawar at 1,200–1,700 masl.",
    varieties: ["Ateng", "Tim Tim", "Abyssinia"],
    flavor: "Herbal, chocolate, low acidity",
    demoData: true,
  },
  {
    id: "mandheling",
    name: "Mandheling",
    province: "North Sumatra",
    description: "Classic wet-hulled Sumatran coffee with heavy body.",
    varieties: ["Sigarar Utang", "Ateng"],
    flavor: "Earthy, cedar, dark cocoa",
    demoData: true,
  },
  {
    id: "kintamani",
    name: "Kintamani",
    province: "Bali",
    description: "Volcanic soils, intercropped with citrus under the Subak Abian system.",
    varieties: ["S795", "Kopyol"],
    flavor: "Citrus, bright, clean",
    demoData: true,
  },
  {
    id: "toraja",
    name: "Toraja",
    province: "South Sulawesi",
    description: "Mountain coffee from the Sesean and Sapan highlands.",
    varieties: ["S795", "Typica"],
    flavor: "Spice, dark fruit, syrupy",
    demoData: true,
  },
  {
    id: "flores",
    name: "Flores Bajawa",
    province: "East Nusa Tenggara",
    description: "Grown on the slopes of Mount Inerie by smallholder groups.",
    varieties: ["Typica", "S795"],
    flavor: "Floral, caramel, mild",
    demoData: true,
  },
  {
    id: "java",
    name: "Java Ijen",
    province: "East Java",
    description: "Plateau estates and smallholders around the Ijen volcano.",
    varieties: ["Typica", "USDA"],
    flavor: "Nutty, sweet, balanced",
    demoData: true,
  },
  {
    id: "papua",
    name: "Wamena",
    province: "Highland Papua",
    description: "Remote Baliem Valley coffee, small volumes from family plots.",
    varieties: ["Typica"],
    flavor: "Sweet, floral, delicate",
    demoData: true,
  },
  {
    id: "lampung",
    name: "Lampung",
    province: "Lampung",
    description: "Indonesia's robusta heartland on southern Sumatra.",
    varieties: ["Robusta BP"],
    flavor: "Bold, cocoa, bitter-sweet",
    demoData: true,
  },
];

export const SELLERS = [
  { id: "s1", name: "Koperasi Gayo Lestari", type: "Cooperative" },
  { id: "s2", name: "Tani Kopi Kintamani", type: "Farmer Group" },
  { id: "s3", name: "Toraja Highland Processors", type: "Processor" },
];

export const DEMO_USERS: User[] = [
  {
    id: "s1",
    name: "Pak Rahmat",
    email: "seller@asal.demo",
    password: "demo1234",
    role: "seller",
    org: "Koperasi Gayo Lestari",
    country: "Indonesia",
  },
  {
    id: "s2",
    name: "Bu Komang",
    email: "seller2@asal.demo",
    password: "demo1234",
    role: "seller",
    org: "Tani Kopi Kintamani",
    country: "Indonesia",
  },
  {
    id: "s3",
    name: "Pak Yohanis",
    email: "seller3@asal.demo",
    password: "demo1234",
    role: "seller",
    org: "Toraja Highland Processors",
    country: "Indonesia",
  },
  {
    id: "b1",
    name: "Sarah Lim",
    email: "buyer@asal.demo",
    password: "demo1234",
    role: "buyer",
    org: "Northbound Roasters",
    country: "Singapore",
  },
  {
    id: "b2",
    name: "Dimas Putra",
    email: "buyer2@asal.demo",
    password: "demo1234",
    role: "buyer",
    org: "Kedai Senja",
    country: "Indonesia",
  },
];

const processes = ["Washed", "Natural", "Honey", "Wet-Hulled"];
const formats = ["Green Bean", "Roasted Bean", "Green Bean", "Ground"] as const;
const notes = [
  ["Chocolate", "Spice", "Cedar"],
  ["Orange", "Jasmine", "Honey"],
  ["Dark cherry", "Clove", "Molasses"],
  ["Caramel", "Almond", "Brown sugar"],
  ["Cocoa", "Tobacco", "Earthy"],
  ["Lemon", "Black tea", "Florals"],
];
const imgFor = (f: string, i: number) => (f === "Green Bean" ? (i % 2 ? green : drying) : roasted);

export const SEED_PRODUCTS: Product[] = Array.from({ length: 20 }, (_, i) => {
  const o = ORIGINS[i % ORIGINS.length]!;
  const s = SELLERS[i % 3]!;
  const species = o.id === "lampung" ? "Robusta" : i === 13 ? "Liberica" : "Arabica";
  const fmt = formats[i % 4]!;
  const base =
    (species === "Robusta" ? 75000 : 120000) + (i % 5) * 9000 + (fmt !== "Green Bean" ? 40000 : 0);
  const tiered = i % 3 !== 2;
  const proc = processes[i % 4]!;
  const roast = fmt === "Green Bean" ? undefined : ["Light", "Medium", "Medium-Dark"][i % 3];
  return {
    id: `p${i + 1}`,
    name: `${o.name} ${species} ${proc}${i >= 8 ? " Lot " + (i + 1) : ""}`,
    description: `A ${proc.toLowerCase()} ${species.toLowerCase()} from ${o.name}, ${o.province}. ${o.description} Sample listing for demonstration.`,
    image: imgFor(fmt, i),
    sellerId: s.id,
    sellerName: s.name,
    sellerType: s.type,
    originId: o.id,
    originName: o.name,
    province: o.province,
    species,
    variety: o.varieties[i % o.varieties.length] ?? "Typica",
    processingMethod: proc,
    beanFormat: fmt,
    ...(roast ? { roastLevel: roast } : {}),
    flavorNotes: notes[i % notes.length]!,
    body: ["Light", "Medium", "Full"][i % 3]!,
    acidity: ["Low", "Medium", "Bright"][(i + 1) % 3]!,
    stockKg: 40 + ((i * 37) % 460),
    minimumOrderKg: fmt === "Green Bean" && i % 2 ? 5 : 1,
    pricePerKg: base,
    priceTiers: tiered
      ? [
          { minKg: 1, pricePerKg: base },
          { minKg: 5, pricePerKg: Math.round(base * 0.93) },
          { minKg: 25, pricePerKg: Math.round(base * 0.85) },
          { minKg: 100, pricePerKg: Math.round(base * 0.77) },
        ]
      : [{ minKg: 1, pricePerKg: base }],
    harvestSeason: ["May–Aug 2026", "Apr–Jul 2026", "Jun–Sep 2026"][i % 3]!,
    sampleAvailable: i % 2 === 0,
    createdAt: new Date(2026, 6, 1 + i).toISOString(),
    status: "active",
    demoData: true,
  };
});

export function unitPrice(p: Product, qty: number) {
  let price = p.pricePerKg;
  for (const t of [...p.priceTiers].sort((a, b) => a.minKg - b.minKg))
    if (qty >= t.minKg) price = t.pricePerKg;
  return price;
}

export type OrderStatus =
  "Pending" | "Accepted" | "Processing" | "Shipped" | "Completed" | "Rejected" | "Cancelled";
export const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Completed"],
  Completed: [],
  Rejected: [],
  Cancelled: [],
};
export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  sellerId: string;
};
export type Order = {
  id: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  shipping: number;
  total: number;
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
  address: {
    name: string;
    email: string;
    country: string;
    street: string;
    city: string;
    postal: string;
    notes: string;
    method: string;
    buyerType: string;
    payment: string;
  };
  sample?: boolean;
};

const mk = (id: string, pid: number, qty: number, status: OrderStatus): Order => {
  const p = SEED_PRODUCTS[pid]!;
  const u = unitPrice(p, qty);
  const hist: OrderStatus[] =
    status === "Pending"
      ? ["Pending"]
      : status === "Shipped"
        ? ["Pending", "Accepted", "Processing", "Shipped"]
        : ["Pending", "Accepted"];
  return {
    id,
    buyerId: "b1",
    buyerName: "Sarah Lim",
    sample: true,
    items: [{ productId: p.id, name: p.name, qty, unitPrice: u, sellerId: p.sellerId }],
    shipping: 450000,
    total: u * qty + 450000,
    status,
    history: hist.map((s, k) => ({ status: s, at: new Date(2026, 8, 20 + k).toISOString() })),
    address: {
      name: "Northbound Roasters",
      email: "buyer@asal.demo",
      country: "Singapore",
      street: "12 Tras St",
      city: "Singapore",
      postal: "078987",
      notes: "",
      method: "International",
      buyerType: "Cafe/Roaster",
      payment: "Bank Transfer — Demo",
    },
  };
};
export const SEED_ORDERS: Order[] = [
  mk("ORD-DEMO-001", 0, 30, "Pending"),
  mk("ORD-DEMO-002", 3, 10, "Shipped"),
  mk("ORD-DEMO-003", 1, 6, "Accepted"),
];
