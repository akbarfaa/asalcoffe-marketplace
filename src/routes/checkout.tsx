import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { USD_RATE, unitPrice } from "@/lib/data";
import { useMoney, useStore } from "@/lib/store";
import { Guard } from "@/components/Shell";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ASAL COFFEE" },
      { name: "description", content: "Selesaikan pesanan demo kopi Anda." },
      { property: "og:title", content: "Checkout — ASAL COFFEE" },
      { property: "og:description", content: "Checkout pesanan demo." },
    ],
  }),
  component: () => (
    <Guard role="buyer">
      <Checkout />
    </Guard>
  ),
});

function Checkout() {
  const { cart, products, user, checkout, setCurrency } = useStore();
  const money = useMoney();
  const nav = useNavigate();
  const [f, setF] = useState({
    name: user?.org ?? "",
    email: user?.email ?? "",
    country: user?.country ?? "Indonesia",
    street: "",
    city: "",
    postal: "",
    notes: "",
    method: user?.country === "Indonesia" ? "Domestic" : "International",
    buyerType: "Cafe/Roaster",
    payment: "Bank Transfer — Demo",
  });
  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });
  const lines = cart
    .map((c) => ({ c, p: products.find((x) => x.id === c.productId)! }))
    .filter((l) => l.p);
  const kg = lines.reduce((s, l) => s + l.c.qty, 0);
  const sub = lines.reduce((s, { c, p }) => s + unitPrice(p, c.qty) * c.qty, 0);
  const shipping = f.method === "Domestic" ? 25000 + kg * 8000 : 350000 + kg * 45000;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Email tidak valid.");
    const r = checkout(f, shipping);
    if (!r.ok) return toast.error(r.error);
    toast.success("Pesanan demo dibuat!");
    nav({ to: "/orders/$id", params: { id: r.id } });
  };
  const inp = (k: keyof typeof f, ph: string, req = true) => (
    <input className="field" required={req} placeholder={ph} value={f[k]} onChange={set(k)} />
  );

  if (!lines.length)
    return <div className="p-10 text-center text-xl font-bold">Keranjang kosong.</div>;
  return (
    <form
      onSubmit={submit}
      className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1fr_360px]"
    >
      <div className="brut space-y-3 bg-paper p-6">
        <h1 className="text-4xl">Checkout</h1>
        {inp("name", "Nama penerima / bisnis")}
        {inp("email", "Email kontak")}
        <div className="grid grid-cols-2 gap-3">
          {inp("country", "Negara tujuan")}
          {inp("city", "Kota")}
        </div>
        {inp("street", "Alamat pengiriman")}
        {inp("postal", "Kode pos")}
        <textarea
          className="field"
          placeholder="Catatan pengiriman (opsional)"
          value={f.notes}
          onChange={set("notes")}
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            aria-label="Metode pengiriman"
            className="field"
            value={f.method}
            onChange={(e) => {
              set("method")(e);
              setCurrency(e.target.value === "International" ? "USD" : "IDR");
            }}
          >
            <option>Domestic</option>
            <option>International</option>
          </select>
          <select
            aria-label="Tipe pembeli"
            className="field"
            value={f.buyerType}
            onChange={set("buyerType")}
          >
            <option>Individual</option>
            <option>Cafe/Roaster</option>
            <option>Distributor</option>
            <option>Other</option>
          </select>
        </div>
        <p className="pt-2 font-bold">Pembayaran (demo)</p>
        {["Bank Transfer — Demo", "Manual Payment Confirmation — Demo"].map((m) => (
          <label key={m} className="flex items-center gap-2 border-2 p-3">
            <input
              type="radio"
              name="pay"
              checked={f.payment === m}
              onChange={() => setF({ ...f, payment: m })}
            />
            {m}
          </label>
        ))}
      </div>
      <div className="brut h-fit space-y-2 bg-paper p-5 text-sm">
        <h2 className="text-xl">Ringkasan</h2>
        {lines.map(({ c, p }) => (
          <p key={p.id} className="flex justify-between gap-2">
            <span>
              {p.name} · {c.qty} kg × {money(unitPrice(p, c.qty))}
            </span>
            <b>{money(unitPrice(p, c.qty) * c.qty)}</b>
          </p>
        ))}
        <hr className="border-t-2" />
        <p className="flex justify-between">
          <span>Subtotal</span>
          <b>{money(sub)}</b>
        </p>
        <p className="flex justify-between">
          <span>Ongkir estimasi ({f.method})</span>
          <b>{money(shipping)}</b>
        </p>
        <p className="flex justify-between text-lg">
          <span>Total estimasi</span>
          <b>{money(sub + shipping)}</b>
        </p>
        <p className="text-xs text-muted-foreground">
          Kurs DEMO tetap: 1 USD = Rp{USD_RATE.toLocaleString("id-ID")} (bukan kurs live).
        </p>
        <p className="border-2 bg-secondary p-2 text-xs font-bold">
          Ini PESANAN DEMO — tidak ada transaksi keuangan nyata.
        </p>
        <button className="brut-btn w-full bg-primary py-3 text-primary-foreground">
          Konfirmasi Pesanan
        </button>
      </div>
    </form>
  );
}
