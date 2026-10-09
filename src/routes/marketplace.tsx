import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ORIGINS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/Shell";

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s: Record<string, unknown>) => ({
    origin: typeof s.origin === "string" ? s.origin : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Marketplace — ASAL COFFEE" },
      {
        name: "description",
        content:
          "Cari dan bandingkan lot kopi Indonesia berdasarkan asal, spesies, proses, dan harga.",
      },
      { property: "og:title", content: "Marketplace Kopi Indonesia — ASAL COFFEE" },
      { property: "og:description", content: "Bandingkan kopi dari 8 daerah asal Indonesia." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { products } = useStore();
  const sp = Route.useSearch();
  const [q, setQ] = useState("");
  const [origin, setOrigin] = useState(sp.origin ?? "");
  const [species, setSpecies] = useState("");
  const [proc, setProc] = useState("");
  const [fmt, setFmt] = useState("");
  const [sort, setSort] = useState("new");

  const list = useMemo(() => {
    const r = products.filter(
      (p) =>
        p.status === "active" &&
        (!q ||
          (p.name + p.sellerName + p.flavorNotes.join(" ") + p.province)
            .toLowerCase()
            .includes(q.toLowerCase())) &&
        (!origin || p.originId === origin) &&
        (!species || p.species === species) &&
        (!proc || p.processingMethod === proc) &&
        (!fmt || p.beanFormat === fmt),
    );
    return [...r].sort((a, b) =>
      sort === "low"
        ? a.pricePerKg - b.pricePerKg
        : sort === "high"
          ? b.pricePerKg - a.pricePerKg
          : sort === "stock"
            ? b.stockKg - a.stockKg
            : b.createdAt.localeCompare(a.createdAt),
    );
  }, [products, q, origin, species, proc, fmt, sort]);

  const sel = (v: string, set: (s: string) => void, opts: [string, string][], label: string) => (
    <select aria-label={label} value={v} onChange={(e) => set(e.target.value)} className="field">
      <option value="">{label}: Semua</option>
      {opts.map(([k, l]) => (
        <option key={k} value={k}>
          {l}
        </option>
      ))}
    </select>
  );
  const reset = () => {
    setQ("");
    setOrigin("");
    setSpecies("");
    setProc("");
    setFmt("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl">Marketplace</h1>
      <p className="mt-2 text-muted-foreground">Semua lot adalah data sampel untuk demonstrasi.</p>
      <div className="brut mt-6 grid gap-3 bg-paper p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="absolute left-2 top-3 h-4 w-4" />
          <input
            className="field pl-8"
            placeholder="Cari kopi, rasa, produsen…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        {sel(
          origin,
          setOrigin,
          ORIGINS.map((o) => [o.id, o.name]),
          "Asal",
        )}
        {sel(
          species,
          setSpecies,
          ["Arabica", "Robusta", "Liberica"].map((x) => [x, x]),
          "Spesies",
        )}
        {sel(
          proc,
          setProc,
          ["Washed", "Natural", "Honey", "Wet-Hulled"].map((x) => [x, x]),
          "Proses",
        )}
        {sel(
          fmt,
          setFmt,
          ["Green Bean", "Roasted Bean", "Ground"].map((x) => [x, x]),
          "Bentuk",
        )}
      </div>
      <div className="my-5 flex items-center justify-between text-sm">
        <span className="font-bold">{list.length} lot ditemukan</span>
        <select
          aria-label="Urutkan"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="field w-auto"
        >
          <option value="new">Terbaru</option>
          <option value="low">Harga terendah</option>
          <option value="high">Harga tertinggi</option>
          <option value="stock">Stok terbanyak</option>
        </select>
      </div>
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="brut bg-paper p-10 text-center">
          <p className="text-xl font-bold">Tidak ada kopi yang cocok.</p>
          <button onClick={reset} className="brut-btn mt-4 bg-secondary px-4 py-2">
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
