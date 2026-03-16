import { ChangeEvent, useMemo, useRef, useState } from "react";
import { formatBusinessHours, type BusinessHoursValue } from "../lib/businessHours";
import { readFilesAsDataUrls } from "../lib/imageFiles";
import { areVisitRulesValid, formatVisitRules } from "../lib/visitRules";
import type { MenuCategory, RegistrationRequest, Vendor } from "../types";
import { BusinessHoursEditor } from "./BusinessHoursEditor";
import { LocationPicker } from "./LocationPicker";
import { VisitRuleEditor } from "./VisitRuleEditor";
import { BottomSheet, Button } from "../ui";

interface RegistrationSheetProps {
  open: boolean;
  vendors: Vendor[];
  onClose: () => void;
  onSubmit: (draft: Omit<RegistrationRequest, "id" | "submittedAt" | "duplicateCandidateIds">) => Promise<void>;
  onCheckDuplicates: (name: string, location: string) => Vendor[];
}

const MENU_CATEGORY_OPTIONS: MenuCategory[] = [
  "\uC21C\uB300",
  "\uACF1\uCC3D",
  "\uD1B5\uB2ED",
  "\uC0BC\uACB9\uC0B4",
  "\uBAA9\uC0B4",
  "\uD0C0\uCF54\uC57C\uB07C",
];

export function RegistrationSheet({
  open,
  vendors,
  onClose,
  onSubmit,
  onCheckDuplicates,
}: RegistrationSheetProps) {
  const [name, setName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationPin, setLocationPin] = useState<{ latitude?: number; longitude?: number }>({});
  const [visitRules, setVisitRules] = useState<RegistrationRequest["visitRules"]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHoursValue>({ startHour: 18, endHour: 24 });
  const [businessCardPhoto, setBusinessCardPhoto] = useState("");
  const [menuBoardPhotos, setMenuBoardPhotos] = useState(["", "", ""]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const businessCardInputRef = useRef<HTMLInputElement | null>(null);
  const menuBoardInputRef = useRef<HTMLInputElement | null>(null);

  const candidates = useMemo(
    () => onCheckDuplicates(name, locationDescription),
    [locationDescription, name, onCheckDuplicates],
  );

  const handleBusinessCardSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files.length === 0) {
      return;
    }

    const [image] = await readFilesAsDataUrls(event.target.files);
    if (image) {
      setBusinessCardPhoto(image);
    }
    event.target.value = "";
  };

  const handleMenuBoardSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files.length === 0) {
      return;
    }

    const images = await readFilesAsDataUrls(event.target.files);
    if (images.length > 0) {
      setMenuBoardPhotos(images.slice(0, 3).concat(["", "", ""]).slice(0, 3));
    }
    event.target.value = "";
  };

  const handleSubmit = async () => {
    await onSubmit({
      name,
      location: locationDescription.trim(),
      latitude: locationPin.latitude,
      longitude: locationPin.longitude,
      visitPattern: formatVisitRules(visitRules),
      visitRules,
      businessHours: formatBusinessHours(businessHours),
      businessCardPhoto,
      menuBoardPhotos: menuBoardPhotos.map((item) => item.trim()).filter(Boolean),
      menuCategories,
    });
    setName("");
    setLocationDescription("");
    setLocationPin({});
    setVisitRules([]);
    setBusinessHours({ startHour: 18, endHour: 24 });
    setBusinessCardPhoto("");
    setMenuBoardPhotos(["", "", ""]);
    setMenuCategories([]);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      hasTextField
      expandBottomSheet
      header={<BottomSheet.Header>{"\uC2E0\uADDC \uD2B8\uB7ED \uB4F1\uB85D \uC694\uCCAD"}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>
          {"\uAE30\uC874 \uD2B8\uB7ED\uC778\uC9C0 \uBA3C\uC800 \uD655\uC778\uD558\uACE0 \uC694\uCCAD\uC744 \uB0A8\uACA8\uC8FC\uC138\uC694."}
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.CTA>
          <Button
            color="primary"
            variant="fill"
            size="xlarge"
            display="full"
            onClick={handleSubmit}
            disabled={
              !name ||
              !locationDescription.trim() ||
              !areVisitRulesValid(visitRules ?? []) ||
              businessHours.startHour >= businessHours.endHour ||
              menuBoardPhotos.every((item) => item.trim() === "")
            }
          >
            {"\uB4F1\uB85D \uC694\uCCAD \uBCF4\uB0B4\uAE30"}
          </Button>
        </BottomSheet.CTA>
      }
    >
      <div className="sheet-content">
        <label className="field">
          <span>{"\uD2B8\uB7ED \uC774\uB984"}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="\uC608: \uCCAD\uCD98 \uC21C\uB300\uD2B8\uB7ED"
          />
        </label>
        <div className="field">
          <span>{"\uC704\uCE58 \uC124\uBA85 / \uC815\uD655\uD55C \uD540"}</span>
          <LocationPicker
            description={locationDescription}
            latitude={locationPin.latitude}
            longitude={locationPin.longitude}
            onDescriptionChange={setLocationDescription}
            onPinChange={setLocationPin}
          />
        </div>
        <div className="field">
          <span>{"\uC6B4\uC601\uC694\uC77C / \uC6B4\uC601\uC8FC\uAE30"}</span>
          <VisitRuleEditor value={visitRules ?? []} onChange={setVisitRules} />
        </div>
        <div className="field">
          <span>{"\uC601\uC5C5\uC2DC\uAC04"}</span>
          <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
        </div>
        <div className="field">
          <span>{"\uB300\uD45C \uBA54\uB274 \uBD84\uB958"}</span>
          <div className="field-picker-grid">
            {MENU_CATEGORY_OPTIONS.map((category) => {
              const active = menuCategories.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  className={`field-chip ${active ? "field-chip-active" : ""}`}
                  onClick={() =>
                    setMenuCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((item) => item !== category)
                        : [...prev, category],
                    )
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        <div className="field">
          <span>{"\uBA85\uD568 \uC0AC\uC9C4"}</span>
          <input
            ref={businessCardInputRef}
            className="hidden-file-input"
            type="file"
            accept="image/*"
            onChange={handleBusinessCardSelect}
          />
          <div className="photo-upload-stack">
            <Button
              color="light"
              variant="fill"
              size="large"
              display="full"
              onClick={() => businessCardInputRef.current?.click()}
            >
              {businessCardPhoto ? "\uBA85\uD568 \uC0AC\uC9C4 \uB2E4\uC2DC \uC120\uD0DD" : "\uBA85\uD568 \uC0AC\uC9C4 \uC62C\uB9AC\uAE30"}
            </Button>
            {businessCardPhoto ? (
              <div className="photo-preview-grid photo-preview-grid-single">
                <div className="photo-preview-card">
                  <img src={businessCardPhoto} alt="\uBA85\uD568 \uBBF8\uB9AC\uBCF4\uAE30" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="field">
          <span>{"\uCD5C\uC2E0 \uBA54\uB274\uD310 \uC0AC\uC9C4"}</span>
          <input
            ref={menuBoardInputRef}
            className="hidden-file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleMenuBoardSelect}
          />
          <div className="photo-upload-stack">
            <Button
              color="light"
              variant="fill"
              size="large"
              display="full"
              onClick={() => menuBoardInputRef.current?.click()}
            >
              {"\uBA54\uB274\uD310 \uC0AC\uC9C4 \uCD5C\uB300 3\uC7A5 \uC120\uD0DD"}
            </Button>
            {menuBoardPhotos.some((item) => item !== "") ? (
              <div className="photo-preview-grid">
                {menuBoardPhotos
                  .filter(Boolean)
                  .map((photo, index) => (
                    <div className="photo-preview-card" key={`menu-board-preview-${index}`}>
                      <img src={photo} alt={`\uBA54\uB274\uD310 \uBBF8\uB9AC\uBCF4\uAE30 ${index + 1}`} />
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
          <small className="field-help">
            {"\uBA54\uB274\uC640 \uAC00\uACA9\uC774 \uC798 \uBCF4\uC774\uB294 \uCD5C\uC2E0 \uBA54\uB274\uD310 \uC0AC\uC9C4\uC774 \uC88B\uC544\uC694."}
          </small>
        </div>

        <div className="hint-card">
          <p className="section-label">{"\uAE30\uC874 \uD2B8\uB7ED \uD6C4\uBCF4"}</p>
          {candidates.length === 0 ? (
            <p className="muted-text">
              {vendors.length > 0
                ? "\uBE44\uC2B7\uD55C \uD6C4\uBCF4\uAC00 \uC5C6\uC5B4\uC694."
                : "\uB4F1\uB85D\uB41C \uD2B8\uB7ED\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694."}
            </p>
          ) : (
            candidates.map((candidate) => (
              <div className="duplicate-row" key={candidate.id}>
                <strong>{candidate.name}</strong>
                <span>{candidate.position.address}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
