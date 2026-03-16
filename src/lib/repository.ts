import type { LiveReport, MenuItem, RegistrationRequest, UpdateRequest, Vendor } from "../types";
import {
  loadLocalRegistrationRequests,
  loadLocalReports,
  loadLocalUpdateRequests,
  loadLocalVendors,
  saveLocalRegistrationRequests,
  saveLocalReports,
  saveLocalUpdateRequests,
} from "./localStore";
import { hasSupabaseConfig, supabase } from "./supabase";

interface VendorRow {
  id: string;
  name: string;
  category: Vendor["category"];
  phone: string;
  menu_summary: string[];
  price_summary: string;
  business_hours: string;
  visit_pattern: string;
  description: string;
  position_x: number;
  position_y: number;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  owner_confirmed_today: boolean;
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
  type: LiveReport["type"];
  created_at: string;
  note: string | null;
  photo_label: string | null;
  reporter_id: string;
}

interface RegistrationRequestRow {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  visit_pattern: string;
  business_card_photo: string;
  menu_board_photo: string;
  menu_categories?: RegistrationRequest["menuCategories"] | null;
  submitted_at: string;
  duplicate_candidate_ids: string[];
}

interface UpdateRequestRow {
  id: string;
  vendor_id: string;
  field: UpdateRequest["field"];
  value: string;
  menu_category?: UpdateRequest["menuCategory"] | null;
  target_menu_name?: string | null;
  current_menu_name?: string | null;
  current_menu_price?: string | null;
  proposed_menu_name?: string | null;
  proposed_menu_price?: string | null;
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
    menuItems: menuItems.length > 0 ? menuItems : buildFallbackMenuItems(row.menu_summary, row.price_summary),
    priceSummary: row.price_summary,
    businessHours: row.business_hours,
    visitPattern: row.visit_pattern,
    description: row.description,
    position: {
      x: row.position_x,
      y: row.position_y,
      address: row.address,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
    },
    ownerConfirmedToday: row.owner_confirmed_today,
  };
}

function mapReportRow(row: LiveReportRow): LiveReport {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    type: row.type,
    createdAt: row.created_at,
    note: row.note ?? undefined,
    photoLabel: row.photo_label ?? undefined,
    reporterId: row.reporter_id,
  };
}

function mapRegistrationRequestRow(row: RegistrationRequestRow): RegistrationRequest {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    visitPattern: row.visit_pattern,
    businessCardPhoto: row.business_card_photo,
    menuBoardPhoto: row.menu_board_photo,
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
    menuCategory: row.menu_category ?? undefined,
    targetMenuName: row.target_menu_name ?? undefined,
    currentMenuName: row.current_menu_name ?? undefined,
    currentMenuPrice: row.current_menu_price ?? undefined,
    proposedMenuName: row.proposed_menu_name ?? undefined,
    proposedMenuPrice: row.proposed_menu_price ?? undefined,
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

    if (
      vendorsResult.error ||
      reportsResult.error ||
      registrationResult.error ||
      updateResult.error
    ) {
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
      reports: (reportsResult.data as LiveReportRow[]).map(mapReportRow),
      registrationRequests: (registrationResult.data as RegistrationRequestRow[]).map(
        mapRegistrationRequestRow,
      ),
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
    note: report.note ?? null,
    photo_label: report.photoLabel ?? null,
    reporter_id: report.reporterId,
  });

  if (error) {
    console.warn("Supabase report insert failed; local fallback kept.", error);
  }
}

export async function createRegistrationRequest(
  request: RegistrationRequest,
): Promise<void> {
  saveLocalRegistrationRequests([request, ...loadLocalRegistrationRequests()]);

  if (!hasSupabaseConfig || supabase == null) {
    return;
  }

  const { error } = await supabase.from("registration_requests").insert({
    id: request.id,
    name: request.name,
    location: request.location,
    latitude: request.latitude ?? null,
    longitude: request.longitude ?? null,
    visit_pattern: request.visitPattern,
    business_card_photo: request.businessCardPhoto,
    menu_board_photo: request.menuBoardPhoto,
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
    menu_category: request.menuCategory ?? null,
    target_menu_name: request.targetMenuName ?? null,
    current_menu_name: request.currentMenuName ?? null,
    current_menu_price: request.currentMenuPrice ?? null,
    proposed_menu_name: request.proposedMenuName ?? null,
    proposed_menu_price: request.proposedMenuPrice ?? null,
    proposed_latitude: request.proposedLatitude ?? null,
    proposed_longitude: request.proposedLongitude ?? null,
    submitted_at: request.submittedAt,
  });

  if (error) {
    console.warn("Supabase update request insert failed; local fallback kept.", error);
  }
}
