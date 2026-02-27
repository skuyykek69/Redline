export interface Product {
  id: number;
  name: string;
  price: number;
  category: "standard" | "premium";
  items: string[];
  emoji: string;
  popular?: boolean;
  order?: number;
  imageUrl?: string; // URL foto dari Cloudinary atau path lokal
}

export const products: Product[] = [
  {
    id: 1,
    name: "Paket 1",
    price: 110000,
    category: "standard",
    emoji: "🎁",
    items: ["Gizi", "Tic tic", "Teh dandang", "Tanggo javamoca", "Marjan squash", "Nabati ah", "Nyam-nyam smile", "Minyak fitri 200 ml"],
  },
  {
    id: 2,
    name: "Paket 2",
    price: 100000,
    category: "standard",
    emoji: "🎀",
    items: ["Tasty", "Gery eggroll", "Choco latos", "Teh sosro isi 15", "Marjan squash", "Luwak kopi gula", "Usagi"],
  },
  {
    id: 3,
    name: "Paket 3",
    price: 150000,
    category: "standard",
    emoji: "🌟",
    popular: true,
    items: ["Gizzi", "Marjan squash", "Tasty", "Luwak kopi gula", "Tic tic", "Pocky", "Minyak fitri 200 ml", "Teh sosro isi 15"],
  },
  {
    id: 4,
    name: "Paket 4",
    price: 175000,
    category: "standard",
    emoji: "✨",
    items: ["Good time", "Teh sosro isi 15", "Minyak fitri 200 ml", "Tic tic", "Marjan squash", "Luwak kopi gula", "Astor", "Eggroll", "Biskuat bites"],
  },
  {
    id: 5,
    name: "Paket 5",
    price: 275000,
    category: "standard",
    emoji: "🎊",
    items: ["Kapal api", "Astor", "Eggroll", "Pocky", "Permen bonkopi", "Astor", "Nescafe", "Biskuat bites", "Marjan squash", "Teh sosro isi 15"],
  },
  {
    id: 6,
    name: "Paket 6",
    price: 300000,
    category: "standard",
    emoji: "💝",
    items: ["Oreo wafer", "Oreo box", "Permen box", "Pejoy", "Marjan squash", "Nescafe", "Butter cookies", "Panda", "Grio vanila", "Pocky"],
  },
  {
    id: 7,
    name: "Paket 7",
    price: 300000,
    category: "standard",
    emoji: "🏆",
    items: ["Arden", "Butter cookie", "Nissin wafer", "Marjan squash", "Nescafe", "Pocky", "Teh jawa", "Permen bonkopi"],
  },
  {
    id: 8,
    name: "Paket 8",
    price: 300000,
    category: "premium",
    emoji: "👑",
    popular: true,
    items: ["Marjan squash", "Gizzi", "Minyak fitri 400 ml", "Usagi", "Tango", "Luwak kopi gula", "Chocolatos", "Pocky", "Nabati ah", "Teh dandang", "Tic tic", "Tasty", "Biskuat bites", "Nextar", "Nyam-nyam smile"],
  },
  {
    id: 9,
    name: "Paket 9",
    price: 350000,
    category: "premium",
    emoji: "💎",
    items: ["Biskuat bites", "Teh jawa", "Pocky", "Go potato", "Tango", "Nyam-nyam smile", "Nutrisari", "Nescafe", "Permen fox", "Butter cookie", "Freish", "Gerry eggroll"],
  },
  {
    id: 10,
    name: "Paket 10",
    price: 700000,
    category: "premium",
    emoji: "🌙",
    popular: true,
    items: ["Mangkok", "Kapal api", "Pocky", "Nextar", "Nescafe", "Teh sosro isi 50", "Marjan Boudoin", "Tasty", "Tango", "Minyak fitri 400 ml", "Permen relaxa", "Usagi"],
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Siti Rahayu",
    location: "Jember",
    rating: 5,
    text: "Parcelnya rapi banget dan isinya lengkap! Keluarga saya sangat senang menerimanya. Kemasan elegan bikin makin spesial.",
    package: "Paket 8",
    date: "Lebaran 2025",
  },
  {
    id: 2,
    name: "Ahmad Fauzi",
    location: "Bondowoso",
    rating: 5,
    text: "Pesan Paket 10 untuk kantor, hasilnya memuaskan banget. Pengiriman tepat waktu dan kemasan sangat mewah.",
    package: "Paket 10",
    date: "Lebaran 2025",
  },
  {
    id: 3,
    name: "Dewi Kartika",
    location: "Lumajang",
    rating: 5,
    text: "Sudah 2 tahun berlangganan di Redline Production. Kualitas selalu konsisten dan harga sangat terjangkau!",
    package: "Paket 3",
    date: "Lebaran 2025",
  },
  {
    id: 4,
    name: "Budi Santoso",
    location: "Jember",
    rating: 5,
    text: "Responsif banget pas nanya-nanya via WA. Paketnya sesuai ekspektasi, recommended banget buat hadiah Lebaran!",
    package: "Paket 5",
    date: "Lebaran 2024",
  },
  {
    id: 5,
    name: "Rina Wulandari",
    location: "Situbondo",
    rating: 5,
    text: "Pertama kali order dan langsung puas. Kemasan cantik, isi berkualitas, dan pengiriman aman. Pasti order lagi!",
    package: "Paket 6",
    date: "Lebaran 2024",
  },
  {
    id: 6,
    name: "Hendra Gunawan",
    location: "Probolinggo",
    rating: 4,
    text: "Paket premium-nya worth it banget. Cocok buat kado mertua hehe. Terima kasih Redline Production!",
    package: "Paket 9",
    date: "Lebaran 2024",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
