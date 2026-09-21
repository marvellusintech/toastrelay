export interface UserCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  formattedAddress?: string;
}

export interface CityData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  aliases?: string[];
}

export const KNOWN_CITIES: CityData[] = [
  // Nigeria
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, aliases: ["ikeja", "lekki", "victoria island", "vi", "ikoyi", "yaba", "surulere", "maryland", "ajah", "gbagada"] },
  { city: "Abuja", country: "Nigeria", lat: 9.0765, lon: 7.3986, aliases: ["fct", "wuse", "garki", "maitama", "asokoro", "jabi", "gwarinpa"] },
  { city: "Port Harcourt", country: "Nigeria", lat: 4.8156, lon: 7.0498, aliases: ["ph", "rivers"] },
  { city: "Ibadan", country: "Nigeria", lat: 7.3775, lon: 3.947, aliases: ["oyo", "bodija"] },
  { city: "Benin City", country: "Nigeria", lat: 6.335, lon: 5.6037, aliases: ["edo"] },
  { city: "Enugu", country: "Nigeria", lat: 6.4584, lon: 7.5464, aliases: ["enugu state"] },
  { city: "Kano", country: "Nigeria", lat: 12.0022, lon: 8.5919 },
  { city: "Abeokuta", country: "Nigeria", lat: 7.1475, lon: 3.3619, aliases: ["ogun"] },
  { city: "Calabar", country: "Nigeria", lat: 4.9757, lon: 8.3417, aliases: ["cross river"] },
  { city: "Warri", country: "Nigeria", lat: 5.5167, lon: 5.75, aliases: ["delta"] },
  { city: "Owerri", country: "Nigeria", lat: 5.4852, lon: 7.0351, aliases: ["imo"] },
  { city: "Uyo", country: "Nigeria", lat: 5.0377, lon: 7.9128, aliases: ["akwa ibom"] },
  { city: "Ilorin", country: "Nigeria", lat: 8.4966, lon: 4.5421, aliases: ["kwara"] },

  // Canada & North America
  { city: "Calgary", country: "Canada", lat: 51.0447, lon: -114.0719, aliases: ["ab", "alberta"] },
  { city: "Edmonton", country: "Canada", lat: 53.5461, lon: -113.4938 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, aliases: ["gta", "ontario", "on"] },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, aliases: ["bc", "british columbia"] },
  { city: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673, aliases: ["quebec", "qc"] },
  { city: "Ottawa", country: "Canada", lat: 45.4215, lon: -75.6972 },
  { city: "New York", country: "United States", lat: 40.7128, lon: -74.006, aliases: ["nyc", "manhattan", "brooklyn", "queens"] },
  { city: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, aliases: ["la", "hollywood", "california", "ca"] },
  { city: "San Francisco", country: "United States", lat: 37.7749, lon: -122.4194, aliases: ["sf", "bay area", "silicon valley"] },
  { city: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, aliases: ["illinois", "il"] },
  { city: "Houston", country: "United States", lat: 29.7604, lon: -95.3698, aliases: ["texas", "tx"] },
  { city: "Dallas", country: "United States", lat: 32.7767, lon: -96.797 },
  { city: "Atlanta", country: "United States", lat: 33.749, lon: -84.388, aliases: ["georgia", "ga"] },
  { city: "Miami", country: "United States", lat: 25.7617, lon: -80.1918, aliases: ["florida", "fl"] },
  { city: "Seattle", country: "United States", lat: 47.6062, lon: -122.3321, aliases: ["washington", "wa"] },

  // UK & Europe
  { city: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, aliases: ["uk", "england", "greater london"] },
  { city: "Manchester", country: "United Kingdom", lat: 53.4808, lon: -2.2426 },
  { city: "Birmingham", country: "United Kingdom", lat: 52.4862, lon: -1.8904 },
  { city: "Edinburgh", country: "United Kingdom", lat: 55.9533, lon: -3.1883, aliases: ["scotland"] },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603 },
  { city: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { city: "Berlin", country: "Germany", lat: 52.52, lon: 13.405 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { city: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { city: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },

  // Africa & Middle East & Other
  { city: "Accra", country: "Ghana", lat: 5.6037, lon: -0.187 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219 },
  { city: "Johannesburg", country: "South Africa", lat: -26.2041, lon: 28.0473, aliases: ["joburg", "gauteng"] },
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241 },
  { city: "Kigali", country: "Rwanda", lat: -1.9706, lon: 30.1044 },
  { city: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
  { city: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708, aliases: ["uae"] },
  { city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { city: "Mumbai", country: "India", lat: 19.076, lon: 72.8777 },
];

/**
 * Calculates the great-circle distance between two points in kilometers
 * using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Searches a location string for known city/area names or direct coordinates.
 */
export function extractLocationCoordinates(
  locationStr: string,
): { latitude: number; longitude: number; city: string; country: string } | null {
  if (!locationStr || typeof locationStr !== "string") return null;

  const normalized = locationStr.toLowerCase();

  // 1. Direct coordinate regex check: e.g. "6.5244, 3.3792"
  const coordMatch = normalized.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { latitude: lat, longitude: lon, city: locationStr, country: "" };
    }
  }

  // 2. City & alias lookup
  for (const item of KNOWN_CITIES) {
    const cityNameLower = item.city.toLowerCase();
    const cityRegex = new RegExp(`\\b${cityNameLower}\\b`, "i");
    if (cityRegex.test(normalized)) {
      return { latitude: item.lat, longitude: item.lon, city: item.city, country: item.country };
    }

    if (item.aliases) {
      for (const alias of item.aliases) {
        const aliasRegex = new RegExp(`\\b${alias}\\b`, "i");
        if (aliasRegex.test(normalized)) {
          return { latitude: item.lat, longitude: item.lon, city: item.city, country: item.country };
        }
      }
    }
  }

  return null;
}

/**
 * Finds the closest known city to a given latitude and longitude.
 */
export function findNearestKnownCity(lat: number, lon: number): CityData {
  let closest = KNOWN_CITIES[0];
  let minDistance = Infinity;

  for (const item of KNOWN_CITIES) {
    const dist = calculateHaversineDistance(lat, lon, item.lat, item.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return closest;
}

/**
 * Computes an estimated distance (in km) from the user's location to an event.
 * Returns Infinity if location is missing, online-only, or cannot be resolved.
 */
export function getEventDistance(
  eventLocation: string | null | undefined,
  userCoords: UserCoordinates | null,
): number {
  if (!userCoords || !eventLocation) return Infinity;

  const loc = eventLocation.trim();
  if (!loc || loc.toLowerCase() === "online" || loc.toLowerCase() === "virtual") {
    return Infinity;
  }

  // Check if we can resolve exact coordinates
  const resolved = extractLocationCoordinates(loc);
  if (resolved) {
    return calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      resolved.latitude,
      resolved.longitude,
    );
  }

  // Textual fuzzy matching fallback
  const normalizedLoc = loc.toLowerCase();
  const userCity = userCoords.city?.toLowerCase();
  const userRegion = userCoords.region?.toLowerCase();
  const userCountry = userCoords.country?.toLowerCase();

  if (userCity && normalizedLoc.includes(userCity)) {
    return 10; // Within city bounds ~10km
  }

  if (userRegion && normalizedLoc.includes(userRegion)) {
    return 40; // Within state/region ~40km
  }

  if (userCountry && normalizedLoc.includes(userCountry)) {
    return 250; // Within country ~250km
  }

  // Location string is present but unknown
  return 12000;
}

/**
 * Formats a kilometer distance into a friendly human-readable label.
 */
export function formatDistance(km: number): string {
  if (!isFinite(km) || km < 0) return "";
  if (km < 1) return "< 1 km away";
  if (km < 10) return `${km.toFixed(1)} km away`;
  if (km < 1000) return `${Math.round(km)} km away`;
  return `${Math.round(km).toLocaleString()} km away`;
}

/**
 * Reverse geocodes coordinates to a human-readable city/region/country.
 * Uses BigDataCloud client API with a 3-second timeout and offline dictionary fallback.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<UserCoordinates> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const region = data.principalSubdivision;
      const country = data.countryName;

      let formatted = city || "";
      if (country) {
        formatted = formatted ? `${formatted}, ${country}` : country;
      }

      return {
        latitude: lat,
        longitude: lon,
        city: city || undefined,
        region: region || undefined,
        country: country || undefined,
        formattedAddress: formatted || undefined,
      };
    }
  } catch {
    // Network error or timeout: fall back to dictionary lookup
  }

  const nearest = findNearestKnownCity(lat, lon);
  return {
    latitude: lat,
    longitude: lon,
    city: nearest.city,
    country: nearest.country,
    formattedAddress: `${nearest.city}, ${nearest.country}`,
  };
}

