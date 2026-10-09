import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { TRANSITIONS } from "@/lib/data";
import { useMoney, useStore } from "@/lib/store";
import { STATUS_COLOR } from "@/components/Shell";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Detail Pesanan — ASAL COFFEE" },
      { name: "description", content: "Timeline dan rincian pesanan demo." },
      { property: "og:title", content: "Detail Pesanan — ASAL COFFEE" },
      { property: "og:description", content: "Lacak timeline pesanan kopi." },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { orders, user, ready, setStatus } = useStore();
  const money = useMoney();
  const o = orders.find((x) => x.id === id);
  if (!ready) return <div className="p-10 text-center">Memuat…</div>;
  const isSeller = user?.role === "seller" && o?.items.some((i) => i.sellerId === user.id);
  if (!o || !user || (o.buyerId !== user.id && !isSeller))
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl">Pesanan tidak tersedia</h2>
        <Link to="/login" className="underline">
          Masuk
        </Link>
      </div>
    );
  const next = TRANSITIONS[o.status].filter(
    (s) => isSeller || (s === "Cancelled" && o.status === "Accepted"),
  );
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to={isSeller ? "/seller" : "/orders"} className="text-sm underline">
        ← Kembali
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl">{o.id}</h1>
        <span className={`border-2 px-2 font-bold ${STATUS_COLOR[o.status]}`}>{o.status}</span>
      </div>
      <p className="text-sm text-muted-foreground">Pesanan DEMO · {o.address.payment}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="brut bg-paper p-5">
          <h2 className="mb-3 text-xl">Timeline</h2>
          <ol className="space-y-3 border-l-[3px] pl-4">
            {o.history.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[23px] top-1 h-3 w-3 border-2 bg-primary" />
                <b>{h.status}</b>
                <p className="text-xs">{new Date(h.at).toLocaleString("id-ID")}</p>
              </li>
            ))}
          </ol>
          {next.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {next.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(o.id, s);
                    toast.success(`Status → ${s}`);
                  }}
                  className={`brut-btn px-3 py-2 text-sm ${s === "Rejected" || s === "Cancelled" ? "bg-destructive text-destructive-foreground" : "bg-secondary"}`}
                >
                  {s === "Cancelled" ? "Batalkan" : `Tandai ${s}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="brut space-y-2 bg-paper p-5 text-sm">
          <h2 className="text-xl">Rincian</h2>
          {o.items.map((i) => (
            <p key={i.productId} className="flex justify-between">
              <span>
                {i.name} · {i.qty} kg × {money(i.unitPrice)}
              </span>
              <b>{money(i.qty * i.unitPrice)}</b>
            </p>
          ))}
          <p className="flex justify-between">
            <span>Ongkir</span>
            <b>{money(o.shipping)}</b>
          </p>
          <p className="flex justify-between text-lg">
            <span>Total</span>
            <b>{money(o.total)}</b>
          </p>
          <hr className="border-t-2" />
          <p>
            <b>{o.address.name}</b> ({o.address.buyerType})<br />
            {o.address.street}, {o.address.city} {o.address.postal}, {o.address.country}
            <br />
            {o.address.method} · {o.address.email}
          </p>
        </div>
      </div>
    </div>
  );
}
