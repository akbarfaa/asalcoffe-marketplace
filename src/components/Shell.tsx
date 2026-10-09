import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, LogOut, Coffee } from "lucide-react";
import type { ReactNode } from "react";
import { useMoney, useStore } from "@/lib/store";
import { unitPrice, type Product } from "@/lib/data";

export function Navbar() {
  const { user, cart, currency, setCurrency, logout } = useStore();
  const nav = useNavigate();
  const link = "px-2 py-1 font-semibold hover:bg-secondary";
  return (
    <header className="sticky top-0 z-40 border-b-[3px] bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <Coffee className="h-6 w-6 text-primary" />
          ASAL COFFEE
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm">
          <Link to="/marketplace" className={link} activeProps={{ className: "bg-secondary" }}>
            Marketplace
          </Link>
          {user?.role === "seller" && (
            <Link to="/seller" className={link} activeProps={{ className: "bg-secondary" }}>
              Dashboard Penjual
            </Link>
          )}
          {user?.role === "buyer" && (
            <Link to="/orders" className={link} activeProps={{ className: "bg-secondary" }}>
              Pesanan Saya
            </Link>
          )}
          <button
            onClick={() => setCurrency(currency === "IDR" ? "USD" : "IDR")}
            className="brut-btn bg-paper px-2 py-1"
            aria-label="Ganti mata uang"
          >
            {currency}
          </button>
          {user?.role !== "seller" && (
            <Link
              to="/cart"
              className="brut-btn relative bg-paper px-2 py-1"
              aria-label="Keranjang"
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center border-2 bg-primary text-xs text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                logout();
                nav({ to: "/" });
              }}
              className="brut-btn flex items-center gap-1 bg-paper px-2 py-1"
            >
              <LogOut className="h-4 w-4" />
              {user.name.split(" ")[0]}
            </button>
          ) : (
            <Link to="/login" className="brut-btn bg-primary px-3 py-1 text-primary-foreground">
              Masuk
            </Link>
          )}
        </nav>
      </div>
      <div className="border-t-2 bg-espresso py-1 text-center text-xs text-paper">
        Prototipe demo — semua data, harga & pembayaran adalah SAMPEL, bukan transaksi nyata.
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t-[3px] bg-espresso px-4 py-10 text-paper">
      <div className="mx-auto max-w-7xl">
        <p className="font-display text-2xl">ASAL COFFEE</p>
        <p className="text-sm opacity-80">
          From Indonesian Farms to the World. · Prototipe proyek universitas.
        </p>
      </div>
    </footer>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const money = useMoney();
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="brut group flex flex-col bg-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-[3px]">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 border-2 bg-secondary px-2 text-xs font-bold">
          {p.originName}, {p.province}
        </span>
        {p.priceTiers.length > 1 && (
          <span className="absolute right-2 top-2 rotate-3 border-2 bg-primary px-2 text-xs font-bold text-primary-foreground">
            HARGA GROSIR
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg leading-tight">{p.name}</h3>
        <p className="text-xs text-muted-foreground">
          {p.sellerName} · {p.species} · {p.processingMethod} · {p.beanFormat}
        </p>
        <div className="flex flex-wrap gap-1">
          {p.flavorNotes.map((n) => (
            <span key={n} className="border px-1.5 text-xs">
              {n}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xl font-bold">
              {money(p.pricePerKg)}
              <span className="text-xs font-normal">/kg</span>
            </p>
            {p.priceTiers.length > 1 && (
              <p className="text-xs text-muted-foreground">
                mulai {money(unitPrice(p, 1e6))}/kg (bulk)
              </p>
            )}
          </div>
          <p className="text-xs">Stok {p.stockKg} kg</p>
        </div>
      </div>
    </Link>
  );
}

export function Guard({ role, children }: { role: "buyer" | "seller"; children: ReactNode }) {
  const { ready, user } = useStore();
  if (!ready) return <div className="p-10 text-center">Memuat…</div>;
  if (!user || user.role !== role)
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h2 className="text-2xl">Akses terbatas</h2>
        <p className="my-3 text-muted-foreground">
          Halaman ini khusus akun {role === "buyer" ? "pembeli" : "penjual"}.
        </p>
        <Link
          to="/login"
          className="brut-btn inline-block bg-primary px-4 py-2 text-primary-foreground"
        >
          Masuk
        </Link>
      </div>
    );
  return <>{children}</>;
}

export const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-taupe",
  Accepted: "bg-secondary",
  Processing: "bg-secondary",
  Shipped: "bg-paper",
  Completed: "bg-espresso text-paper",
  Rejected: "bg-destructive text-destructive-foreground",
  Cancelled: "bg-muted",
};
