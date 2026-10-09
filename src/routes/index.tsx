import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Handshake, MapPin, Sprout } from "lucide-react";
import { IMAGES, ORIGINS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASAL COFFEE — From Indonesian Farms to the World" },
      {
        name: "description",
        content:
          "Marketplace kopi direct-trade: temukan lot kopi langsung dari petani & koperasi Indonesia dengan harga transparan.",
      },
      { property: "og:title", content: "ASAL COFFEE — From Indonesian Farms to the World" },
      { property: "og:description", content: "Know the Origin. See the Price. Trade Direct." },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useStore();
  const stats = [
    ["20+", "Lot kopi sampel"],
    ["8", "Daerah asal"],
    ["3", "Produsen demo"],
    ["4", "Tingkat harga grosir"],
  ];
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="rise flex flex-col justify-center">
          <span className="mb-4 w-fit -rotate-2 border-2 bg-secondary px-3 py-1 text-sm font-bold">
            DIRECT-TRADE · INDONESIA
          </span>
          <h1 className="text-5xl leading-[0.95] md:text-7xl">
            From Indonesian Farms to the <span className="text-primary">World.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg">
            Know the origin. See the price. Trade direct. Temukan kopi dari Gayo hingga Wamena,
            langsung dari petani dan koperasi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/marketplace"
              className="brut-btn flex items-center gap-2 bg-primary px-6 py-3 text-primary-foreground"
            >
              Jelajahi Kopi <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="brut-btn bg-paper px-6 py-3">
              Jual Kopi Anda
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src={IMAGES.hero}
            alt="Petani kopi Indonesia memegang buah kopi merah"
            width={1024}
            height={1152}
            className="brut aspect-[4/5] w-full object-cover"
          />
          <div className="brut absolute -bottom-5 -left-3 rotate-[-3deg] bg-paper p-3 text-sm md:-left-8">
            <p className="font-bold">Koperasi Gayo Lestari</p>
            <p className="text-xs">Aceh · 1.500 mdpl · Data sampel</p>
          </div>
        </div>
      </section>

      <section className="border-y-[3px] bg-espresso text-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l} className="border-paper/20 p-6 md:border-r">
              <p className="font-display text-4xl text-secondary">{n}</p>
              <p className="text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl">Kopi Pilihan</h2>
          <Link to="/marketplace" className="font-bold underline">
            Lihat semua →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 border-y-[3px] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-4xl">Daerah Asal</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ORIGINS.map((o) => (
              <Link
                key={o.id}
                to="/marketplace"
                search={{ origin: o.id }}
                className="brut-sm bg-paper p-4 transition-transform hover:-translate-y-1"
              >
                <p className="flex items-center gap-1 text-xs font-bold text-primary">
                  <MapPin className="h-3 w-3" />
                  {o.province}
                </p>
                <h3 className="text-xl">{o.name}</h3>
                <p className="mt-1 text-sm">{o.flavor}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-4xl">Cara Kerja</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              Sprout,
              "1. Produsen mendaftar",
              "Petani & koperasi mengunggah lot dengan asal, proses, dan harga grosir.",
            ],
            [
              Eye,
              "2. Pembeli membandingkan",
              "Lihat asal, varietas, proses, dan rincian harga per kg secara terbuka.",
            ],
            [
              Handshake,
              "3. Trade direct",
              "Pesan langsung; penjual mengonfirmasi dan memperbarui status pengiriman.",
            ],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Sprout;
            return (
              <div key={t as string} className="brut bg-paper p-6">
                <Icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="text-xl">{t as string}</h3>
                <p className="mt-2 text-sm">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="brut grid items-center gap-6 bg-primary p-8 text-primary-foreground md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl md:text-4xl">Anda petani atau koperasi kopi?</h2>
            <p className="mt-2">
              Buka etalase digital dan jangkau roaster & pembeli internasional.
            </p>
          </div>
          <Link to="/register" className="brut-btn bg-paper px-6 py-3 text-foreground">
            Daftar sebagai Penjual
          </Link>
        </div>
      </section>
    </div>
  );
}
