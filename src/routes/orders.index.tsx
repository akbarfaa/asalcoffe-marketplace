import { createFileRoute, Link } from "@tanstack/react-router";
import { useMoney, useStore } from "@/lib/store";
import { Guard, STATUS_COLOR } from "@/components/Shell";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Pesanan Saya — ASAL COFFEE" },
      { name: "description", content: "Dashboard pembeli: lacak pesanan kopi Anda." },
      { property: "og:title", content: "Pesanan Saya — ASAL COFFEE" },
      { property: "og:description", content: "Lacak status pesanan kopi direct-trade." },
    ],
  }),
  component: () => (
    <Guard role="buyer">
      <Orders />
    </Guard>
  ),
});

function Orders() {
  const { orders, user } = useStore();
  const money = useMoney();
  const mine = orders.filter((o) => o.buyerId === user!.id);
  const spent = mine
    .filter((o) => !["Rejected", "Cancelled"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-5xl">Halo, {user!.name.split(" ")[0]}</h1>
      <div className="my-6 grid grid-cols-3 gap-4">
        {[
          ["Total pesanan", mine.length],
          [
            "Aktif",
            mine.filter((o) => !["Completed", "Rejected", "Cancelled"].includes(o.status)).length,
          ],
          ["Belanja", money(spent)],
        ].map(([l, v]) => (
          <div key={l as string} className="brut-sm bg-paper p-4">
            <p className="text-xs">{l}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      {!mine.length ? (
        <p className="brut bg-paper p-8 text-center">
          Belum ada pesanan.{" "}
          <Link to="/marketplace" className="font-bold underline">
            Mulai belanja
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {mine.map((o) => (
            <Link
              key={o.id}
              to="/orders/$id"
              params={{ id: o.id }}
              className="brut-sm flex flex-wrap items-center justify-between gap-2 bg-paper p-4 hover:bg-muted"
            >
              <div>
                <p className="font-bold">
                  {o.id}
                  {o.sample && <span className="ml-2 border px-1 text-xs">SAMPEL</span>}
                </p>
                <p className="text-xs">{o.items.map((i) => i.name).join(", ")}</p>
              </div>
              <span className={`border-2 px-2 text-xs font-bold ${STATUS_COLOR[o.status]}`}>
                {o.status}
              </span>
              <b>{money(o.total)}</b>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
