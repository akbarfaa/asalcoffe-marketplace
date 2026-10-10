import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { ORIGINS, unitPrice } from "@/lib/data";
import { useMoney, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Detail Kopi — ASAL COFFEE" },
      {
        name: "description",
        content: "Asal, produsen, karakter rasa, dan harga grosir transparan untuk lot kopi ini.",
      },
      { property: "og:title", content: "Detail Lot Kopi — ASAL COFFEE" },
      { property: "og:description", content: "Know the origin. See the price." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { products, user, addToCart } = useStore();
  const money = useMoney();
  const nav = useNavigate();
  const p = products.find((x) => x.id === id);
  const [qty, setQty] = useState(p?.minimumOrderKg ?? 1);
  if (!p)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl">Kopi tidak ditemukan</h2>
        <Link to="/marketplace" className="underline">
          Kembali
        </Link>
      </div>
    );
  const o = ORIGINS.find((x) => x.id === p.originId);
  const u = unitPrice(p, qty);
  const clamp = (n: number) =>
    Math.max(p.minimumOrderKg, Math.min(p.stockKg, n || p.minimumOrderKg));

  const add = (go: boolean) => {
    if (!user) {
      toast.error("Silakan masuk sebagai pembeli.");
      nav({ to: "/login" });
      return;
    }
    if (user.role !== "buyer") {
      toast.error("Akun penjual tidak dapat membeli.");
      return;
    }
    const err = addToCart(p.id, qty);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(`${qty} kg ditambahkan ke keranjang`);
    if (go) nav({ to: "/cart" });
  };
  const specs = [
    ["Spesies", p.species],
    ["Varietas", p.variety],
    ["Proses", p.processingMethod],
    ["Bentuk", p.beanFormat],
    ["Roast", p.roastLevel ?? "—"],
    ["Body", p.body],
    ["Acidity", p.acidity],
    ["Panen", p.harvestSeason],
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
      <div className="rise">
        <img src={p.image} alt={p.name} className="brut aspect-square w-full object-cover" />
        <div className="brut mt-6 bg-secondary p-5">
          <p className="text-xs font-bold">TRANSPARANSI PRODUSEN · DATA SAMPEL</p>
          <h3 className="mt-1 text-2xl">{p.sellerName}</h3>
          <p className="text-sm">
            {p.sellerType} · {p.originName}, {p.province}
          </p>
          <p className="mt-2 text-sm">{o?.description}</p>
          <p className="mt-2 text-xs italic">Belum diverifikasi — profil untuk demonstrasi.</p>
        </div>
      </div>
      <div>
        <span className="border-2 bg-paper px-2 text-xs font-bold">
          {p.originName}, {p.province}
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl">{p.name}</h1>
        <p className="mt-4">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.flavorNotes.map((n) => (
            <span key={n} className="border-2 bg-paper px-2 text-sm">
              {n}
            </span>
          ))}
        </div>
        <dl className="brut-sm mt-6 grid grid-cols-2 bg-paper sm:grid-cols-4">
          {specs.map(([k, v]) => (
            <div key={k} className="border p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="brut mt-6 bg-paper p-5">
          <p className="text-sm text-muted-foreground">
            Stok {p.stockKg} kg · Min. order {p.minimumOrderKg} kg
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              aria-label="Kurangi"
              onClick={() => setQty(clamp(qty - 1))}
              className="brut-btn bg-paper p-2"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              aria-label="Jumlah kg"
              type="number"
              value={qty}
              onChange={(e) => setQty(clamp(+e.target.value))}
              className="field w-24 text-center font-bold"
            />
            <button
              aria-label="Tambah"
              onClick={() => setQty(clamp(qty + 1))}
              className="brut-btn bg-paper p-2"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-sm">kg</span>
          </div>
          <p className="mt-4 text-3xl font-bold">{money(u * qty)}</p>
          <p className="text-sm">
            {money(u)}/kg × {qty} kg
          </p>
          {p.priceTiers.length > 1 && (
            <table className="mt-4 w-full border-2 text-sm">
              <thead className="bg-espresso text-paper">
                <tr>
                  <th className="p-2 text-left">Jumlah</th>
                  <th className="p-2 text-right">Harga/kg</th>
                </tr>
              </thead>
              <tbody>
                {p.priceTiers.map((t, i) => {
                  const next = p.priceTiers[i + 1]?.minKg;
                  const on = qty >= t.minKg && (!next || qty < next);
                  return (
                    <tr key={t.minKg} className={on ? "bg-secondary font-bold" : ""}>
                      <td className="border-t p-2">
                        {t.minKg}
                        {next ? `–${next - 1}` : "+"} kg
                      </td>
                      <td className="border-t p-2 text-right">{money(t.pricePerKg)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Harga ilustratif, ditetapkan penjual sampel.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => add(false)} className="brut-btn bg-paper px-5 py-3">
              Tambah ke Keranjang
            </button>
            <button
              onClick={() => add(true)}
              className="brut-btn bg-primary px-5 py-3 text-primary-foreground"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
