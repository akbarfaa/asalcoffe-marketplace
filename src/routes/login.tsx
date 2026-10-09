import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — ASAL COFFEE" },
      { name: "description", content: "Masuk ke akun demo pembeli atau penjual ASAL COFFEE." },
      { property: "og:title", content: "Masuk — ASAL COFFEE" },
      { property: "og:description", content: "Akses akun demo pembeli atau penjual." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const go = (e: string, p: string) => {
    const err = login(e, p);
    if (err) return toast.error(err);
    toast.success("Berhasil masuk");
    nav({ to: e.startsWith("seller") ? "/seller" : "/marketplace" });
  };
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(email, pw);
        }}
        className="brut rise space-y-4 bg-paper p-6"
      >
        <h1 className="text-3xl">Masuk</h1>
        <input
          className="field"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field"
          type="password"
          required
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="brut-btn w-full bg-primary py-3 text-primary-foreground">Masuk</button>
        <p className="text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold underline">
            Daftar
          </Link>
        </p>
      </form>
      <div className="brut-sm mt-6 bg-secondary p-4 text-sm">
        <p className="font-bold">Akun demo (password: demo1234)</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => go("buyer@asal.demo", "demo1234")}
            className="brut-btn bg-paper px-3 py-2"
          >
            Masuk sbg Pembeli
          </button>
          <button
            onClick={() => go("seller@asal.demo", "demo1234")}
            className="brut-btn bg-paper px-3 py-2"
          >
            Masuk sbg Penjual
          </button>
        </div>
        <p className="mt-3 text-xs">Autentikasi demo di browser — bukan keamanan produksi.</p>
      </div>
    </div>
  );
}
