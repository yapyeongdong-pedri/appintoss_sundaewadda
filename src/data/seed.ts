import type { LiveReport, RegistrationRequest, UpdateRequest, Vendor } from "../types";

export const seedVendors: Vendor[] = [
  {
    id: "vendor-sundae-1",
    name: "\uCCAD\uCD98\uC21C\uB300\uD2B8\uB7ED",
    category: "\uC21C\uB300",
    phone: "010-2486-2109",
    menuSummary: ["\uCC30\uC21C\uB300", "\uB0B4\uC7A5\uBAA8\uB4EC", "\uC624\uB385\uD0D5"],
    menuItems: [
      { name: "\uCC30\uC21C\uB300", price: "4,000\uC6D0", category: "\uC21C\uB300" },
      { name: "\uB0B4\uC7A5\uBAA8\uB4EC", price: "7,000\uC6D0", category: "\uC21C\uB300" },
      { name: "\uC624\uB385\uD0D5", price: "9,000\uC6D0", category: "\uC21C\uB300" },
    ],
    priceSummary: "4,000\uC6D0 / 9,000\uC6D0",
    businessHours: "\uC624\uD6C4 5\uC2DC ~ \uBC24 11\uC2DC",
    visitPattern: "\uD654/\uBAA9/\uD1A0 \uC800\uB141",
    description: "\uD1F4\uADFC \uC2DC\uAC04 \uC704\uC8FC",
    position: {
      x: 18,
      y: 34,
      address: "\uC131\uBD81\uCC9C \uC785\uAD6C \uC0AC\uAC70\uB9AC",
    },
  },
  {
    id: "vendor-gopchang-1",
    name: "\uACF1\uCC3D\uB2E4\uC74C \uD2B8\uB7ED",
    category: "\uACF1\uCC3D",
    phone: "010-5310-7791",
    menuSummary: ["\uC57C\uCC44\uACF1\uCC3D", "\uC21C\uB300\uACF1\uCC3D", "\uBCF6\uC74C\uBC25"],
    menuItems: [
      { name: "\uC57C\uCC44\uACF1\uCC3D", price: "7,000\uC6D0", category: "\uACF1\uCC3D" },
      { name: "\uC21C\uB300\uACF1\uCC3D", price: "10,000\uC6D0", category: "\uACF1\uCC3D" },
      { name: "\uBCF6\uC74C\uBC25", price: "12,000\uC6D0", category: "\uACF1\uCC3D" },
    ],
    priceSummary: "7,000\uC6D0 / 12,000\uC6D0",
    businessHours: "\uC624\uD6C4 6\uC2DC ~ \uBC24 12\uC2DC",
    visitPattern: "\uAE08/\uD1A0 \uBC24",
    description: "\uC8FC\uB9D0 \uC800\uB141 \uC704\uC8FC",
    position: {
      x: 61,
      y: 45,
      address: "\uC815\uB989\uC2DC\uC7A5 \uC55E",
    },
  },
  {
    id: "vendor-sundae-2",
    name: "\uBC14\uB85C\uAC00\uB294 \uC21C\uB300",
    category: "\uC21C\uB300",
    phone: "010-9941-1004",
    menuSummary: ["\uC21C\uB300\uBCF6\uC74C", "\uC21C\uB300\uAF2C\uCE58", "\uAC00\uB798\uB5A1"],
    menuItems: [
      { name: "\uC21C\uB300\uBCF6\uC74C", price: "8,000\uC6D0", category: "\uC21C\uB300" },
      { name: "\uC21C\uB300\uAF2C\uCE58", price: "3,500\uC6D0", category: "\uC21C\uB300" },
      { name: "\uAC00\uB798\uB5A1", price: "4,000\uC6D0", category: "\uAE30\uD0C0" },
    ],
    priceSummary: "3,500\uC6D0 / 8,000\uC6D0",
    businessHours: "\uC624\uD6C4 4\uC2DC ~ \uBC24 10\uC2DC",
    visitPattern: "\uD3C9\uC77C \uC800\uB141",
    description: "\uD559\uAD50 \uC55E \uACE8\uBAA9",
    position: {
      x: 78,
      y: 22,
      address: "\uAD6D\uBBFC\uB300 \uC815\uBB38 \uC544\uB798",
    },
    ownerConfirmedToday: true,
  },
];

export const seedReports: LiveReport[] = [
  {
    id: "report-1",
    vendorId: "vendor-sundae-1",
    type: "open",
    createdAt: "2026-03-15T18:05:00+09:00",
    reporterId: "guest-a",
    photoLabel: "\uC21C\uB300 \uC0AC\uC9C4",
  },
  {
    id: "report-2",
    vendorId: "vendor-sundae-1",
    type: "open",
    createdAt: "2026-03-15T18:21:00+09:00",
    reporterId: "guest-b",
  },
  {
    id: "report-3",
    vendorId: "vendor-gopchang-1",
    type: "closed",
    createdAt: "2026-03-15T22:02:00+09:00",
    reporterId: "guest-c",
  },
  {
    id: "report-4",
    vendorId: "vendor-gopchang-1",
    type: "open",
    createdAt: "2026-03-15T19:18:00+09:00",
    reporterId: "guest-d",
  },
  {
    id: "report-5",
    vendorId: "vendor-gopchang-1",
    type: "closed",
    createdAt: "2026-03-15T22:16:00+09:00",
    reporterId: "guest-e",
  },
];

export const seedRegistrationRequests: RegistrationRequest[] = [];
export const seedUpdateRequests: UpdateRequest[] = [];
