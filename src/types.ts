export type ReportKind = "open" | "notYet" | "closed";
export type TruckStatus = "unknown" | "likelyOpen" | "likelyClosed" | "ownerConfirmed";
export type VendorCategory = "순대" | "곱창" | "오뎅" | "붕어빵";

export interface Review {
  id: string;
  author: string;
  body: string;
  score: number;
}

export interface LiveReport {
  id: string;
  vendorId: string;
  type: ReportKind;
  createdAt: string;
  note?: string;
  photoLabel?: string;
  reporterId: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  menuSummary: string[];
  priceSummary: string;
  businessHours: string;
  visitPattern: string;
  description: string;
  reviews: Review[];
  position: {
    x: number;
    y: number;
    address: string;
  };
  ownerConfirmedToday?: boolean;
}

export interface VendorSummary extends Vendor {
  status: TruckStatus;
  reportCounts: Record<ReportKind, number>;
  latestReportAt?: string;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  location: string;
  visitPattern: string;
  businessCardPhoto: string;
  menuBoardPhoto: string;
  submittedAt: string;
  duplicateCandidateIds: string[];
}

export interface UpdateRequest {
  id: string;
  vendorId: string;
  field:
    | "menu"
    | "price"
    | "visitPattern"
    | "businessHours"
    | "location"
    | "phone"
    | "closedNotice";
  value: string;
  submittedAt: string;
}
