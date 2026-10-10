import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar — ASAL COFFEE" },
      {
        name: "description",
        content: "Daftar sebagai pembeli atau penjual kopi Indonesia di ASAL COFFEE.",
      },
      { property: "og:title", content: "Daftar — ASAL COFFEE" },
      {
        property: "og:description",
        content: "Bergabung sebagai petani, koperasi, roaster, atau pembeli.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const { register } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({
    role: "seller" as "buyer" | "seller",
    name: "",
    email: "",
    password: "",
    org: "",
    country: "Indonesia",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }
    const err = register(f);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Akun dibuat");
    nav({ to: f.role === "seller" ? "/seller" : "/marketplace" });
  };
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} className="brut rise space-y-4 bg-paper p-6">
        <h1 className="text-3xl">Buat Akun</h1>
        <div className="grid grid-cols-2 gap-2">
          {(["seller", "buyer"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setF({ ...f, role: r })}
              className={`brut-btn py-3 ${f.role === r ? "bg-secondary" : "bg-paper"}`}
            >
              {r === "seller" ? "Penjual / Petani" : "Pembeli"}
            </button>
          ))}
        </div>
        <input
          className="field"
          required
          placeholder="Nama lengkap"
          value={f.name}
          onChange={set("name")}
        />
        <input
          className="field"
          required
          placeholder={f.role === "seller" ? "Nama koperasi / usaha" : "Nama kafe / perusahaan"}
          value={f.org}
          onChange={set("org")}
        />
        <input
          className="field"
          required
          placeholder="Negara"
          value={f.country}
          onChange={set("country")}
        />
        <input
          className="field"
          type="email"
          required
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
        />
        <input
          className="field"
          type="password"
          required
          placeholder="Password (min. 6)"
          value={f.password}
          onChange={set("password")}
        />
        <button className="brut-btn w-full bg-primary py-3 text-primary-foreground">Daftar</button>
        <p className="text-sm">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
