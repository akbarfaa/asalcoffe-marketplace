import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEMO_USERS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  TRANSITIONS,
  USD_RATE,
  unitPrice,
  type Order,
  type OrderStatus,
  type Product,
  type User,
} from "./data";

type CartLine = { productId: string; qty: number };
type Currency = "IDR" | "USD";
type Store = {
  ready: boolean;
  products: Product[];
  orders: Order[];
  users: User[];
  user: User | null;
  cart: CartLine[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  login: (email: string, pw: string) => string | null;
  register: (u: Omit<User, "id">) => string | null;
  logout: () => void;
  addToCart: (id: string, qty: number) => string | null;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  checkout: (
    addr: Order["address"],
    shipping: number,
  ) => { ok: true; id: string } | { ok: false; error: string };
  setStatus: (orderId: string, s: OrderStatus) => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);
const K = "asal:v1:";
const load = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(K + k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [currency, setCurrency] = useState<Currency>("IDR");

  useEffect(() => {
    setProducts(load("products", SEED_PRODUCTS));
    setOrders(load("orders", SEED_ORDERS));
    setUsers(load("users", DEMO_USERS));
    setUser(load("session", null));
    setCart(load("cart", []));
    setCurrency(load("currency", "IDR"));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const save = { products, orders, users, session: user, cart, currency };
    Object.entries(save).forEach(([k, v]) => localStorage.setItem(K + k, JSON.stringify(v)));
  }, [ready, products, orders, users, user, cart, currency]);

  const store: Store = {
    ready,
    products,
    orders,
    users,
    user,
    cart,
    currency,
    setCurrency,
    login: (email, pw) => {
      const u = users.find(
        (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === pw,
      );
      if (!u) return "Email atau password salah.";
      setUser(u);
      return null;
    },
    register: (data) => {
      if (users.some((x) => x.email.toLowerCase() === data.email.toLowerCase()))
        return "Email sudah terdaftar.";
      const u = { ...data, id: (data.role === "seller" ? "s" : "b") + Date.now() };
      setUsers([...users, u]);
      setUser(u);
      return null;
    },
    logout: () => {
      setUser(null);
      setCart([]);
    },
    addToCart: (id, qty) => {
      const p = products.find((x) => x.id === id)!;
      const cur = cart.find((c) => c.productId === id)?.qty ?? 0;
      if (qty < p.minimumOrderKg) return `Minimum order ${p.minimumOrderKg} kg.`;
      if (cur + qty > p.stockKg) return `Stok hanya ${p.stockKg} kg.`;
      setCart(
        cur
          ? cart.map((c) => (c.productId === id ? { ...c, qty: cur + qty } : c))
          : [...cart, { productId: id, qty }],
      );
      return null;
    },
    setQty: (id, qty) => setCart(cart.map((c) => (c.productId === id ? { ...c, qty } : c))),
    removeFromCart: (id) => setCart(cart.filter((c) => c.productId !== id)),
    checkout: (address, shipping) => {
      if (!user) return { ok: false, error: "Silakan login." };
      if (!cart.length) return { ok: false, error: "Keranjang kosong." };
      const items = [];
      for (const c of cart) {
        const p = products.find((x) => x.id === c.productId);
        if (!p) return { ok: false, error: "Produk tidak ditemukan." };
        if (c.qty > p.stockKg || c.qty < p.minimumOrderKg)
          return { ok: false, error: `Jumlah tidak valid untuk ${p.name}.` };
        items.push({
          productId: p.id,
          name: p.name,
          qty: c.qty,
          unitPrice: unitPrice(p, c.qty),
          sellerId: p.sellerId,
        });
      }
      const id = "ORD-" + Date.now().toString(36).toUpperCase();
      const sub = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
      const order: Order = {
        id,
        buyerId: user.id,
        buyerName: user.name,
        items,
        shipping,
        total: sub + shipping,
        status: "Pending",
        history: [{ status: "Pending", at: new Date().toISOString() }],
        address,
      };
      setProducts(
        products.map((p) => {
          const it = items.find((i) => i.productId === p.id);
          return it ? { ...p, stockKg: p.stockKg - it.qty } : p;
        }),
      );
      setOrders([order, ...orders]);
      setCart([]);
      return { ok: true, id };
    },
    setStatus: (orderId, s) =>
      setOrders(
        orders.map((o) => {
          if (o.id !== orderId || !TRANSITIONS[o.status].includes(s)) return o;
          if (s === "Rejected" || s === "Cancelled") {
            setProducts((ps) =>
              ps.map((p) => {
                const it = o.items.find((i) => i.productId === p.id);
                return it ? { ...p, stockKg: p.stockKg + it.qty } : p;
              }),
            );
          }
          return {
            ...o,
            status: s,
            history: [...o.history, { status: s, at: new Date().toISOString() }],
          };
        }),
      ),
    saveProduct: (p) =>
      setProducts(
        products.some((x) => x.id === p.id)
          ? products.map((x) => (x.id === p.id ? p : x))
          : [p, ...products],
      ),
    deleteProduct: (id) => setProducts(products.filter((x) => x.id !== id)),
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx)!;

export function useMoney() {
  const { currency } = useStore();
  return (idr: number) =>
    currency === "USD"
      ? "$" +
        (idr / USD_RATE).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "Rp" + Math.round(idr).toLocaleString("id-ID");
}
