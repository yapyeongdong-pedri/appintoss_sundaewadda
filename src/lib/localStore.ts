import {
  seedRegistrationRequests,
  seedReports,
  seedUpdateRequests,
  seedVendors,
} from "../data/seed";
import type { LiveReport, RegistrationRequest, UpdateRequest, Vendor } from "../types";

const KEYS = {
  vendors: "sundae-watta/vendors",
  reports: "sundae-watta/reports",
  registrationRequests: "sundae-watta/registration-requests",
  updateRequests: "sundae-watta/update-requests",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (raw == null) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocalVendors(): Vendor[] {
  return readJson(KEYS.vendors, seedVendors);
}

export function loadLocalReports(): LiveReport[] {
  return readJson(KEYS.reports, seedReports);
}

export function loadLocalRegistrationRequests(): RegistrationRequest[] {
  return readJson(KEYS.registrationRequests, seedRegistrationRequests);
}

export function loadLocalUpdateRequests(): UpdateRequest[] {
  return readJson(KEYS.updateRequests, seedUpdateRequests);
}

export function saveLocalReports(reports: LiveReport[]) {
  writeJson(KEYS.reports, reports);
}

export function saveLocalRegistrationRequests(requests: RegistrationRequest[]) {
  writeJson(KEYS.registrationRequests, requests);
}

export function saveLocalUpdateRequests(requests: UpdateRequest[]) {
  writeJson(KEYS.updateRequests, requests);
}
