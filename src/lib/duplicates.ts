import type { RegistrationRequest, Vendor } from "../types";

function normalize(text: string): string {
  return text.replace(/\s+/g, "").toLowerCase();
}

export function findDuplicateCandidates(
  vendors: Vendor[],
  draft: Pick<RegistrationRequest, "name" | "location">,
): Vendor[] {
  const normalizedName = normalize(draft.name);
  const normalizedLocation = normalize(draft.location);

  return vendors.filter((vendor) => {
    const similarName =
      normalize(vendor.name).includes(normalizedName) ||
      normalizedName.includes(normalize(vendor.name));
    const similarLocation =
      normalize(vendor.position.address).includes(normalizedLocation) ||
      normalizedLocation.includes(normalize(vendor.position.address));

    return similarName || similarLocation;
  });
}
