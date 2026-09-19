import { Language } from '../types';

export interface GeoDetectionResult {
  countryCode: string | null; // e.g. "TZ", "KE", "UG", "US"
  countryName?: string;
  ip?: string;
  provider?: string;
  resolvedLanguage: Language; // 'sw' for TZ, 'en' for KE and others
  isFallback: boolean;
}

export const GEO_STORAGE_KEYS = {
  // Saved language preference (takes priority when chosen)
  LANG_PREF: 'gix_user_lang_preference',
  // Indicates if user explicitly clicked/chose their language manually
  IS_MANUAL_SELECTION: 'gix_lang_is_manual',
  // Detected country code from IP Geolocation
  DETECTED_COUNTRY: 'gix_detected_country_code',
  // Detected country name
  DETECTED_COUNTRY_NAME: 'gix_detected_country_name',
  // Timestamp when geolocation detection last succeeded
  DETECTED_AT: 'gix_detected_timestamp',
  // Legacy key compatibility
  LEGACY_LANG: 'gix_ai_tasks_lang',
};

/**
 * Maps country code to platform language based on explicit rules:
 * - "TZ" (Tanzania) -> Swahili ('sw')
 * - "KE" (Kenya) -> English ('en')
 * - All other countries / fallback -> English ('en')
 */
export function resolveLanguageFromCountry(countryCode: string | null): Language {
  if (!countryCode) return 'en';
  const cleanCode = countryCode.trim().toUpperCase();
  if (cleanCode === 'TZ') {
    return 'sw';
  }
  return 'en';
}

/**
 * Validates whether a country code is a valid 2-letter uppercase ISO code
 */
function isValidCountryCode(code: unknown): code is string {
  return typeof code === 'string' && /^[A-Za-z]{2}$/.test(code.trim());
}

/**
 * Performs IP Geolocation using public, CORS-enabled HTTPS providers with multi-tier fallback.
 * Strictly uses IP lookup: NO browser GPS, NO location prompts, NO timezone guessing.
 * Non-blocking with strict timeout (defaults to 3500ms).
 */
export async function detectVisitorCountry(timeoutMs = 3500): Promise<GeoDetectionResult> {
  // Provider 1: api.country.is (ultra-fast, lightweight JSON: { "country": "TZ", "ip": "..." })
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch('https://api.country.is/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      if (isValidCountryCode(data?.country)) {
        const countryCode = data.country.trim().toUpperCase();
        const resolvedLang = resolveLanguageFromCountry(countryCode);
        return {
          countryCode,
          ip: data.ip,
          provider: 'api.country.is',
          resolvedLanguage: resolvedLang,
          isFallback: false,
        };
      }
    }
  } catch {
    // Silently fall through to secondary provider without throwing
  }

  // Provider 2: ipwho.is (fast, returns { "success": true, "country_code": "TZ", "country": "Tanzania" })
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch('https://ipwho.is/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      if (data?.success && isValidCountryCode(data?.country_code)) {
        const countryCode = data.country_code.trim().toUpperCase();
        const resolvedLang = resolveLanguageFromCountry(countryCode);
        return {
          countryCode,
          countryName: data.country,
          ip: data.ip,
          provider: 'ipwho.is',
          resolvedLanguage: resolvedLang,
          isFallback: false,
        };
      }
    }
  } catch {
    // Silently fall through to third provider
  }

  // Provider 3: ipinfo.io/json
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch('https://ipinfo.io/json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      if (isValidCountryCode(data?.country)) {
        const countryCode = data.country.trim().toUpperCase();
        const resolvedLang = resolveLanguageFromCountry(countryCode);
        return {
          countryCode,
          countryName: data.city ? `${data.city}, ${countryCode}` : countryCode,
          ip: data.ip,
          provider: 'ipinfo.io',
          resolvedLanguage: resolvedLang,
          isFallback: false,
        };
      }
    }
  } catch {
    // Silently fall through to fallback
  }

  // Default fallback if all IP geolocation providers fail or timeout:
  // "Ikiwa IP geolocation haipatikani, haijulikani, au kuna error, tumia English kama fallback."
  return {
    countryCode: null,
    resolvedLanguage: 'en',
    isFallback: true,
  };
}

/**
 * Returns user-friendly metadata for common country codes
 */
export function getCountryMeta(code: string | null): {
  code: string;
  nameEn: string;
  nameSw: string;
  flag: string;
} {
  if (!code) {
    return {
      code: 'UNKNOWN',
      nameEn: 'Global / International',
      nameSw: 'Kimataifa',
      flag: '🌐',
    };
  }

  const clean = code.trim().toUpperCase();
  const map: Record<string, { nameEn: string; nameSw: string; flag: string }> = {
    TZ: { nameEn: 'Tanzania', nameSw: 'Tanzania', flag: '🇹🇿' },
    KE: { nameEn: 'Kenya', nameSw: 'Kenya', flag: '🇰🇪' },
    UG: { nameEn: 'Uganda', nameSw: 'Uganda', flag: '🇺🇬' },
    RW: { nameEn: 'Rwanda', nameSw: 'Rwanda', flag: '🇷🇼' },
    BI: { nameEn: 'Burundi', nameSw: 'Burundi', flag: '🇧🇮' },
    CD: { nameEn: 'DR Congo', nameSw: 'Kongo', flag: '🇨🇩' },
    ZM: { nameEn: 'Zambia', nameSw: 'Zambia', flag: '🇿🇲' },
    MW: { nameEn: 'Malawi', nameSw: 'Malawi', flag: '🇲🇼' },
    MZ: { nameEn: 'Mozambique', nameSw: 'Msumbiji', flag: '🇲🇿' },
    ZA: { nameEn: 'South Africa', nameSw: 'Afrika Kusini', flag: '🇿🇦' },
    NG: { nameEn: 'Nigeria', nameSw: 'Nigeria', flag: '🇳🇬' },
    GH: { nameEn: 'Ghana', nameSw: 'Ghana', flag: '🇬🇭' },
    US: { nameEn: 'United States', nameSw: 'Marekani', flag: '🇺🇸' },
    GB: { nameEn: 'United Kingdom', nameSw: 'Uingereza', flag: '🇬🇧' },
    CA: { nameEn: 'Canada', nameSw: 'Kanada', flag: '🇨🇦' },
    AE: { nameEn: 'United Arab Emirates', nameSw: 'Falme za Kiarabu', flag: '🇦🇪' },
    IN: { nameEn: 'India', nameSw: 'Uhindi', flag: '🇮🇳' },
    CN: { nameEn: 'China', nameSw: 'Uchina', flag: '🇨🇳' },
  };

  if (map[clean]) {
    return { code: clean, ...map[clean] };
  }

  return {
    code: clean,
    nameEn: clean,
    nameSw: clean,
    flag: '🌍',
  };
}
