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

export function loadVendors(): Vendor[] {
  return readJson(KEYS.vendors, seedVendors);
}

export function loadReports(): LiveReport[] {
  return readJson(KEYS.reports, seedReports);
}

export function loadRegistrationRequests(): RegistrationRequest[] {
  return readJson(KEYS.registrationRequests, seedRegistrationRequests);
}

export function loadUpdateRequests(): UpdateRequest[] {
  return readJson(KEYS.updateRequests, seedUpdateRequests);
}

export function saveReports(reports: LiveReport[]) {
  writeJson(KEYS.reports, reports);
}

export function saveRegistrationRequests(requests: RegistrationRequest[]) {
  writeJson(KEYS.registrationRequests, requests);
}

export function saveUpdateRequests(requests: UpdateRequest[]) {
  writeJson(KEYS.updateRequests, requests);
}
