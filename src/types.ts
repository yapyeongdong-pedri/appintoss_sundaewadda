export type ReportKind = "open" | "closed";
export type TruckStatus = "unknown" | "likelyOpen" | "likelyClosed";
export type VendorCategory =
  | "\uC21C\uB300"
  | "\uACF1\uCC3D"
  | "\uD2B8\uBF80\uAE30"
  | "\uBD95\uC5B4\uBE75";

export type MenuCategory =
  | "\uC21C\uB300"
  | "\uACF1\uCC3D"
  | "\uD1B5\uB2ED"
  | "\uC0BC\uACB9\uC0B4"
  | "\uBAA9\uC0B4"
  | "\uD0C0\uCF54\uC57C\uB07C"
  | "\uAE30\uD0C0";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type MonthlyNth = 1 | 2 | 3 | 4 | "last";
export type VisitRule =
  | { mode: "daily" }
  | { mode: "weekly"; interval: 1 | 2; weekdays: Weekday[] }
  | { mode: "monthlyNth"; nth: MonthlyNth; weekdays: Weekday[] }
  | { mode: "custom"; text: string };

export interface MenuItem {
  name: string;
  price: string;
  category: MenuCategory;
}

export interface LiveReport {
  id: string;
  vendorId: string;
  type: ReportKind;
  createdAt: string;
  reportDateKey?: string;
  reporterId: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  menuSummary: string[];
  menuBoardPhotos: string[];
  menuItems: MenuItem[];
  priceSummary: string;
  businessHours: string;
  visitPattern: string;
  visitRules?: VisitRule[];
  description: string;
  position: {
    x: number;
    y: number;
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface VendorSummary extends Vendor {
  status: TruckStatus;
  reportCounts: Record<ReportKind, number>;
  latestReportAt?: string;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  latitude?: number;
  longitude?: number;
  visitPattern: string;
  visitRules?: VisitRule[];
  businessHours: string;
  businessCardPhoto: string;
  menuBoardPhotos: string[];
  menuCategories: MenuCategory[];
  submittedAt: string;
  duplicateCandidateIds: string[];
}

export interface UpdateRequest {
  id: string;
  vendorId: string;
  field: "menuBoard" | "visitPattern" | "businessHours" | "location" | "phone" | "closedNotice";
  value: string;
  visitRules?: VisitRule[];
  menuBoardPhotos?: string[];
  proposedLatitude?: number;
  proposedLongitude?: number;
  submittedAt: string;
}
