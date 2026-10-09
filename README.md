# ASAL COFFEE — Direct-Trade Indonesian Coffee Marketplace

ASAL COFFEE adalah platform e-commerce direct-trade untuk komoditas kopi Indonesia. Menghubungkan langsung kelompok tani kopi (Gayo, Toraja, Kintamani, Ijen, dll.) dengan roastery, kafe, dan penikmat kopi dengan transparansi harga, asal-usul (single origin), dan estimasi pengiriman.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Fullstack SSR & Routing)
- **Library**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Lucide Icons + Shadcn UI
- **Server Engine**: [Nitro](https://nitro.unjs.io) (Cloudflare Pages preset)
- **State Management**: React Context + TanStack Query
- **Testing**: Vitest

## Fitur Utama

- **Katalog Marketplace**: Filter berdasarkan asal daerah, proses pascapanen, grade kopi, dan varietas.
- **Transparansi Petani & Asal Kopi**: Detail perkebunan, ketinggian tanam (mdpl), dan sertifikasi.
- **Keranjang & Checkout**: Kalkulasi kuantitas, opsi pengiriman, dan ringkasan pembayaran.
- **Pelacakan Pesanan**: Status pesanan dan riwayat pembelian.
- **Dashboard Petani / Penjual**: Manajemen inventaris, batch panen, dan status stok.

## Cara Menjalankan di Local

1. Install dependensi:

   ```bash
   npm install
   ```

2. Jalankan development server:

   ```bash
   npm run dev
   ```

3. Buka browser di `http://localhost:8080` (atau port yang ditampilkan di terminal).

4. Testing & Lint:
   ```bash
   npm run test
   npm run lint
   ```

## Panduan Deploy ke Cloudflare Pages

Project ini telah dikonfigurasi untuk deployment ke **Cloudflare Pages**:

### Opsi A: Hubungkan Git Repository (Rekomendasi)

1. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
2. Klik **Create application** -> Tab **Pages** -> **Connect to Git**.
3. Pilih repository `asalcoffe-marketplace`.
4. Konfigurasi build setting:
   - **Framework preset**: None (atau TanStack Start jika tersedia)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**. Cloudflare Pages akan otomatis mendeteksi output Nitro (`dist/_worker.js` & `dist/_routes.json`) dan menyajikan website secara global di Cloudflare Edge Network.

### Opsi B: Deploy Langsung via Wrangler CLI

Jika ingin deploy langsung dari terminal:

```bash
npm run build
npx wrangler pages deploy dist --project-name=asalcoffe-marketplace
```
