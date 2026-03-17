import type { RegistrationRequest, Vendor } from "../types";

const DUPLICATE_DISTANCE_METERS = 50;

function normalize(text: string): string {
  return text.replace(/\s+/g, "").toLowerCase();
}

function normalizePhone(text: string): string {
  return text.replace(/\D+/g, "");
}

function getDistanceInMeters(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
): number {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const earthRadius = 6371000;
  const latitudeDiff = toRadians(endLatitude - startLatitude);
  const longitudeDiff = toRadians(endLongitude - startLongitude);
  const startLatitudeRadians = toRadians(startLatitude);
  const endLatitudeRadians = toRadians(endLatitude);

  const haversine =
    Math.sin(latitudeDiff / 2) ** 2 +
    Math.cos(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.sin(longitudeDiff / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function findDuplicateCandidates(
  vendors: Vendor[],
  draft: Pick<RegistrationRequest, "name" | "location" | "phone" | "latitude" | "longitude">,
): Vendor[] {
  const normalizedLocation = normalize(draft.location);
  const normalizedPhone = normalizePhone(draft.phone);

  return vendors.filter((vendor) => {
    const vendorLocation = normalize(vendor.position.address);
    const vendorPhone = normalizePhone(vendor.phone);
    const similarLocation =
      normalizedLocation.length > 1 &&
      (vendorLocation.includes(normalizedLocation) || normalizedLocation.includes(vendorLocation));
    const nearbyPin =
      draft.latitude != null &&
      draft.longitude != null &&
      vendor.position.latitude != null &&
      vendor.position.longitude != null &&
      getDistanceInMeters(
        draft.latitude,
        draft.longitude,
        vendor.position.latitude,
        vendor.position.longitude,
      ) <= DUPLICATE_DISTANCE_METERS;
    const samePhone =
      normalizedPhone.length >= 8 &&
      vendorPhone.length >= 8 &&
      (vendorPhone === normalizedPhone ||
        vendorPhone.endsWith(normalizedPhone) ||
        normalizedPhone.endsWith(vendorPhone));

    if (samePhone) {
      return true;
    }

    return nearbyPin || similarLocation;
  });
}
