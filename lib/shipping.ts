// Data wilayah Indonesia & perhitungan ongkir.
//
// Sumber data: Open Admin Data (https://openadmindata.org/id/) + dataset
// Caknooo untuk 4 provinsi baru Papua. Total 38 provinsi, 540
// kabupaten/kota, 7.215 kecamatan. Data lengkap di lib/wilayah.json.
//
// Dropdown cascading (Provinsi -> Kota -> Kecamatan) dibangun dari lookup
// map yang di-instantiate sekali di module level, jadi tidak ada async /
// fetch / lag — pemilihan kota & kecamatan instan.

import wilayahData from './wilayah.json';

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

interface RawProvince {
  id: number;
  name: string;
  zone: number;
  cities: { name: string; districts: string[] }[];
}

interface ZoneInfo {
  baseCost: number;
  perKg: number;
  estDays: [number, number];
}

const rawProvinces = wilayahData.provinces as unknown as RawProvince[];
const zoneInfo = wilayahData.zones as unknown as Record<string, ZoneInfo>;

// ---------------------------------------------------------------------------
// Build lookup maps once at module load (synchronous, no async fetch).
// ---------------------------------------------------------------------------
const PROVINCE_BY_NAME = new Map<string, Province>();
const CITIES_BY_PROVINCE = new Map<string, City[]>();
const DISTRICTS_BY_CITY = new Map<string, string[]>();

for (const rp of rawProvinces) {
  const zi = zoneInfo[String(rp.zone)];
  const estDays: [number, number] = [zi.estDays[0], zi.estDays[1]];
  const cities: City[] = rp.cities.map((c) => ({
    name: c.name,
    districts: c.districts,
    baseCost: zi.baseCost,
    estDays,
  }));
  PROVINCE_BY_NAME.set(rp.name, { name: rp.name, cities });
  CITIES_BY_PROVINCE.set(rp.name, cities);
  for (const c of cities) {
    DISTRICTS_BY_CITY.set(`${rp.name}|${c.name}`, c.districts);
  }
}

// Exported provinces list (sorted by name for stable dropdown)
export const PROVINCES: Province[] = rawProvinces
  .map((rp) => PROVINCE_BY_NAME.get(rp.name)!)
  .sort((a, b) => a.name.localeCompare(b.name));

export const PROVINCE_NAMES: string[] = PROVINCES.map((p) => p.name);

// ---------------------------------------------------------------------------
// Helper functions (all synchronous — instant lookup, no lag)
// ---------------------------------------------------------------------------
export function findProvince(name: string): Province | undefined {
  return PROVINCE_BY_NAME.get(name);
}

export function findCity(provinceName: string, cityName: string): City | undefined {
  return CITIES_BY_PROVINCE.get(provinceName)?.find((c) => c.name === cityName);
}

export function getCitiesForProvince(provinceName: string): City[] {
  return CITIES_BY_PROVINCE.get(provinceName) ?? [];
}

export function getDistrictsForCity(provinceName: string, cityName: string): string[] {
  return DISTRICTS_BY_CITY.get(`${provinceName}|${cityName}`) ?? [];
}

// ---------------------------------------------------------------------------
// Shipping cost & admin fee calculation
// ---------------------------------------------------------------------------
export function calculateShipping(
  provinceName: string,
  cityName: string,
  weightGrams: number,
): { cost: number; estDays: [number, number] } | null {
  const city = findCity(provinceName, cityName);
  if (!city) return null;
  const weightKg = Math.max(0.1, weightGrams / 1000); // minimum 100g
  const cost = Math.round(city.baseCost + (Math.ceil(weightKg) - 1) * 5000);
  return { cost, estDays: city.estDays };
}

export function calculateAdminFee(subtotal: number): number {
  // 2% of subtotal, min Rp 2.000, max Rp 10.000
  const fee = subtotal * 0.02;
  return Math.min(10000, Math.max(2000, Math.round(fee)));
}

export function formatEstDays(days: [number, number]): string {
  if (days[0] === days[1]) return `${days[0]} hari`;
  return `${days[0]}-${days[1]} hari`;
}
