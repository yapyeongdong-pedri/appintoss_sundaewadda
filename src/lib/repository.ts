import type { LiveReport, MenuItem, RegistrationRequest, UpdateRequest, Vendor, VisitRule } from "../types";
import {
  loadLocalRegistrationRequests,
  loadLocalReports,
  loadLocalUpdateRequests,
  loadLocalVendors,
  saveLocalRegistrationRequests,
  saveLocalReports,
  saveLocalUpdateRequests,
} from "./localStore";
import { sanitizeLiveReports } from "./liveReports";
import { hasSupabaseConfig, supabase } from "./supabase";

interface VendorRow {
  id: string;
  name: string;
  category: Vendor["category"];
  phone: string;
  menu_summary: string[];
  menu_board_photos?: string[] | null;
  price_summary: string;
  business_hours: string;
  visit_pattern: string;
  visit_rules?: VisitRule[] | null;
  description: string;
  position_x: number;
  position_y: number;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface VendorMenuItemRow {
  id: string;
  vendor_id: string;
  menu_name: string;
  price: string;
  menu_category: MenuItem["category"];
  sort_order: number;
  is_available: boolean;
}

interface LiveReportRow {
  id: string;
  vendor_id: string;
  type: string;
  created_at: string;
  reporter_id: string;
  report_date_key?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
}

interface RegistrationRequestRow {
  id: string;
  name: string;
  phone?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  visit_pattern: string;
  visit_rules?: VisitRule[] | null;
  business_hours?: string | null;
  business_card_photo: string;
  menu_board_photos?: string[] | null;
  menu_categories?: RegistrationRequest["menuCategories"] | null;
  submitted_at: string;
  duplicate_candidate_ids: string[];
}

interface UpdateRequestRow {
  id: string;
  vendor_id: string;
  field: UpdateRequest["field"];
  value: string;
  visit_rules?: VisitRule[] | null;
  menu_board_photos?: string[] | null;
  proposed_latitude?: number | null;
  proposed_longitude?: number | null;
  submitted_at: string;
}

export interface AppDataBundle {
  vendors: Vendor[];
  reports: LiveReport[];
  registrationRequests: RegistrationRequest[];
  updateRequests: UpdateRequest[];
}

function buildFallbackMenuItems(menuSummary: string[], priceSummary: string) {
  const prices = priceSummary
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return menuSummary.map((name, index) => ({
    name,
    price: prices[index] ?? prices[prices.length - 1] ?? "-",
    category: "\uAE30\uD0C0" as const,
  }));
}

function mapVendorRow(row: VendorRow, menuItems: MenuItem[]): Vendor {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    phone: row.phone,
    menuSummary: row.menu_summary,
    menuBoardPhotos: row.menu_board_photos ?? [],
    menuItems: menuItems.length > 0 ? menuItems : buildFallbackMenuItems(row.menu_summary, row.price_summary),
    priceSummary: row.price_summary,
    businessHours: row.business_hours,
    visitPattern: row.visit_pattern,
    visitRules: row.visit_rules ?? undefined,
    description: row.description,
    position: {
      x: row.position_x,
      y: row.position_y,
      address: row.address,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
    },
  };
}

function mapReportRow(row: LiveReportRow): LiveReport {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    type: row.type as LiveReport["type"],
    createdAt: row.created_at,
    reportDateKey: row.report_date_key ?? undefined,
    reporterId: row.reporter_id,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    accuracy: row.accuracy ?? undefined,
  };
}

function mapRegistrationRequestRow(row: RegistrationRequestRow): RegistrationRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    location: row.location,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    visitPattern: row.visit_pattern,
    visitRules: row.visit_rules ?? undefined,
    businessHours: row.business_hours ?? "",
    businessCardPhoto: row.business_card_photo,
    menuBoardPhotos: row.menu_board_photos ?? [],
    menuCategories: row.menu_categories ?? [],
    submittedAt: row.submitted_at,
    duplicateCandidateIds: row.duplicate_candidate_ids ?? [],
  };
}

function mapUpdateRequestRow(row: UpdateRequestRow): UpdateRequest {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    field: row.field,
    value: row.value,
    visitRules: row.visit_rules ?? undefined,
    menuBoardPhotos: row.menu_board_photos ?? [],
    proposedLatitude: row.proposed_latitude ?? undefined,
    proposedLongitude: row.proposed_longitude ?? undefined,
    submittedAt: row.submitted_at,
  };
}

function getFallbackBundle(): AppDataBundle {
  return {
    vendors: loadLocalVendors(),
    reports: loadLocalReports(),
    registrationRequests: loadLocalRegistrationRequests(),
    updateRequests: loadLocalUpdateRequests(),
  };
}

export async function loadAppData(): Promise<AppDataBundle> {
  if (!hasSupabaseConfig || supabase == null) {
    return getFallbackBundle();
  }

  try {
    const [vendorsResult, reportsResult, registrationResult, updateResult, vendorMenuItemsResult] =
      await Promise.all([
        supabase.from("vendors").select("*").order("created_at", { ascending: true }),
        supabase.from("live_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("registration_requests").select("*").order("submitted_at", { ascending: false }),
        supabase.from("update_requests").select("*").order("submitted_at", { ascending: false }),
        supabase
          .from("vendor_menu_items")
          .select("*")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
      ]);

    if (vendorsResult.error || reportsResult.error || registrationResult.error || updateResult.error) {
      console.warn("Supabase load failed, using local fallback.", {
        vendorsError: vendorsResult.error,
        reportsError: reportsResult.error,
        registrationError: registrationResult.error,
        updateError: updateResult.error,
      });
      return getFallbackBundle();
    }

    const menuMap = new Map<string, MenuItem[]>();
    if (!vendorMenuItemsResult.error && vendorMenuItemsResult.data != null) {
      (vendorMenuItemsResult.data as VendorMenuItemRow[]).forEach((row) => {
        const next = menuMap.get(row.vendor_id) ?? [];
        next.push({
          name: row.menu_name,
          price: row.price,
          category: row.menu_category ?? "\uAE30\uD0C0",
        });
        menuMap.set(row.vendor_id, next);
      });
    }

    return {
      vendors: (vendorsResult.data as VendorRow[]).map((row) => mapVendorRow(row, menuMap.get(row.id) ?? [])),
      reports: sanitizeLiveReports((reportsResult.data as LiveReportRow[]).map(mapReportRow)),
      registrationRequests: (registrationResult.data as RegistrationRequestRow[]).map(mapRegistrationRequestRow),
      updateRequests: (updateResult.data as UpdateRequestRow[]).map(mapUpdateRequestRow),
    };
  } catch (error) {
    console.warn("Unexpected Supabase load failure, using local fallback.", error);
    return getFallbackBundle();
  }
}

export async function createLiveReport(report: LiveReport): Promise<void> {
  saveLocalReports([report, ...loadLocalReports()]);

  if (!hasSupabaseConfig || supabase == null) {
    return;
  }

  const { error } = await supabase.from("live_reports").insert({
    id: report.id,
    vendor_id: report.vendorId,
    type: report.type,
    created_at: report.createdAt,
    report_date_key: report.reportDateKey ?? null,
    reporter_id: report.reporterId,
    latitude: report.latitude ?? null,
    longitude: report.longitude ?? null,
    accuracy: report.accuracy ?? null,
  });

  if (error) {
    console.warn("Supabase report insert failed; local fallback kept.", error);
  }
}

export async function createRegistrationRequest(request: RegistrationRequest): Promise<void> {
  saveLocalRegistrationRequests([request, ...loadLocalRegistrationRequests()]);

  if (!hasSupabaseConfig || supabase == null) {
    return;
  }

  const { error } = await supabase.from("registration_requests").insert({
    id: request.id,
    name: request.name,
    phone: request.phone,
    location: request.location,
    latitude: request.latitude ?? null,
    longitude: request.longitude ?? null,
    visit_pattern: request.visitPattern,
    visit_rules: request.visitRules ?? [],
    business_hours: request.businessHours,
    business_card_photo: request.businessCardPhoto,
    menu_board_photos: request.menuBoardPhotos,
    menu_categories: request.menuCategories,
    submitted_at: request.submittedAt,
    duplicate_candidate_ids: request.duplicateCandidateIds,
  });

  if (error) {
    console.warn("Supabase registration request insert failed; local fallback kept.", error);
  }
}

export async function createUpdateRequest(request: UpdateRequest): Promise<void> {
  saveLocalUpdateRequests([request, ...loadLocalUpdateRequests()]);

  if (!hasSupabaseConfig || supabase == null) {
    return;
  }

  const { error } = await supabase.from("update_requests").insert({
    id: request.id,
    vendor_id: request.vendorId,
    field: request.field,
    value: request.value,
    visit_rules: request.visitRules ?? [],
    menu_board_photos: request.menuBoardPhotos ?? [],
    proposed_latitude: request.proposedLatitude ?? null,
    proposed_longitude: request.proposedLongitude ?? null,
    submitted_at: request.submittedAt,
  });

  if (error) {
    console.warn("Supabase update request insert failed; local fallback kept.", error);
  }
}
