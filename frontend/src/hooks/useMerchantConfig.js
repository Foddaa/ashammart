import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

// key -> Promise. Shared by every component, so each key is requested
// only once per page load (Footer + Contact don't double-fetch).
const cache = new Map();

// Mounted hooks listen here so they can refetch after an admin edit.
const listeners = new Set();

const fetchKey = (key) => {
  if (!cache.has(key)) {
    const request = api
      .get(`/api/merchant-config/${key}`)
      .then((res) => res.data?.configValue ?? "") // <-- change field name if your entity differs
      .catch((error) => {
        console.error(`Failed to load config "${key}":`, error);
        cache.delete(key); // allow a retry on the next mount
        return null;
      });
    cache.set(key, request);
  }
  return cache.get(key);
};

/**
 * Call after saving config keys (admin page). Clears the cached values and
 * makes every mounted component that uses those keys (e.g. the Footer)
 * refetch them immediately.
 */
export function invalidateMerchantConfig(keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  list.forEach((key) => cache.delete(key));
  listeners.forEach((listener) => listener(list));
}

const emptyConfig = (keyMap) =>
  Object.fromEntries(Object.keys(keyMap).map((field) => [field, ""]));

/**
 * keyMap: { fieldName: "database_config_key" }
 * Define it OUTSIDE the component so its reference stays stable.
 * Returns { config, loading } where config[fieldName] is the stored value
 * ("" while loading, or when the key is missing / failed).
 */
export default function useMerchantConfig(keyMap) {
  const [config, setConfig] = useState(() => emptyConfig(keyMap));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = () =>
      Promise.all(
        Object.entries(keyMap).map(async ([field, key]) => [
          field,
          await fetchKey(key),
        ])
      ).then((entries) => {
        if (ignore) return;
        const loaded = {};
        entries.forEach(([field, value]) => {
          if (value !== null) loaded[field] = value;
        });
        setConfig((prev) => ({ ...prev, ...loaded }));
        setLoading(false);
      });

    load();

    const onInvalidate = (changedKeys) => {
      if (Object.values(keyMap).some((key) => changedKeys.includes(key))) {
        load();
      }
    };
    listeners.add(onInvalidate);

    return () => {
      ignore = true;
      listeners.delete(onInvalidate);
    };
  }, [keyMap]);

  return { config, loading };
}