import { feature } from 'topojson-client';
import countriesAtlas from 'world-atlas/countries-110m.json';
import type { Country } from '../db';

// Extract GeoJSON features once
const countriesGeo = feature(
  countriesAtlas as any,
  (countriesAtlas as any).objects.countries
) as any;

export const allGeoFeatures: any[] = countriesGeo.features || [];

// Map of numeric IDs to GeoJSON feature
export const geoFeatureMap = new Map<string, any>();
allGeoFeatures.forEach((f) => {
  const rawId = String(f.id || '');
  geoFeatureMap.set(rawId, f);
  geoFeatureMap.set(rawId.replace(/^0+/, ''), f);
  geoFeatureMap.set(rawId.padStart(3, '0'), f);
});

export function getGeoFeatureForCountry(country: Country | null): any | null {
  if (!country) return null;
  const num = country.isoNumeric;
  return (
    geoFeatureMap.get(num) ||
    geoFeatureMap.get(num.replace(/^0+/, '')) ||
    geoFeatureMap.get(num.padStart(3, '0')) ||
    null
  );
}

export function hasCountryShape(country: Country): boolean {
  const num = country.isoNumeric;
  return (
    geoFeatureMap.has(num) ||
    geoFeatureMap.has(num.replace(/^0+/, '')) ||
    geoFeatureMap.has(num.padStart(3, '0'))
  );
}
