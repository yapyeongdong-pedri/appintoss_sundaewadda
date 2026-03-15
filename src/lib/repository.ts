import type { LiveReport, RegistrationRequest, Review, UpdateRequest, Vendor } from "../types";
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
  owner_confirmed_today: boolean;
}

interface ReviewRow {
  id: string;
  vendor_id: string;
  author: string;
  body: string;
  score: number;
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
  visit_pattern: string;
  business_card_photo: string;
  menu_board_photo: string;
  submitted_at: string;
  duplicate_candidate_ids: string[];
}

interface UpdateRequestRow {
  id: string;
  vendor_id: string;
  field: UpdateRequest["field"];
  value: string;
  submitted_at: string;
}

export interface AppDataBundle {
  vendors: Vendor[];
  reports: LiveReport[];
  registrationRequests: RegistrationRequest[];
  updateRequests: UpdateRequest[];
}

function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    author: row.author,
    body: row.body,
    score: row.score,
  };
}

function mapVendorRow(row: VendorRow, reviews: Review[]): Vendor {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    phone: row.phone,
    menuSummary: row.menu_summary,
    priceSummary: row.price_summary,
    businessHours: row.business_hours,
    visitPattern: row.visit_pattern,
    description: row.description,
    position: {
      x: row.position_x,
      y: row.position_y,
      address: row.address,
    },
    ownerConfirmedToday: row.owner_confirmed_today,
    reviews,
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
    visitPattern: row.visit_pattern,
    businessCardPhoto: row.business_card_photo,
    menuBoardPhoto: row.menu_board_photo,
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
    const [vendorsResult, reviewsResult, reportsResult, registrationResult, updateResult] =
      await Promise.all([
        supabase.from("vendors").select("*").order("created_at", { ascending: true }),
        supabase.from("reviews").select("*").order("created_at", { ascending: true }),
        supabase.from("live_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("registration_requests").select("*").order("submitted_at", { ascending: false }),
        supabase.from("update_requests").select("*").order("submitted_at", { ascending: false }),
      ]);

    if (
      vendorsResult.error ||
      reviewsResult.error ||
      reportsResult.error ||
      registrationResult.error ||
      updateResult.error
    ) {
      console.warn("Supabase load failed, using local fallback.", {
        vendorsError: vendorsResult.error,
        reviewsError: reviewsResult.error,
        reportsError: reportsResult.error,
        registrationError: registrationResult.error,
        updateError: updateResult.error,
      });
      return getFallbackBundle();
    }

    const reviewMap = new Map<string, Review[]>();
    (reviewsResult.data as ReviewRow[]).forEach((row) => {
      const next = reviewMap.get(row.vendor_id) ?? [];
      next.push(mapReviewRow(row));
      reviewMap.set(row.vendor_id, next);
    });

    return {
      vendors: (vendorsResult.data as VendorRow[]).map((row) =>
        mapVendorRow(row, reviewMap.get(row.id) ?? []),
      ),
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
    visit_pattern: request.visitPattern,
    business_card_photo: request.businessCardPhoto,
    menu_board_photo: request.menuBoardPhoto,
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
    submitted_at: request.submittedAt,
  });

  if (error) {
    console.warn("Supabase update request insert failed; local fallback kept.", error);
  }
}
