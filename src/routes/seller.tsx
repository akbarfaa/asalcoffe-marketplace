import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { IMAGES, ORIGINS, type Product } from "@/lib/data";
import { useMoney, useStore } from "@/lib/store";
import { Guard, STATUS_COLOR } from "@/components/Shell";

export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Dashboard Penjual — ASAL COFFEE" },
      {
        name: "description",
        content: "Kelola produk kopi, stok, harga grosir, dan pesanan masuk.",
      },
      { property: "og:title", content: "Dashboard Penjual — ASAL COFFEE" },
      { property: "og:description", content: "Kelola lot kopi dan pesanan." },
    ],
  }),
  component: () => (
    <Guard role="seller">
      <Seller />
    </Guard>
  ),
});

function Seller() {
  const { products, orders, user, deleteProduct } = useStore();
  const money = useMoney();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [edit, setEdit] = useState<Product | null | "new">(null);
  const mine = products.filter((p) => p.sellerId === user!.id);
  const inc = orders.filter((o) => o.items.some((i) => i.sellerId === user!.id));
  const revenue = inc
    .filter((o) => o.status === "Completed" || o.status === "Shipped")
    .reduce(
      (s, o) =>
        s +
        o.items.filter((i) => i.sellerId === user!.id).reduce((a, i) => a + i.qty * i.unitPrice, 0),
      0,
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-bold text-primary">{user!.org}</p>
      <h1 className="text-5xl">Dashboard Penjual</h1>
      <div className="my-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Produk", mine.length],
          ["Total stok", mine.reduce((s, p) => s + p.stockKg, 0) + " kg"],
          ["Pesanan baru", inc.filter((o) => o.status === "Pending").length],
          ["Pendapatan (demo)", money(revenue)],
        ].map(([l, v]) => (
          <div key={l as string} className="brut-sm bg-paper p-4">
            <p className="text-xs">{l}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mb-4 flex gap-2">
        {(["products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`brut-btn px-4 py-2 ${tab === t ? "bg-secondary" : "bg-paper"}`}
          >
            {t === "products" ? "Produk" : `Pesanan (${inc.length})`}
          </button>
        ))}
        {tab === "products" && (
          <button
            onClick={() => setEdit("new")}
            className="brut-btn ml-auto flex items-center gap-1 bg-primary px-4 py-2 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Tambah Kopi
          </button>
        )}
      </div>
      {tab === "products" ? (
        <div className="brut overflow-x-auto bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-espresso text-left text-paper">
              <tr>
                <th className="p-3">Kopi</th>
                <th className="p-3">Harga/kg</th>
                <th className="p-3">Stok</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id} className="border-t-2">
                  <td className="p-3">
                    <Link to="/product/$id" params={{ id: p.id }} className="font-bold">
                      {p.name}
                    </Link>
                    <p className="text-xs">
                      {p.originName} · {p.processingMethod}
                    </p>
                  </td>
                  <td className="p-3">{money(p.pricePerKg)}</td>
                  <td className="p-3">{p.stockKg} kg</td>
                  <td className="p-3">
                    <span
                      className={`border px-1 text-xs ${p.status === "active" ? "bg-secondary" : "bg-muted"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="flex gap-2 p-3">
                    <button aria-label="Edit" onClick={() => setEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Hapus"
                      onClick={() => {
                        if (confirm(`Hapus ${p.name}?`)) {
                          deleteProduct(p.id);
                          toast.success("Produk dihapus");
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!mine.length && (
            <p className="p-8 text-center">Belum ada produk. Tambahkan lot kopi pertama Anda.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {inc.map((o) => (
            <Link
              key={o.id}
              to="/orders/$id"
              params={{ id: o.id }}
              className="brut-sm flex flex-wrap items-center justify-between gap-2 bg-paper p-4 hover:bg-muted"
            >
              <div>
                <p className="font-bold">{o.id}</p>
                <p className="text-xs">
                  {o.buyerName} · {o.address.country}
                </p>
              </div>
              <span className={`border-2 px-2 text-xs font-bold ${STATUS_COLOR[o.status]}`}>
                {o.status}
              </span>
              <b>{money(o.total)}</b>
            </Link>
          ))}
          {!inc.length && <p className="brut bg-paper p-8 text-center">Belum ada pesanan masuk.</p>}
        </div>
      )}
      {edit && <ProductForm initial={edit === "new" ? null : edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function ProductForm({ initial, onClose }: { initial: Product | null; onClose: () => void }) {
  const { user, saveProduct } = useStore();
  const [f, setF] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    originId: initial?.originId ?? "gayo",
    species: initial?.species ?? "Arabica",
    variety: initial?.variety ?? "",
    processingMethod: initial?.processingMethod ?? "Washed",
    beanFormat: initial?.beanFormat ?? "Green Bean",
    flavorNotes: initial?.flavorNotes.join(", ") ?? "",
    stockKg: initial?.stockKg ?? 100,
    minimumOrderKg: initial?.minimumOrderKg ?? 1,
    pricePerKg: initial?.pricePerKg ?? 120000,
    bulk: (initial?.priceTiers.length ?? 2) > 1,
    status: initial?.status ?? "active",
  });
  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.type === "number" ? +e.target.value : e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.pricePerKg <= 0 || f.stockKg < 0 || f.minimumOrderKg < 1) {
      toast.error("Harga, stok, dan minimum order harus valid.");
      return;
    }
    const o = ORIGINS.find((x) => x.id === f.originId)!;
    const b = f.pricePerKg;
    const p: Product = {
      ...(initial ?? {
        id: "p" + Date.now(),
        createdAt: new Date().toISOString(),
        harvestSeason: "2026",
        sampleAvailable: false,
        body: "Medium",
        acidity: "Medium",
        demoData: true as const,
      }),
      name: f.name,
      description: f.description,
      image: f.beanFormat === "Green Bean" ? IMAGES.green : IMAGES.roasted,
      sellerId: user!.id,
      sellerName: user!.org,
      sellerType: "Producer",
      originId: o.id,
      originName: o.name,
      province: o.province,
      species: f.species as Product["species"],
      variety: f.variety || "—",
      processingMethod: f.processingMethod,
      beanFormat: f.beanFormat as Product["beanFormat"],
      flavorNotes: f.flavorNotes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stockKg: f.stockKg,
      minimumOrderKg: f.minimumOrderKg,
      pricePerKg: b,
      status: f.status as Product["status"],
      priceTiers: f.bulk
        ? [
            { minKg: 1, pricePerKg: b },
            { minKg: 5, pricePerKg: Math.round(b * 0.93) },
            { minKg: 25, pricePerKg: Math.round(b * 0.85) },
            { minKg: 100, pricePerKg: Math.round(b * 0.77) },
          ]
        : [{ minKg: 1, pricePerKg: b }],
    };
    saveProduct(p);
    toast.success(initial ? "Produk diperbarui" : "Produk ditambahkan");
    onClose();
  };
  const sel = (k: keyof typeof f, opts: string[][]) => (
    <select className="field" value={String(f[k])} onChange={set(k)}>
      {opts.map(([v, l]) => (
        <option key={v} value={v}>
          {l ?? v}
        </option>
      ))}
    </select>
  );
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-espresso/60 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="brut rise max-h-[90vh] w-full max-w-xl space-y-3 overflow-y-auto bg-paper p-6"
      >
        <div className="flex justify-between">
          <h2 className="text-2xl">{initial ? "Edit Kopi" : "Tambah Kopi"}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose}>
            <X />
          </button>
        </div>
        <input
          className="field"
          required
          placeholder="Nama produk"
          value={f.name}
          onChange={set("name")}
        />
        <textarea
          className="field"
          required
          placeholder="Deskripsi"
          value={f.description}
          onChange={set("description")}
        />
        <div className="grid grid-cols-2 gap-3">
          {sel(
            "originId",
            ORIGINS.map((o) => [o.id, o.name]),
          )}
          {sel("species", [["Arabica"], ["Robusta"], ["Liberica"]])}
          {sel("processingMethod", [["Washed"], ["Natural"], ["Honey"], ["Wet-Hulled"]])}
          {sel("beanFormat", [["Green Bean"], ["Roasted Bean"], ["Ground"]])}
        </div>
        <input
          className="field"
          placeholder="Varietas"
          value={f.variety}
          onChange={set("variety")}
        />
        <input
          className="field"
          placeholder="Catatan rasa (pisahkan koma)"
          value={f.flavorNotes}
          onChange={set("flavorNotes")}
        />
        <div className="grid grid-cols-3 gap-3 text-xs">
          <label>
            Harga/kg (Rp)
            <input
              className="field"
              type="number"
              value={f.pricePerKg}
              onChange={set("pricePerKg")}
            />
          </label>
          <label>
            Stok (kg)
            <input className="field" type="number" value={f.stockKg} onChange={set("stockKg")} />
          </label>
          <label>
            Min. order
            <input
              className="field"
              type="number"
              value={f.minimumOrderKg}
              onChange={set("minimumOrderKg")}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={f.bulk}
            onChange={(e) => setF({ ...f, bulk: e.target.checked })}
          />
          Aktifkan harga grosir otomatis (5/25/100 kg)
        </label>
        {sel("status", [
          ["active", "Aktif"],
          ["draft", "Draft"],
        ])}
        <button className="brut-btn w-full bg-primary py-3 text-primary-foreground">Simpan</button>
      </form>
    </div>
  );
}
