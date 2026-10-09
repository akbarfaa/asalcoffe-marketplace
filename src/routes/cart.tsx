import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { unitPrice } from "@/lib/data";
import { useMoney, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — ASAL COFFEE" },
      { name: "description", content: "Tinjau kopi di keranjang Anda sebelum checkout." },
      { property: "og:title", content: "Keranjang — ASAL COFFEE" },
      { property: "og:description", content: "Keranjang belanja kopi direct-trade." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, products, setQty, removeFromCart, user } = useStore();
  const money = useMoney();
  const lines = cart
    .map((c) => ({ c, p: products.find((x) => x.id === c.productId)! }))
    .filter((l) => l.p);
  const sub = lines.reduce((s, { c, p }) => s + unitPrice(p, c.qty) * c.qty, 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-5xl">Keranjang</h1>
      {!lines.length ? (
        <div className="brut mt-6 bg-paper p-10 text-center">
          <p className="text-xl font-bold">Keranjang masih kosong.</p>
          <Link
            to="/marketplace"
            className="brut-btn mt-4 inline-block bg-primary px-4 py-2 text-primary-foreground"
          >
            Jelajahi Kopi
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {lines.map(({ c, p }) => {
              const u = unitPrice(p, c.qty);
              return (
                <div key={p.id} className="brut-sm flex gap-4 bg-paper p-3">
                  <img src={p.image} alt={p.name} className="h-24 w-24 border-2 object-cover" />
                  <div className="flex-1">
                    <Link to="/product/$id" params={{ id: p.id }} className="font-bold">
                      {p.name}
                    </Link>
                    <p className="text-xs">{p.sellerName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        aria-label="Jumlah kg"
                        type="number"
                        min={p.minimumOrderKg}
                        max={p.stockKg}
                        value={c.qty}
                        onChange={(e) =>
                          setQty(
                            p.id,
                            Math.max(
                              p.minimumOrderKg,
                              Math.min(p.stockKg, +e.target.value || p.minimumOrderKg),
                            ),
                          )
                        }
                        className="field w-20"
                      />
                      <span className="text-sm">kg × {money(u)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button aria-label="Hapus" onClick={() => removeFromCart(p.id)}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="font-bold">{money(u * c.qty)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="brut h-fit bg-paper p-5">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <b>{money(sub)}</b>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Ongkir dihitung saat checkout.</p>
            {user?.role === "buyer" ? (
              <Link
                to="/checkout"
                className="brut-btn mt-4 block bg-primary py-3 text-center text-primary-foreground"
              >
                Checkout
              </Link>
            ) : (
              <Link
                to="/login"
                className="brut-btn mt-4 block bg-primary py-3 text-center text-primary-foreground"
              >
                Masuk untuk checkout
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
