import type { LiveReport, RegistrationRequest, UpdateRequest, Vendor } from "../types";

export const seedVendors: Vendor[] = [
  {
    id: "vendor-sundae-1",
    name: "청춘순대트럭",
    category: "순대",
    phone: "010-2486-2109",
    menuSummary: ["찰순대", "내장모듬", "떡볶이"],
    priceSummary: "4,000원~9,000원",
    businessHours: "오후 5시 ~ 밤 11시",
    visitPattern: "화/목/토 저녁에 자주 와요",
    description: "퇴근 시간에 맞춰 오는 순대트럭이에요.",
    position: {
      x: 18,
      y: 34,
      address: "성북천 입구 사거리",
    },
    reviews: [
      { id: "r1", author: "동네주민", body: "순대가 쫄깃하고 양념이 진해요.", score: 5 },
      { id: "r2", author: "야식러", body: "퇴근길에 먹기 딱 좋아요.", score: 4 },
    ],
  },
  {
    id: "vendor-gopchang-1",
    name: "곱창와따트럭",
    category: "곱창",
    phone: "010-5310-7791",
    menuSummary: ["야채곱창", "순대곱창", "볶음밥"],
    priceSummary: "7,000원~12,000원",
    businessHours: "오후 6시 ~ 밤 12시",
    visitPattern: "금/토 밤에 자주 와요",
    description: "주말 늦게까지 운영하는 곱창트럭이에요.",
    position: {
      x: 61,
      y: 45,
      address: "정릉시장 후문",
    },
    reviews: [
      { id: "r3", author: "곱창러버", body: "볶음밥 마무리가 좋아요.", score: 5 },
    ],
  },
  {
    id: "vendor-sundae-2",
    name: "밤도깨비순대",
    category: "순대",
    phone: "010-9941-1004",
    menuSummary: ["순대볶음", "순대꼬치", "간/허파"],
    priceSummary: "3,500원~10,000원",
    businessHours: "오후 4시 ~ 밤 10시",
    visitPattern: "평일 저녁에 랜덤으로 와요",
    description: "학교 앞 골목에서 종종 만나는 트럭이에요.",
    position: {
      x: 78,
      y: 22,
      address: "국민대 정문 아래",
    },
    reviews: [
      { id: "r4", author: "학생", body: "가성비가 좋아요.", score: 4 },
    ],
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
    photoLabel: "순대 냄비 사진",
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
