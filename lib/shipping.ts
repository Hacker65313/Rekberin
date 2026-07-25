// Data wilayah & perhitungan ongkir untuk simulasi
// Data ini digunakan untuk pilih Provinsi → Kota → Kecamatan

export interface Province {
  name: string;
  cities: City[];
}

export interface City {
  name: string;
  districts: string[];
  baseCost: number; // ongkir dasar per kg
  estDays: [number, number]; // estimasi hari [min, max]
}

// Zona pengiriman: masing-masing zona punya ongkir & estimasi berbeda
// Zona 1: Jakarta & sekitar (2-4 hari)
// Zona 2: Jawa (4-7 hari)
// Zona 3: Luar Jawa (7-10 hari)
export const PROVINCES: Province[] = [
  {
    name: 'DKI Jakarta',
    cities: [
      {
        name: 'Jakarta Pusat',
        districts: ['Cempaka Putih', 'Gambir', 'Kemayoran', 'Menteng', 'Sawah Besar', 'Senen', 'Tanah Abang'],
        baseCost: 8000,
        estDays: [1, 3],
      },
      {
        name: 'Jakarta Selatan',
        districts: ['Cilandak', 'Jagakarsa', 'Kebayoran Baru', 'Kebayoran Lama', 'Mampang Prapatan', 'Pancoran', 'Pasar Minggu', 'Pesanggrahan', 'Setiabudi', 'Tebet'],
        baseCost: 9000,
        estDays: [1, 3],
      },
      {
        name: 'Jakarta Barat',
        districts: ['Cengkareng', 'Grogol Petamburan', 'Kebon Jeruk', 'Kalideres', 'Palmerah', 'Taman Sari', 'Tambora'],
        baseCost: 9000,
        estDays: [1, 3],
      },
      {
        name: 'Jakarta Timur',
        districts: ['Cipayung', 'Ciracas', 'Duren Sawit', 'Jatinegara', 'Kramat Jati', 'Makasar', 'Matraman', 'Pulo Gadung'],
        baseCost: 10000,
        estDays: [1, 3],
      },
      {
        name: 'Jakarta Utara',
        districts: ['Cilincing', 'Kelapa Gading', 'Koja', 'Pademangan', 'Penjaringan', 'Tanjung Priok'],
        baseCost: 10000,
        estDays: [1, 3],
      },
    ],
  },
  {
    name: 'Banten',
    cities: [
      {
        name: 'Tangerang',
        districts: ['Tangerang', 'Batuceper', 'Benda', 'Cipondoh', 'Jatiuwung', 'Karang Tengah', 'Larangan', 'Neglasari', 'Periuk', 'Pinang'],
        baseCost: 12000,
        estDays: [2, 4],
      },
      {
        name: 'Tangerang Selatan',
        districts: ['Ciputat', 'Cireundeu', 'East Ciputat', 'Jurangmangu', 'Pamulang', 'Pondok Aren', 'Pondok Jagung', 'Serpong', 'Serpong Utara'],
        baseCost: 12000,
        estDays: [2, 4],
      },
      {
        name: 'Bekasi',
        districts: ['Bekasi Barat', 'Bekasi Selatan', 'Bekasi Timur', 'Bekasi Utara', 'Medan Satria', 'Rawalumbu', 'Bantargebang'],
        baseCost: 12000,
        estDays: [2, 4],
      },
      {
        name: 'Serang',
        districts: ['Serang', 'Cipocok Jaya', 'Curug', 'Kasemen', 'Kramatwatu', 'Taktakan', 'Walantaka'],
        baseCost: 14000,
        estDays: [2, 4],
      },
    ],
  },
  {
    name: 'Jawa Barat',
    cities: [
      {
        name: 'Bandung',
        districts: ['Bandung Wetan', 'Coblong', 'Cidadap', 'Sumur Bandung', 'Regol', 'Bandung Kidul', 'Astana Anyar', 'Bojong Loa Kaler', 'Bojong Loa Kidul', 'Lengkong', 'Bandung Kulon', 'Babakan Cipadung', 'Kiaracondong', 'Mandalajati', 'Cinambo', 'Cibeunying Kidul', 'Cibeunying Kaler', ' Gedebage', 'Rancasari', 'Antapani', 'Ujungberung', 'Sukajadi', 'Sukasari', 'Cicendo', 'Andir', 'Tegalega'],
        baseCost: 15000,
        estDays: [2, 4],
      },
      {
        name: 'Bogor',
        districts: ['Bogor Tengah', 'Bogor Timur', 'Bogor Utara', 'Bogor Selatan', 'Bogor Barat', 'Tanah Sareal', 'Bantar Jaya', 'Cibinong'],
        baseCost: 13000,
        estDays: [2, 4],
      },
      {
        name: 'Depok',
        districts: ['Depok', 'Pancoran Mas', 'Beji', 'Cipayung', 'Sukmajaya', 'Cimanggis', 'Limo', 'Sawangan', 'Bojongsari', 'Cilodong'],
        baseCost: 13000,
        estDays: [2, 4],
      },
      {
        name: 'Cimahi',
        districts: ['Cimahi', 'Cimahi Tengah', 'Cimahi Selatan', 'Cimahi Utara'],
        baseCost: 16000,
        estDays: [2, 4],
      },
      {
        name: 'Sukabumi',
        districts: ['Sukabumi', 'Warudoyong', 'Cikole', 'Lembah Tengah', 'Baros', 'Gedong Tetek'],
        baseCost: 18000,
        estDays: [3, 5],
      },
      {
        name: 'Cianjur',
        districts: ['Cianjur', 'Cibeber', 'Cikalong Kulon', 'Cipanas', 'Karangtengah'],
        baseCost: 19000,
        estDays: [3, 5],
      },
      {
        name: 'Tasikmalaya',
        districts: ['Tasikmalaya', 'Cihideung', 'Cipedes', 'Indihiang', 'Kawalu', 'Tamansari'],
        baseCost: 20000,
        estDays: [3, 5],
      },
      {
        name: 'Cirebon',
        districts: ['Cirebon', 'Pesisir', 'Lemahwungkuk', 'Kejaksan', 'Harjamukti', 'Kesambi', 'Patomanan', 'Tegalsari'],
        baseCost: 21000,
        estDays: [3, 5],
      },
    ],
  },
  {
    name: 'Jawa Tengah',
    cities: [
      {
        name: 'Semarang',
        districts: ['Semarang Tengah', 'Semarang Utara', 'Semarang Timur', 'Semarang Selatan', 'Semarang Barat', 'Gajah Mungkur', 'Gayamsari', 'Pedurungan', 'Mijen', 'Banyumanik', 'Candisari', 'Genuk', 'Tugu', 'Ngaliyan', 'Gunungpati', 'Argomulyo', 'Tembalang', 'Bumi Tembalang'],
        baseCost: 22000,
        estDays: [3, 5],
      },
      {
        name: 'Surakarta',
        districts: ['Laweyan', 'Serengan', 'Pasar Kliwon', 'Jebres', 'Banjarsari', 'Banyu Urip'],
        baseCost: 23000,
        estDays: [3, 5],
      },
      {
        name: 'Kudus',
        districts: ['Kudus', 'Jati', 'Undaan', 'Mejobo', 'Jekulo', 'Gebog', 'Dawe', 'Colo', 'Undaan', 'Kaliwungu'],
        baseCost: 24000,
        estDays: [3, 5],
      },
      {
        name: 'Magelang',
        districts: ['Magelang Utara', 'Magelang Selatan', 'Magelang Tengah', 'Magelang Timur', 'Magelang Barat', 'Kramat Utara', 'Kramat Selatan', 'Tidar Utara', 'Tidar Selatan'],
        baseCost: 24000,
        estDays: [3, 5],
      },
      {
        name: 'Tegal',
        districts: ['Tegal Timur', 'Tegal Barat', 'Tegal Selatan', 'Margadana', 'Adiwerna', 'Dukuhturi', 'Talang'],
        baseCost: 25000,
        estDays: [3, 5],
      },
    ],
  },
  {
    name: 'Jawa Timur',
    cities: [
      {
        name: 'Surabaya',
        districts: ['Tegalsari', 'Genteng', 'Wonokromo', 'Bubutan', 'Pabean Cantian', 'Semampir', 'Krembangan', 'Kenjeran', 'Bulak', 'Simokerto', 'Gubeng', 'Putat Gede', 'Wonocolo', 'Rungkut', 'Sukolilo', 'Tambaksari', 'Sawahan', 'Karang Pilang', 'Gayungan'],
        baseCost: 25000,
        estDays: [3, 5],
      },
      {
        name: 'Sidoarjo',
        districts: ['Sidoarjo', 'Buduran', 'Candi', 'Gedangan', 'Jabon', 'Krian', 'Porong', 'Prambon', 'Sukodono', 'Tanggulangin', 'Taman', 'Waru'],
        baseCost: 26000,
        estDays: [3, 5],
      },
      {
        name: 'Malang',
        districts: ['Kedungkandang', 'Blimbing', 'Klojen', 'Lowokwaru', 'Sukun', 'Batu'],
        baseCost: 28000,
        estDays: [3, 5],
      },
      {
        name: 'Gresik',
        districts: ['Gresik', 'Bungah', 'Cerme', 'Duduk', 'Dukun', 'Driyorejo', 'Girimulyo', 'Kebomas', 'Manyar', 'Menganti', 'Panceng', 'Sangkapura', 'Sidayu', 'Ujungpangkah', 'Wringinanom'],
        baseCost: 26000,
        estDays: [3, 5],
      },
      {
        name: 'Jember',
        districts: ['Jember', 'Ambulu', 'Ajung', 'Arjasa', 'Balung', 'Bangsalsari', 'Gumukmas', 'Jelbuk', 'Kalisat', 'Kec. Kencong', 'Kertosono', 'Ledokombo', 'Mayang', 'Pakusari', 'Panti', 'Patrang', 'Rambipuji', 'Sempu', 'Silo', 'Sukorambi', 'Sumbersari', 'Sumberjambe', 'Tanggul', 'Tempurejo', 'Umbulsari', 'Wuluhan'],
        baseCost: 30000,
        estDays: [4, 6],
      },
    ],
  },
  {
    name: 'Bali',
    cities: [
      {
        name: 'Denpasar',
        districts: ['Denpasar Barat', 'Denpasar Selatan', 'Denpasar Timur', 'Denpasar Utara'],
        baseCost: 30000,
        estDays: [4, 7],
      },
      {
        name: 'Badung',
        districts: ['Kuta', 'Kuta Utara', 'Kuta Selatan', 'Mengwi', 'Abiansemal', 'Petang', 'North Kuta'],
        baseCost: 32000,
        estDays: [4, 7],
      },
      {
        name: 'Gianyar',
        districts: ['Gianyar', 'Sukawati', 'Blahbatuh', 'Tampaksiring', 'Tegallalang', 'Ubud', 'Payangan', 'Tegallalang', 'Bali'],
        baseCost: 33000,
        estDays: [4, 7],
      },
    ],
  },
  {
    name: 'Sumatera Utara',
    cities: [
      {
        name: 'Medan',
        districts: ['Medan Tengah', 'Medan Barat', 'Medan Timur', 'Medan Utara', 'Medan Selatan', 'Medan Kota', 'Medan Perjuangan', 'Medan Area', 'Medan Helvetia', 'Medan Polonia', 'Medan Petisah', 'Medan Sunggal', 'Medan Denai', 'Medan Deli', 'Medan Labuhan', 'Medan Marelan', 'Medan Belawan', 'Medan Kota'],
        baseCost: 35000,
        estDays: [4, 7],
      },
      {
        name: 'Binjai',
        districts: ['Binjai Utara', 'Binjai Selatan', 'Binjai Barat', 'Binjai Timur', 'Binjai Kota'],
        baseCost: 37000,
        estDays: [4, 7],
      },
    ],
  },
  {
    name: 'Sumatera Barat',
    cities: [
      {
        name: 'Padang',
        districts: ['Padang Barat', 'Padang Utara', 'Padang Selatan', 'Padang Timur', 'Padang Timur', 'Kuranji', 'Lubuk Begalung', 'Lubuk Kilangan', 'Bungus Teluk Kabung', 'Koto Tangah', 'Nanggalo', 'Pauh'],
        baseCost: 38000,
        estDays: [4, 7],
      },
    ],
  },
  {
    name: 'Riau',
    cities: [
      {
        name: 'Pekanbaru',
        districts: ['Pekanbaru', 'Marpoyan', 'Sail', 'Senapelan', 'Sukajadi', 'Tampan', 'Tenayan Raya', 'Rumbai', 'Bukit Raya', 'Lima Puluh', 'Payung Sekaki'],
        baseCost: 40000,
        estDays: [5, 8],
      },
    ],
  },
  {
    name: 'Sumatera Selatan',
    cities: [
      {
        name: 'Palembang',
        districts: ['Ilir Timur I', 'Ilir Timur II', 'Ilir Barat I', 'Ilir Barat II', 'Seberang Ulu I', 'Seberang Ulu II', 'Sukarami', 'Kalidoni', 'Sako', 'Alang-alang Lebar', 'Kemuning', 'Plaju', 'Bukit Kecil', 'Kertapati'],
        baseCost: 42000,
        estDays: [5, 8],
      },
    ],
  },
  {
    name: 'Lampung',
    cities: [
      {
        name: 'Bandar Lampung',
        districts: ['Teluk Betung Utara', 'Teluk Betung Selatan', 'Teluk Betung Barat', 'Teluk Betung Timur', 'Tanjung Karang Pusat', 'Tanjung Karang Barat', 'Tanjung Karang Timur', 'Tanjung Senang', 'Tanjung Raja', 'Kedamaian', 'Panjang', 'Bumi Waras', 'Bumi Ratu', 'Way Laga', 'Sukarame', 'Tanjung Pinang'],
        baseCost: 38000,
        estDays: [4, 7],
      },
    ],
  },
  {
    name: 'Kalimantan Timur',
    cities: [
      {
        name: 'Samarinda',
        districts: ['Samarinda Utara', 'Samarinda Ilir', 'Samarinda Ulu', 'Samarinda Seberang', 'Sambutan', 'Palaran', 'Loa Janan Ilir', 'Sungai Kunjang', 'Loa Janan'],
        baseCost: 45000,
        estDays: [5, 9],
      },
      {
        name: 'Balikpapan',
        districts: ['Balikpapan Tengah', 'Balikpapan Utara', 'Balikpapan Selatan', 'Balikpapan Barat', 'Balikpapan Timur', 'Balikpapan Kota'],
        baseCost: 46000,
        estDays: [5, 9],
      },
    ],
  },
  {
    name: 'Kalimantan Barat',
    cities: [
      {
        name: 'Pontianak',
        districts: ['Pontianak Selatan', 'Pontianak Timur', 'Pontianak Barat', 'Pontianak Utara', 'Pontianak Kota', 'Bantan Tengah', 'Sungai Pinyuh'],
        baseCost: 47000,
        estDays: [5, 9],
      },
    ],
  },
  {
    name: 'Sulawesi Utara',
    cities: [
      {
        name: 'Manado',
        districts: ['Wenang', 'Singkil', 'Tikala', 'Sario', 'Bunaken', 'Bunaken Kepulauan', 'Malalayang', 'Mapanget', 'Molas', 'Bumi Tien Raya', 'Pasar Belang', 'Wanea', 'Tuminting', 'Suluun Tara', 'Tatelu'],
        baseCost: 48000,
        estDays: [6, 10],
      },
    ],
  },
  {
    name: 'Sulawesi Selatan',
    cities: [
      {
        name: 'Makassar',
        districts: ['Makassar', 'Ujung Pandang', 'Bontoala', 'Wajo', 'Mariso', 'Tamalanrea', 'Biringmulai', 'Tamanggase', 'Rappocini', 'Panakkukang', 'Mamajang', 'Tallo', 'Ujung Tanah', 'Bonto Marannu', 'Borong', 'Bonto Bahari'],
        baseCost: 48000,
        estDays: [5, 9],
      },
    ],
  },
  {
    name: 'Papua',
    cities: [
      {
        name: 'Jayapura',
        districts: ['Jayapura Utara', 'Jayapura Selatan', 'Abepura', 'Muara Tami', 'Hamadi'],
        baseCost: 55000,
        estDays: [7, 12],
      },
    ],
  },
  {
    name: 'Nusa Tenggara Barat',
    cities: [
      {
        name: 'Mataram',
        districts: ['Cakranegara', 'Ampenan', 'Selaparang', 'Sekarbela', 'Mataram'],
        baseCost: 35000,
        estDays: [4, 7],
      },
    ],
  },
  {
    name: 'Nusa Tenggara Timur',
    cities: [
      {
        name: 'Kupang',
        districts: ['Kupang Tengah', 'Kupang Barat', 'Kelapa Lima', 'Kelapa Lima Dalam', 'Oebobo', 'Maulafa', 'Alak'],
        baseCost: 38000,
        estDays: [5, 9],
      },
    ],
  },
];

/** Cari province berdasarkan nama. */
export function findProvince(name: string): Province | undefined {
  return PROVINCES.find((p) => p.name === name);
}

/** Cari city dalam province. */
export function findCity(provinceName: string, cityName: string): City | undefined {
  const p = findProvince(provinceName);
  return p?.cities.find((c) => c.name === cityName);
}

/** Hitung ongkir: baseCost dikalikan faktor berat (kg). */
export function calculateShipping(
  provinceName: string,
  cityName: string,
  weightGrams: number,
): { cost: number; estDays: [number, number] } {
  const city = findCity(provinceName, cityName);
  if (!city) {
    return { cost: 30000, estDays: [5, 10] };
  }
  const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
  const cost = city.baseCost * weightKg;
  return { cost, estDays: city.estDays };
}

/** Biaya admin: 2% dari subtotal (minimum Rp 2.000, maksimum Rp 10.000). */
export function calculateAdminFee(subtotal: number): number {
  return Math.min(10000, Math.max(2000, Math.round(subtotal * 0.02)));
}

/** Format estimasi hari: "2–4 hari". */
export function formatEstDays(days: [number, number]): string {
  return `${days[0]}–${days[1]} hari`;
}

/** Daftar nama provinsi saja (untuk dropdown). */
export const PROVINCE_NAMES = PROVINCES.map((p) => p.name);

/** Ambil daftar kota dari provinsi. */
export function getCitiesForProvince(provinceName: string): City[] {
  return findProvince(provinceName)?.cities || [];
}

/** Ambil daftar kecamatan dari provinsi + kota. */
export function getDistrictsForCity(provinceName: string, cityName: string): string[] {
  return findCity(provinceName, cityName)?.districts || [];
}
